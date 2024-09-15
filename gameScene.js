// gameScene.js

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // Load images
        this.load.image('jaxon', 'assets/jaxon.png');
        this.load.image('ethereum', 'assets/ethereum.png');
        this.load.image('bomb', 'assets/bomb.png');
    }

    create() {
        // Set up variables
        this.MAX_BOMBS = 5;
        this.MAX_ETHEREUM_COINS = 12;
        this.ethereumCollected = 0;
        this.gameOver = false;

        // Center positions based on canvas size
        const centerX = this.sys.game.config.width / 2;
        const centerY = this.sys.game.config.height / 2;

        // Create grid background
        const gridGraphics = this.add.graphics();
        gridGraphics.lineStyle(1, 0xcccccc, 1);

        for (let x = 0; x < this.sys.game.config.width; x += 40) {
            gridGraphics.moveTo(x, 0);
            gridGraphics.lineTo(x, this.sys.game.config.height);
        }
        for (let y = 0; y < this.sys.game.config.height; y += 40) {
            gridGraphics.moveTo(0, y);
            gridGraphics.lineTo(this.sys.game.config.width, y);
        }

        gridGraphics.strokePath();

        // Generate a texture from the graphics
        gridGraphics.generateTexture('gridTexture', this.sys.game.config.width, this.sys.game.config.height);
        gridGraphics.destroy();

        // Add the grid as a static image
        this.add.image(centerX, centerY, 'gridTexture');

        // Create player sprite and scale down
        this.player = this.physics.add.sprite(centerX, centerY, 'jaxon');
        this.player.setScale(0.5);
        this.player.setCollideWorldBounds(true);

        // Create groups
        this.ethereumGroup = this.physics.add.group();
        this.bombGroup = this.physics.add.group();

        // Input handling
        this.cursors = this.input.keyboard.createCursorKeys();

        // Spawn Ethereum Coins
        this.time.addEvent({
            delay: 5000,
            callback: this.spawnEthereum,
            callbackScope: this,
            loop: true
        });

        // Spawn Bombs
        this.time.addEvent({
            delay: 3000,
            callback: this.spawnBomb,
            callbackScope: this,
            loop: true
        });

        // Collision detection
        this.physics.add.overlap(this.player, this.ethereumGroup, this.collectEthereum, null, this);
        this.physics.add.overlap(this.player, this.bombGroup, this.hitBomb, null, this);

        // Display score
        this.scoreText = this.add.text(centerX, 10, 'Ethereum Coins: 0', { fontSize: '16px', fill: '#000' }).setOrigin(0.5, 0);

        // Display player's name
        const playerName = this.registry.get('playerName') || 'Player';
        this.nameText = this.add.text(this.sys.game.config.width - 10, 10, `Player: ${playerName}`, { fontSize: '16px', fill: '#000' }).setOrigin(1, 0);

        // Display time
        this.startTime = this.time.now;
        this.timeText = this.add.text(10, 10, 'Time: 0', { fontSize: '16px', fill: '#000' });

        // QueSopa text at bottom left
        this.add.text(10, this.sys.game.config.height - 20, 'QueSopa', { fontSize: '16px', fill: '#000' });
    }

    update() {
        if (this.gameOver) {
            return;
        }

        // Update time
        const elapsedSeconds = Math.floor((this.time.now - this.startTime) / 1000);
        this.timeText.setText('Time: ' + elapsedSeconds);

        // Reset velocity
        this.player.setVelocity(0);

        // Movement controls
        let velocityX = 0;
        let velocityY = 0;

        if (this.cursors.left.isDown) {
            velocityX = -160;
        } else if (this.cursors.right.isDown) {
            velocityX = 160;
        }

        if (this.cursors.up.isDown) {
            velocityY = -160;
        } else if (this.cursors.down.isDown) {
            velocityY = 160;
        }

        this.player.setVelocity(velocityX, velocityY);
    }

    spawnEthereum() {
        if (this.ethereumGroup.countActive(true) < this.MAX_ETHEREUM_COINS) {
            const x = Phaser.Math.Between(20, this.sys.game.config.width - 20);
            const y = Phaser.Math.Between(20, this.sys.game.config.height - 20);
            const ethereum = this.ethereumGroup.create(x, y, 'ethereum');
            ethereum.setScale(0.5); // Scale down Ethereum coin
            ethereum.setBounce(1);
            ethereum.setCollideWorldBounds(true);
            ethereum.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200));
        }
    }

    spawnBomb() {
        if (this.bombGroup.countActive(true) < this.MAX_BOMBS) {
            const x = Phaser.Math.Between(20, this.sys.game.config.width - 20);
            const y = Phaser.Math.Between(20, this.sys.game.config.height - 20);
            const bomb = this.bombGroup.create(x, y, 'bomb');
            bomb.setScale(0.5); // Scale down Bomb
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200));
        }
    }

    collectEthereum(player, ethereum) {
        ethereum.destroy();
        this.ethereumCollected += 1;
        this.scoreText.setText('Ethereum Coins: ' + this.ethereumCollected);

        // Check for win condition
        if (this.ethereumCollected >= this.MAX_ETHEREUM_COINS) {
            this.winGame();
        }
    }

    hitBomb(player, bomb) {
        this.physics.pause();
        player.setTint(0xff0000);
        this.gameOver = true;

        // Transition to GameOverScene after a short delay
        this.time.delayedCall(1000, () => {
            this.registry.set('gameResult', 'lose');
            this.registry.set('ethereumCollected', this.ethereumCollected);
            this.scene.start('GameOverScene');
        }, [], this);
    }

    winGame() {
        this.physics.pause();
        this.gameOver = true;

        // Transition to GameOverScene after a short delay
        this.time.delayedCall(1000, () => {
            this.registry.set('gameResult', 'win');
            this.registry.set('finalTime', Math.floor((this.time.now - this.startTime) / 1000));
            this.scene.start('GameOverScene');
        }, [], this);
    }
}