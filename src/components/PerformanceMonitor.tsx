import React, { useState, useEffect } from 'react';

interface PerformanceMonitorProps {
    onClose: () => void;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ onClose }) => {
    const [fps, setFps] = useState(60);
    const [memory, setMemory] = useState({ used: 0, total: 0 });
    const [ping, setPing] = useState(0);
    const [renderTime, setRenderTime] = useState(0);

    useEffect(() => {
        let frameCount = 0;
        let lastTime = performance.now();
        let animationId: number;

        const measurePerformance = () => {
            const currentTime = performance.now();
            frameCount++;

            if (currentTime >= lastTime + 1000) {
                setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
                frameCount = 0;
                lastTime = currentTime;

                // Memory (if available)
                if ((performance as any).memory) {
                    const mem = (performance as any).memory;
                    setMemory({
                        used: Math.round(mem.usedJSHeapSize / 1048576),
                        total: Math.round(mem.jsHeapSizeLimit / 1048576)
                    });
                }

                // Simulated render time
                setRenderTime(Math.random() * 5 + 10);
            }

            animationId = requestAnimationFrame(measurePerformance);
        };

        animationId = requestAnimationFrame(measurePerformance);

        // Simulate ping measurement
        const pingInterval = setInterval(() => {
            setPing(Math.floor(Math.random() * 50) + 10);
        }, 5000);

        return () => {
            cancelAnimationFrame(animationId);
            clearInterval(pingInterval);
        };
    }, []);

    const getStatusColor = (value: number, thresholds: [number, number]) => {
        if (value <= thresholds[0]) return '#10b981';
        if (value <= thresholds[1]) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <>
            <style>{`
                .perf-monitor-container {
                    position: absolute;
                    top: 20px;
                    left: 280px;
                    width: 260px;
                    background: rgba(10, 10, 15, 0.95);
                    border: 1px solid rgba(139, 92, 246, 0.3);
                    border-radius: 16px;
                    backdrop-filter: blur(12px);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
                    z-index: 1000;
                    animation: perf-slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .perf-monitor-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 12px 16px;
                    border-bottom: 1px solid rgba(139, 92, 246, 0.2);
                }

                .perf-monitor-title {
                    color: #fff;
                    font-size: 14px;
                    font-weight: 600;
                }

                .perf-monitor-close-btn {
                    background: none;
                    border: none;
                    color: #888;
                    font-size: 18px;
                    cursor: pointer;
                    padding: 4px 8px;
                    border-radius: 6px;
                    transition: all 0.2s ease;
                }

                .perf-monitor-close-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: #fff;
                }

                .perf-monitor-metrics {
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .perf-monitor-metric {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .perf-monitor-metric-label {
                    color: #888;
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .perf-monitor-metric-value {
                    color: #fff;
                    font-size: 18px;
                    font-weight: 600;
                    font-variant-numeric: tabular-nums;
                }

                .perf-monitor-metric-bar {
                    height: 4px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 999px;
                    overflow: hidden;
                }

                .perf-monitor-metric-fill {
                    height: 100%;
                    background: #3b82f6;
                    border-radius: 999px;
                    transition: width 0.3s ease;
                }

                @keyframes perf-slideInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @media (max-width: 1024px) {
                    .perf-monitor-container {
                        left: 10px;
                        top: 220px;
                        width: 200px;
                    }

                    .perf-monitor-metrics {
                        padding: 12px;
                        gap: 12px;
                    }

                    .perf-monitor-metric-value {
                        font-size: 16px;
                    }
                }
            `}</style>

            <div className="perf-monitor-container">
                <div className="perf-monitor-header">
                    <span className="perf-monitor-title">📊 Performance</span>
                    <button className="perf-monitor-close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="perf-monitor-metrics">
                    <div className="perf-monitor-metric">
                        <div className="perf-monitor-metric-label">FPS</div>
                        <div
                            className="perf-monitor-metric-value"
                            style={{ color: getStatusColor(60 - fps, [10, 20]) }}
                        >
                            {fps}
                        </div>
                        <div className="perf-monitor-metric-bar">
                            <div
                                className="perf-monitor-metric-fill"
                                style={{ width: `${Math.min(fps / 60 * 100, 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="perf-monitor-metric">
                        <div className="perf-monitor-metric-label">Memory</div>
                        <div className="perf-monitor-metric-value">
                            {memory.used}MB / {memory.total}MB
                        </div>
                        <div className="perf-monitor-metric-bar">
                            <div
                                className="perf-monitor-metric-fill"
                                style={{
                                    width: `${(memory.used / memory.total) * 100}%`,
                                    background: memory.used / memory.total > 0.8 ? '#ef4444' : '#3b82f6'
                                }}
                            ></div>
                        </div>
                    </div>

                    <div className="perf-monitor-metric">
                        <div className="perf-monitor-metric-label">Ping</div>
                        <div
                            className="perf-monitor-metric-value"
                            style={{ color: getStatusColor(ping, [50, 100]) }}
                        >
                            {ping}ms
                        </div>
                    </div>

                    <div className="perf-monitor-metric">
                        <div className="perf-monitor-metric-label">Render Time</div>
                        <div className="perf-monitor-metric-value">
                            {renderTime.toFixed(1)}ms
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};