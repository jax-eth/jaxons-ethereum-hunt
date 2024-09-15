// instructionsScene.js

class InstructionsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'InstructionsScene' });
    }

    create() {
        // Center positions based on canvas size
        const centerX = this.sys.game.config.width / 2;
        const centerY = this.sys.game.config.height / 2;

        // Background color
        this.cameras.main.setBackgroundColor('#ffffff');

        // Instructions text
        const instructions = [
            "Welcome to Jaxon's Ethereum Hunt!",
            "Use the arrow keys to move Jaxon.",
            "Collect as many Ethereum Coins as you can.",
            "Avoid Bombs or you will lose.",
            "Collect 12 Ethereum Coins to win the game.",
            "Press any key to start."
        ];

        for (let i = 0; i < instructions.length; i++) {
            this.add.text(centerX, centerY - 100 + i * 30, instructions[i], { fontSize: '18px', fill: '#000' }).setOrigin(0.5);
        }

        // Add keyboard listener to start the game
        this.input.keyboard.once('keydown', () => {
            this.scene.start('GameScene');
        });
    }
}