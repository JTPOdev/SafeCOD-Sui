import express from 'express';
import cors from 'cors';
import { getAllOrders, getOrdersByWallet, getOrderByCode, createOrder, updateOrderStatus } from './database.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Mock products (0.01-0.05 SUI for testnet)
const PRODUCTS = [
    {
        id: 'prod_1',
        name: 'Fresh Mangoes (1kg)',
        description: 'Sweet Philippine mangoes from Guimaras',
        price_sui: 0.01,
        price_php: 50,
        image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400',
        seller: 'Juan\'s Farm'
    },
    {
        id: 'prod_2',
        name: 'Dried Fish Bundle',
        description: 'Assorted dried fish - Tuyo, Dilis, Danggit',
        price_sui: 0.02,
        price_php: 100,
        image: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400',
        seller: 'Visayan Seafoods'
    },
    {
        id: 'prod_3',
        name: 'Ube Halaya Jar',
        description: 'Homemade purple yam jam, 500g',
        price_sui: 0.03,
        price_php: 150,
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
        seller: 'Nanay\'s Kitchen'
    },
    {
        id: 'prod_4',
        name: 'Calamansi Juice (1L)',
        description: 'Fresh squeezed calamansi concentrate',
        price_sui: 0.02,
        price_php: 80,
        image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400',
        seller: 'Citrus Grove PH'
    },
    {
        id: 'prod_5',
        name: 'Pili Nuts (250g)',
        description: 'Roasted pili nuts from Bicol',
        price_sui: 0.05,
        price_php: 250,
        image: 'https://images.unsplash.com/photo-1536816579748-4ecb3f03d72a?w=400',
        seller: 'Bicol Delights'
    },
    {
        id: 'prod_6',
        name: 'Banana Chips Pack',
        description: 'Crispy banana chips, sweet & savory mix',
        price_sui: 0.01,
        price_php: 45,
        image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400',
        seller: 'Davao Snacks'
    }
];

// Generate unique order code
function generateOrderCode() {
    return 'SC' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
}

// ============= API ROUTES =============

// Get all products
app.get('/api/products', (req, res) => {
    res.json(PRODUCTS);
});

// Get single product
app.get('/api/products/:id', (req, res) => {
    const product = PRODUCTS.find(p => p.id === req.params.id);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
});

// Create new order
app.post('/api/orders', (req, res) => {
    const { buyer_wallet, product_id, escrow_tx_digest } = req.body;

    const product = PRODUCTS.find(p => p.id === product_id);
    if (!product) {
        return res.status(400).json({ error: 'Invalid product' });
    }

    const order_code = generateOrderCode();

    try {
        const order = createOrder({
            order_code,
            buyer_wallet,
            product_id,
            product_name: product.name,
            amount_sui: product.price_sui,
            status: 'paid',
            escrow_tx_digest: escrow_tx_digest || null
        });

        res.json({
            ...order,
            product,
            message: 'Order created successfully'
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Get orders by wallet
app.get('/api/orders/wallet/:wallet', (req, res) => {
    try {
        const orders = getOrdersByWallet(req.params.wallet);
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Get single order
app.get('/api/orders/:code', (req, res) => {
    try {
        const order = getOrderByCode(req.params.code);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const product = PRODUCTS.find(p => p.id === order.product_id);
        res.json({ ...order, product });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

// Update order status
app.put('/api/orders/:code/status', (req, res) => {
    const { status } = req.body;
    const validStatuses = ['paid', 'shipped', 'out_for_delivery', 'delivered', 'completed', 'disputed'];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        const order = updateOrderStatus(req.params.code, status);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({ message: 'Status updated', status });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Failed to update order' });
    }
});

// Simulate order progression (mock seller/rider)
app.post('/api/orders/:code/simulate', async (req, res) => {
    const orderCode = req.params.code;

    res.json({ message: 'Simulation started' });

    // Simulate: paid -> shipped (2 seconds)
    setTimeout(() => {
        updateOrderStatus(orderCode, 'shipped');
        console.log(`Order ${orderCode}: Shipped`);
    }, 2000);

    // Simulate: shipped -> out_for_delivery (4 seconds)
    setTimeout(() => {
        updateOrderStatus(orderCode, 'out_for_delivery');
        console.log(`Order ${orderCode}: Out for delivery`);
    }, 4000);

    // Simulate: out_for_delivery -> delivered (6 seconds)
    setTimeout(() => {
        updateOrderStatus(orderCode, 'delivered');
        console.log(`Order ${orderCode}: Delivered`);
    }, 6000);
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`SafeCOD API running on http://localhost:${PORT}`);
});
