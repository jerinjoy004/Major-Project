import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameEngine } from '../lib/game/GameEngine';
import { PresenceManager } from '../lib/realtime/PresenceManager';
import { ChatManager } from '../lib/realtime/ChatManager';
import { supabase } from '../lib/supabase/client';
import { useGameStore } from '../lib/store/gameStore';
import { useAuth } from '../lib/auth/AuthProvider';
import { ProductModal } from '../components/ProductModal';
import { CartPanel } from '../components/CartPanel';
import { ChatPanel } from '../components/ChatPanel';
import { HUD } from '../components/HUD';
import { CheckoutModal } from '../components/CheckoutModal';
import { AIAssistant } from '../components/AIAssistant';
import { RecommendationPanel } from '../components/RecommendationPanel';
import { CameraControls } from '../components/CameraControls';
import { PlayerInteraction } from '../components/PlayerInteraction';
import { AvatarCustomization, AvatarCustomization as AvatarCustomizationType } from '../components/AvatarCustomization';
import { Minimap } from '@/components/Minimap';
import { NotificationSystem } from '@/components/NotificationSystem';
import { LoadingScreen } from '@/components/LoadingScreen';
import { PerformanceMonitor } from '@/components/PerformanceMonitor';
import styles from './StorePage.module.css';

interface CameraState {
    zoom: number;
    rotation: number;
    pitch: number;
    x: number;
    y: number;
}

export const StorePage: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameEngineRef = useRef<GameEngine | null>(null);
    const presenceManagerRef = useRef<PresenceManager | null>(null);
    const chatManagerRef = useRef<ChatManager | null>(null);
    const animationFrameRef = useRef<number>();

    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [cameraState, setCameraState] = useState<CameraState>({
        zoom: 1.0,
        rotation: 0,
        pitch: 45,
        x: 0,
        y: 0
    });
    const [showMinimap, setShowMinimap] = useState(true);
    const [showPerformance, setShowPerformance] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [notifications, setNotifications] = useState<Array<{ id: string; message: string; type: 'info' | 'success' | 'warning' | 'error' }>>([]);
    const [selectedPlayer, setSelectedPlayer] = useState<{ user_id: string; username: string } | null>(null);
    const [showCustomization, setShowCustomization] = useState(false);
    const [avatarCustomization, setAvatarCustomization] = useState<AvatarCustomizationType>({
        bodyColor: '#4A90E2',
        skinTone: '#FFD1A3',
        style: 'casual'
    });

    const {
        setProducts,
        selectedProduct,
        setSelectedProduct,
        setIsCheckoutOpen,
        isCheckoutOpen,
    } = useGameStore();

    // Optimized notification system
    const addNotification = useCallback((message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
        const id = `notif-${Date.now()}-${Math.random()}`;
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    }, []);

    // Enhanced 3D camera controls
    // Simplified camera controls
    const handleCameraView = useCallback((view: 'aerial' | 'normal' | 'close') => {
        const engine = gameEngineRef.current;
        if (!engine) return;

        const camera = engine.getCamera();

        switch (view) {
            case 'aerial':
                camera.setAerialView();
                addNotification('Switched to Aerial View 🔭', 'info');
                break;
            case 'normal':
                camera.setNormalView();
                addNotification('Switched to Normal View 👁️', 'info');
                break;
            case 'close':
                camera.setCloseView();
                addNotification('Switched to Close View 🔍', 'info');
                break;
        }
    }, [addNotification]);

    // Player interaction handlers
    const handleWave = useCallback(() => {
        if (!selectedPlayer) return;
        addNotification(`👋 You waved at ${selectedPlayer.username}!`, 'success');
        // TODO: Send wave event to other player via Supabase
        setSelectedPlayer(null);
    }, [selectedPlayer, addNotification]);

    const handleChat = useCallback(() => {
        if (!selectedPlayer) return;
        addNotification(`💬 Starting chat with ${selectedPlayer.username}...`, 'info');
        setSelectedPlayer(null);
        // Open chat panel
        useGameStore.getState().setIsChatOpen(true);
    }, [selectedPlayer, addNotification]);

    const handleFollow = useCallback(() => {
        if (!selectedPlayer) return;
        addNotification(`👥 Following ${selectedPlayer.username}...`, 'info');
        setSelectedPlayer(null);
    }, [selectedPlayer, addNotification]);

    // Fullscreen toggle
    const toggleFullscreen = useCallback(async () => {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            await document.exitFullscreen();
            setIsFullscreen(false);
        }
    }, []);

    // Optimized camera state update using RAF
    useEffect(() => {
        const updateCameraState = () => {
            if (gameEngineRef.current) {
                const camera = gameEngineRef.current.getCamera();
                setCameraState({
                    zoom: camera.zoom,
                    rotation: camera.rotation,
                    pitch: camera.pitch ?? 45,
                    x: camera.x ?? 0,
                    y: camera.y ?? 0
                });
            }
            animationFrameRef.current = requestAnimationFrame(updateCameraState);
        };

        animationFrameRef.current = requestAnimationFrame(updateCameraState);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    // Keyboard shortcut for testing player interaction
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 't' || e.key === 'T') {
                e.preventDefault();
                setSelectedPlayer({ user_id: 'test-npc', username: 'Alex (Test NPC)' });
                addNotification('Testing player interaction! 🎮', 'info');
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [addNotification]);


    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        let cleanupStoreSub: (() => void) | undefined;
        let timeout: NodeJS.Timeout;

        const initializeStore = async () => {
            console.log('🚀 Store initialization started');
            setLoadingProgress(10);

            // 🔐 Fail-safe timeout
            timeout = setTimeout(() => {
                console.warn('⚠️ Store init timeout — forcing render');
                setLoading(false);
                addNotification('Store loaded with timeout', 'warning');
            }, 6000);

            try {
                // ✅ Load user profile
                setLoadingProgress(20);
                const { data: profiles, error: profileError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', user.id);

                if (profileError || !profiles || profiles.length === 0) {
                    console.error('❌ User profile missing', profileError);
                    clearTimeout(timeout);
                    setLoading(false);
                    addNotification('Failed to load user profile', 'error');
                    navigate('/login');
                    return;
                }

                const profile = profiles[0];
                console.log('✅ Profile loaded');
                setLoadingProgress(40);

                // ✅ Load products
                const { data: products, error: productError } = await supabase
                    .from('products')
                    .select('*');

                if (productError) {
                    console.error('❌ Failed to load products', productError);
                    addNotification('Some products failed to load', 'warning');
                } else if (products) {
                    setProducts(products);
                    console.log('✅ Products loaded');
                }
                setLoadingProgress(60);

                if (!canvasRef.current) {
                    console.error('❌ Canvas not ready');
                    clearTimeout(timeout);
                    setLoading(false);
                    return;
                }

                // 🎮 Initialize game engine
                const engine = new GameEngine(canvasRef.current);
                gameEngineRef.current = engine;

                engine.initPlayer(user.id, profile.username);
                if (products) engine.setProducts(products);
                setLoadingProgress(70);

                engine.setOnProductClick((product) => {
                    setSelectedProduct(product);
                    addNotification(`Viewing ${product.name}`, 'info');
                    supabase.from('user_activity').insert({
                        user_id: user.id,
                        product_id: product.id,
                        action_type: 'view',
                    });
                });

                engine.setOnCheckoutEnter(() => {
                    setIsCheckoutOpen(true);
                    addNotification('Entering checkout area', 'info');
                });

                engine.setOnPlayerClick((player) => {
                    setSelectedPlayer(player);
                });

                setLoadingProgress(80);

                // 🌐 Presence (NON-BLOCKING)
                const presenceManager = new PresenceManager(user.id, profile.username);
                presenceManagerRef.current = presenceManager;
                presenceManager.initialize().catch((err) =>
                    console.error('❌ Presence init failed', err)
                );

                engine.setOnPositionUpdate((position) => {
                    presenceManager.updatePosition(position);
                });

                // 💬 Chat (NON-BLOCKING)
                const chatManager = new ChatManager(user.id, profile.username);
                chatManagerRef.current = chatManager;
                chatManager.initialize().catch((err) =>
                    console.error('❌ Chat init failed', err)
                );

                setLoadingProgress(90);

                // 👥 Sync other players (optimized)
                let previousPlayers = useGameStore.getState().otherPlayers;
                cleanupStoreSub = useGameStore.subscribe((state) => {
                    if (state.otherPlayers !== previousPlayers) {
                        previousPlayers = state.otherPlayers;
                        // Batch update for performance
                        requestAnimationFrame(() => {
                            state.otherPlayers.forEach((player) => {
                                engine.updateRemotePlayer(
                                    player.user_id,
                                    player.username,
                                    player
                                );
                            });
                        });
                    }
                });

                engine.start();
                console.log('✅ Game engine started');
                setLoadingProgress(100);

                clearTimeout(timeout);
                setTimeout(() => {
                    setLoading(false);
                }, 300);
            } catch (error) {
                console.error('❌ Store initialization failed', error);
                clearTimeout(timeout);
                setLoading(false);
                addNotification('Failed to initialize store', 'error');
            }
        };

        initializeStore();

        // Keyboard shortcuts
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 'm':
                        e.preventDefault();
                        setShowMinimap(prev => !prev);
                        break;
                    case 'f':
                        e.preventDefault();
                        toggleFullscreen();
                        break;
                    case 'p':
                        e.preventDefault();
                        setShowPerformance(prev => !prev);
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            cleanupStoreSub?.();
            gameEngineRef.current?.cleanup();
            presenceManagerRef.current?.cleanup();
            chatManagerRef.current?.cleanup();
            clearTimeout(timeout);
            window.removeEventListener('keydown', handleKeyPress);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [user, navigate, setProducts, setSelectedProduct, setIsCheckoutOpen, addNotification, toggleFullscreen]);

    // ⏳ Enhanced loading screen
    if (loading) {
        return (
            <LoadingScreen
                progress={loadingProgress}
                message="Loading virtual store..."
            />
        );
    }

    // 🏬 Enhanced Store UI
    return (
        <div className={styles.container}>
            <canvas ref={canvasRef} className={styles.canvas} />

            {/* Core UI Components */}
            <HUD />

            <ChatPanel
                chatManager={chatManagerRef.current}
                inputManager={gameEngineRef.current?.getInputManager()}
            />

            <CartPanel />
            <RecommendationPanel />

            {/* Simplified Camera Controls */}
            <CameraControls
                onAerialView={() => handleCameraView('aerial')}
                onNormalView={() => handleCameraView('normal')}
                onCloseView={() => handleCameraView('close')}
                onZoomIn={() => gameEngineRef.current?.getCamera().adjustZoom(0.1)}
                onZoomOut={() => gameEngineRef.current?.getCamera().adjustZoom(-0.1)}
                zoom={cameraState.zoom}
                currentView={gameEngineRef.current?.getCamera().getCurrentView() || 'normal'}
            />

            {/* Minimap */}
            {showMinimap && (
                <Minimap
                    playerPosition={{ x: cameraState.x, y: cameraState.y }}
                    otherPlayers={useGameStore.getState().otherPlayers}
                    products={useGameStore.getState().products}
                    onToggle={() => setShowMinimap(false)}
                />
            )}

            {/* Performance Monitor (Dev tool) */}
            {showPerformance && (
                <PerformanceMonitor
                    onClose={() => setShowPerformance(false)}
                />
            )}

            {/* Notifications */}
            <NotificationSystem notifications={notifications} />

            {/* Modals */}
            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}

            {isCheckoutOpen && <CheckoutModal />}

            {/* AI Assistant */}
            <AIAssistant />

            {/* Quick Actions Bar */}
            <div className={styles.quickActions}>
                <button
                    className={styles.quickActionBtn}
                    onClick={() => setShowMinimap(!showMinimap)}
                    title="Toggle Minimap (Ctrl+M)"
                >
                    🗺️
                </button>
                <button
                    className={styles.quickActionBtn}
                    onClick={toggleFullscreen}
                    title="Toggle Fullscreen (Ctrl+F)"
                >
                    {isFullscreen ? '⊡' : '⛶'}
                </button>
                <button
                    className={styles.quickActionBtn}
                    onClick={() => setShowPerformance(!showPerformance)}
                    title="Performance Monitor (Ctrl+P)"
                >
                    📊
                </button>
                <button
                    className={styles.quickActionBtn}
                    onClick={() => setShowCustomization(true)}
                    title="Customize Avatar"
                    style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}
                >
                    🎨
                </button>
            </div>

            {/* Player Interaction Modal */}
            {selectedPlayer && (
                <PlayerInteraction
                    player={selectedPlayer}
                    onWave={handleWave}
                    onChat={handleChat}
                    onFollow={handleFollow}
                    onClose={() => setSelectedPlayer(null)}
                />
            )}

            {/* Avatar Customization */}
            {showCustomization && (
                <AvatarCustomization
                    currentCustomization={avatarCustomization}
                    onApply={(custom) => {
                        setAvatarCustomization(custom);
                        // Apply to actual avatar
                        if (gameEngineRef.current) {
                            gameEngineRef.current.updatePlayerCustomization(custom.bodyColor, custom.skinTone);
                        }
                        addNotification('Avatar customized! 🎨', 'success');
                    }}
                    onClose={() => setShowCustomization(false)}
                />
            )}
        </div>
    );
};