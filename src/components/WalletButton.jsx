import React, { useState, useRef, useEffect } from 'react';
import { ConnectModal } from '@mysten/dapp-kit';
import { useWallet, WALLET_STATUS } from '../context/WalletContext';
import './WalletButton.css';

export default function WalletButton() {
    const {
        status,
        address,
        balance,
        balanceUsd,
        network,
        disconnect,
        formatAddress,
        isConnected,
        isConnecting,
        walletName
    } = useWallet();

    const [showMenu, setShowMenu] = useState(false);
    const [copied, setCopied] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Copy address to clipboard
    const copyAddress = async () => {
        if (address) {
            await navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Render based on status
    if (isConnecting) {
        return (
            <button className="wallet-btn wallet-btn--connecting" disabled>
                <span className="spinner spinner--sm"></span>
                <span>Connecting...</span>
            </button>
        );
    }

    if (isConnected) {
        return (
            <div className="wallet-connected" ref={menuRef}>
                <button
                    className="wallet-btn wallet-btn--connected"
                    onClick={() => setShowMenu(!showMenu)}
                >
                    <span className="status-dot status-dot--connected"></span>
                    <span className="wallet-address">{formatAddress(address)}</span>
                    {balanceUsd && <span className="wallet-balance">${balanceUsd}</span>}
                    <svg className="wallet-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                {showMenu && (
                    <div className="wallet-menu animate-fade-in">
                        <div className="wallet-menu__header">
                            <span className="wallet-menu__label">{walletName || 'Connected'}</span>
                            <span className="wallet-menu__address">{formatAddress(address)}</span>
                        </div>

                        <div className="wallet-menu__balance">
                            <span className="wallet-menu__balance-label">Balance</span>
                            <span className="wallet-menu__balance-value">{balance || '0'} SUI</span>
                            {balanceUsd && (
                                <span className="wallet-menu__balance-usd">≈ ${balanceUsd} USD</span>
                            )}
                        </div>

                        <div className="wallet-menu__divider"></div>

                        <button className="wallet-menu__item" onClick={copyAddress}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M3 10V3.5C3 3.22386 3.22386 3 3.5 3H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <span>{copied ? 'Copied!' : 'Copy Address'}</span>
                        </button>

                        <button className="wallet-menu__item" onClick={() => window.open(`https://suiscan.xyz/${network}/account/${address}`, '_blank')}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M6 10L10 6M10 6H6.5M10 6V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                            <span>View on Explorer</span>
                        </button>

                        <div className="wallet-menu__divider"></div>

                        <button className="wallet-menu__item wallet-menu__item--danger" onClick={() => { disconnect(); setShowMenu(false); }}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M10 2H12.5C13.3284 2 14 2.67157 14 3.5V12.5C14 13.3284 13.3284 14 12.5 14H10M6 11L2 8M2 8L6 5M2 8H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Disconnect</span>
                        </button>
                    </div>
                )}
            </div>
        );
    }

    // Default: Disconnected - show Connect Modal
    return (
        <ConnectModal
            trigger={
                <button className="wallet-btn btn-glow">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M15 5.25H3C2.58579 5.25 2.25 5.58579 2.25 6V14.25C2.25 14.6642 2.58579 15 3 15H15C15.4142 15 15.75 14.6642 15.75 14.25V6C15.75 5.58579 15.4142 5.25 15 5.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 10.125C12 10.7463 11.4963 11.25 10.875 11.25C10.2537 11.25 9.75 10.7463 9.75 10.125C9.75 9.50368 10.2537 9 10.875 9C11.4963 9 12 9.50368 12 10.125Z" fill="currentColor" />
                        <path d="M4.5 5.25V4.125C4.5 3.29657 5.17157 2.625 6 2.625H12C12.8284 2.625 13.5 3.29657 13.5 4.125V5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Connect Wallet</span>
                </button>
            }
            open={modalOpen}
            onOpenChange={(open) => setModalOpen(open)}
        />
    );
}
