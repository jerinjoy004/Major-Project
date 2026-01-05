import { Avatar } from './Avatar';
import type { Vector2D, Direction } from '../types';
import { isWalkable } from '../Store';
import type { InputManager } from '../InputManager';

export class PlayerAvatar extends Avatar {
    private inputManager: InputManager;
    private velocity: Vector2D = { x: 0, y: 0 };

    constructor(
        userId: string,
        username: string,
        position: Vector2D,
        inputManager: InputManager
    ) {
        super(userId, username, position);
        this.inputManager = inputManager;
    }

    update(deltaTime: number): void {
        // Get input
        this.velocity = { x: 0, y: 0 };
        let newDirection: Direction = this.direction;

        if (this.inputManager.isMovingUp()) {
            this.velocity.y = -this.speed;
            newDirection = 'up';
        } else if (this.inputManager.isMovingDown()) {
            this.velocity.y = this.speed;
            newDirection = 'down';
        }

        if (this.inputManager.isMovingLeft()) {
            this.velocity.x = -this.speed;
            newDirection = 'left';
        } else if (this.inputManager.isMovingRight()) {
            this.velocity.x = this.speed;
            newDirection = 'right';
        }

        // Normalize diagonal movement
        if (this.velocity.x !== 0 && this.velocity.y !== 0) {
            const length = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
            this.velocity.x = (this.velocity.x / length) * this.speed;
            this.velocity.y = (this.velocity.y / length) * this.speed;
        }

        this.isMoving = this.velocity.x !== 0 || this.velocity.y !== 0;
        if (this.isMoving) {
            this.direction = newDirection;
        }

        // Calculate new position
        const newPosition = {
            x: this.position.x + this.velocity.x * deltaTime,
            y: this.position.y + this.velocity.y * deltaTime,
        };

        // Check if new position is walkable
        if (isWalkable(newPosition, this.getBounds())) {
            this.position = newPosition;
        }

        // Update animation
        super.update(deltaTime);
    }

    getState() {
        return {
            position_x: this.position.x,
            position_y: this.position.y,
            direction: this.direction,
            is_moving: this.isMoving,
        };
    }
}
