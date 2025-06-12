import Wheel from './wheel.js';
import Ball from './ball.js';
import { applyGravity, applyFriction, updateBallPosition, updateWheelRotation } from './physics.js';

// Get the canvas and context
const canvas = document.getElementById('rouletteCanvas');
const context = canvas.getContext('2d');

// Initialize game objects
const wheel = new Wheel(canvas, context);
const ball = new Ball(10, 'white');

// Initial render
wheel.draw();
ball.draw(context);

// Add click event to start the game
canvas.addEventListener('click', () => {
    wheel.spin();
});

// Game loop
function gameLoop() {
    wheel.draw();
    ball.draw(context);
    requestAnimationFrame(gameLoop);
}

gameLoop();