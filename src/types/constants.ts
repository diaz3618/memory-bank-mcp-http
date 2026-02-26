/**
 * Type-safe constants for Memory Bank MCP
 * 
 * This file contains type-safe constants that can be used throughout the codebase.
 */

/**
 * Memory Bank status constants
 */
export const MEMORY_BANK_STATUS = {
  /** Memory Bank is active and ready to use */
  ACTIVE: 'ACTIVE',
  /** Memory Bank is not active or not found */
  INACTIVE: 'INACTIVE',
  /** Memory Bank is being updated */
  UPDATING: 'UPDATING'
} as const;

/**
 * Type for Memory Bank status values
 */
export type MemoryBankStatusType = typeof MEMORY_BANK_STATUS[keyof typeof MEMORY_BANK_STATUS];

/**
 * Progress action constants
 */
export const PROGRESS_ACTION = {
  /** File update action */
  FILE_UPDATE: 'File Update',
  /** Decision made action */
  DECISION_MADE: 'Decision Made',
  /** Context update action */
  CONTEXT_UPDATE: 'Context Update',
  /** Implementation action */
  IMPLEMENTATION: 'Implementation',
  /** Documentation action */
  DOCUMENTATION: 'Documentation',
  /** Bug fix action */
  BUG_FIX: 'Bug Fix',
  /** Feature addition action */
  FEATURE_ADDITION: 'Feature Addition',
  /** Refactoring action */
  REFACTORING: 'Refactoring',
  /** Testing action */
  TESTING: 'Testing',
  /** Completion action */
  COMPLETION: 'Completion'
} as const;

/**
 * Type for progress action values
 */
export type ProgressActionType = typeof PROGRESS_ACTION[keyof typeof PROGRESS_ACTION];

/**
 * Progress status constants
 */
export const PROGRESS_STATUS = {
  /** Success status */
  SUCCESS: 'success',
  /** Error status */
  ERROR: 'error',
  /** Warning status */
  WARNING: 'warning'
} as const;

/**
 * Type for progress status values
 */
export type ProgressStatusType = typeof PROGRESS_STATUS[keyof typeof PROGRESS_STATUS];

/**
 * Mode constants
 */
export const MODE = {
  /** Architect mode */
  ARCHITECT: 'architect',
  /** Ask mode */
  ASK: 'ask',
  /** Code mode */
  CODE: 'code',
  /** Debug mode */
  DEBUG: 'debug',
  /** Test mode */
  TEST: 'test'
} as const;

/**
 * Type for mode values
 */
export type ModeType = typeof MODE[keyof typeof MODE]; 