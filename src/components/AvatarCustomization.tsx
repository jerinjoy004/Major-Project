import React, { useState } from 'react';

interface AvatarCustomizationProps {
    onClose: () => void;
    onApply: (customization: AvatarCustomization) => void;
    currentCustomization: AvatarCustomization;
}

export interface AvatarCustomization {
    bodyColor: string;
    skinTone: string;
    style: 'casual' | 'formal' | 'sporty' | 'cool';
}

const BODY_COLORS = [
    { name: 'Blue', value: '#4A90E2' },
    { name: 'Red', value: '#E74C3C' },
    { name: 'Green', value: '#2ECC71' },
    { name: 'Purple', value: '#9B59B6' },
    { name: 'Orange', value: '#E67E22' },
    { name: 'Pink', value: '#EC407A' },
];

const SKIN_TONES = [
    { name: 'Light', value: '#FFD1A3' },
    { name: 'Medium', value: '#D4A574' },
    { name: 'Tan', value: '#C68642' },
    { name: 'Dark', value: '#8D5524' },
];

export const AvatarCustomization: React.FC<AvatarCustomizationProps> = ({
    onClose,
    onApply,
    currentCustomization
}) => {
    const [customization, setCustomization] = useState<AvatarCustomization>(currentCustomization);

    const handleApply = () => {
        onApply(customization);
        onClose();
    };

    return (
        <>
            <style>{`
                .avatar-custom-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    animation: ac-fadeIn 0.3s;
                }

                @keyframes ac-fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .avatar-custom-panel {
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    border: 2px solid #8b5cf6;
                    border-radius: 20px;
                    padding: 30px;
                    max-width: 500px;
                    width: 90%;
                    box-shadow: 0 20px 60px rgba(139, 92, 246, 0.3);
                    animation: ac-slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }

                @keyframes ac-slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .ac-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                }

                .ac-title {
                    color: #fff;
                    font-size: 24px;
                    font-weight: 700;
                    margin: 0;
                }

                .ac-close {
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    color: #fff;
                    font-size: 24px;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .ac-close:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: rotate(90deg);
                }

                .ac-section {
                    margin-bottom: 25px;
                }

                .ac-section-title {
                    color: #a78bfa;
                    font-size: 14px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 12px;
                }

                .ac-color-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
                    gap: 10px;
                }

                .ac-color-option {
                    aspect-ratio: 1;
                    border-radius: 12px;
                    border: 3px solid transparent;
                    cursor: pointer;
                    transition: all 0.2s;
                    position: relative;
                }

                .ac-color-option:hover {
                    transform: scale(1.1);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                }

                .ac-color-option.selected {
                    border-color: #fff;
                    box-shadow: 0 0 0 2px #8b5cf6;
                }

                .ac-color-name {
                    position: absolute;
                    bottom: -20px;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 10px;
                    color: #999;
                    white-space: nowrap;
                }

                .ac-style-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 12px;
                }

                .ac-style-option {
                    background: rgba(255, 255, 255, 0.05);
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    border-radius: 12px;
                    padding: 16px;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: center;
                }

                .ac-style-option:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(139, 92, 246, 0.6);
                }

                .ac-style-option.selected {
                    background: rgba(139, 92, 246, 0.2);
                    border-color: #8b5cf6;
                }

                .ac-style-icon {
                    font-size: 32px;
                    margin-bottom: 8px;
                }

                .ac-style-name {
                    color: #fff;
                    font-size: 14px;
                    font-weight: 600;
                }

                .ac-actions {
                    display: flex;
                    gap: 12px;
                    margin-top: 30px;
                }

                .ac-btn {
                    flex: 1;
                    padding: 14px;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .ac-btn-cancel {
                    background: rgba(255, 255, 255, 0.1);
                    color: #fff;
                }

                .ac-btn-cancel:hover {
                    background: rgba(255, 255, 255, 0.15);
                }

                .ac-btn-apply {
                    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
                    color: #fff;
                    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
                }

                .ac-btn-apply:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(139, 92, 246, 0.6);
                }
            `}</style>

            <div className="avatar-custom-overlay" onClick={onClose}>
                <div className="avatar-custom-panel" onClick={(e) => e.stopPropagation()}>
                    <div className="ac-header">
                        <h2 className="ac-title">🎨 Customize Avatar</h2>
                        <button className="ac-close" onClick={onClose}>✕</button>
                    </div>

                    <div className="ac-section">
                        <div className="ac-section-title">Outfit Color</div>
                        <div className="ac-color-grid">
                            {BODY_COLORS.map((color) => (
                                <div
                                    key={color.value}
                                    className={`ac-color-option ${customization.bodyColor === color.value ? 'selected' : ''}`}
                                    style={{ background: color.value }}
                                    onClick={() => setCustomization({ ...customization, bodyColor: color.value })}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="ac-section">
                        <div className="ac-section-title">Skin Tone</div>
                        <div className="ac-color-grid">
                            {SKIN_TONES.map((tone) => (
                                <div
                                    key={tone.value}
                                    className={`ac-color-option ${customization.skinTone === tone.value ? 'selected' : ''}`}
                                    style={{ background: tone.value }}
                                    onClick={() => setCustomization({ ...customization, skinTone: tone.value })}
                                    title={tone.name}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="ac-section">
                        <div className="ac-section-title">Style</div>
                        <div className="ac-style-grid">
                            <div
                                className={`ac-style-option ${customization.style === 'casual' ? 'selected' : ''}`}
                                onClick={() => setCustomization({ ...customization, style: 'casual' })}
                            >
                                <div className="ac-style-icon">👕</div>
                                <div className="ac-style-name">Casual</div>
                            </div>
                            <div
                                className={`ac-style-option ${customization.style === 'formal' ? 'selected' : ''}`}
                                onClick={() => setCustomization({ ...customization, style: 'formal' })}
                            >
                                <div className="ac-style-icon">👔</div>
                                <div className="ac-style-name">Formal</div>
                            </div>
                            <div
                                className={`ac-style-option ${customization.style === 'sporty' ? 'selected' : ''}`}
                                onClick={() => setCustomization({ ...customization, style: 'sporty' })}
                            >
                                <div className="ac-style-icon">⚽</div>
                                <div className="ac-style-name">Sporty</div>
                            </div>
                            <div
                                className={`ac-style-option ${customization.style === 'cool' ? 'selected' : ''}`}
                                onClick={() => setCustomization({ ...customization, style: 'cool' })}
                            >
                                <div className="ac-style-icon">😎</div>
                                <div className="ac-style-name">Cool</div>
                            </div>
                        </div>
                    </div>

                    <div className="ac-actions">
                        <button className="ac-btn ac-btn-cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button className="ac-btn ac-btn-apply" onClick={handleApply}>
                            Apply Changes
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
