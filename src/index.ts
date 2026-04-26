import { createPublicClient, http, Address, Chain } from 'viem';
import { celo, celoAlfajores } from 'viem/chains';
import { 
  SHIP_MASTER_ABI, 
  DAILY_PULSE_ABI, 
  CONTRACTS, 
  CONTRACTS_ALFAJORES, 
  ENDPOINTS 
} from './constants';
import { 
  TalentPassport, 
  TalentPassportResponse, 
  Shipment, 
  PulseStats 
} from './types';

/**
 * Custom error class for ShipMaster SDK issues
 */
export class ShipMasterError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'ShipMasterError';
  }
}

export * from './types';
export * from './constants';
export * from './utils';

/**
 * Main SDK class for interacting with ShipMaster contracts and Talent Protocol on Celo
 */
export class ShipMasterSDK {
  private client;
  private contracts;

  /**
   * Initialize the ShipMaster SDK
   * @param rpcUrl The Celo RPC URL (defaults to Celo Forno)
   * @param chain The viem Chain object (defaults to celo)
   */
  constructor(rpcUrl: string = 'https://forno.celo.org', chain: Chain = celo) {
    this.client = createPublicClient({
      chain,
      transport: http(rpcUrl),
    });
    this.contracts = chain.id === celoAlfajores.id ? CONTRACTS_ALFAJORES : CONTRACTS;
  }

  // --- ShipMaster Contract Methods ---

  /**
   * Get all shipments for a specific builder
   * @param address The builder's Celo address
   * @returns Array of shipments
   */
  async getShipments(address: Address): Promise<readonly Shipment[]> {
    return (await this.client.readContract({
      address: this.contracts.SHIP_MASTER,
      abi: SHIP_MASTER_ABI,
      functionName: 'getShipments',
      args: [address],
    })) as readonly Shipment[];
  }

  /**
   * Get the total number of shipments by a builder
   * @param address The builder's Celo address
   * @returns Total count
   */
  async getTotalShipped(address: Address): Promise<bigint> {
    return await this.client.readContract({
      address: this.contracts.SHIP_MASTER,
      abi: SHIP_MASTER_ABI,
      functionName: 'totalShipped',
      args: [address],
    });
  }

  /**
   * Prepares a request to record a shipment.
   * Note: This requires a wallet client to send a transaction.
   * @param update Description of what was shipped
   * @param link Link to proof or details
   * @returns Transaction parameters
   */
  getShipRequest(update: string, link: string) {
    return {
      address: this.contracts.SHIP_MASTER,
      abi: SHIP_MASTER_ABI,
      functionName: 'ship',
      args: [update, link],
    };
  }

  // --- Pulse Contract Methods ---

  /**
   * Get the total number of check-ins for a builder
   * @param address The builder's Celo address
   * @returns Total count
   */
  async getTotalCheckIns(address: Address): Promise<bigint> {
    return await this.client.readContract({
      address: this.contracts.PULSE,
      abi: DAILY_PULSE_ABI,
      functionName: 'totalCheckIns',
      args: [address],
    });
  }

  /**
   * Get the last check-in timestamp for a builder
   * @param address The builder's Celo address
   * @returns Timestamp (seconds)
   */
  async getLastCheckIn(address: Address): Promise<bigint> {
    return await this.client.readContract({
      address: this.contracts.PULSE,
      abi: DAILY_PULSE_ABI,
      functionName: 'lastCheckIn',
      args: [address],
    });
  }

  /**
   * Get combined pulse stats for a builder
   * @param address The builder's Celo address
   * @returns Object with totalCheckIns and lastCheckIn
   */
  async getPulseStats(address: Address): Promise<PulseStats> {
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
      functionName: 'checkIn',
    };
  }

  // --- Talent Protocol Integration ---

  /**
   * Fetch the full Talent Protocol Passport for a specific address.
   * 
   * @param address The Celo address to check
   * @returns The full passport data or null if not found
   */
  async getTalentPassport(address: Address): Promise<TalentPassport | null> {
    try {
      const response = await fetch(`${ENDPOINTS.TALENT_PROTOCOL_API}/passports/${address}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.status === 404) return null;
      if (!response.ok) {
        throw new ShipMasterError(`Failed to fetch passport: ${response.statusText}`, response.status);
      }
      
      const data: TalentPassportResponse = await response.json();
      return data?.passport || null;
    } catch (error) {
      if (error instanceof ShipMasterError) throw error;
      console.error('Error fetching Talent Protocol passport:', error);
      throw new ShipMasterError(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Fetch the Talent Protocol Builder Score for a specific address.
   * 
   * @param address The Celo address to check
   * @returns The Builder Score (0-100)
   */
  async getTalentScore(address: Address): Promise<number> {
    const passport = await this.getTalentPassport(address);
    return passport?.score || 0;
  }

  /**
   * Check if a user qualifies as "Top Talent" based on their Builder Score.
   * 
   * @param address The Celo address of the user
   * @returns True if the user is Top Talent, false otherwise
   */
  async isTopTalent(address: Address): Promise<boolean> {
    const score = await this.getTalentScore(address);
    return score > 50;
  }
}

export default ShipMasterSDK;

