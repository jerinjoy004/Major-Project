import React from 'react';
import { useGameStore } from '../lib/store/gameStore';
import { supabase } from '../lib/supabase/client';
import { useAuth } from '../lib/auth/AuthProvider';
import styles from './CheckoutModal.module.css';

export const CheckoutModal: React.FC = () => {
    const { user } = useAuth();
    const { cartItems, setIsCheckoutOpen, clearCart, recommendations } = useGameStore();
    const [processing, setProcessing] = React.useState(false);
    const [completed, setCompleted] = React.useState(false);

    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const handleCheckout = async () => {
        if (!user || cartItems.length === 0) return;

        setProcessing(true);
        try {
            // Create order
            const { error: orderError } = await supabase.from('orders').insert({
                user_id: user.id,
                total,
                status: 'completed',
                items: cartItems.map((item) => ({
                    product_id: item.product_id,
                    name: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity,
                })),
            });

            if (orderError) throw orderError;

            // Clear cart in database
            const { error: clearError } = await supabase
                .from('cart_items')
                .delete()
                .eq('user_id', user.id);

            if (clearError) throw clearError;

            // Clear local cart
            clearCart();
            setCompleted(true);

            setTimeout(() => {
                setIsCheckoutOpen(false);
                setCompleted(false);
            }, 3000);
        } catch (error) {
            console.error('Error during checkout:', error);
        } finally {
            setProcessing(false);
        }
    };

    if (completed) {
        return (
            <div className={styles.overlay}>
                <div className={styles.modal}>
                    <div className={styles.success}>
                        <div className={styles.successIcon}>✓</div>
                        <h2>Order Completed!</h2>
                        <p>Thank you for shopping with us!</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.overlay} onClick={() => setIsCheckoutOpen(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={() => setIsCheckoutOpen(false)}>
                    ✕
                </button>

                <h2 className={styles.title}>Checkout</h2>

                <div className={styles.section}>
                    <h3>Order Summary</h3>
                    <div className={styles.items}>
                        {cartItems.map((item) => (
                            <div key={item.id} className={styles.item}>
                                <span>{item.product.name} x{item.quantity}</span>
                                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className={styles.total}>
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>

                {recommendations.length > 0 && (
                    <div className={styles.section}>
                        <h3>🤖 AI Recommendations</h3>
                        <p className={styles.hint}>You might also like:</p>
                        <div className={styles.recommendations}>
                            {recommendations.slice(0, 3).map((product) => (
                                <div key={product.id} className={styles.recommendation}>
                                    <div className={styles.recName}>{product.name}</div>
                                    <div className={styles.recPrice}>${product.price}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <button
                    className={styles.checkoutButton}
                    onClick={handleCheckout}
                    disabled={processing || cartItems.length === 0}
                >
                    {processing ? 'Processing...' : `Complete Purchase ($${total.toFixed(2)})`}
                </button>
            </div>
        </div>
    );
};
