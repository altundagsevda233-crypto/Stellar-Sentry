# 🛡 Stellar Sentry

Project name:

Stellar Sentry

Who are you:

Name: Ömer Altundağ

Field: Web3 Developer & Student at METU (ODTÜ).

Technical Expertise: Specialized in Rust and Soroban smart contract development.

Track Record: Active builder in the blockchain ecosystem, with experience in Avalanche and TEKNOFEST hackathons.

Creative Background: Digital Music Producer (FL Studio), bringing a disciplined and structured approach to both audio and code.

Design Philosophy: Strongly influenced by Art and Aesthetics, focusing on creating Web3 products that are both technically robust and visually intuitive.

Visionary Builder: Transitioning from academic theory to real-world blockchain implementation with a "contribution-first" mindset.

Project details:

Stellar Sentry is a decentralized security and monitoring layer designed for the Stellar (Soroban) ecosystem. It provides real-time tracking of smart contract activities and automated risk mitigation. By deploying "sentinel" protocols, it ensures that on-chain assets are protected against anomalies, bridging the gap between complex blockchain data and actionable security insights.

Vision:

To set a new standard for security in the Stellar ecosystem by making high-level protection accessible to every developer and user. My vision is to build a safer, more transparent Web3 where technical complexity never compromises user security or aesthetic quality.

> Real-time Soroban Smart Contract TTL monitoring dashboard for the Stellar network.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-stellar--sentry.vercel.app-blue?style=for-the-badge&logo=vercel)](https://stellar-sentry.vercel.app)
[![Stellar](https://img.shields.io/badge/Stellar-Soroban-7C3AED?style=for-the-badge&logo=stellar)](https://stellar.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Usage](#-usage)
- [Architecture](#-architecture)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 About

**Stellar Sentry** is a web-based monitoring dashboard that tracks the **Time-To-Live (TTL)** of Soroban smart contracts deployed on the Stellar network. Soroban contracts and their data entries have limited lifetimes — when a contract's TTL expires, its data becomes inaccessible. Stellar Sentry helps developers stay ahead of expirations by providing real-time health monitoring, visual indicators, and one-click TTL extension via the Freighter wallet.

### Why Does This Matter?

On the Stellar/Soroban network, all contract data (instance storage, persistent entries, temporary entries) has a TTL measured in **ledger sequences**. If a TTL expires, that data is archived and can no longer be accessed. This tool solves the problem of manually tracking these expirations across multiple contracts.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔭 **Contract Monitoring** | Add any Soroban contract by its ID and monitor its TTL health in real-time |
| 📊 **Health Dashboard** | Visual health bars with color-coded status (🟢 Healthy / 🟡 Warning / 🔴 Critical) |
| ⏱ **TTL Extension** | Extend contract TTL directly from the dashboard via Freighter wallet transactions |
| 🔗 **Wallet Integration** | Seamless Freighter wallet connection for signing extension transactions |
| 🔄 **Auto-Refresh** | Automatic data refresh every 30 seconds to keep metrics up to date |
| 📦 **Data Key Tracking** | Monitor specific persistent/temporary data keys within a contract |
| 💾 **Local Persistence** | Monitored contracts are saved in `localStorage` — no backend required |
| 🌐 **Network Status** | Live network connectivity indicator with latest ledger sequence display |
| 🔔 **Toast Notifications** | Real-time feedback for all user actions (add, remove, extend, errors) |
| 🎨 **Custom TTL Duration** | Choose from preset durations (7d, 30d, 90d, 180d, 365d) or enter a custom value |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 |
| **Build Tool** | Vite 6 |
| **Blockchain SDK** | `@stellar/stellar-sdk` v14 |
| **Wallet** | `@stellar/freighter-api` v2 |
| **Styling** | Vanilla CSS (custom design system) |
| **Fonts** | Inter, JetBrains Mono (Google Fonts) |
| **Deployment** | Vercel / GitHub Pages |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- [**Freighter Wallet**](https://www.freighter.app/) browser extension (for TTL extension feature)

### Installation

```bash
# Clone the repository
git clone https://github.com/altundagsevda233-crypto/Stellar-Sentry.git
cd Stellar-Sentry

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 📖 Usage

### 1. Monitor a Contract

1. Click the **"+ Add Contract"** button
2. Paste a Soroban contract address (starts with `C...`)
3. Optionally add specific data keys to monitor (persistent or temporary)
4. Click **Add** — the dashboard will start tracking the contract's TTL

### 2. Understand Health Indicators

| Status | Health % | Meaning |
|---|---|---|
| 🟢 **Healthy** | > 30% | Contract has plenty of time remaining |
| 🟡 **Warning** | 10% – 30% | Contract will expire relatively soon |
| 🔴 **Critical** | < 10% | Urgent — contract is near expiration |

### 3. Extend Contract TTL

1. **Connect your Freighter wallet** using the "🔗 Connect Wallet" button in the header
2. Click **"Extend TTL"** on a contract card
3. Select a preset duration or enter a custom number of days
4. Confirm the transaction in Freighter
5. The extension transaction will be submitted and the dashboard will refresh automatically

---

## 🏗 Architecture

```
src/
├── App.jsx                      # Root component — state management & auto-refresh
├── main.jsx                     # React entry point
├── index.css                    # Design system & all styles
├── components/
│   ├── Dashboard.jsx            # Network status & stats overview
│   ├── ContractCard.jsx         # Individual contract monitoring card
│   ├── AddContractModal.jsx     # Modal for adding new contracts
│   └── TTLBar.jsx               # Visual TTL health bar component
└── services/
    ├── stellarService.js        # Soroban RPC interactions & TTL calculations
    └── freighterService.js      # Freighter wallet integration & TX signing
```

### Key Modules

- **`stellarService.js`** — Core service layer that communicates with the Soroban RPC. Handles ledger queries, TTL calculations, health metrics, and duration formatting.
- **`freighterService.js`** — Wallet integration service. Manages Freighter connection, builds `extendFootprintTtl` operations, simulates transactions, and handles signing/submission.

---

## 🌍 Deployment

### Vercel (Recommended)

The project is configured for Vercel deployment out of the box:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect the GitHub repository directly to [Vercel](https://vercel.com) for automatic deployments on push.

### GitHub Pages

```bash
# Build and deploy to GitHub Pages
npm run deploy
```

This runs `vite build` followed by `gh-pages -d dist`.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ for the <a href="https://stellar.org">Stellar</a> ecosystem
</p>
