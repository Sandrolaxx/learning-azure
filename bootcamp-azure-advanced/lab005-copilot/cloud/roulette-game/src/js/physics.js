function applyGravity(ball) {
    const gravity = 0.5; // Gravity constant
    ball.velocityY += gravity; // Apply gravity to the ball's vertical velocity
}

function applyFriction(wheel) {
    const friction = 0.99; // Friction constant
    wheel.angularVelocity *= friction; // Apply friction to the wheel's angular velocity
}

function updateBallPosition(ball) {
    ball.y += ball.velocityY; // Update the ball's vertical position
    ball.x += ball.velocityX; // Update the ball's horizontal position

    // Check for ground collision
    if (ball.y >= canvas.height - ball.radius) {
        ball.y = canvas.height - ball.radius; // Reset position to ground level
        ball.velocityY *= -0.7; // Bounce effect
    }
}

function updateWheelRotation(wheel) {
    wheel.angle += wheel.angularVelocity; // Update the wheel's rotation angle
    if (wheel.angularVelocity > 0) {
        wheel.angularVelocity -= 0.01; // Gradually slow down the wheel
    }
}

export { applyGravity, applyFriction, updateBallPosition, updateWheelRotation };