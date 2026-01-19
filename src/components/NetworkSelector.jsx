import React, { useState, useRef, useEffect } from 'react';
import { useSuiClientContext } from '@mysten/dapp-kit';
import './NetworkSelector.css';

export default function NetworkSelector() {
    const { network, selectNetwork, networks } = useSuiClientContext();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const networkLabels = {
        mainnet: { name: 'Mainnet', color: '#22c55e' },
        testnet: { name: 'Testnet', color: '#eab308' },
        devnet: { name: 'Devnet', color: '#f97316' }
    };

    const currentNetwork = networkLabels[network] || networkLabels.mainnet;

    const handleNetworkChange = (newNetwork) => {
        selectNetwork(newNetwork);
        setShowDropdown(false);
    };

    return (
        <div className="network-selector" ref={dropdownRef}>
            <button
                className="network-selector__trigger"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                <span
                    className="network-selector__dot"
                    style={{ backgroundColor: currentNetwork.color }}
                ></span>
                <span className="network-selector__name">{currentNetwork.name}</span>
                <svg
                    className={`network-selector__chevron ${showDropdown ? 'network-selector__chevron--open' : ''}`}
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                >
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {showDropdown && (
                <div className="network-selector__dropdown animate-fade-in">
                    <div className="network-selector__header">
                        <span>Select Network</span>
                    </div>
                    {Object.keys(networks).map((networkKey) => {
                        const netInfo = networkLabels[networkKey];
                        const isActive = network === networkKey;

                        return (
                            <button
                                key={networkKey}
                                className={`network-selector__option ${isActive ? 'network-selector__option--active' : ''}`}
                                onClick={() => handleNetworkChange(networkKey)}
                            >
                                <span
                                    className="network-selector__dot"
                                    style={{ backgroundColor: netInfo.color }}
                                ></span>
                                <span>{netInfo.name}</span>
                                {isActive && (
                                    <svg className="network-selector__check" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M3 8L6.5 11.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
