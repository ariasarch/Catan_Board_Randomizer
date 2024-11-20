// Constants for hex dimensions and colors
const HEX_SIZE = 50;
const COLORS = {
    desert: '#f4d03f',
    wheat: '#f1c40f',
    wood: '#27ae60',
    sheep: '#2ecc71',
    brick: '#c0392b',
    ore: '#7f8c8d',
    portBackground: '#fff',
    textColor: '#2c3e50',
    redNumbers: '#c0392b'
};
const PORT_COLORS = {
    '3:1': '#ffffff',  // White for 3:1 ports
    'wheat': '#f1c40f',
    'wood': '#27ae60',
    'sheep': '#2ecc71',
    'brick': '#c0392b',
    'ore': '#7f8c8d'
};


class CatanRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.hexHeight = Math.sqrt(3) * HEX_SIZE;
        this.hexWidth = 2 * HEX_SIZE;
        this.centerX = canvas.width / 2;
        this.centerY = canvas.height / 2;
        
        // Image cache
        this.imageCache = new Map();
        this.preloadImages();
    }

    preloadImages() {
        const resources = ['desert', 'wheat', 'wood', 'sheep', 'brick', 'ore'];
        resources.forEach(resource => {
            const img = new Image();
            img.src = `./images/${resource}.png`;
            
            img.onload = () => {
                this.imageCache.set(resource, img);
            };
        });
    }

    drawHex(x, y, hexType, useCustomImages = false) {
        this.ctx.beginPath();
        this.ctx.lineWidth = 2; // Increase line width for sharper edges
        
        // Draw the hex path
        for (let i = 0; i < 6; i++) {
            const angleDeg = 60 * i - 30;
            const angleRad = (Math.PI / 180) * angleDeg;
            const pointX = x + HEX_SIZE * Math.cos(angleRad);
            const pointY = y + HEX_SIZE * Math.sin(angleRad);
            
            if (i === 0) {
                this.ctx.moveTo(pointX, pointY);
            } else {
                this.ctx.lineTo(pointX, pointY);
            }
        }
        this.ctx.closePath();

        if (useCustomImages) {
            const cachedImg = this.imageCache.get(hexType);
            if (cachedImg && cachedImg.complete) {
                // Save the current context state
                this.ctx.save();
                
                // Create the clipping path
                this.ctx.clip();
                
                // Calculate image dimensions to maintain aspect ratio
                const imgSize = HEX_SIZE * 2;
                
                // Center the image precisely within the hex
                const imgX = x - imgSize/2;
                const imgY = y - imgSize/2;
                
                // Draw the image with proper centering
                this.ctx.drawImage(
                    cachedImg,
                    imgX,
                    imgY,
                    imgSize,
                    imgSize
                );
                
                // Restore the context state
                this.ctx.restore();
                
                // Draw the hex border
                this.ctx.stroke();
            } else {
                // Fallback to color
                this.ctx.fillStyle = COLORS[hexType];
                this.ctx.fill();
                this.ctx.stroke();
            }
        } else {
            this.ctx.fillStyle = COLORS[hexType];
            this.ctx.fill();
            this.ctx.stroke();
        }
    }

    // Get correct number of probability dots for a given number
    getProbabilityDots(number) {
        // For 2d6, probability is based on number of ways to roll the number
        const probabilityMap = {
            2: 1,   // 1 way
            3: 2,   // 2 ways
            4: 3,   // 3 ways
            5: 4,   // 4 ways
            6: 5,   // 5 ways
            8: 5,   // 5 ways
            9: 4,   // 4 ways
            10: 3,  // 3 ways
            11: 2,  // 2 ways
            12: 1   // 1 way
        };
        return probabilityMap[number] || 0;
    }

    // Updated drawNumber method with correct probability dots
    drawNumber(x, y, number) {
        const circleRadius = HEX_SIZE / 3;
        
        // Draw circle background
        this.ctx.beginPath();
        this.ctx.arc(x, y, circleRadius, 0, 2 * Math.PI);
        this.ctx.fillStyle = COLORS.portBackground;
        this.ctx.fill();
        this.ctx.stroke();

        // Draw number
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Fix for red 6 and 8
        this.ctx.fillStyle = (number === 6 || number === 8) ? COLORS.redNumbers : COLORS.textColor;
        this.ctx.fillText(number.toString(), x, y - 2);

        // Add probability dots with correct count
        if (number !== null) {
            const dots = this.getProbabilityDots(number);
            const dotRadius = 1.5;
            const dotSpacing = 4;
            const startX = x - ((dots - 1) * dotSpacing) / 2;
            const dotY = y + circleRadius - 8;
            
            this.ctx.fillStyle = (number === 6 || number === 8) ? COLORS.redNumbers : COLORS.textColor;
            
            for (let i = 0; i < dots; i++) {
                this.ctx.beginPath();
                this.ctx.arc(startX + i * dotSpacing, dotY, dotRadius, 0, 2 * Math.PI);
                this.ctx.fill();
            }
        }
    }

    calculateHexPosition(row, col, rowLengths) {
        const rowOffset = row - (rowLengths.length - 1) / 2;
        const colOffset = col - (rowLengths[row] - 1) / 2;
        
        // Adjust spacing multipliers for better alignment
        const horizontalSpacing = 0.9; // Reduce horizontal spacing slightly
        const verticalSpacing = 0.9;   // Adjust vertical spacing for better alignment
        
        let x = this.centerX + colOffset * this.hexWidth * horizontalSpacing;
        let y = this.centerY + rowOffset * this.hexHeight * verticalSpacing;
        
        return { x, y };
    }

    drawPort(x, y, portType) {
        // Draw port circle
        const portRadius = HEX_SIZE / 3;
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, portRadius, 0, 2 * Math.PI);
        this.ctx.fillStyle = PORT_COLORS[portType] || '#ffffff';
        this.ctx.fill();
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Add port label
        this.ctx.font = '12px Arial';
        this.ctx.fillStyle = '#000000';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Format the label text
        const label = portType === '3:1' ? '3:1' : portType.charAt(0).toUpperCase();
        this.ctx.fillText(label, x, y);
    }

    // Clear the canvas
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }


    render(board, showPorts = false, useCustomImages = false) {
        this.clear();
        
        // Draw tiles and numbers
        board.board.forEach((row, rowIndex) => {
            row.forEach((hex, colIndex) => {
                const { x, y } = this.calculateHexPosition(rowIndex, colIndex, board.config.rowLengths);
                
                // Draw hex tile
                this.drawHex(x, y, hex.type, useCustomImages);
                
                // Draw number if it exists
                if (hex.number !== null) {
                    this.drawNumber(x, y, hex.number);
                }
            });
        });
        
        // Draw ports if enabled and ports exist
        if (showPorts && board.config.ports) {
            board.config.ports.forEach(port => {
                const basePos = this.calculateHexPosition(port.anchorHex[0], port.anchorHex[1], board.config.rowLengths);
                const portX = this.centerX + (port.pos[0] * this.hexWidth * 0.9);  // Added scaling factor
                const portY = this.centerY + (port.pos[1] * this.hexHeight * 0.9); // Added scaling factor
                
                this.drawPort(portX, portY, port.type);
            });
        }
    }

    drawPort(x, y, portType) {
        const portRadius = HEX_SIZE / 3;
        
        // Draw port circle
        this.ctx.beginPath();
        this.ctx.arc(x, y, portRadius, 0, 2 * Math.PI);
        this.ctx.fillStyle = PORT_COLORS[portType] || '#ffffff';
        this.ctx.fill();
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Add port label
        this.ctx.font = '12px Arial';
        this.ctx.fillStyle = '#000000';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Format the label text
        const label = portType === '3:1' ? '3:1' : portType.charAt(0).toUpperCase();
        this.ctx.fillText(label, x, y);
    }
}

export default CatanRenderer;