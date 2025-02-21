# IDO Platform — Decentralized Project Funding dApp

> A Web3 launchpad where creators tokenize their projects as NFTs and raise funding directly on-chain. Built during the **UnitZero blockchain hackathon**.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![ethers.js](https://img.shields.io/badge/ethers.js-5.7-2535A0)](https://docs.ethers.org/v5/)
[![Network](https://img.shields.io/badge/Network-UnitZero%20Testnet-ffd700)](https://explorer-testnet.unit0.dev)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## Overview

**IDO Platform** is a decentralized application (dApp) that lets creators turn their projects into on-chain assets and attract investment from a community. Each project is minted as an NFT, and supporters fund it directly with the network's native token — gaining proportional **voting power** based on their contribution.

The project was developed for a blockchain hackathon on the **[UnitZero](https://unit0.dev) Testnet**, demonstrating an end-to-end Web3 flow: wallet authentication, smart-contract interaction, and live on-chain transactions.

## Features

- 🔗 **Wallet authentication** — connect via MetaMask and interact as your on-chain identity
- 🪙 **Project tokenization** — mint a project as an NFT (`ProjectFundingNFT`) with name, description, and GitHub link
- 💸 **On-chain funding** — invest in projects with the native UNIT token; transactions settle on the UnitZero Testnet
- 📊 **Proportional voting power** — each supporter's influence is computed from their share of total funding
- 🎨 **Neon-themed responsive UI** — a custom dark/neon interface built from scratch

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 (Create React App) |
| Web3 / Blockchain | ethers.js v5 |
| Network | UnitZero Testnet (chain ID `88817`) |
| Smart contract | `ProjectFundingNFT` (Solidity, deployed on UnitZero Testnet) |
| Wallet | MetaMask |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 16+
- [MetaMask](https://metamask.io/) browser extension

### Installation

```bash
git clone https://github.com/batuonlukus/unithackathon.git
cd unithackathon
npm install
npm start
```

The app runs at [http://localhost:3000](http://localhost:3000).

### Configure MetaMask for UnitZero Testnet

Add a custom network with the following settings:

| Field | Value |
|-------|-------|
| Network name | UnitZero Testnet |
| RPC URL | `https://rpc-testnet.unit0.dev` |
| Chain ID | `88817` |
| Currency symbol | `UNIT` |
| Block explorer | `https://explorer-testnet.unit0.dev` |

## How It Works

1. **Connect** your MetaMask wallet to the UnitZero Testnet.
2. **Create** a project — this mints an NFT representing your project on-chain.
3. **Fund** any listed project by sending UNIT tokens; the contract records your investment.
4. **Voting power** is recalculated for every supporter based on their share of the project's total funding.

The contract interaction layer lives in [`src/utils/contractInteractions.js`](src/utils/contractInteractions.js), which wraps wallet connection, NFT creation, and funding calls behind a clean API consumed by the React UI.

## Project Structure

```
unithackathon/
├── public/                 # Static assets and HTML shell
├── src/
│   ├── App.js              # Main UI: project cards, create/fund flows
│   ├── App.css             # Neon-themed styling
│   ├── utils/
│   │   └── contractInteractions.js   # ethers.js <-> smart-contract bridge
│   └── index.js            # React entry point
├── package.json
└── README.md
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run the app in development mode |
| `npm test` | Launch the test runner |
| `npm run build` | Produce an optimized production build |

## Notes

This is a **hackathon prototype** running on a testnet — it is intended as a proof of concept, not for production or real-value transactions. The contract address and network configuration can be found in `src/utils/contractInteractions.js`.

## License

Released under the [MIT License](LICENSE).
