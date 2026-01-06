import React, { useRef, useState, useCallback, useEffect } from 'react';
import styles from './CameraStyleAdvisor.module.css';

interface StyleSuggestion {
    category: string;
    items: string[];
    reasoning: string;
}

interface UserPreferences {
    categories: string[]; // dress, makeup, accessories, etc.
    occasion?: string; // casual, formal, party, etc.
    brand?: string;
    style?: string; // bohemian, classic, modern, etc.
    priceRange?: string;
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
    const [showPreferences, setShowPreferences] = useState(false);
    const [userPreferences, setUserPreferences] = useState<UserPreferences>({
        categories: [],
        occasion: '',
        brand: '',
        style: '',
        priceRange: ''
    });

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
        setShowPreferences(true); // Show preference selection instead of immediate analysis
    }, [stopCamera]);


    // Generate personalized recommendations based on user preferences
    const analyzeImage = useCallback((prefs: UserPreferences) => {
        setIsAnalyzing(true);
        setShowPreferences(false);

        // Simulate AI processing time
        setTimeout(() => {
            const suggestions: StyleSuggestion[] = [];

            // Generate recommendations based on selected categories
            if (prefs.categories.includes('dresses')) {
                const brandText = prefs.brand ? ` from ${prefs.brand}` : '';
                const occasionText = prefs.occasion ? ` for ${prefs.occasion}` : '';
                const styleText = prefs.style ? ` in ${prefs.style} style` : '';

                suggestions.push({
                    category: `👗 Dress Recommendations${brandText}`,
                    items: [
                        `Elegant Floral Maxi Dress${occasionText} - Perfect for your skin tone`,
                        `Classic Black Cocktail Dress - Timeless and sophisticated`,
                        `${prefs.style || 'Casual'} Denim Dress - Great for everyday wear`,
                        `Bohemian Summer Dress${styleText} - Matches your style vibe`
                    ],
                    reasoning: `Based on your preferences${occasionText}${styleText}, these dresses will complement your natural beauty.`
                });
            }

            if (prefs.categories.includes('makeup')) {
                const brandText = prefs.brand ? ` (${prefs.brand} recommended)` : '';

                suggestions.push({
                    category: `💄 Makeup Suggestions${brandText}`,
                    items: [
                        'Warm Coral Lipstick - Enhances your natural glow',
                        'Soft Brown Eyeshadow Palette - Perfect for your eye color',
                        'Peachy Blush - Adds a healthy radiance',
                        'Natural Foundation (Medium Beige) - Matches your skin tone'
                    ],
                    reasoning: 'These makeup products are selected to enhance your natural features and skin undertones.'
                });
            }

            if (prefs.categories.includes('accessories')) {
                const occasionText = prefs.occasion ? ` for ${prefs.occasion}` : '';

                suggestions.push({
                    category: `👜 Accessory Recommendations${occasionText}`,
                    items: [
                        'Gold Statement Necklace - Adds elegance to any outfit',
                        'Leather Crossbody Bag - Practical and stylish',
                        'Classic Watch - Timeless accessory',
                        'Silk Scarf - Versatile and chic'
                    ],
                    reasoning: `These accessories${occasionText} will complete your look beautifully.`
                });
            }

            if (prefs.categories.includes('shoes')) {
                const occasionText = prefs.occasion ? ` for ${prefs.occasion} occasions` : '';

                suggestions.push({
                    category: `👠 Shoe Recommendations${occasionText}`,
                    items: [
                        'Classic Black Pumps - Versatile and elegant',
                        'White Sneakers - Comfortable and trendy',
                        'Ankle Boots - Perfect for any season',
                        'Strappy Sandals - Great for warm weather'
                    ],
                    reasoning: `These shoes${occasionText} will complement your style perfectly.`
                });
            }

            // Add color palette if any category is selected
            if (suggestions.length > 0) {
                suggestions.push({
                    category: '🎨 Personalized Color Palette',
                    items: [
                        'Jewel Tones (Emerald, Sapphire, Ruby)',
                        'Soft Pastels (Blush, Lavender, Mint)',
                        'Earth Tones (Terracotta, Olive, Camel)',
                        'Classic Neutrals (Black, White, Navy)'
                    ],
                    reasoning: 'These color families complement your skin tone and will make you look radiant.'
                });
            }

            setSuggestions(suggestions);
            setIsAnalyzing(false);
        }, 2000);
    }, []);

    // Retake photo
    const retakePhoto = useCallback(async () => {
        setCapturedImage(null);
        setSuggestions([]);
        setShowPreferences(false);
        setUserPreferences({
            categories: [],
            occasion: '',
            brand: '',
            style: '',
            priceRange: ''
        });
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


                            {showPreferences ? (
                                <div className={styles.preferencesForm}>
                                    <h3>🎯 What are you looking for?</h3>
                                    <p className={styles.subtitle}>Select categories and preferences to get personalized recommendations</p>

                                    {/* Category Selection */}
                                    <div className={styles.formSection}>
                                        <label>📦 Categories (select all that apply):</label>
                                        <div className={styles.checkboxGroup}>
                                            {['dresses', 'makeup', 'accessories', 'shoes'].map(cat => (
                                                <label key={cat} className={styles.checkboxLabel}>
                                                    <input
                                                        type="checkbox"
                                                        checked={userPreferences.categories.includes(cat)}
                                                        onChange={(e) => {
                                                            const newCats = e.target.checked
                                                                ? [...userPreferences.categories, cat]
                                                                : userPreferences.categories.filter(c => c !== cat);
                                                            setUserPreferences({ ...userPreferences, categories: newCats });
                                                        }}
                                                    />
                                                    <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Occasion */}
                                    <div className={styles.formSection}>
                                        <label htmlFor="occasion">🎉 Occasion (optional):</label>
                                        <select
                                            id="occasion"
                                            value={userPreferences.occasion}
                                            onChange={(e) => setUserPreferences({ ...userPreferences, occasion: e.target.value })}
                                            className={styles.selectInput}
                                        >
                                            <option value="">Any occasion</option>
                                            <option value="casual">Casual</option>
                                            <option value="formal">Formal</option>
                                            <option value="party">Party</option>
                                            <option value="work">Work/Office</option>
                                            <option value="wedding">Wedding</option>
                                            <option value="date">Date Night</option>
                                        </select>
                                    </div>

                                    {/* Brand Preference */}
                                    <div className={styles.formSection}>
                                        <label htmlFor="brand">🏷️ Preferred Brand (optional):</label>
                                        <input
                                            id="brand"
                                            type="text"
                                            placeholder="e.g., Zara, H&M, Sephora..."
                                            value={userPreferences.brand}
                                            onChange={(e) => setUserPreferences({ ...userPreferences, brand: e.target.value })}
                                            className={styles.textInput}
                                        />
                                    </div>

                                    {/* Style Preference */}
                                    <div className={styles.formSection}>
                                        <label htmlFor="style">✨ Style Preference (optional):</label>
                                        <select
                                            id="style"
                                            value={userPreferences.style}
                                            onChange={(e) => setUserPreferences({ ...userPreferences, style: e.target.value })}
                                            className={styles.selectInput}
                                        >
                                            <option value="">Any style</option>
                                            <option value="bohemian">Bohemian</option>
                                            <option value="classic">Classic</option>
                                            <option value="modern">Modern</option>
                                            <option value="vintage">Vintage</option>
                                            <option value="minimalist">Minimalist</option>
                                            <option value="edgy">Edgy</option>
                                        </select>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className={styles.preferenceActions}>
                                        <button
                                            className={styles.primaryBtn}
                                            onClick={() => analyzeImage(userPreferences)}
                                            disabled={userPreferences.categories.length === 0}
                                        >
                                            ✨ Get Recommendations
                                        </button>
                                        <button className={styles.secondaryBtn} onClick={retakePhoto}>
                                            📸 Retake Photo
                                        </button>
                                    </div>
                                </div>
                            ) : isAnalyzing ? (
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
