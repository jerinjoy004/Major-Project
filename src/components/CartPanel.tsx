import React from 'react';
import { useGameStore } from '../lib/store/gameStore';
import { supabase } from '../lib/supabase/client';
import { useAuth } from '../lib/auth/AuthProvider';
import styles from './CartPanel.module.css';

export const CartPanel: React.FC = () => {
    const { user } = useAuth();
    const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateCartQuantity } = useGameStore();

    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const handleRemove = async (itemId: string) => {
        try {
            await supabase.from('cart_items').delete().eq('id', itemId);
            removeFromCart(itemId);
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const handleQuantityChange = async (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;

        try {
            await supabase
                .from('cart_items')
                .update({ quantity: newQuantity })
                .eq('id', itemId);

            updateCartQuantity(itemId, newQuantity);
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    return (
        <>
            <button
                className={styles.cartButton}
                onClick={() => setIsCartOpen(!isCartOpen)}
            >
                🛒 {cartItems.length > 0 && <span className={styles.badge}>{cartItems.length}</span>}
            </button>

            {isCartOpen && (
                <div className={styles.panel}>
                    <div className={styles.header}>
                        <h3>Shopping Cart</h3>
                        <button className={styles.closeBtn} onClick={() => setIsCartOpen(false)}>
                            ✕
                        </button>
                    </div>

                    <div className={styles.items}>
                        {cartItems.length === 0 ? (
                            <div className={styles.empty}>
                                <p>Your cart is empty</p>
                                <p className={styles.emptyHint}>Walk around and click on products to add them!</p>
                            </div>
                        ) : (
                            cartItems.map((item) => (
                                <div key={item.id} className={styles.item}>
                                    <div className={styles.itemInfo}>
                                        <div className={styles.itemName}>{item.product.name}</div>
                                        <div className={styles.itemPrice}>${item.product.price}</div>
                                    </div>

                                    <div className={styles.itemActions}>
                                        <div className={styles.quantity}>
                                            <button
                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                −
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                                                +
                                            </button>
                                        </div>
                                        <button
                                            className={styles.removeBtn}
                                            onClick={() => handleRemove(item.id)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {cartItems.length > 0 && (
                        <div className={styles.footer}>
                            <div className={styles.total}>
                                <span>Total:</span>
                                <span className={styles.totalAmount}>${total.toFixed(2)}</span>
                            </div>
                            <p className={styles.checkoutHint}>
                                💡 Walk to the checkout counter to complete your purchase!
                            </p>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};
