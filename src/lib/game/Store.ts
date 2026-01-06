import type { Vector2D, Bounds } from './types';

// Store dimensions - reduced for better screen fit
export const STORE_WIDTH = 1200;
export const STORE_HEIGHT = 900;

// Spawn point - safe location in the middle corridor
export const SPAWN_POINT: Vector2D = { x: 600, y: 700 };

// Store layout
export const STORE_BOUNDS: Bounds = {
    x: 0,
    y: 0,
    width: STORE_WIDTH,
    height: STORE_HEIGHT,
};

// Shelves - properly aligned in 3 columns x 4 rows
export const SHELVES: Bounds[] = [
    // Left column
    { x: 100, y: 120, width: 250, height: 80 },
    { x: 100, y: 260, width: 250, height: 80 },
    { x: 100, y: 400, width: 250, height: 80 },
    { x: 100, y: 540, width: 250, height: 80 },

    // Middle column
    { x: 475, y: 120, width: 250, height: 80 },
    { x: 475, y: 260, width: 250, height: 80 },
    { x: 475, y: 400, width: 250, height: 80 },
    { x: 475, y: 540, width: 250, height: 80 },

    // Right column
    { x: 850, y: 120, width: 250, height: 80 },
    { x: 850, y: 260, width: 250, height: 80 },
    { x: 850, y: 400, width: 250, height: 80 },
    { x: 850, y: 540, width: 250, height: 80 },
];

// Checkout area - centered at bottom
export const CHECKOUT_AREA: Bounds = {
    x: 350,
    y: 720,
    width: 500,
    height: 120,
};

// Store configuration interface for future multi-store support
export interface StoreConfig {
    id: string;
    name: string;
    width: number;
    height: number;
    spawnPoint: Vector2D;
    shelves: Bounds[];
    checkoutArea: Bounds;
    backgroundColor: string;
    floorColor: string;
}

// Default store config (H&M style for all stores for now)
const DEFAULT_STORE_CONFIG: StoreConfig = {
    id: 'default',
    name: 'Store',
    width: STORE_WIDTH,
    height: STORE_HEIGHT,
    spawnPoint: SPAWN_POINT,
    shelves: SHELVES,
    checkoutArea: CHECKOUT_AREA,
    backgroundColor: '#FFE5E5',
    floorColor: '#FFF0F0'
};

// Get store config - for now all stores use the same layout
export function getStoreConfig(storeId: string): StoreConfig {
    // Return default config for all stores to maintain compatibility
    return DEFAULT_STORE_CONFIG;
}

// Check if position is walkable (not inside shelves or checkout)
export function isWalkable(position: Vector2D, bounds: Bounds, config?: StoreConfig): boolean {
    const storeConfig = config || DEFAULT_STORE_CONFIG;

    // Check store bounds
    if (
        position.x < 0 ||
        position.y < 0 ||
        position.x + bounds.width > storeConfig.width ||
        position.y + bounds.height > storeConfig.height
    ) {
        return false;
    }

    // Check shelves
    for (const shelf of storeConfig.shelves) {
        if (
            position.x + bounds.width > shelf.x &&
            position.x < shelf.x + shelf.width &&
            position.y + bounds.height > shelf.y &&
            position.y < shelf.y + shelf.height
        ) {
            return false;
        }
    }

    return true;
}

// Check if position is in checkout area
export function isInCheckoutArea(position: Vector2D, config?: StoreConfig): boolean {
    const checkoutArea = config ? config.checkoutArea : CHECKOUT_AREA;
    return (
        position.x >= checkoutArea.x &&
        position.x <= checkoutArea.x + checkoutArea.width &&
        position.y >= checkoutArea.y &&
        position.y <= checkoutArea.y + checkoutArea.height
    );
}
