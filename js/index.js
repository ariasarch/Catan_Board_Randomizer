// index.js
import CatanBoard from './board.js';
import CatanRenderer from './render.js';

document.addEventListener('DOMContentLoaded', () => {
    // Get canvas element
    const canvas = document.createElement('canvas');
    const boardContainer = document.querySelector('.board-container');
    boardContainer.appendChild(canvas);

    // Initialize renderer and board
    const renderer = new CatanRenderer(canvas);
    const board = new CatanBoard();
    
    // Generate initial board
    let currentBoard = board.generate();
    
    // Initial render
    renderer.render(currentBoard, false, false);

    // Setup event listeners for controls
    document.querySelector('.radio-group').addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const newMode = e.target.textContent.trim();
            board.setMode(newMode);
            currentBoard = board.generate();
            renderer.render(currentBoard, board.showPorts, useCOImages.checked || useWAImages.checked);
        }
    });

    const useWAImages = document.querySelector('#useWAImages');
    const useCOImages = document.querySelector('#useCOImages');

    useWAImages.addEventListener('change', () => {
        if(useWAImages.checked) {
            useCOImages.checked = false;
            renderer.setImageFolder('images');
        } else {
            renderer.setImageFolder(null);
            renderer.render(currentBoard, board.showPorts, false);  // Added this line to render with defaults
        }
    });

    useCOImages.addEventListener('change', () => {
        if(useCOImages.checked) {
            useWAImages.checked = false;
            renderer.setImageFolder('images2');
        } else {
            renderer.setImageFolder(null);
            renderer.render(currentBoard, board.showPorts, false);  // Added this line to render with defaults
        }
    });

    const generateButton = document.querySelector('.controls > button:nth-last-child(2)');
    generateButton.addEventListener('click', () => {
        currentBoard = board.generate();
        renderer.render(currentBoard, board.showPorts, useCOImages.checked || useWAImages.checked);
    });

    const portButton = document.querySelector('.controls > button:last-child');
    portButton.addEventListener('click', () => {
        board.showPorts = board.togglePorts();
        renderer.render(currentBoard, board.showPorts, useCOImages.checked || useWAImages.checked);
    });
});