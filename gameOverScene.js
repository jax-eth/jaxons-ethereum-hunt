// gameOverScene.js

class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create() {
        // Center positions based on canvas size
        const centerX = this.sys.game.config.width / 2;
        const centerY = this.sys.game.config.height / 2;

        this.cameras.main.setBackgroundColor('#ffffff');

        const gameResult = this.registry.get('gameResult');
        const playerName = this.registry.get('playerName');
        const ethereumCollected = this.registry.get('ethereumCollected') || 0;
        const finalTime = this.registry.get('finalTime');

        if (gameResult === 'win') {
            // Win message
            this.add.text(centerX, centerY - 80, 'You Win!', { fontSize: '36px', fill: '#000' }).setOrigin(0.5);
            this.add.text(centerX, centerY - 40, `Congratulations, ${playerName}!`, { fontSize: '24px', fill: '#000' }).setOrigin(0.5);
            this.add.text(centerX, centerY, `Time: ${finalTime} seconds`, { fontSize: '20px', fill: '#000' }).setOrigin(0.5);
        } else {
            // Game over message
            this.add.text(centerX, centerY - 60, 'Game Over!', { fontSize: '36px', fill: '#000' }).setOrigin(0.5);
            this.add.text(centerX, centerY - 20, `Ethereum Coins Collected: ${ethereumCollected}`, { fontSize: '24px', fill: '#000' }).setOrigin(0.5);
        }

        // Restart and Menu buttons
        const restartButton = this.add.text(centerX, centerY + 60, 'Play Again', { fontSize: '24px', fill: '#000' }).setOrigin(0.5).setInteractive();
        const menuButton = this.add.text(centerX, centerY + 100, 'Main Menu', { fontSize: '24px', fill: '#000' }).setOrigin(0.5).setInteractive();

        restartButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        menuButton.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }
}