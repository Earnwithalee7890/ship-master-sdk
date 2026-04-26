// src/index.ts
import { createPublicClient, http } from "viem";
import { celo, celoAlfajores } from "viem/chains";

// src/constants.ts
var SHIP_MASTER_ABI = [
  {
    inputs: [
      { name: "update", type: "string" },
      { name: "link", type: "string" }
    ],
    name: "ship",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "builder", type: "address" }],
    name: "getShipments",
    outputs: [
      {
        components: [
          { name: "update", type: "string" },
          { name: "timestamp", type: "uint256" },
          { name: "link", type: "string" }
        ],
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "builder", type: "address" }],
    name: "totalShipped",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "builder", type: "address" },
      { indexed: true, name: "shipmentId", type: "uint256" },
      { name: "update", type: "string" },
      { name: "timestamp", type: "uint256" }
    ],
    name: "Shipped",
    type: "event"
  }
];
var DAILY_PULSE_ABI = [
  {
    inputs: [],
    name: "checkIn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "builder", type: "address" }],
    name: "totalCheckIns",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "builder", type: "address" }],
    name: "lastCheckIn",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "builder", type: "address" },
      { indexed: true, name: "count", type: "uint256" },
      { name: "timestamp", type: "uint256" }
    ],
    name: "Pulse",
    type: "event"
  }
];
var CONTRACTS = {
  /** ShipMaster shipment tracking contract */
  SHIP_MASTER: "0x82D85064A49B7544e9D81d8192Ab125a42e8a4C4",
  /** Daily Activity / Pulse tracking contract */
  PULSE: "0x6E2b4b0F19EE0ECcb1dd1024e4E9318a9eC2FCD2"
};
var CONTRACTS_ALFAJORES = {
  SHIP_MASTER: "0x0000000000000000000000000000000000000000",
  // TODO: Deploy
  PULSE: "0x0000000000000000000000000000000000000000"
  // TODO: Deploy
};
var ENDPOINTS = {
  TALENT_PROTOCOL_API: "https://api.talentprotocol.com/api/v1"
};

// src/utils.ts
import { isAddress } from "viem";
function isValidAddress(address) {
  return isAddress(address);
}
function formatAddress(address) {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

// src/index.ts
var ShipMasterError = class extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ShipMasterError";
  }
};
var ShipMasterSDK = class {
  /**
   * Initialize the ShipMaster SDK
   * @param rpcUrl The Celo RPC URL (defaults to Celo Forno)
   * @param chain The viem Chain object (defaults to celo)
   */
  constructor(rpcUrl = "https://forno.celo.org", chain = celo) {
    this.client = createPublicClient({
      chain,
      transport: http(rpcUrl)
    });
    this.contracts = chain.id === celoAlfajores.id ? CONTRACTS_ALFAJORES : CONTRACTS;
  }
  // --- ShipMaster Contract Methods ---
  /**
   * Get all shipments for a specific builder
   * @param address The builder's Celo address
   * @returns Array of shipments
   */
  async getShipments(address) {
    return await this.client.readContract({
      address: this.contracts.SHIP_MASTER,
      abi: SHIP_MASTER_ABI,
      functionName: "getShipments",
      args: [address]
    });
  }
  /**
   * Get the total number of shipments by a builder
   * @param address The builder's Celo address
   * @returns Total count
   */
  async getTotalShipped(address) {
    return await this.client.readContract({
      address: this.contracts.SHIP_MASTER,
      abi: SHIP_MASTER_ABI,
      functionName: "totalShipped",
      args: [address]
    });
  }
  /**
   * Prepares a request to record a shipment.
   * Note: This requires a wallet client to send a transaction.
   * @param update Description of what was shipped
   * @param link Link to proof or details
   * @returns Transaction parameters
   */
  getShipRequest(update, link) {
    return {
      address: this.contracts.SHIP_MASTER,
      abi: SHIP_MASTER_ABI,
      functionName: "ship",
      args: [update, link]
    };
  }
  // --- Pulse Contract Methods ---
  /**
   * Get the total number of check-ins for a builder
   * @param address The builder's Celo address
   * @returns Total count
   */
  async getTotalCheckIns(address) {
    return await this.client.readContract({
      address: this.contracts.PULSE,
      abi: DAILY_PULSE_ABI,
      functionName: "totalCheckIns",
      args: [address]
    });
  }
  /**
   * Get the last check-in timestamp for a builder
   * @param address The builder's Celo address
   * @returns Timestamp (seconds)
   */
  async getLastCheckIn(address) {
    return await this.client.readContract({
      address: this.contracts.PULSE,
      abi: DAILY_PULSE_ABI,
      functionName: "lastCheckIn",
      args: [address]
    });
  }
  /**
   * Get combined pulse stats for a builder
   * @param address The builder's Celo address
   * @returns Object with totalCheckIns and lastCheckIn
   */
  async getPulseStats(address) {
    const [total, last] = await Promise.all([
      this.getTotalCheckIns(address),
      this.getLastCheckIn(address)
    ]);
    return { totalCheckIns: total, lastCheckIn: last };
  }
  /**
   * Prepares a request to record a daily pulse check-in.
   * Note: This requires a wallet client to send a transaction.
   * @returns Transaction parameters
   */
  getCheckInRequest() {
    return {
      address: this.contracts.PULSE,
      abi: DAILY_PULSE_ABI,
      functionName: "checkIn"
    };
  }
  // --- Talent Protocol Integration ---
  /**
   * Fetch the full Talent Protocol Passport for a specific address.
   * 
   * @param address The Celo address to check
   * @returns The full passport data or null if not found
   */
  async getTalentPassport(address) {
    try {
      const response = await fetch(`${ENDPOINTS.TALENT_PROTOCOL_API}/passports/${address}`, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response.status === 404) return null;
      if (!response.ok) {
        throw new ShipMasterError(`Failed to fetch passport: ${response.statusText}`, response.status);
      }
      const data = await response.json();
      return data?.passport || null;
    } catch (error) {
      if (error instanceof ShipMasterError) throw error;
      console.error("Error fetching Talent Protocol passport:", error);
      throw new ShipMasterError(error instanceof Error ? error.message : "Unknown error");
    }
  }
  /**
   * Fetch the Talent Protocol Builder Score for a specific address.
   * 
   * @param address The Celo address to check
   * @returns The Builder Score (0-100)
   */
  async getTalentScore(address) {
    const passport = await this.getTalentPassport(address);
    return passport?.score || 0;
  }
  /**
   * Check if a user qualifies as "Top Talent" based on their Builder Score.
   * 
   * @param address The Celo address of the user
   * @returns True if the user is Top Talent, false otherwise
   */
  async isTopTalent(address) {
    const score = await this.getTalentScore(address);
    return score > 50;
  }
};
var index_default = ShipMasterSDK;
export {
  CONTRACTS,
  CONTRACTS_ALFAJORES,
  DAILY_PULSE_ABI,
  ENDPOINTS,
  SHIP_MASTER_ABI,
  ShipMasterError,
  ShipMasterSDK,
  index_default as default,
  formatAddress,
  isValidAddress
};
