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
    let generatedBoard = board.generate();
    
    // Initial render
    renderer.render(board, false, false);

    // Track current state
    let useCustomImages = false;

    // Setup event listeners for controls
    document.querySelector('.radio-group').addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            board.mode = e.target.textContent.trim();
            generatedBoard = board.generate();
            renderer.render(board, board.showPorts, useCustomImages);
        }
    });

    const buttons = document.querySelectorAll('button');
    const generateButton = buttons[3]; // Fourth button (after the 3 mode buttons)
    const portButton = buttons[4]; // Fifth button

    generateButton.addEventListener('click', () => {
        generatedBoard = board.generate();
        renderer.render(board, board.showPorts, useCustomImages);
    });

    portButton.addEventListener('click', () => {
        board.showPorts = board.togglePorts();
        renderer.render(board, board.showPorts, useCustomImages);
    });

    const customImagesCheckbox = document.querySelector('#useCustomImages');
    if (customImagesCheckbox) {
        customImagesCheckbox.addEventListener('change', (e) => {
            useCustomImages = e.target.checked;
            renderer.render(board, board.showPorts, useCustomImages);
        });
    }
});