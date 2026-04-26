import { Address, Chain } from 'viem';

/**
 * Represents a shipment recorded on ShipMaster
 */
interface Shipment {
    /** The update description */
    update: string;
    /** The block timestamp of the shipment */
    timestamp: bigint;
    /** Link to proof or details */
    link: string;
}
/**
 * Represents pulse statistics for a builder
 */
interface PulseStats {
    /** Total number of check-ins */
    totalCheckIns: bigint;
    /** Timestamp of the last check-in */
    lastCheckIn: bigint;
}
/**
 * Represents a user profile from Talent Protocol
 */
interface TalentProfile {
    /** The builder score (0-100) */
    score: number;
    /** The unique passport ID */
    passport_id: string;
    /** Whether the user is identity verified */
    verified: boolean;
}
/**
 * Detailed passport data from Talent Protocol
 */
interface TalentPassport {
    id: string;
    main_wallet: Address;
    score: number;
    verified: boolean;
    activity_score: number;
    identity_score: number;
    skills_score: number;
}
/**
 * Response structure from the Talent Protocol API
 */
interface TalentPassportResponse {
    passport: TalentPassport;
}

/**
 * ABI for the ShipMaster contract
 */
declare const SHIP_MASTER_ABI: readonly [{
    readonly inputs: readonly [{
        readonly name: "update";
        readonly type: "string";
    }, {
        readonly name: "link";
        readonly type: "string";
    }];
    readonly name: "ship";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly name: "builder";
        readonly type: "address";
    }];
    readonly name: "getShipments";
    readonly outputs: readonly [{
        readonly components: readonly [{
            readonly name: "update";
            readonly type: "string";
        }, {
            readonly name: "timestamp";
            readonly type: "uint256";
        }, {
            readonly name: "link";
            readonly type: "string";
        }];
        readonly type: "tuple[]";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly name: "builder";
        readonly type: "address";
    }];
    readonly name: "totalShipped";
    readonly outputs: readonly [{
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly name: "builder";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly name: "shipmentId";
        readonly type: "uint256";
    }, {
        readonly name: "update";
        readonly type: "string";
    }, {
        readonly name: "timestamp";
        readonly type: "uint256";
    }];
    readonly name: "Shipped";
    readonly type: "event";
}];
/**
 * ABI for the DailyPulse contract
 */
declare const DAILY_PULSE_ABI: readonly [{
    readonly inputs: readonly [];
    readonly name: "checkIn";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly name: "builder";
        readonly type: "address";
    }];
    readonly name: "totalCheckIns";
    readonly outputs: readonly [{
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly name: "builder";
        readonly type: "address";
    }];
    readonly name: "lastCheckIn";
    readonly outputs: readonly [{
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly name: "builder";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly name: "count";
        readonly type: "uint256";
    }, {
        readonly name: "timestamp";
        readonly type: "uint256";
    }];
    readonly name: "Pulse";
    readonly type: "event";
}];
/**
 * Deployed contract addresses on Celo
 */
declare const CONTRACTS: {
    /** ShipMaster shipment tracking contract */
    readonly SHIP_MASTER: Address;
    /** Daily Activity / Pulse tracking contract */
    readonly PULSE: Address;
};
/**
 * Deployed contract addresses on Celo Alfajores Testnet
 */
declare const CONTRACTS_ALFAJORES: {
    readonly SHIP_MASTER: Address;
    readonly PULSE: Address;
};
/**
 * External API Endpoints
 */
declare const ENDPOINTS: {
    readonly TALENT_PROTOCOL_API: "https://api.talentprotocol.com/api/v1";
};

/**
 * Validates a Celo/Ethereum address
 * @param address The address to validate
 * @returns True if valid, false otherwise
 */
declare function isValidAddress(address: string): address is Address;
/**
 * Formats an address for display (0x1234...5678)
 * @param address The address to format
 * @returns The truncated address string
 */
declare function formatAddress(address: string): string;

/**
 * Custom error class for ShipMaster SDK issues
 */
declare class ShipMasterError extends Error {
    statusCode?: number | undefined;
    constructor(message: string, statusCode?: number | undefined);
}

/**
 * Main SDK class for interacting with ShipMaster contracts and Talent Protocol on Celo
 */
declare class ShipMasterSDK {
    private client;
    private contracts;
    /**
     * Initialize the ShipMaster SDK
     * @param rpcUrl The Celo RPC URL (defaults to Celo Forno)
     * @param chain The viem Chain object (defaults to celo)
     */
    constructor(rpcUrl?: string, chain?: Chain);
    /**
     * Get all shipments for a specific builder
     * @param address The builder's Celo address
     * @returns Array of shipments
     */
    getShipments(address: Address): Promise<readonly Shipment[]>;
    /**
     * Get the total number of shipments by a builder
     * @param address The builder's Celo address
     * @returns Total count
     */
    getTotalShipped(address: Address): Promise<bigint>;
    /**
     * Prepares a request to record a shipment.
     * Note: This requires a wallet client to send a transaction.
     * @param update Description of what was shipped
     * @param link Link to proof or details
     * @returns Transaction parameters
     */
    getShipRequest(update: string, link: string): {
        address: `0x${string}`;
        abi: readonly [{
            readonly inputs: readonly [{
                readonly name: "update";
                readonly type: "string";
            }, {
                readonly name: "link";
                readonly type: "string";
            }];
            readonly name: "ship";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly name: "builder";
                readonly type: "address";
            }];
            readonly name: "getShipments";
            readonly outputs: readonly [{
                readonly components: readonly [{
                    readonly name: "update";
                    readonly type: "string";
                }, {
                    readonly name: "timestamp";
                    readonly type: "uint256";
                }, {
                    readonly name: "link";
                    readonly type: "string";
                }];
                readonly type: "tuple[]";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly name: "builder";
                readonly type: "address";
            }];
            readonly name: "totalShipped";
            readonly outputs: readonly [{
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly name: "builder";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly name: "shipmentId";
                readonly type: "uint256";
            }, {
                readonly name: "update";
                readonly type: "string";
            }, {
                readonly name: "timestamp";
                readonly type: "uint256";
            }];
            readonly name: "Shipped";
            readonly type: "event";
        }];
        functionName: string;
        args: string[];
    };
    /**
     * Get the total number of check-ins for a builder
     * @param address The builder's Celo address
     * @returns Total count
     */
    getTotalCheckIns(address: Address): Promise<bigint>;
    /**
     * Get the last check-in timestamp for a builder
     * @param address The builder's Celo address
     * @returns Timestamp (seconds)
     */
    getLastCheckIn(address: Address): Promise<bigint>;
    /**
     * Get combined pulse stats for a builder
     * @param address The builder's Celo address
     * @returns Object with totalCheckIns and lastCheckIn
     */
    getPulseStats(address: Address): Promise<PulseStats>;
    /**
     * Prepares a request to record a daily pulse check-in.
     * Note: This requires a wallet client to send a transaction.
     * @returns Transaction parameters
     */
    getCheckInRequest(): {
        address: `0x${string}`;
        abi: readonly [{
            readonly inputs: readonly [];
            readonly name: "checkIn";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly name: "builder";
                readonly type: "address";
            }];
            readonly name: "totalCheckIns";
            readonly outputs: readonly [{
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly name: "builder";
                readonly type: "address";
            }];
            readonly name: "lastCheckIn";
            readonly outputs: readonly [{
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly name: "builder";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly name: "count";
                readonly type: "uint256";
            }, {
                readonly name: "timestamp";
                readonly type: "uint256";
            }];
            readonly name: "Pulse";
            readonly type: "event";
        }];
        functionName: string;
    };
    /**
     * Fetch the full Talent Protocol Passport for a specific address.
     *
     * @param address The Celo address to check
     * @returns The full passport data or null if not found
     */
    getTalentPassport(address: Address): Promise<TalentPassport | null>;
    /**
     * Fetch the Talent Protocol Builder Score for a specific address.
     *
     * @param address The Celo address to check
     * @returns The Builder Score (0-100)
     */
    getTalentScore(address: Address): Promise<number>;
    /**
     * Check if a user qualifies as "Top Talent" based on their Builder Score.
     *
     * @param address The Celo address of the user
     * @returns True if the user is Top Talent, false otherwise
     */
    isTopTalent(address: Address): Promise<boolean>;
}

export { CONTRACTS, CONTRACTS_ALFAJORES, DAILY_PULSE_ABI, ENDPOINTS, type PulseStats, SHIP_MASTER_ABI, ShipMasterError, ShipMasterSDK, type Shipment, type TalentPassport, type TalentPassportResponse, type TalentProfile, ShipMasterSDK as default, formatAddress, isValidAddress };
