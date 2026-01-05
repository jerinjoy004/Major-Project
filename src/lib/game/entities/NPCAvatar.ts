import { Avatar } from './Avatar';
import type { Vector2D, Direction } from '../types';
import { isWalkable } from '../Store';

export class NPCAvatar extends Avatar {
    private targetPosition: Vector2D;
    private moveTimer: number = 0;
    private moveDuration: number = 2; // Change direction every 2 seconds
    private velocity: Vector2D = { x: 0, y: 0 };
    private pauseTimer: number = 0;
    private pauseDuration: number = 0;

    constructor(id: string, username: string, position: Vector2D) {
        super(id, username, position);
        this.targetPosition = { ...position };
        this.speed = 80; // Slower than player
        this.chooseRandomDirection();
    }

    private chooseRandomDirection(): void {
        // 30% chance to pause
        if (Math.random() < 0.3) {
            this.velocity = { x: 0, y: 0 };
            this.isMoving = false;
            this.pauseDuration = Math.random() * 3 + 1; // Pause 1-4 seconds
            this.pauseTimer = 0;
            return;
        }

        // Choose random direction
        const directions: Direction[] = ['up', 'down', 'left', 'right'];
        this.direction = directions[Math.floor(Math.random() * directions.length)];

        switch (this.direction) {
            case 'up':
                this.velocity = { x: 0, y: -1 };
                break;
            case 'down':
                this.velocity = { x: 0, y: 1 };
                break;
            case 'left':
                this.velocity = { x: -1, y: 0 };
                break;
            case 'right':
                this.velocity = { x: 1, y: 0 };
                break;
        }

        this.isMoving = true;
    }

    update(deltaTime: number): void {
        // Handle pause
        if (this.pauseDuration > 0) {
            this.pauseTimer += deltaTime;
            if (this.pauseTimer >= this.pauseDuration) {
                this.pauseDuration = 0;
                this.chooseRandomDirection();
            }
            super.update(deltaTime);
            return;
        }

        // Change direction periodically
        this.moveTimer += deltaTime;
        if (this.moveTimer >= this.moveDuration) {
            this.moveTimer = 0;
            this.chooseRandomDirection();
        }

        // Move
        if (this.isMoving) {
            const newPosition = {
                x: this.position.x + this.velocity.x * this.speed * deltaTime,
                y: this.position.y + this.velocity.y * this.speed * deltaTime,
            };

            // Check if new position is walkable
            if (isWalkable(newPosition, this.getBounds())) {
                this.position = newPosition;
            } else {
                // Hit obstacle, choose new direction
                this.chooseRandomDirection();
            }
        }

        // Update animation
        super.update(deltaTime);
    }
}
