import { Address } from 'viem';

/**
 * Represents a shipment recorded on ShipMaster
 */
export interface Shipment {
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
export interface PulseStats {
  /** Total number of check-ins */
  totalCheckIns: bigint;
  /** Timestamp of the last check-in */
  lastCheckIn: bigint;
}

/**
 * Represents a user profile from Talent Protocol
 */
export interface TalentProfile {
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
export interface TalentPassport {
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
export interface TalentPassportResponse {
  passport: TalentPassport;
}

