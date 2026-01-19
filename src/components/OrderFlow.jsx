import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import './OrderFlow.css';

const API_URL = 'http://localhost:3001/api';
const MOCK_SELLER_WALLET = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

export default function OrderFlow({ product, onClose, onOrderSuccess }) {
    const { address, balance, suiPrice } = useWallet();
    const suiClient = useSuiClient();
    const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

    const [step, setStep] = useState('confirm'); // confirm, paying, tracking
    const [order, setOrder] = useState(null);
    const [error, setError] = useState(null);

    // Calculate amounts
    const amountInMist = Math.floor(product.price_sui * 1_000_000_000);
    const usdValue = suiPrice ? (product.price_sui * suiPrice).toFixed(2) : null;

    const handlePayment = async () => {
        setStep('paying');
        setError(null);

        try {
            // Create transaction to send SUI (simulating escrow deposit)
            const tx = new Transaction();

            // Split coin and transfer to mock seller (representing escrow)
            const [coin] = tx.splitCoins(tx.gas, [amountInMist]);
            tx.transferObjects([coin], MOCK_SELLER_WALLET);

            // Execute transaction
            const result = await signAndExecute({
                transaction: tx,
            });

            // Wait for transaction to be confirmed
            await suiClient.waitForTransaction({ digest: result.digest });

            // Create order in backend
            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    buyer_wallet: address,
                    product_id: product.id,
                    escrow_tx_digest: result.digest
                })
            });

            const orderData = await response.json();
            setOrder(orderData);
            setStep('tracking');

            // Start order simulation (mock seller/rider)
            await fetch(`${API_URL}/orders/${orderData.order_code}/simulate`, {
                method: 'POST'
            });

        } catch (err) {
            console.error('Payment error:', err);
            setError(err.message || 'Payment failed. Please try again.');
            setStep('confirm');
        }
    };

    return (
        <div className="order-flow-overlay" onClick={onClose}>
            <div className="order-flow glass-card" onClick={e => e.stopPropagation()}>
                <button className="order-flow__close" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>

                {step === 'confirm' && (
                    <div className="order-flow__step">
                        <div className="order-flow__header">
                            <h2>Confirm Order</h2>
                            <p>Your payment will be held in escrow until delivery</p>
                        </div>

                        <div className="order-flow__product">
                            <img src={product.image} alt={product.name} />
                            <div className="order-flow__product-info">
                                <span className="order-flow__seller">{product.seller}</span>
                                <h3>{product.name}</h3>
                            </div>
                        </div>

                        <div className="order-flow__summary">
                            <div className="order-flow__row">
                                <span>Product Price</span>
                                <span>{product.price_sui} SUI</span>
                            </div>
                            <div className="order-flow__row">
                                <span>PHP Equivalent</span>
                                <span>₱{product.price_php}</span>
                            </div>
                            {usdValue && (
                                <div className="order-flow__row">
                                    <span>USD Equivalent</span>
                                    <span>${usdValue}</span>
                                </div>
                            )}
                            <div className="order-flow__row order-flow__row--total">
                                <span>Total to Deposit</span>
                                <span className="order-flow__total">{product.price_sui} SUI</span>
                            </div>
                        </div>

                        <div className="order-flow__notice">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M10 6V10M10 14H10.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <p>Funds will be released to seller only after you confirm receipt</p>
                        </div>

                        {error && (
                            <div className="order-flow__error">
                                <p>{error}</p>
                            </div>
                        )}

                        <div className="order-flow__actions">
                            <button className="btn-ghost" onClick={onClose}>Cancel</button>
                            <button
                                className="btn-glow"
                                onClick={handlePayment}
                                disabled={!balance || Number(balance) < product.price_sui}
                            >
                                Deposit {product.price_sui} SUI
                            </button>
                        </div>
                    </div>
                )}

                {step === 'paying' && (
                    <div className="order-flow__step order-flow__step--center">
                        <span className="spinner spinner--lg"></span>
                        <h2>Processing Payment</h2>
                        <p>Please confirm the transaction in your wallet...</p>
                    </div>
                )}

                {step === 'tracking' && order && (
                    <OrderTracker
                        order={order}
                        product={product}
                        onComplete={() => {
                            onOrderSuccess && onOrderSuccess();
                            onClose();
                        }}
                    />
                )}
            </div>
        </div>
    );
}

function OrderTracker({ order, product, onComplete }) {
    const [status, setStatus] = useState('paid');
    const [polling, setPolling] = useState(true);

    const statuses = [
        { key: 'paid', label: 'Payment Received', icon: '💳' },
        { key: 'shipped', label: 'Seller Shipped', icon: '📦' },
        { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🛵' },
        { key: 'delivered', label: 'Delivered', icon: '🏠' },
        { key: 'completed', label: 'Completed', icon: '✅' }
    ];

    useEffect(() => {
        if (!polling) return;

        const interval = setInterval(async () => {
            try {
                const response = await fetch(`${API_URL}/orders/${order.order_code}`);
                const data = await response.json();
                setStatus(data.status);

                if (data.status === 'completed') {
                    setPolling(false);
                }
            } catch (err) {
                console.error('Failed to poll order:', err);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [order.order_code, polling]);

    const handleConfirmReceipt = async () => {
        try {
            await fetch(`${API_URL}/orders/${order.order_code}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'completed' })
            });
            setStatus('completed');
            setPolling(false);
        } catch (err) {
            console.error('Failed to confirm:', err);
        }
    };

    const currentIndex = statuses.findIndex(s => s.key === status);

    return (
        <div className="order-flow__step">
            <div className="order-flow__header">
                <h2>Order #{order.order_code}</h2>
                <p>Track your order status</p>
            </div>

            <div className="order-tracker">
                {statuses.map((s, index) => (
                    <div
                        key={s.key}
                        className={`order-tracker__step ${index <= currentIndex ? 'order-tracker__step--active' : ''} ${index === currentIndex ? 'order-tracker__step--current' : ''}`}
                    >
                        <div className="order-tracker__icon">{s.icon}</div>
                        <div className="order-tracker__label">{s.label}</div>
                        {index < statuses.length - 1 && (
                            <div className={`order-tracker__line ${index < currentIndex ? 'order-tracker__line--active' : ''}`}></div>
                        )}
                    </div>
                ))}
            </div>

            {status === 'delivered' && (
                <div className="order-flow__confirm-section">
                    <h3>📦 Your order has been delivered!</h3>
                    <p>Please confirm receipt to release payment to the seller.</p>
                    <button className="btn-glow" onClick={handleConfirmReceipt}>
                        Confirm Receipt & Release Payment
                    </button>
                </div>
            )}

            {status === 'completed' && (
                <div className="order-flow__success">
                    <div className="order-flow__success-icon">🎉</div>
                    <h3>Order Complete!</h3>
                    <p>Thank you for using SafeCOD. Payment has been released to the seller.</p>
                    <button className="btn-ghost" onClick={onComplete}>Close</button>
                </div>
            )}
        </div>
    );
}
