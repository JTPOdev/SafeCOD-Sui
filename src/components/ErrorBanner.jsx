import React from 'react';
import { useWallet } from '../context/WalletContext';
import './ErrorBanner.css';

export default function ErrorBanner() {
    const { error, clearError, connect, hasError } = useWallet();

    if (!hasError || !error) return null;

    return (
        <div className="error-banner animate-fade-in">
            <div className="error-banner__content">
                <svg className="error-banner__icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="error-banner__text">
                    <span className="error-banner__message">{error.message}</span>
                    <span className="error-banner__suggestion">{error.suggestion}</span>
                </div>
            </div>

            <div className="error-banner__actions">
                <button className="error-banner__retry" onClick={connect}>
                    Try Again
                </button>
                <button className="error-banner__close" onClick={clearError} aria-label="Dismiss error">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
