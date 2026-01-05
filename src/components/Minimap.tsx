import React, { useMemo } from 'react';
import styles from './Minimap.module.css';

interface Position {
    x: number;
    y: number;
}

interface Player {
    user_id: string;
    username: string;
    x?: number;
    y?: number;
}

interface Product {
    id: string;
    name: string;
    position_x?: number;
    position_y?: number;
}

interface MinimapProps {
    playerPosition: Position;
    otherPlayers: Player[];
    products: Product[];
    onToggle: () => void;
}

export const Minimap: React.FC<MinimapProps> = ({
    playerPosition,
    otherPlayers,
    products,
    onToggle
}) => {
    // Map dimensions and scale
    const MAP_WIDTH = 200;
    const MAP_HEIGHT = 200;
    const WORLD_WIDTH = 2000; // Adjust based on your game world
    const WORLD_HEIGHT = 2000;

    const scaleX = MAP_WIDTH / WORLD_WIDTH;
    const scaleY = MAP_HEIGHT / WORLD_HEIGHT;

    const toMapCoords = (x: number, y: number) => ({
        x: (x + WORLD_WIDTH / 2) * scaleX,
        y: (y + WORLD_HEIGHT / 2) * scaleY
    });

    const playerMapPos = useMemo(() =>
        toMapCoords(playerPosition.x, playerPosition.y),
        [playerPosition]
    );

    const otherPlayersMapPos = useMemo(() =>
        otherPlayers
            .filter(p => p.x !== undefined && p.y !== undefined)
            .map(p => ({
                ...p,
                ...toMapCoords(p.x!, p.y!)
            })),
        [otherPlayers]
    );

    const productsMapPos = useMemo(() =>
        products
            .filter(p => p.position_x !== undefined && p.position_y !== undefined)
            .map(p => ({
                ...p,
                ...toMapCoords(p.position_x!, p.position_y!)
            })),
        [products]
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.title}>🗺️ Map</span>
                <button
                    className={styles.closeBtn}
                    onClick={onToggle}
                    aria-label="Close minimap"
                >
                    ✕
                </button>
            </div>

            <div className={styles.map}>
                {/* Grid background */}
                <svg className={styles.grid}>
                    <defs>
                        <pattern
                            id="grid"
                            width="20"
                            height="20"
                            patternUnits="userSpaceOnUse"
                        >
                            <path
                                d="M 20 0 L 0 0 0 20"
                                fill="none"
                                stroke="rgba(139, 92, 246, 0.1)"
                                strokeWidth="0.5"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Products */}
                {productsMapPos.map(product => (
                    <div
                        key={product.id}
                        className={styles.product}
                        style={{
                            left: `${product.x}px`,
                            top: `${product.y}px`
                        }}
                        title={product.name}
                    >
                        📦
                    </div>
                ))}

                {/* Other players */}
                {otherPlayersMapPos.map(player => (
                    <div
                        key={player.user_id}
                        className={styles.otherPlayer}
                        style={{
                            left: `${player.x}px`,
                            top: `${player.y}px`
                        }}
                        title={player.username}
                    >
                        <div className={styles.playerDot}></div>
                        <div className={styles.playerPulse}></div>
                    </div>
                ))}

                {/* Current player */}
                <div
                    className={styles.currentPlayer}
                    style={{
                        left: `${playerMapPos.x}px`,
                        top: `${playerMapPos.y}px`
                    }}
                >
                    <div className={styles.playerArrow}>▲</div>
                    <div className={styles.playerGlow}></div>
                </div>
            </div>

            <div className={styles.legend}>
                <div className={styles.legendItem}>
                    <div className={styles.legendIcon} style={{ background: '#3b82f6' }}></div>
                    <span>You</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={styles.legendIcon} style={{ background: '#10b981' }}></div>
                    <span>Players</span>
                </div>
                <div className={styles.legendItem}>
                    <span>📦</span>
                    <span>Products</span>
                </div>
            </div>
        </div>
    );
};