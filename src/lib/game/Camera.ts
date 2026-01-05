import type { Vector2D } from './types';

export class Camera {
    public position: Vector2D;
    public width: number;
    public height: number;
    private targetPosition: Vector2D;
    private smoothing: number = 0.1;
    private _zoom: number = 0.7; // Zoom out to fit entire store on screen
    private _rotation: number = 0;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        // Center camera on the store (600, 450 is center of 1200x900 store)
        this.position = { x: 600 - width / 2, y: 450 - height / 2 };
        this.targetPosition = { ...this.position };
    }

    follow(target: Vector2D): void {
        // Center camera on target
        this.targetPosition = {
            x: target.x - this.width / (2 * this._zoom),
            y: target.y - this.height / (2 * this._zoom),
        };
    }

    update(): void {
        // Smooth camera movement
        this.position.x += (this.targetPosition.x - this.position.x) * this.smoothing;
        this.position.y += (this.targetPosition.y - this.position.y) * this.smoothing;
    }

    worldToScreen(worldPos: Vector2D): Vector2D {
        return {
            x: (worldPos.x - this.position.x) * this._zoom,
            y: (worldPos.y - this.position.y) * this._zoom,
        };
    }

    screenToWorld(screenPos: Vector2D): Vector2D {
        return {
            x: screenPos.x / this._zoom + this.position.x,
            y: screenPos.y / this._zoom + this.position.y,
        };
    }

    resize(width: number, height: number): void {
        this.width = width;
        this.height = height;
    }

    // Zoom controls
    get zoom(): number {
        return this._zoom;
    }

    setZoom(zoom: number): void {
        this._zoom = Math.max(0.5, Math.min(2.0, zoom));
    }

    adjustZoom(delta: number): void {
        this.setZoom(this._zoom + delta);
    }

    // Rotation controls
    get rotation(): number {
        return this._rotation;
    }

    setRotation(angle: number): void {
        this._rotation = angle % 360;
        if (this._rotation < 0) this._rotation += 360;
    }

    adjustRotation(delta: number): void {
        this.setRotation(this._rotation + delta);
    }

    // Additional getters for enhanced camera state
    get pitch(): number {
        return 45; // Default pitch for 2D top-down view
    }

    get x(): number {
        return this.position.x;
    }

    get y(): number {
        return this.position.y;
    }

    // View presets for simplified camera control
    setAerialView(): void {
        // Top-down, zoomed out view
        this._zoom = 0.6;
        this._rotation = 0;
    }

    setNormalView(): void {
        // Default isometric view
        this._zoom = 1.0;
        this._rotation = 0;
    }

    setCloseView(): void {
        // Zoomed in, following closely
        this._zoom = 1.5;
        this._rotation = 0;
    }

    getCurrentView(): 'aerial' | 'normal' | 'close' {
        if (this._zoom <= 0.7) return 'aerial';
        if (this._zoom >= 1.3) return 'close';
        return 'normal';
    }

    // Reset camera to defaults
    reset(): void {
        this._zoom = 1.0;
        this._rotation = 0;
    }
}
