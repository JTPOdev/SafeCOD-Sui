import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import OrderFlow from './components/OrderFlow';
import Footer from './components/Footer';
import ErrorBanner from './components/ErrorBanner';
import { useWallet } from './context/WalletContext';
import './App.css';

function App() {
    const { hasError } = useWallet();
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleSelectProduct = (product) => {
        setSelectedProduct(product);
    };

    const handleCloseOrderFlow = () => {
        setSelectedProduct(null);
    };

    return (
        <div className="app">
            <Navbar />

            <main className="main">
                {hasError && (
                    <div className="container" style={{ paddingTop: '100px' }}>
                        <ErrorBanner />
                    </div>
                )}

                <Hero />
                <ProductGrid onSelectProduct={handleSelectProduct} />
            </main>

            <Footer />

            {/* Order Flow Modal */}
            {selectedProduct && (
                <OrderFlow
                    product={selectedProduct}
                    onClose={handleCloseOrderFlow}
                    onOrderSuccess={handleCloseOrderFlow}
                />
            )}
        </div>
    );
}

export default App;
