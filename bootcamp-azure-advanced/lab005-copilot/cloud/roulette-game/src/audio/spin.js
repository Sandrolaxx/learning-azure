// This file handles audio effects for the game, such as the sound of the wheel spinning and the ball bouncing.

const spinSound = new Audio('path/to/spin-sound.mp3'); // Replace with the actual path to your audio file

function playSpinSound() {
    spinSound.currentTime = 0; // Reset sound to the start
    spinSound.play();
}

export { playSpinSound };