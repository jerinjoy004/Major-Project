import React from 'react';

interface Player {
    user_id: string;
    username: string;
    x?: number;
    y?: number;
}

interface PlayerInteractionProps {
    player: Player;
    onWave: () => void;
    onChat: () => void;
    onFollow: () => void;
    onClose: () => void;
}

export const PlayerInteraction: React.FC<PlayerInteractionProps> = ({
    player,
    onWave,
    onChat,
    onFollow,
    onClose
}) => {
    return (
        <>
            <style>{`
                .player-interaction {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(10, 10, 15, 0.98);
                    border: 2px solid rgba(139, 92, 246, 0.5);
                    border-radius: 20px;
                    padding: 24px;
                    min-width: 320px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(20px);
                    z-index: 10000;
                    animation: pi-slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }

                @keyframes pi-slideIn {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -45%);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, -50%);
                    }
                }

                .pi-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 20px;
                }

                .pi-player-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .pi-avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
                }

                .pi-player-name {
                    color: #fff;
                    font-size: 18px;
                    font-weight: 600;
                }

                .pi-online {
                    color: #10b981;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .pi-online-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #10b981;
                    animation: pi-pulse 2s infinite;
                }

                @keyframes pi-pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                .pi-close-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    color: #fff;
                    font-size: 20px;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .pi-close-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: rotate(90deg);
                }

                .pi-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .pi-action-btn {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    color: #fff;
                    padding: 14px 20px;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    transition: all 0.2s;
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                }

                .pi-action-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
                }

                .pi-action-btn:active {
                    transform: translateY(0);
                }

                .pi-action-icon {
                    font-size: 24px;
                }
            `}</style>

            <div className="player-interaction">
                <div className="pi-header">
                    <div className="pi-player-info">
                        <div className="pi-avatar">👤</div>
                        <div>
                            <div className="pi-player-name">{player.username}</div>
                            <div className="pi-online">
                                <span className="pi-online-dot"></span>
                                Online
                            </div>
                        </div>
                    </div>
                    <button className="pi-close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="pi-actions">
                    <button className="pi-action-btn" onClick={onWave}>
                        <span className="pi-action-icon">👋</span>
                        Wave Hello
                    </button>
                    <button className="pi-action-btn" onClick={onChat}>
                        <span className="pi-action-icon">💬</span>
                        Start Chat
                    </button>
                    <button className="pi-action-btn" onClick={onFollow}>
                        <span className="pi-action-icon">👥</span>
                        Follow Player
                    </button>
                </div>
            </div>
        </>
    );
};
