import { Avatar } from './Avatar';
import type { Vector2D, Direction } from '../types';

export class RemoteAvatar extends Avatar {
    private targetPosition: Vector2D;
    private interpolationSpeed: number = 0.2;

    constructor(userId: string, username: string, position: Vector2D) {
        super(userId, username, position);
        this.targetPosition = { ...position };
    }

    updateFromServer(data: {
        position_x: number;
        position_y: number;
        direction: Direction;
        is_moving: boolean;
    }): void {
        this.targetPosition = { x: data.position_x, y: data.position_y };
        this.direction = data.direction;
        this.isMoving = data.is_moving;
    }

    update(deltaTime: number): void {
        // Interpolate to target position for smooth movement
        const dx = this.targetPosition.x - this.position.x;
        const dy = this.targetPosition.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 1) {
            this.position.x += dx * this.interpolationSpeed;
            this.position.y += dy * this.interpolationSpeed;
        } else {
            this.position = { ...this.targetPosition };
        }

        // Update animation
        super.update(deltaTime);
    }
}
