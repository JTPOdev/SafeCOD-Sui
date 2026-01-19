import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import {
    useCurrentAccount,
    useCurrentWallet,
    useDisconnectWallet,
    useSuiClientQuery,
    useSuiClientContext,
} from '@mysten/dapp-kit';

// Wallet connection states
export const WALLET_STATUS = {
    DISCONNECTED: 'disconnected',
    CONNECTING: 'connecting',
    CONNECTED: 'connected',
    ERROR: 'error'
};

// Error types with user-friendly messages
export const WALLET_ERRORS = {
    NOT_FOUND: {
        code: 'NOT_FOUND',
        message: 'Sui wallet not found',
        suggestion: 'Please install the Sui wallet extension'
    },
    REJECTED: {
        code: 'REJECTED',
        message: 'Connection rejected',
        suggestion: 'You declined the connection request'
    },
    NETWORK_ERROR: {
        code: 'NETWORK_ERROR',
        message: 'Network error',
        suggestion: 'Please check your internet connection'
    },
    UNKNOWN: {
        code: 'UNKNOWN',
        message: 'An error occurred',
        suggestion: 'Please try again or refresh the page'
    }
};

// Create context
const WalletContext = createContext(null);

// Hook to fetch SUI price in USD
function useSuiPrice() {
    const [price, setPrice] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPrice = async () => {
            try {
                // Using CoinGecko API to get SUI price
                const response = await fetch(
                    'https://api.coingecko.com/api/v3/simple/price?ids=sui&vs_currencies=usd'
                );
                const data = await response.json();
                if (data?.sui?.usd) {
                    setPrice(data.sui.usd);
                }
            } catch (error) {
                console.error('Failed to fetch SUI price:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPrice();
        // Refresh price every 60 seconds
        const interval = setInterval(fetchPrice, 60000);
        return () => clearInterval(interval);
    }, []);

    return { price, isLoading };
}

export function WalletContextProvider({ children }) {
    const currentAccount = useCurrentAccount();
    const { currentWallet, connectionStatus } = useCurrentWallet();
    const { mutate: disconnect } = useDisconnectWallet();
    const { network } = useSuiClientContext();

    // Fetch SUI price
    const { price: suiPrice, isLoading: isPriceLoading } = useSuiPrice();

    // Get wallet address
    const address = currentAccount?.address || null;

    // Fetch real-time SUI balance
    const { data: balanceData, isLoading: isBalanceLoading } = useSuiClientQuery(
        'getBalance',
        { owner: address, coinType: '0x2::sui::SUI' },
        { enabled: !!address, refetchInterval: 10000 } // Refetch every 10 seconds
    );

    // Fetch owned NFTs (objects with display data)
    const { data: ownedObjects, isLoading: isNftsLoading } = useSuiClientQuery(
        'getOwnedObjects',
        {
            owner: address,
            options: {
                showType: true,
                showDisplay: true,
                showContent: true,
            },
            limit: 50,
        },
        { enabled: !!address }
    );

    // Parse balance (convert from MIST to SUI)
    const balance = useMemo(() => {
        if (!balanceData?.totalBalance) return null;
        return (Number(balanceData.totalBalance) / 1_000_000_000).toFixed(4);
    }, [balanceData]);

    // Calculate USD value
    const balanceUsd = useMemo(() => {
        if (!balance || !suiPrice) return null;
        return (Number(balance) * suiPrice).toFixed(2);
    }, [balance, suiPrice]);

    // Parse NFTs from owned objects
    const nfts = useMemo(() => {
        if (!ownedObjects?.data) return [];

        return ownedObjects.data
            .filter(obj => obj.data?.display?.data) // Only objects with display metadata
            .map(obj => {
                const display = obj.data.display.data;
                const objectId = obj.data.objectId;

                return {
                    id: objectId,
                    name: display.name || `NFT #${objectId.slice(0, 8)}`,
                    description: display.description || '',
                    image: display.image_url || display.img_url || display.url || '',
                    collection: display.collection || display.project_name || 'Unknown Collection',
                    objectType: obj.data.type || '',
                };
            })
            .filter(nft => nft.image); // Only show NFTs with images
    }, [ownedObjects]);

    // Determine connection status
    const status = useMemo(() => {
        if (connectionStatus === 'connecting') return WALLET_STATUS.CONNECTING;
        if (connectionStatus === 'connected' && address) return WALLET_STATUS.CONNECTED;
        return WALLET_STATUS.DISCONNECTED;
    }, [connectionStatus, address]);

    // Format address for display
    const formatAddress = (addr) => {
        if (!addr) return '';
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    const value = {
        status,
        address,
        balance,
        balanceUsd,
        suiPrice,
        network,
        nfts,
        disconnect,
        formatAddress,
        isConnected: status === WALLET_STATUS.CONNECTED,
        isConnecting: status === WALLET_STATUS.CONNECTING,
        hasError: status === WALLET_STATUS.ERROR,
        isLoading: isBalanceLoading || isNftsLoading,
        walletName: currentWallet?.name || null,
    };

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletContextProvider');
    }
    return context;
}
