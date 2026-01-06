import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth/AuthProvider';
import styles from './MallPage.module.css';

interface Store {
    id: string;
    name: string;
    description: string;
    theme: string;
    icon: string;
    gradient: string;
    category: string;
}

const STORES: Store[] = [
    {
        id: 'hm',
        name: 'H&M',
        description: 'Trendy fashion for everyone. Discover the latest styles in clothing and accessories.',
        theme: 'modern-fashion',
        icon: '👗',
        gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
        category: 'Fashion'
    },
    {
        id: 'lulu',
        name: 'LULU Hypermarket',
        description: 'Your one-stop shop for groceries, electronics, and household essentials.',
        theme: 'supermarket',
        icon: '🛒',
        gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
        category: 'Grocery'
    },
    {
        id: 'zara',
        name: 'ZARA',
        description: 'Premium fashion and elegant designs. Experience luxury shopping.',
        theme: 'luxury-fashion',
        icon: '👔',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        category: 'Fashion'
    },
    {
        id: 'sephora',
        name: 'Sephora',
        description: 'Beauty and cosmetics paradise. Explore makeup, skincare, and fragrances.',
        theme: 'beauty',
        icon: '💄',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        category: 'Beauty'
    },
    {
        id: 'nike',
        name: 'Nike Store',
        description: 'Athletic wear and sports equipment. Just do it!',
        theme: 'sports',
        icon: '👟',
        gradient: 'linear-gradient(135deg, #FA8BFF 0%, #2BD2FF 90%, #2BFF88 100%)',
        category: 'Sports'
    },
    {
        id: 'ikea',
        name: 'IKEA',
        description: 'Furniture and home accessories. Design your dream home.',
        theme: 'furniture',
        icon: '🛋️',
        gradient: 'linear-gradient(135deg, #FEC163 0%, #DE4313 100%)',
        category: 'Home'
    }
];

export const MallPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    const categories = ['All', ...Array.from(new Set(STORES.map(s => s.category)))];

    const filteredStores = selectedCategory === 'All'
        ? STORES
        : STORES.filter(s => s.category === selectedCategory);

    const handleStoreClick = (storeId: string) => {
        navigate(`/store/${storeId}`);
    };

    const handleLogout = async () => {
        navigate('/login');
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.logo}>
                        <span className={styles.logoIcon}>🏬</span>
                        <h1>Virtual Shopping Mall</h1>
                    </div>
                    <div className={styles.userInfo}>
                        <span className={styles.welcome}>Welcome, {user.email?.split('@')[0]}!</span>
                        <button className={styles.logoutBtn} onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h2 className={styles.heroTitle}>
                        Explore Amazing Stores
                    </h2>
                    <p className={styles.heroSubtitle}>
                        Walk through virtual stores, interact with products, and shop with your avatar!
                    </p>
                </div>
            </section>

            {/* Category Filter */}
            <div className={styles.filterSection}>
                <div className={styles.filterContainer}>
                    {categories.map(category => (
                        <button
                            key={category}
                            className={`${styles.filterBtn} ${selectedCategory === category ? styles.filterBtnActive : ''}`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Store Grid */}
            <main className={styles.main}>
                <div className={styles.storeGrid}>
                    {filteredStores.map((store) => (
                        <div
                            key={store.id}
                            className={styles.storeCard}
                            onClick={() => handleStoreClick(store.id)}
                            style={{ background: store.gradient }}
                        >
                            <div className={styles.storeCardContent}>
                                <div className={styles.storeIcon}>{store.icon}</div>
                                <h3 className={styles.storeName}>{store.name}</h3>
                                <p className={styles.storeDescription}>{store.description}</p>
                                <div className={styles.storeCategory}>
                                    <span className={styles.categoryBadge}>{store.category}</span>
                                </div>
                                <button className={styles.enterBtn}>
                                    Enter Store →
                                </button>
                            </div>
                            <div className={styles.storeCardOverlay}></div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className={styles.footer}>
                <p>© 2026 Virtual Shopping Mall - Experience the future of shopping</p>
            </footer>
        </div>
    );
};
