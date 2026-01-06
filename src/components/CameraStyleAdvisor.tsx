import React, { useRef, useState, useCallback, useEffect } from 'react';
import styles from './CameraStyleAdvisor.module.css';

interface StyleSuggestion {
    category: string;
    items: string[];
    reasoning: string;
}

export const CameraStyleAdvisor: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [suggestions, setSuggestions] = useState<StyleSuggestion[]>([]);
    const [cameraActive, setCameraActive] = useState(false);
    const [error, setError] = useState<string>('');
    const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
    const [selectedCamera, setSelectedCamera] = useState<string>('');

    // Get available cameras ONLY when user wants to start camera
    const getCameras = useCallback(async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            setAvailableCameras(videoDevices);

            // Select first camera by default
            if (videoDevices.length > 0 && !selectedCamera) {
                setSelectedCamera(videoDevices[0].deviceId);
            }

            return videoDevices;
        } catch (err) {
            console.error('Error getting cameras:', err);
            return [];
        }
    }, [selectedCamera]);

    // Start camera with selected device
    const startCamera = useCallback(async () => {
        console.log('🎥 START CAMERA BUTTON CLICKED!');
        try {
            setError('');

            // Check if getUserMedia is supported
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                setError('Camera not supported on this device/browser.');
                return;
            }

            // Get list of cameras first if we don't have it
            let cameras = availableCameras;
            if (cameras.length === 0) {
                cameras = await getCameras();
            }

            // Use selected camera or first available
            const cameraToUse = selectedCamera || (cameras.length > 0 ? cameras[0].deviceId : undefined);

            const constraints: MediaStreamConstraints = cameraToUse ?
                { video: { deviceId: { exact: cameraToUse }, width: { ideal: 1280 }, height: { ideal: 720 } } } :
                { video: { width: { ideal: 1280 }, height: { ideal: 720 } } };

            console.log('Requesting camera access...');
            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            console.log('Camera access granted, stream:', mediaStream);

            // Set state to render video element - useEffect will handle srcObject
            setStream(mediaStream);
            setCameraActive(true);
            console.log('State updated - useEffect will set video srcObject');
        } catch (err: any) {
            console.error('Camera access error:', err);
            let errorMessage = '';

            if (err.name === 'NotAllowedError') {
                errorMessage = '🔒 Camera permission denied. For Brave browser: Click the Shields icon (🦁) → Allow fingerprinting → Refresh page → Click "Allow" when prompted.';
            } else if (err.name === 'NotFoundError') {
                errorMessage = '📷 No camera found. Please connect a camera and try again.';
            } else if (err.name === 'NotReadableError') {
                errorMessage = '⚠️ Camera is already in use by another application. Please close other apps using the camera.';
            } else if (err.name === 'OverconstrainedError') {
                errorMessage = '🔄 Selected camera not available. Trying default camera...';
                // Get cameras again and retry with default
                await getCameras();
                setSelectedCamera('');
            } else if (err.name === 'NotSupportedError') {
                errorMessage = '❌ Camera not supported. Please ensure you\'re accessing via https:// or localhost.';
            } else {
                errorMessage = `⚠️ Unable to access camera: ${err.message || 'Unknown error'}. For Brave: Check Shields settings and camera permissions.`;
            }

            setError(errorMessage);
        }
    }, [selectedCamera, availableCameras, getCameras]);

    // Stop camera
    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
            setCameraActive(false);
        }
    }, [stream]);

    // Capture photo
    const capturePhoto = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(imageData);
        stopCamera();
        analyzeImage();
    }, [stopCamera]);

    // Dummy AI analysis - generates fashion suggestions
    const analyzeImage = useCallback(() => {
        setIsAnalyzing(true);

        // Simulate AI processing time
        setTimeout(() => {
            const dummySuggestions: StyleSuggestion[] = [
                {
                    category: '👗 Dress Recommendations',
                    items: [
                        'Elegant Floral Maxi Dress - Perfect for your skin tone',
                        'Classic Black Cocktail Dress - Timeless and sophisticated',
                        'Casual Denim Dress - Great for everyday wear',
                        'Bohemian Summer Dress - Matches your style vibe'
                    ],
                    reasoning: 'Based on your complexion and facial features, these dresses will complement your natural beauty.'
                },
                {
                    category: '💄 Makeup Suggestions',
                    items: [
                        'Warm Coral Lipstick - Enhances your natural glow',
                        'Soft Brown Eyeshadow Palette - Perfect for your eye color',
                        'Peachy Blush - Adds a healthy radiance',
                        'Natural Foundation (Medium Beige) - Matches your skin tone'
                    ],
                    reasoning: 'These makeup products are selected to enhance your natural features and skin undertones.'
                },
                {
                    category: '👚 Top Recommendations',
                    items: [
                        'Silk Blouse in Emerald Green - Brings out your eyes',
                        'White Cotton Button-Down - Classic and versatile',
                        'Pastel Pink Sweater - Soft and flattering',
                        'Navy Blue Blazer - Professional and chic'
                    ],
                    reasoning: 'These colors and styles will work beautifully with your complexion and personal aesthetic.'
                },
                {
                    category: '🎨 Color Palette',
                    items: [
                        'Jewel Tones (Emerald, Sapphire, Ruby)',
                        'Soft Pastels (Blush, Lavender, Mint)',
                        'Earth Tones (Terracotta, Olive, Camel)',
                        'Classic Neutrals (Black, White, Navy)'
                    ],
                    reasoning: 'These color families complement your skin tone and will make you look radiant.'
                }
            ];

            setSuggestions(dummySuggestions);
            setIsAnalyzing(false);
        }, 2000);
    }, []);

    // Retake photo
    const retakePhoto = useCallback(async () => {
        setCapturedImage(null);
        setSuggestions([]);
        // Get cameras again for selection
        await getCameras();
    }, [getCameras]);

    // Set video source when stream is available and video element is rendered
    useEffect(() => {
        if (stream && videoRef.current && cameraActive) {
            console.log('Setting video srcObject in useEffect...');
            videoRef.current.srcObject = stream;

            videoRef.current.play()
                .then(() => console.log('Video playing successfully'))
                .catch(err => console.error('Video play error:', err));
        }
    }, [stream, cameraActive]);

    // Cleanup on unmount
    useEffect(() => {
        console.log('📸 CameraStyleAdvisor component mounted');
        return () => {
            console.log('📸 CameraStyleAdvisor component unmounting');
            stopCamera();
        };
    }, [stopCamera]);

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>📸 AI Style Advisor</h2>
                    <button className={styles.closeBtn} onClick={onClose}>✕</button>
                </div>

                <div className={styles.content}>
                    {error && (
                        <div className={styles.error}>
                            <span>⚠️ {error}</span>
                        </div>
                    )}

                    {!cameraActive && !capturedImage && (
                        <div className={styles.startScreen}>
                            <div className={styles.icon}>📷</div>
                            <h3>Get Personalized Style Recommendations</h3>
                            <p>Take a photo and let our AI suggest the perfect outfits and makeup for you!</p>

                            {/* Brave Browser Help */}
                            <div className={styles.helpBox}>
                                <strong>📌 Using Brave Browser?</strong>
                                <ol>
                                    <li>Click the <strong>Shields icon (🦁)</strong> in the address bar</li>
                                    <li>Set <strong>"Block fingerprinting"</strong> to <strong>"Allow"</strong></li>
                                    <li>Refresh the page</li>
                                    <li>Click "Start Camera" and allow permissions</li>
                                </ol>
                            </div>

                            {/* Camera Selection */}
                            {availableCameras.length > 1 && (
                                <div className={styles.cameraSelector}>
                                    <label htmlFor="camera-select">📹 Select Camera:</label>
                                    <select
                                        id="camera-select"
                                        value={selectedCamera}
                                        onChange={(e) => setSelectedCamera(e.target.value)}
                                        className={styles.cameraSelect}
                                    >
                                        {availableCameras.map((camera, index) => (
                                            <option key={camera.deviceId} value={camera.deviceId}>
                                                {camera.label || `Camera ${index + 1}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <button className={styles.primaryBtn} onClick={startCamera}>
                                Start Camera
                            </button>
                        </div>
                    )}

                    {cameraActive && (
                        <div className={styles.cameraView}>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className={styles.video}
                            />
                            <canvas ref={canvasRef} style={{ display: 'none' }} />
                            <div className={styles.cameraControls}>
                                <button className={styles.captureBtn} onClick={capturePhoto}>
                                    📸 Capture Photo
                                </button>
                                <button className={styles.secondaryBtn} onClick={stopCamera}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {capturedImage && (
                        <div className={styles.resultsView}>
                            <div className={styles.imagePreview}>
                                <img src={capturedImage} alt="Captured" />
                            </div>

                            {isAnalyzing ? (
                                <div className={styles.analyzing}>
                                    <div className={styles.spinner}></div>
                                    <p>✨ Analyzing your style... Please wait</p>
                                </div>
                            ) : (
                                <div className={styles.suggestions}>
                                    <h3>🎯 Your Personalized Recommendations</h3>

                                    {suggestions.map((suggestion, index) => (
                                        <div key={index} className={styles.suggestionCard}>
                                            <h4>{suggestion.category}</h4>
                                            <p className={styles.reasoning}>{suggestion.reasoning}</p>
                                            <ul className={styles.itemList}>
                                                {suggestion.items.map((item, itemIndex) => (
                                                    <li key={itemIndex}>
                                                        <span className={styles.checkmark}>✓</span>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}

                                    <div className={styles.actionButtons}>
                                        <button className={styles.primaryBtn} onClick={retakePhoto}>
                                            📸 Try Again
                                        </button>
                                        <button className={styles.secondaryBtn} onClick={onClose}>
                                            Done
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
