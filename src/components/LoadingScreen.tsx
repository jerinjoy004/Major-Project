import React from 'react';
import styles from './LoadingScreen.module.css';

interface LoadingScreenProps {
    progress: number;
    message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress, message = 'Loading...' }) => {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.logo}>🛍️</div>
                <h1 className={styles.title}>Virtual Store</h1>
                <p className={styles.message}>{message}</p>

                <div className={styles.progressBar}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                <div className={styles.percentage}>{progress}%</div>
            </div>
        </div>
    );
};