// menuScene.js

class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // Center positions based on canvas size
        const centerX = this.sys.game.config.width / 2;
        const centerY = this.sys.game.config.height / 2;

        // Background color
        this.cameras.main.setBackgroundColor('#ffffff');

        // Prompt for name entry
        this.add.text(centerX, centerY - 80, 'Enter Your Name:', { fontSize: '24px', fill: '#000' }).setOrigin(0.5);

        // Instructions
        this.add.text(centerX, centerY - 50, '(Press Enter when done)', { fontSize: '12px', fill: '#000' }).setOrigin(0.5);

        // Create the text object where the player's name will be displayed
        this.nameText = this.add.text(centerX, centerY - 20, '', { fontSize: '20px', fill: '#000' }).setOrigin(0.5);

        // Blinking cursor
        this.cursor = this.add.text(this.nameText.x + this.nameText.width / 2 + 5, this.nameText.y, '|', { fontSize: '20px', fill: '#000' }).setOrigin(0.5);
        this.cursorVisible = true;
        this.time.addEvent({
            delay: 500,
            callback: () => {
                this.cursorVisible = !this.cursorVisible;
                this.cursor.setVisible(this.cursorVisible);
            },
            loop: true
        });

        // Initialize variables
        this.playerName = '';

        // Set up keyboard input
        this.input.keyboard.on('keydown', this.handleKeyInput, this);
    }

    handleKeyInput(event) {
        if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.BACKSPACE && this.playerName.length > 0) {
            this.playerName = this.playerName.slice(0, -1);
        } else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER) {
            if (this.playerName.trim().length > 0) {
                this.registry.set('playerName', this.playerName.trim());
                this.scene.start('InstructionsScene'); // Proceed to the instructions scene
            } else {
                // Show error message
                if (!this.errorText) {
                    const centerX = this.sys.game.config.width / 2;
                    this.errorText = this.add.text(centerX, this.nameText.y + 40, 'Name cannot be empty!', { fontSize: '18px', fill: '#f00' }).setOrigin(0.5);
                }
            }
        } else if (this.playerName.length < 20 && event.key.length === 1) {
            // Only accept printable characters
            this.playerName += event.key;
        }

        // Update the name text
        this.nameText.setText(this.playerName);
        // Adjust cursor position
        this.cursor.x = this.nameText.x + this.nameText.width / 2 + 5;
    }
}