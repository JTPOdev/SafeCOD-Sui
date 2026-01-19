import React from 'react';
import { ConnectModal } from '@mysten/dapp-kit';
import { useWallet } from '../context/WalletContext';
import './Hero.css';

export default function Hero() {
    const { isConnected } = useWallet();

    return (
        <section className="hero">
            <div className="hero__container container">
                <div className="hero__content">
                    <h1 className="hero__title">
                        <span className="gradient-text">Secure</span> Cash-on-Delivery
                        <br />Powered by Blockchain
                    </h1>

                    <p className="hero__subtitle">
                        Protect yourself from bogus buyers. Your payment is held in escrow
                        until delivery is confirmed. No more ghosted orders or wasted products.
                    </p>

                    <div className="hero__actions">
                        {isConnected ? (
                            <a href="#shop" className="btn-glow hero__cta">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M3 3H5L5.4 5M7 13H15L17 5H5.4M7 13L5.4 5M7 13L4.5 15.5M17 13L17 15.5M6 17.5C6 18.0523 5.55228 18.5 5 18.5C4.44772 18.5 4 18.0523 4 17.5C4 16.9477 4.44772 16.5 5 16.5C5.55228 16.5 6 16.9477 6 17.5ZM16 17.5C16 18.0523 15.5523 18.5 15 18.5C14.4477 18.5 14 18.0523 14 17.5C14 16.9477 14.4477 16.5 15 16.5C15.5523 16.5 16 16.9477 16 17.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Start Shopping
                            </a>
                        ) : (
                            <ConnectModal
                                trigger={
                                    <button className="btn-glow hero__cta">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M15 5.25H3C2.58579 5.25 2.25 5.58579 2.25 6V14.25C2.25 14.6642 2.58579 15 3 15H15C15.4142 15 15.75 14.6642 15.75 14.25V6C15.75 5.58579 15.4142 5.25 15 5.25Z" stroke="currentColor" strokeWidth="1.5" />
                                            <circle cx="12" cy="10" r="1.5" fill="currentColor" />
                                        </svg>
                                        Connect Wallet to Shop
                                    </button>
                                }
                            />
                        )}

                        <a href="#how-it-works" className="btn-ghost">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M10 6V10M10 14H10.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            How It Works
                        </a>
                    </div>

                    <div className="hero__stats">
                        <div className="hero__stat">
                            <span className="hero__stat-value">₱0</span>
                            <span className="hero__stat-label">Lost to Bogus Buyers</span>
                        </div>
                        <div className="hero__stat-divider"></div>
                        <div className="hero__stat">
                            <span className="hero__stat-value">100%</span>
                            <span className="hero__stat-label">Payment Protection</span>
                        </div>
                        <div className="hero__stat-divider"></div>
                        <div className="hero__stat">
                            <span className="hero__stat-value">Instant</span>
                            <span className="hero__stat-label">Release on Confirm</span>
                        </div>
                    </div>
                </div>

                {/* How It Works Card */}
                <div className="hero__preview glass-card" id="how-it-works">
                    <div className="hero__preview-header">
                        <div className="hero__preview-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <span className="hero__preview-filename">How SafeCOD Works</span>
                    </div>
                    <div className="hero__how-it-works">
                        <div className="hero__step">
                            <div className="hero__step-icon">🛒</div>
                            <div className="hero__step-content">
                                <h4>1. Shop & Pay</h4>
                                <p>Browse products, deposit SUI to escrow</p>
                            </div>
                        </div>
                        <div className="hero__step">
                            <div className="hero__step-icon">📦</div>
                            <div className="hero__step-content">
                                <h4>2. Seller Ships</h4>
                                <p>Seller ships knowing payment is secured</p>
                            </div>
                        </div>
                        <div className="hero__step">
                            <div className="hero__step-icon">🚚</div>
                            <div className="hero__step-content">
                                <h4>3. Rider Delivers</h4>
                                <p>Track delivery in real-time</p>
                            </div>
                        </div>
                        <div className="hero__step">
                            <div className="hero__step-icon">✅</div>
                            <div className="hero__step-content">
                                <h4>4. Confirm & Release</h4>
                                <p>Confirm receipt, funds go to seller</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Wave Decoration */}
            <div className="hero__wave">
                <svg viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none">
                    <path d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 80C1248 70 1344 50 1392 40L1440 30V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" fill="url(#wave-gradient)" />
                    <defs>
                        <linearGradient id="wave-gradient" x1="720" y1="0" x2="720" y2="120">
                            <stop stopColor="rgba(0, 214, 143, 0.2)" />
                            <stop offset="1" stopColor="transparent" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </section>
    );
}
