// Initialize the canvas and context
const canvas = document.getElementById('rouletteCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 600;
canvas.height = 600;

// Roulette wheel properties
const wheelRadius = 250;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
let rotationAngle = 0;
let rotationSpeed = 0.05; // radians per frame

// Ball properties
const ballRadius = 10;
let ballAngle = 0;
let ballSpeed = 0.1; // radians per frame
let ballBouncing = true;

// Draw the roulette wheel
function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotationAngle);

    // Draw the wheel segments
    for (let i = 0; i < 36; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, wheelRadius, (i * Math.PI) / 18, ((i + 1) * Math.PI) / 18);
        ctx.fillStyle = (i % 2 === 0) ? '#FF0000' : '#000000';
        ctx.fill();
        ctx.stroke();
    }

    ctx.restore();
}

// Draw the ball
function drawBall() {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(ballAngle);
    ctx.beginPath();
    ctx.arc(0, -wheelRadius + ballRadius, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();
}

// Update the game state
function update() {
    rotationAngle += rotationSpeed;
    ballAngle += ballSpeed;

    // Simulate bouncing effect
    if (ballBouncing) {
        ballAngle += Math.sin(ballAngle) * 0.05; // Adjust bouncing effect
    }

    drawWheel();
    drawBall();
    requestAnimationFrame(update);
}

// Start the animation
update();