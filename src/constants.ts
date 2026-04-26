import { Address } from 'viem';

/**
 * ABI for the ShipMaster contract
 */
export const SHIP_MASTER_ABI = [
  {
    inputs: [
      { name: 'update', type: 'string' },
      { name: 'link', type: 'string' },
    ],
    name: 'ship',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'builder', type: 'address' }],
    name: 'getShipments',
    outputs: [
      {
        components: [
          { name: 'update', type: 'string' },
          { name: 'timestamp', type: 'uint256' },
          { name: 'link', type: 'string' },
        ],
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'builder', type: 'address' }],
    name: 'totalShipped',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'builder', type: 'address' },
      { indexed: true, name: 'shipmentId', type: 'uint256' },
      { name: 'update', type: 'string' },
      { name: 'timestamp', type: 'uint256' },
    ],
    name: 'Shipped',
    type: 'event',
  },
] as const;

/**
 * ABI for the DailyPulse contract
 */
export const DAILY_PULSE_ABI = [
  {
    inputs: [],
    name: 'checkIn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'builder', type: 'address' }],
    name: 'totalCheckIns',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'builder', type: 'address' }],
    name: 'lastCheckIn',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'builder', type: 'address' },
      { indexed: true, name: 'count', type: 'uint256' },
      { name: 'timestamp', type: 'uint256' },
    ],
    name: 'Pulse',
    type: 'event',
  },
] as const;

/**
 * Deployed contract addresses on Celo
 */
export const CONTRACTS = {
  /** ShipMaster shipment tracking contract */
  SHIP_MASTER: '0x82D85064A49B7544e9D81d8192Ab125a42e8a4C4' as Address,
  /** Daily Activity / Pulse tracking contract */
  PULSE: '0x6E2b4b0F19EE0ECcb1dd1024e4E9318a9eC2FCD2' as Address,
} as const;

/**
 * Deployed contract addresses on Celo Alfajores Testnet
 */
export const CONTRACTS_ALFAJORES = {
  SHIP_MASTER: '0x0000000000000000000000000000000000000000' as Address, // TODO: Deploy
  PULSE: '0x0000000000000000000000000000000000000000' as Address, // TODO: Deploy
} as const;

/**
 * External API Endpoints
 */
export const ENDPOINTS = {
  TALENT_PROTOCOL_API: 'https://api.talentprotocol.com/api/v1',
} as const;

