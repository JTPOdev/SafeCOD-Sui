import React, { useState } from 'react';
import WalletButton from './WalletButton';
import WalletStatus from './WalletStatus';
import NetworkSelector from './NetworkSelector';
import './Navbar.css';

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="navbar__container container">
                {/* Logo */}
                <a href="/" className="navbar__logo">
                    <svg className="navbar__logo-icon" width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <circle cx="16" cy="16" r="14" stroke="url(#logo-gradient)" strokeWidth="2" />
                        <path d="M10 16L14 20L22 12" stroke="url(#logo-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <defs>
                            <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32">
                                <stop stopColor="#00d68f" />
                                <stop offset="1" stopColor="#00a86b" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <span className="navbar__logo-text">
                        <span className="gradient-text">Safe</span>COD
                    </span>
                </a>

                {/* Navigation Links */}
                <div className="navbar__nav">
                    <a href="#shop" className="navbar__link">Shop</a>
                    <a href="#how-it-works" className="navbar__link">How It Works</a>
                    <a href="#" className="navbar__link">My Orders</a>
                </div>

                {/* Right Side: Network + Status + Wallet */}
                <div className="navbar__actions">
                    <NetworkSelector />
                    <WalletStatus />
                    <WalletButton />
                </div>
            </div>
        </nav>
    );
}
