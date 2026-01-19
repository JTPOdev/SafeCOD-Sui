import React from 'react';
import { ConnectModal } from '@mysten/dapp-kit';
import { useWallet } from '../context/WalletContext';
import './NFTGallery.css';

export default function NFTGallery() {
    const { nfts, isConnected, isLoading, network } = useWallet();

    return (
        <section id="explore" className="nft-gallery">
            <div className="nft-gallery__container container">
                <div className="nft-gallery__header">
                    <div className="nft-gallery__title-group">
                        <h2 className="nft-gallery__title">
                            Your <span className="gradient-text">NFT Collection</span>
                        </h2>
                        <p className="nft-gallery__subtitle">
                            {isConnected
                                ? 'NFTs owned by your connected Sui wallet'
                                : 'Connect your wallet to view your NFT collection'
                            }
                        </p>
                    </div>

                    {isConnected && nfts.length > 0 && (
                        <div className="nft-gallery__filters">
                            <button className="nft-gallery__filter nft-gallery__filter--active">All ({nfts.length})</button>
                        </div>
                    )}
                </div>

                {isConnected ? (
                    isLoading ? (
                        <div className="nft-gallery__loading glass-card">
                            <span className="spinner spinner--lg"></span>
                            <p>Loading your NFTs...</p>
                        </div>
                    ) : nfts.length > 0 ? (
                        <div className="nft-gallery__grid">
                            {nfts.map((nft, index) => (
                                <div
                                    key={nft.id}
                                    className="nft-card glass-card animate-fade-in"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="nft-card__image-wrapper">
                                        <img
                                            src={nft.image}
                                            alt={nft.name}
                                            className="nft-card__image"
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect fill="%23374151" width="400" height="400"/><text x="50%" y="50%" fill="%239ca3af" text-anchor="middle" dy=".3em">Image Not Found</text></svg>';
                                            }}
                                        />
                                        <div className="nft-card__overlay">
                                            <button
                                                className="nft-card__action btn-glow"
                                                onClick={() => window.open(`https://suiscan.xyz/${network}/object/${nft.id}`, '_blank')}
                                            >
                                                View on Explorer
                                            </button>
                                        </div>
                                    </div>

                                    <div className="nft-card__content">
                                        <span className="nft-card__collection">{nft.collection}</span>
                                        <h3 className="nft-card__name">{nft.name}</h3>
                                        {nft.description && (
                                            <p className="nft-card__description">{nft.description}</p>
                                        )}
                                        <div className="nft-card__footer">
                                            <div className="nft-card__id">
                                                <span className="nft-card__id-label">Object ID</span>
                                                <span className="nft-card__id-value">{nft.id.slice(0, 8)}...{nft.id.slice(-6)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="nft-gallery__empty glass-card">
                            <svg className="nft-gallery__empty-icon" width="64" height="64" viewBox="0 0 64 64" fill="none">
                                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                                <rect x="22" y="22" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="2" />
                                <path d="M28 32L30 34L36 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <h3 className="nft-gallery__empty-title">No NFTs Found</h3>
                            <p className="nft-gallery__empty-text">
                                Your wallet doesn't contain any NFTs with display metadata yet.
                                <br />Mint or purchase NFTs to see them here!
                            </p>
                        </div>
                    )
                ) : (
                    <div className="nft-gallery__empty glass-card">
                        <svg className="nft-gallery__empty-icon" width="64" height="64" viewBox="0 0 64 64" fill="none">
                            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                            <rect x="22" y="22" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="2" />
                            <path d="M28 32L30 34L36 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <h3 className="nft-gallery__empty-title">Connect Your Wallet</h3>
                        <p className="nft-gallery__empty-text">
                            Connect your Sui wallet to view your NFT collection
                        </p>
                        <ConnectModal
                            trigger={
                                <button className="btn-glow">
                                    Connect Wallet
                                </button>
                            }
                        />
                    </div>
                )}
            </div>
        </section>
    );
}
