import React from 'react';
import { useWallet, WALLET_STATUS } from '../context/WalletContext';
import './WalletStatus.css';

export default function WalletStatus() {
    const { status, network, walletName } = useWallet();

    const getStatusInfo = () => {
        switch (status) {
            case WALLET_STATUS.CONNECTED:
                return { label: walletName || 'Connected', className: 'connected' };
            case WALLET_STATUS.CONNECTING:
                return { label: 'Connecting', className: 'connecting' };
            case WALLET_STATUS.ERROR:
                return { label: 'Error', className: 'error' };
            default:
                return { label: 'Disconnected', className: 'disconnected' };
        }
    };

    const statusInfo = getStatusInfo();
    const networkLabels = {
        mainnet: 'Mainnet',
        testnet: 'Testnet',
        devnet: 'Devnet'
    };

    return (
        <div className="wallet-status">
            <div className={`wallet-status__indicator wallet-status__indicator--${statusInfo.className}`}>
                <span className={`status-dot status-dot--${statusInfo.className}`}></span>
                <span className="wallet-status__label">{statusInfo.label}</span>
            </div>

            {status === WALLET_STATUS.CONNECTED && (
                <div className="wallet-status__network">
                    <span className="wallet-status__network-dot"></span>
                    <span className="wallet-status__network-label">{networkLabels[network]}</span>
                </div>
            )}
        </div>
    );
}
