describe('Roulette Game', () => {
    let wheel;
    let ball;

    beforeEach(() => {
        wheel = new Wheel();
        ball = new Ball();
    });

    test('Wheel should spin and return a winning number', () => {
        wheel.spin();
        const winningNumber = wheel.getWinningNumber();
        expect(winningNumber).toBeGreaterThanOrEqual(0);
        expect(winningNumber).toBeLessThan(37); // Assuming a standard roulette wheel with numbers 0-36
    });

    test('Ball should bounce off the wheel correctly', () => {
        ball.setPosition(100, 100); // Set initial position
        ball.updatePosition(); // Update position based on physics
        expect(ball.position.x).toBeGreaterThan(0);
        expect(ball.position.y).toBeGreaterThan(0);
    });

    test('Ball should stop after bouncing', () => {
        ball.setPosition(100, 100);
        ball.bounce();
        ball.updatePosition(); // Simulate a few updates
        ball.updatePosition();
        expect(ball.velocity).toBeLessThan(1); // Check if the ball has slowed down
    });
});