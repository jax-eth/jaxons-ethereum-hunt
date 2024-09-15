// main.js

window.onload = () => {
    const config = {
        type: Phaser.AUTO,
        width: 800, // Reduced width
        height: 600, // Reduced height
        backgroundColor: '#ffffff',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false,
                fps: 60,
                timeScale: 1,
            }
        },
        scene: [MenuScene, InstructionsScene, GameScene, GameOverScene],
    };

    const game = new Phaser.Game(config);
};