class CatanRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        window.addEventListener('resize', () => {
            this.calculateHexSize();
            if (this.currentBoard) {
                this.render(this.currentBoard, this.showPorts, this.useCustomImages);
            }
        });
        
        this.calculateHexSize();
        this.imageCache = new Map();
    }

    calculateHexSize() {
        // Get the current viewport dimensions
        const viewportWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);
        const viewportHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
    
        // Set canvas size based on viewport
        this.canvas.width = Math.min(viewportWidth, 1000);
        this.canvas.height = Math.min(viewportHeight * 0.8, 1000);
    
        // Calculate board dimensions based on mode
        const currentMode = this.currentBoard?.mode || 'Regular';
        const maxCols = currentMode === 'Regular' ? 5 : (currentMode === 'Expansion' ? 6 : 7);
    
        // Calculate hex size to fit board within canvas
        this.HEX_SIZE = Math.min(
            this.canvas.width / (maxCols * 2),
            this.canvas.height / (maxCols * 2)
        );
    
        // Calculate derived values
        this.hexWidth = this.HEX_SIZE * 2;
        this.hexHeight = this.HEX_SIZE * Math.sqrt(3);
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }

    setImageFolder(folder) {
        this.currentImageFolder = folder;
        this.imageCache.clear();
        if (!folder) return;
        
        const resources = ['desert', 'wheat', 'wood', 'sheep', 'brick', 'ore'];
        resources.forEach(resource => {
            const img = new Image();
            img.src = `./${folder}/${resource}.png`;
            img.onload = () => {
                this.imageCache.set(resource, img);
                // Re-render when each image loads
                if (this.currentBoard) {
                    this.render(this.currentBoard, this.showPorts, true);
                }
            };
        });
    }

    drawHex(x, y, hexType, useCustomImages = false) {
        this.ctx.beginPath();
        this.ctx.lineWidth = 2;
        
        for (let i = 0; i < 6; i++) {
            const angleDeg = 60 * i - 30;
            const angleRad = (Math.PI / 180) * angleDeg;
            const pointX = x + this.HEX_SIZE * Math.cos(angleRad);
            const pointY = y + this.HEX_SIZE * Math.sin(angleRad);
            
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
                this.ctx.save();
                this.ctx.clip();
                
                const imgSize = this.HEX_SIZE * 2;
                const imgX = x - imgSize/2;
                const imgY = y - imgSize/2;
                
                this.ctx.drawImage(cachedImg, imgX, imgY, imgSize, imgSize);
                this.ctx.restore();
                this.ctx.stroke();
            } else {
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

    getProbabilityDots(number) {
        const probabilityMap = {
            2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 8: 5, 9: 4, 10: 3, 11: 2, 12: 1
        };
        return probabilityMap[number] || 0;
    }

    drawNumber(x, y, number) {
        const circleRadius = this.HEX_SIZE / 3;
        
        // Draw circle background
        this.ctx.beginPath();
        this.ctx.arc(x, y, circleRadius, 0, 2 * Math.PI);
        this.ctx.fillStyle = COLORS.portBackground;
        this.ctx.fill();
        this.ctx.stroke();

        // Scale font size based on hex size
        const fontSize = Math.max(12, Math.min(16, this.HEX_SIZE / 3));
        this.ctx.font = `bold ${fontSize}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        this.ctx.fillStyle = (number === 6 || number === 8) ? COLORS.redNumbers : COLORS.textColor;
        this.ctx.fillText(number.toString(), x, y - 2);

        if (number !== null) {
            const dots = this.getProbabilityDots(number);
            const dotRadius = Math.max(1, this.HEX_SIZE / 30);
            const dotSpacing = Math.max(3, this.HEX_SIZE / 12);
            const startX = x - ((dots - 1) * dotSpacing) / 2;
            const dotY = y + circleRadius - (this.HEX_SIZE / 6);
            
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
        
        const horizontalSpacing = 0.9;
        const verticalSpacing = 0.9;
        
        let x = this.centerX + colOffset * this.hexWidth * horizontalSpacing;
        let y = this.centerY + rowOffset * this.hexHeight * verticalSpacing;
        
        return { x, y };
    }

    drawPort(x, y, portType) {
        const portRadius = this.HEX_SIZE / 3;
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, portRadius, 0, 2 * Math.PI);
        this.ctx.fillStyle = PORT_COLORS[portType] || '#ffffff';
        this.ctx.fill();
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        const fontSize = Math.max(10, Math.min(12, this.HEX_SIZE / 4));
        this.ctx.font = `${fontSize}px Arial`;
        this.ctx.fillStyle = '#000000';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        const label = portType === '3:1' ? '3:1' : portType.charAt(0).toUpperCase();
        this.ctx.fillText(label, x, y);
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    render(board, showPorts = false, useCustomImages = false) {
        console.log('Render called with board:', board);
        console.log('Board mode:', board.mode);
        console.log('Board dimensions:', board.board.length, 'rows');
        if(board.board[0]) console.log('First row length:', board.board[0].length);

        this.clear();
        
        // Store the current board for resize handling
        this.currentBoard = board;
        this.showPorts = showPorts;
        this.useCustomImages = useCustomImages;
        
        // Recalculate hex size for current board mode
        this.calculateHexSize();
        
        // Render the board
        board.board.forEach((row, rowIndex) => {
            row.forEach((hex, colIndex) => {
                const { x, y } = this.calculateHexPosition(rowIndex, colIndex, board.config.rowLengths);
                this.drawHex(x, y, hex.type, useCustomImages);
                if (hex.number !== null) {
                    this.drawNumber(x, y, hex.number);
                }
            });
        });
        
        if (showPorts && board.config.ports) {
            board.config.ports.forEach(port => {
                const basePos = this.calculateHexPosition(port.anchorHex[0], port.anchorHex[1], board.config.rowLengths);
                const portX = this.centerX + (port.pos[0] * this.hexWidth * 0.9);
                const portY = this.centerY + (port.pos[1] * this.hexHeight * 0.9);
                this.drawPort(portX, portY, port.type);
            });
        }
    }
}

// Keep the original color constants
const COLORS = {
    desert: '#ffe69a',
    wheat: '#f1c40f',
    wood: '#004c05',
    sheep: '#2ecc71',
    brick: '#c0392b',
    ore: '#7f8c8d',
    portBackground: '#fff',
    textColor: '#2c3e50',
    redNumbers: '#c0392b'
};

const PORT_COLORS = {
    '3:1': '#ffffff',
    'wheat': '#f1c40f',
    'wood': '#004c05',
    'sheep': '#2ecc71',
    'brick': '#c0392b',
    'ore': '#7f8c8d'
};

export default CatanRenderer;