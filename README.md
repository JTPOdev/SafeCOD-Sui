# SafeCOD - Secure Cash-on-Delivery Platform

<p align="center">
  <img src="https://img.shields.io/badge/Sui-Blockchain-blue?style=for-the-badge" alt="Sui Blockchain"/>
  <img src="https://img.shields.io/badge/React-18-61dafb?style=for-the-badge" alt="React"/>
  <img src="https://img.shields.io/badge/Express-Backend-green?style=for-the-badge" alt="Express"/>
</p>

## 🛡️ About SafeCOD

**SafeCOD** is a blockchain-powered escrow platform designed to solve the "Bogus Buyer" epidemic in the Philippines.

### The Problem
In the Philippines, **Cash-on-Delivery (COD)** is the standard payment method due to low banking penetration. However, sellers suffer massive losses when:
- Buyers refuse delivery upon arrival
- Buyers "ghost" riders and don't show up
- Perishable goods spoil due to failed deliveries

### Our Solution
SafeCOD uses **Sui blockchain escrow** to protect both buyers and sellers:

1. **Buyer deposits SUI** to escrow when ordering
2. **Seller ships** knowing payment is guaranteed
3. **Rider delivers** the package
4. **Buyer confirms receipt** → funds released to seller

No more bogus buyers. No more wasted products. **100% payment protection.**

---

## 🚀 Features

- ✅ Sui Wallet Integration (Testnet/Mainnet)
- ✅ Real-time SUI balance with USD conversion
- ✅ Escrow-protected transactions
- ✅ Order tracking with status updates
- ✅ Mobile-responsive design

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite |
| Blockchain | Sui Network, @mysten/dapp-kit |
| Backend | Express.js, JSON Storage |
| Styling | Vanilla CSS (Glassmorphism) |

---

## 👥 Team Contributions

| Member | Role | Contributions |
|--------|------|---------------|
| **Po, Jorose** | Project Lead & Frontend | Wallet integration, Network selector, Order flow UI, App architecture |
| **Villacorta, Justin** | Backend Developer | Express.js API server, Order management endpoints, Database design |
| **Catabay, Victoria** | UI/UX Designer | Hero section, Product grid styling, Responsive design, CSS animations |
| **Alicoben, Dominic** | Blockchain Integration | Sui escrow transactions, Wallet context, Balance/NFT fetching |
| **Barillo, Will** | Testing & Documentation | Order simulation logic, Error handling, README documentation |

---

## 📦 Installation

### Prerequisites
- Node.js v18+
- Sui Wallet browser extension

### Setup

```bash
# Clone the repository
git clone https://github.com/your-repo/safecod.git
cd safecod

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Running the App

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 📝 How to Use

1. **Connect Wallet** - Click "Connect Wallet" and select Sui Wallet
2. **Select Network** - Choose Testnet (for testing with test SUI)
3. **Browse Products** - View available products with prices in SUI
4. **Place Order** - Click "Order with Escrow" and confirm the transaction
5. **Track Order** - Watch as order progresses (auto-simulated)
6. **Confirm Receipt** - Click to release payment to seller

---

## 📄 License

This project is for educational purposes.

---

<p align="center">
  Built with ❤️ for the Filipino e-commerce community
</p>
