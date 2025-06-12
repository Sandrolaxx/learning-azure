class Ball {
    constructor(radius, color) {
        this.radius = radius;
        this.color = color;
        this.x = 0;
        this.y = 0;
        this.speed = 0;
        this.angle = 0;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    }

    update() {
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);
        this.speed *= 0.99; // Simulate friction
    }

    reset(positionX, positionY) {
        this.x = positionX;
        this.y = positionY;
        this.speed = 0;
        this.angle = 0;
    }

    setSpeed(speed, angle) {
        this.speed = speed;
        this.angle = angle;
    }
}

export default Ball;