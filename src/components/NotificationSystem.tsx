import React from 'react';

interface Notification {
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationSystemProps {
    notifications: Notification[];
}

const iconMap = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
};

const colorMap = {
    info: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
};

export const NotificationSystem: React.FC<NotificationSystemProps> = ({ notifications }) => {
    return (
        <>
            <style>{`
                .notif-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    max-width: 400px;
                    pointer-events: none;
                }

                .notif-notification {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px 18px;
                    border-radius: 12px;
                    background: rgba(15, 15, 25, 0.95);
                    backdrop-filter: blur(12px);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    animation: notif-slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) backwards;
                    position: relative;
                    overflow: hidden;
                    pointer-events: auto;
                    min-width: 280px;
                }

                .notif-icon {
                    font-size: 20px;
                    flex-shrink: 0;
                }

                .notif-message {
                    color: #fff;
                    font-size: 14px;
                    line-height: 1.4;
                    flex: 1;
                }

                .notif-progress {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 3px;
                    width: 100%;
                    transform-origin: left;
                    animation: notif-shrink 5s linear;
                }

                @keyframes notif-slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes notif-shrink {
                    from {
                        transform: scaleX(1);
                    }
                    to {
                        transform: scaleX(0);
                    }
                }

                @media (max-width: 768px) {
                    .notif-container {
                        top: 10px;
                        right: 10px;
                        left: 10px;
                        max-width: none;
                    }

                    .notif-notification {
                        min-width: auto;
                        padding: 12px 16px;
                    }

                    .notif-message {
                        font-size: 13px;
                    }
                }
            `}</style>

            <div className="notif-container">
                {notifications.map((notification, index) => (
                    <div
                        key={notification.id}
                        className="notif-notification"
                        style={{
                            animationDelay: `${index * 0.05}s`,
                            borderLeftColor: colorMap[notification.type],
                            borderLeftWidth: '3px',
                            borderLeftStyle: 'solid'
                        }}
                    >
                        <span className="notif-icon">
                            {iconMap[notification.type]}
                        </span>
                        <span className="notif-message">{notification.message}</span>
                        <div
                            className="notif-progress"
                            style={{ background: colorMap[notification.type] }}
                        ></div>
                    </div>
                ))}
            </div>
        </>
    );
};