import type { Vector2D, Direction } from '../types';

export class Avatar {
    public position: Vector2D;
    public direction: Direction;
    public isMoving: boolean;
    public username: string;
    public userId: string;
    public width: number = 32;
    public height: number = 48;
    public speed: number = 150; // pixels per second
    public bodyColor: string = '#4A90E2'; // Default blue
    public skinTone: string = '#FFD1A3'; // Default light

    protected animationFrame: number = 0;
    protected animationTimer: number = 0;
    protected animationSpeed: number = 0.15; // seconds per frame

    constructor(userId: string, username: string, position: Vector2D) {
        this.userId = userId;
        this.username = username;
        this.position = { ...position };
        this.direction = 'down';
        this.isMoving = false;
    }

    update(deltaTime: number): void {
        if (this.isMoving) {
            this.animationTimer += deltaTime;
            if (this.animationTimer >= this.animationSpeed) {
                this.animationTimer = 0;
                this.animationFrame = (this.animationFrame + 1) % 4;
            }
        } else {
            this.animationFrame = 0;
            this.animationTimer = 0;
        }
    }

    render(ctx: CanvasRenderingContext2D, camera: Vector2D): void {
        const screenX = this.position.x - camera.x;
        const screenY = this.position.y - camera.y;

        // Draw shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(screenX + this.width / 2, screenY + this.height - 2, this.width / 2.5, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw body (torso)
        const bodyGradient = ctx.createLinearGradient(
            screenX,
            screenY + 20,
            screenX,
            screenY + this.height
        );
        bodyGradient.addColorStop(0, this.bodyColor);
        bodyGradient.addColorStop(1, this.adjustBrightness(this.bodyColor, -20));
        ctx.fillStyle = bodyGradient;
        ctx.fillRect(screenX + 6, screenY + 20, this.width - 12, this.height - 20);

        // Draw head
        ctx.fillStyle = this.skinTone;
        ctx.beginPath();
        ctx.arc(screenX + this.width / 2, screenY + 12, 10, 0, Math.PI * 2);
        ctx.fill();

        // Draw eyes based on direction
        ctx.fillStyle = '#333';
        const eyeY = screenY + 10;
        if (this.direction === 'down' || this.direction === 'up') {
            // Front/back view - two eyes
            ctx.fillRect(screenX + 11, eyeY, 3, 3);
            ctx.fillRect(screenX + 18, eyeY, 3, 3);
        } else if (this.direction === 'left') {
            // Side view left - one eye
            ctx.fillRect(screenX + 10, eyeY, 3, 3);
        } else if (this.direction === 'right') {
            // Side view right - one eye
            ctx.fillRect(screenX + 19, eyeY, 3, 3);
        }

        // Draw arms
        ctx.strokeStyle = this.skinTone;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        // Left arm
        ctx.beginPath();
        ctx.moveTo(screenX + 6, screenY + 25);
        ctx.lineTo(screenX + 2, screenY + 32);
        ctx.stroke();

        // Right arm
        ctx.beginPath();
        ctx.moveTo(screenX + this.width - 6, screenY + 25);
        ctx.lineTo(screenX + this.width - 2, screenY + 32);
        ctx.stroke();

        // Draw legs (simple)
        ctx.strokeStyle = this.adjustBrightness(this.bodyColor, -30);
        ctx.lineWidth = 4;

        // Left leg
        ctx.beginPath();
        ctx.moveTo(screenX + 12, screenY + this.height - 20);
        ctx.lineTo(screenX + 10, screenY + this.height - 2);
        ctx.stroke();

        // Right leg
        ctx.beginPath();
        ctx.moveTo(screenX + 20, screenY + this.height - 20);
        ctx.lineTo(screenX + 22, screenY + this.height - 2);
        ctx.stroke();

        // Username tag
        ctx.fillStyle = '#000';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';

        // Username background
        const textWidth = ctx.measureText(this.username).width;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(
            screenX + this.width / 2 - textWidth / 2 - 4,
            screenY - 18,
            textWidth + 8,
            16
        );

        // Username text
        ctx.fillStyle = '#000';
        ctx.fillText(this.username, screenX + this.width / 2, screenY - 5);
    }

    getBounds() {
        return {
            x: this.position.x,
            y: this.position.y,
            width: this.width,
            height: this.height,
        };
    }

    // Check if a point is within this avatar's bounds (with generous padding for easier clicking)
    containsPoint(point: Vector2D): boolean {
        const padding = 50; // Large padding to make clicking easier
        return (
            point.x >= this.position.x - padding &&
            point.x <= this.position.x + this.width + padding &&
            point.y >= this.position.y - padding &&
            point.y <= this.position.y + this.height + padding
        );
    }

    // Helper to adjust color brightness
    private adjustBrightness(color: string, amount: number): string {
        const hex = color.replace('#', '');
        const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
        const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
        const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
}
