class Wheel {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
        this.radius = canvas.height / 2 - 20;
        this.angle = 0;
        this.speed = 0;
        this.isSpinning = false;
        this.colors = ['red', 'black', 'green'];
        this.numbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.save();
        this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.context.rotate(this.angle);

        for (let i = 0; i < this.numbers.length; i++) {
            this.context.beginPath();
            this.context.arc(0, -this.radius, this.radius, (i * Math.PI) / 18, ((i + 1) * Math.PI) / 18);
            this.context.lineTo(0, 0);
            this.context.fillStyle = this.colors[i % 3];
            this.context.fill();
            this.context.stroke();
            this.context.fillStyle = 'white';
            this.context.fillText(this.numbers[i], 0, -this.radius + 20);
            this.context.rotate((Math.PI) / 18);
        }

        this.context.restore();
    }

    spin() {
        this.isSpinning = true;
        this.speed = Math.random() * 10 + 10; // Random speed
        this.animate();
    }

    animate() {
        if (this.isSpinning) {
            this.angle += this.speed * (Math.PI / 180);
            this.speed *= 0.99; // Simulate friction
            if (this.speed < 0.1) {
                this.isSpinning = false;
                this.speed = 0;
                this.angle = Math.round(this.angle / (Math.PI / 18)) * (Math.PI / 18); // Snap to nearest number
            }
            this.draw();
            requestAnimationFrame(this.animate.bind(this));
        }
    }

    getWinningNumber() {
        const index = Math.floor((this.angle / (Math.PI / 18)) % this.numbers.length);
        return this.numbers[index < 0 ? index + this.numbers.length : index];
    }
}

export default Wheel;