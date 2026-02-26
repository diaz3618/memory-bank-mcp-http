/**
 * Type definitions for progress tracking in Memory Bank MCP
 * 
 * This file contains interfaces and types related to progress tracking.
 */

/**
 * Base interface for progress tracking details
 */
export interface ProgressDetailsBase {
  /** Description of the progress or action */
  description: string;
  /** Optional timestamp of the action */
  timestamp?: Date;
  /** Optional additional metadata as key-value pairs */
  metadata?: Record<string, string | number | boolean>;
}

/**
 * Interface for file-related progress details
 */
export interface FileProgressDetails extends ProgressDetailsBase {
  /** Type of progress action */
  type: 'file';
  /** Filename related to the action */
  filename: string;
  /** Optional path related to the action */
  path?: string;
  /** Optional status of the action */
  status?: 'success' | 'error' | 'warning';
}

/**
 * Interface for decision-related progress details
 */
export interface DecisionProgressDetails extends ProgressDetailsBase {
  /** Type of progress action */
  type: 'decision';
  /** Title of the decision */
  title: string;
  /** Context of the decision */
  context?: string;
}

/**
 * Interface for context-related progress details
 */
export interface ContextProgressDetails extends ProgressDetailsBase {
  /** Type of progress action */
  type: 'context';
  /** Tasks related to the context update */
  tasks?: string[];
  /** Issues related to the context update */
  issues?: string[];
  /** Next steps related to the context update */
  nextSteps?: string[];
}

/**
 * Union type for all progress details
 */
export type ProgressDetails = 
  | FileProgressDetails 
  | DecisionProgressDetails 
  | ContextProgressDetails;

/**
 * Interface for decision logging
 */
export interface Decision {
  /** Title of the decision */
  title: string;
  /** Context or background information for the decision */
  context: string;
  /** The actual decision that was made */
  decision: string;
  /** Alternatives that were considered (string or array of strings) */
  alternatives?: string[] | string;
  /** Consequences of the decision (string or array of strings) */
  consequences?: string[] | string;
  /** Optional date when the decision was made (defaults to current date) */
  date?: Date;
  /** Optional tags to categorize the decision */
  tags?: string[];
}

/**
 * Interface for active context updates
 */
export interface ActiveContext {
  /** List of ongoing tasks */
  tasks?: string[];
  /** List of known issues */
  issues?: string[];
  /** List of next steps */
  nextSteps?: string[];
  /** Optional project state description */
  projectState?: string;
  /** Optional session notes */
  sessionNotes?: string[];
} 