import React from 'react';
import styles from './CameraControls.module.css';

interface Props {
    onAerialView: () => void;
    onNormalView: () => void;
    onCloseView: () => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    zoom: number;
    currentView: 'aerial' | 'normal' | 'close';
}

export const CameraControls: React.FC<Props> = ({
    onAerialView,
    onNormalView,
    onCloseView,
    onZoomIn,
    onZoomOut,
    zoom,
    currentView,
}) => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.title}>📷 Camera Views</span>
            </div>

            <div className={styles.controls}>
                {/* View Presets */}
                <div className={styles.section}>
                    <label className={styles.label}>Quick Views</label>
                    <div className={styles.viewGrid}>
                        <button
                            className={`${styles.viewBtn} ${currentView === 'aerial' ? styles.active : ''}`}
                            onClick={onAerialView}
                            title="Aerial View - Top-down overview"
                        >
                            🔭<br />
                            <span className={styles.viewLabel}>Aerial</span>
                        </button>
                        <button
                            className={`${styles.viewBtn} ${currentView === 'normal' ? styles.active : ''}`}
                            onClick={onNormalView}
                            title="Normal View - Default perspective"
                        >
                            👁️<br />
                            <span className={styles.viewLabel}>Normal</span>
                        </button>
                        <button
                            className={`${styles.viewBtn} ${currentView === 'close' ? styles.active : ''}`}
                            onClick={onCloseView}
                            title="Close View - Follow player closely"
                        >
                            🔍<br />
                            <span className={styles.viewLabel}>Close</span>
                        </button>
                    </div>
                </div>

                {/* Zoom Controls */}
                <div className={styles.section}>
                    <label className={styles.label}>Zoom: {zoom.toFixed(1)}x</label>
                    <div className={styles.buttonGroup}>
                        <button
                            className={styles.btn}
                            onClick={onZoomOut}
                            disabled={zoom <= 0.5}
                            title="Zoom Out"
                        >
                            −
                        </button>
                        <button
                            className={styles.btn}
                            onClick={onZoomIn}
                            disabled={zoom >= 2.0}
                            title="Zoom In"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.hint}>
                💡 Use mouse wheel to zoom
            </div>
        </div>
    );
};
