// Add this import at the top of board.js
import PortGenerator from './port-generator.js';

// Update the GAME_MODES object to remove the hardcoded ports
const GAME_MODES = {
    Regular: {
        tiles: [
            { type: 'desert', count: 1 },
            { type: 'wheat', count: 4 },
            { type: 'wood', count: 4 },
            { type: 'sheep', count: 4 },
            { type: 'brick', count: 3 },
            { type: 'ore', count: 3 }
        ],
        numbers: [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12],
        rowLengths: [3, 4, 5, 4, 3],
    },
    Expansion: {
        tiles: [
            { type: 'desert', count: 2 },
            { type: 'wheat', count: 6 },
            { type: 'wood', count: 6 },
            { type: 'sheep', count: 6 },
            { type: 'brick', count: 5 },
            { type: 'ore', count: 5 }
        ],
        numbers: [2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 8, 8, 8, 9, 9, 9, 10, 10, 10, 11, 11, 11, 12, 12],
        rowLengths: [3, 4, 5, 6, 5, 4, 3],
    },
    Mega: {
        tiles: [
            { type: 'desert', count: 3 },
            { type: 'wheat', count: 9 },
            { type: 'wood', count: 9 },
            { type: 'sheep', count: 8 },
            { type: 'brick', count: 7 },
            { type: 'ore', count: 7 }
        ],
        numbers: [2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 11, 11, 11, 11, 12, 12, 12],
        rowLengths: [3, 4, 5, 6, 7, 6, 5, 4, 3],
    }
};
;

class CatanBoard {
    constructor(mode = 'Regular') {
        this.mode = mode;
        this.config = GAME_MODES[mode];
        this.board = [];
        this.showPorts = false;
        
        // Initialize the port generator and generate ports for this mode
        const portGenerator = new PortGenerator();
        this.config.ports = portGenerator.generatePortsForMode(mode);
    }

    // Fisher-Yates shuffle algorithm
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Generate the tiles array based on the configuration
    generateTiles() {
        const tiles = [];
        this.config.tiles.forEach(({ type, count }) => {
            for (let i = 0; i < count; i++) {
                tiles.push(type);
            }
        });
        return this.shuffle(tiles);
    }

    // Check if a number placement is valid
    isValidNumberPlacement(row, col, number) {
        const neighbors = this.getNeighbors(row, col);
        for (const [nRow, nCol] of neighbors) {
            if (this.board[nRow] && this.board[nRow][nCol] && this.board[nRow][nCol].number === number) {
                return false;
            }
            // Additional check for 6 and 8
            if ((number === 6 || number === 8) && 
                this.board[nRow]?.[nCol]?.number && 
                (this.board[nRow][nCol].number === 6 || this.board[nRow][nCol].number === 8)) {
                return false;
            }
        }
        return true;
    }

    // Get neighboring hexes
    getNeighbors(row, col) {
        const neighbors = [];
        const directions = [
            [-1, 0], [1, 0],   // Above and below
            [0, -1], [0, 1],   // Left and right
            [-1, -1], [-1, 1], // Diagonals above
            [1, -1], [1, 1]    // Diagonals below
        ];

        for (const [dRow, dCol] of directions) {
            const newRow = row + dRow;
            const newCol = col + dCol;
            if (newRow >= 0 && newRow < this.board.length && 
                newCol >= 0 && newCol < this.board[newRow].length) {
                neighbors.push([newRow, newCol]);
            }
        }
        return neighbors;
    }

    // Generate a new board
    generate() {
        const tiles = this.generateTiles();
        const numbers = [...this.config.numbers];
        this.shuffle(numbers);
        
        // Create the board structure
        this.board = this.config.rowLengths.map(length => new Array(length));
        
        let tileIndex = 0;
        let numberIndex = 0;

        // Place tiles and numbers
        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[row].length; col++) {
                const tileType = tiles[tileIndex++];
                let number = null;

                if (tileType !== 'desert') {
                    // Find a valid number
                    let foundValidNumber = false;
                    for (let i = numberIndex; i < numbers.length; i++) {
                        if (this.isValidNumberPlacement(row, col, numbers[i])) {
                            number = numbers[i];
                            numbers.splice(i, 1);
                            foundValidNumber = true;
                            break;
                        }
                    }

                    if (!foundValidNumber) {
                        // If no valid number found, start over
                        return this.generate();
                    }
                }

                this.board[row][col] = {
                    type: tileType,
                    number: number
                };
            }
        }

        return {
            board: this.board,
            ports: this.config.ports
        };
    }

    togglePorts() {
        this.showPorts = !this.showPorts;
        return this.showPorts;
    }
}

export default CatanBoard;