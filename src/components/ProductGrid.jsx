import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import './ProductGrid.css';

const API_URL = 'http://localhost:3001/api';

export default function ProductGrid({ onSelectProduct }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isConnected, suiPrice } = useWallet();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_URL}/products`);
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            // Fallback to hardcoded products if server not running
            setProducts([
                { id: 'prod_1', name: 'Fresh Mangoes (1kg)', price_sui: 0.01, price_php: 50, seller: 'Juan\'s Farm', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400' },
                { id: 'prod_2', name: 'Dried Fish Bundle', price_sui: 0.02, price_php: 100, seller: 'Visayan Seafoods', image: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400' },
                { id: 'prod_3', name: 'Ube Halaya Jar', price_sui: 0.03, price_php: 150, seller: 'Nanay\'s Kitchen', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400' },
                { id: 'prod_4', name: 'Calamansi Juice (1L)', price_sui: 0.02, price_php: 80, seller: 'Citrus Grove PH', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400' },
                { id: 'prod_5', name: 'Pili Nuts (250g)', price_sui: 0.05, price_php: 250, seller: 'Bicol Delights', image: 'https://images.unsplash.com/photo-1536816579748-4ecb3f03d72a?w=400' },
                { id: 'prod_6', name: 'Banana Chips Pack', price_sui: 0.01, price_php: 45, seller: 'Davao Snacks', image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const formatUsd = (sui) => {
        if (!suiPrice) return '';
        return `≈ $${(sui * suiPrice).toFixed(2)}`;
    };

    if (loading) {
        return (
            <section className="product-grid">
                <div className="container">
                    <div className="product-grid__loading">
                        <span className="spinner spinner--lg"></span>
                        <p>Loading products...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="shop" className="product-grid">
            <div className="container">
                <div className="product-grid__header">
                    <div className="product-grid__title-group">
                        <h2 className="product-grid__title">
                            Shop with <span className="gradient-text">Protection</span>
                        </h2>
                        <p className="product-grid__subtitle">
                            Your payment is held in escrow until you confirm delivery
                        </p>
                    </div>
                </div>

                <div className="product-grid__items">
                    {products.map((product, index) => (
                        <div
                            key={product.id}
                            className="product-card glass-card animate-fade-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="product-card__image-wrapper">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="product-card__image"
                                    loading="lazy"
                                />
                                <div className="product-card__badge">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M6 1L7.5 4L11 4.5L8.5 7L9 10.5L6 9L3 10.5L3.5 7L1 4.5L4.5 4L6 1Z" fill="currentColor" />
                                    </svg>
                                    Escrow Protected
                                </div>
                            </div>

                            <div className="product-card__content">
                                <span className="product-card__seller">{product.seller}</span>
                                <h3 className="product-card__name">{product.name}</h3>

                                <div className="product-card__price-row">
                                    <div className="product-card__price">
                                        <span className="product-card__price-sui">{product.price_sui} SUI</span>
                                        <span className="product-card__price-php">₱{product.price_php}</span>
                                        {suiPrice && (
                                            <span className="product-card__price-usd">{formatUsd(product.price_sui)}</span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    className="product-card__buy btn-glow"
                                    onClick={() => onSelectProduct(product)}
                                    disabled={!isConnected}
                                >
                                    {isConnected ? 'Order with Escrow' : 'Connect Wallet'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
