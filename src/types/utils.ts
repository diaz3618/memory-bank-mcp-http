/**
 * Type utilities for Memory Bank MCP
 * 
 * This file contains utility types that can be used throughout the codebase.
 */

import { ProgressDetails, Decision, ActiveContext } from './progress.js';
import { MemoryBankStatus } from './index.js';

/**
 * Makes all properties of T optional
 */
export type Optional<T> = Partial<T>;

/**
 * Makes all properties of T required
 */
export type Required<T> = {
  [P in keyof T]-?: T[P];
};

/**
 * Makes all properties of T readonly
 */
export type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

/**
 * Picks only the specified properties from T
 */
export type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

/**
 * Omits the specified properties from T
 */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Utility types for ProgressDetails
 */
export namespace ProgressTypes {
  /** Partial version of ProgressDetails */
  export type PartialProgressDetails = Optional<ProgressDetails>;
  
  /** Required version of ProgressDetails */
  export type RequiredProgressDetails = Required<ProgressDetails>;
  
  /** Read-only version of ProgressDetails */
  export type ReadonlyProgressDetails = Readonly<ProgressDetails>;
}

/**
 * Utility types for Decision
 */
export namespace DecisionTypes {
  /** Partial version of Decision */
  export type PartialDecision = Optional<Decision>;
  
  /** Required version of Decision */
  export type RequiredDecision = Required<Decision>;
  
  /** Read-only version of Decision */
  export type ReadonlyDecision = Readonly<Decision>;
  
  /** Decision summary with only essential fields */
  export type DecisionSummary = Pick<Decision, 'title' | 'decision'>;
}

/**
 * Utility types for ActiveContext
 */
export namespace ActiveContextTypes {
  /** Partial version of ActiveContext */
  export type PartialActiveContext = Optional<ActiveContext>;
  
  /** Required version of ActiveContext */
  export type RequiredActiveContext = Required<ActiveContext>;
  
  /** Read-only version of ActiveContext */
  export type ReadonlyActiveContext = Readonly<ActiveContext>;
}

/**
 * Utility types for MemoryBankStatus
 */
export namespace MemoryBankStatusTypes {
  /** Partial version of MemoryBankStatus */
  export type PartialMemoryBankStatus = Optional<MemoryBankStatus>;
  
  /** Required version of MemoryBankStatus */
  export type RequiredMemoryBankStatus = Required<MemoryBankStatus>;
  
  /** Read-only version of MemoryBankStatus */
  export type ReadonlyMemoryBankStatus = Readonly<MemoryBankStatus>;
  
  /** Memory Bank status summary with only essential fields */
  export type MemoryBankStatusSummary = Pick<MemoryBankStatus, 'path' | 'isComplete' | 'language'>;
} 