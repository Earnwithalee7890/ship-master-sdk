# ShipMaster SDK 🚢

Official SDK for **ShipMaster**, the premium event and micro-task platform on Celo. Build reputation, track activity, and integrate with Talent Protocol seamlessly.

[![NPM Version](https://img.shields.io/npm/v/ship-master-sdk.svg)](https://www.npmjs.com/package/ship-master-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 📦 **Ship updates**: Record your project shipments directly on-chain.
- 💓 **Daily Pulse**: Track consistent builder activity via heartbeat check-ins.
- 🆔 **Talent Protocol Integration**: Fetch Builder Scores and Passport data.
- ⚡ **Viem Powered**: Built with the most modern and lightweight Ethereum library.
- 📝 **TypeScript First**: Full type safety and auto-completion.

## Installation

```bash
npm install ship-master-sdk
# or
yarn add ship-master-sdk
```

## Quick Start

```typescript
import { ShipMasterSDK } from 'ship-master-sdk';

// Initialize the SDK
const sdk = new ShipMasterSDK();

// Fetch a builder's score from Talent Protocol
const score = await sdk.getTalentScore('0x...');
console.log(`Builder Score: ${score}`);

// Get all shipments for a builder
const shipments = await sdk.getShipments('0x...');
console.log(`Total Shipments: ${shipments.length}`);
```

## API Reference

### ShipMaster Contract
- `getShipments(address)`: Returns all project updates recorded by a builder.
- `getTotalShipped(address)`: Returns the total count of shipments.
- `getShipRequest(update, link)`: Returns transaction parameters for recording a new shipment.

### Daily Pulse Contract
- `getPulseStats(address)`: Returns total check-ins and last activity timestamp.
- `getCheckInRequest()`: Returns transaction parameters for a daily pulse heartbeat.

### Talent Protocol
- `getTalentScore(address)`: Returns the builder's score (0-100).
- `getTalentPassport(address)`: Returns full passport metadata including verification status.
- `isTopTalent(address)`: Returns true if the builder score is above 50.

## Development

```bash
npm install
npm run build
```

## License

MIT © [earnwithalee](https://github.com/Earnwithalee7890)
