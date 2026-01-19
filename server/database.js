import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_FILE = join(__dirname, 'database.json');

// Initialize database
function initDB() {
    if (!existsSync(DB_FILE)) {
        const initialData = { orders: [] };
        writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    }
}

// Read database
function readDB() {
    initDB();
    const data = readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
}

// Write database
function writeDB(data) {
    writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Get all orders
export function getAllOrders() {
    return readDB().orders;
}

// Get orders by wallet
export function getOrdersByWallet(wallet) {
    return readDB().orders.filter(o => o.buyer_wallet === wallet);
}

// Get order by code
export function getOrderByCode(orderCode) {
    return readDB().orders.find(o => o.order_code === orderCode);
}

// Create order
export function createOrder(order) {
    const db = readDB();
    const newOrder = {
        id: db.orders.length + 1,
        ...order,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    db.orders.push(newOrder);
    writeDB(db);
    return newOrder;
}

// Update order status
export function updateOrderStatus(orderCode, status) {
    const db = readDB();
    const orderIndex = db.orders.findIndex(o => o.order_code === orderCode);
    if (orderIndex === -1) return null;

    db.orders[orderIndex].status = status;
    db.orders[orderIndex].updated_at = new Date().toISOString();
    writeDB(db);
    return db.orders[orderIndex];
}

console.log('Database initialized (JSON file storage)');
