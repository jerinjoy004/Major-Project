export interface Vector2D {
    x: number;
    y: number;
}

export interface Bounds {
    x: number;
    y: number;
    width: number;
    height: number;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface AnimationFrame {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Entity {
    position: Vector2D;
    bounds: Bounds;
    update(deltaTime: number): void;
    render(ctx: CanvasRenderingContext2D, camera: Vector2D): void;
}
