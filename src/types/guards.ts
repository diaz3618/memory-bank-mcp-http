/**
 * Type guards for Memory Bank MCP
 * 
 * This file contains type guard functions that can be used to validate types at runtime.
 */

import { 
  ProgressDetails, 
  FileProgressDetails, 
  DecisionProgressDetails, 
  ContextProgressDetails,
  Decision,
  ActiveContext
} from './progress.js';
import { MemoryBankStatus, ValidationResult } from './index.js';
import { ClineruleBase, MemoryBankConfig } from './rules.js';

/**
 * Type guard for ProgressDetails
 * @param obj Object to check
 * @returns True if the object is a valid ProgressDetails
 */
export function isProgressDetails(obj: unknown): obj is ProgressDetails {
  return (
    typeof obj === 'object' && 
    obj !== null &&
    'description' in obj &&
    typeof obj.description === 'string'
  );
}

/**
 * Type guard for FileProgressDetails
 * @param obj Object to check
 * @returns True if the object is a valid FileProgressDetails
 */
export function isFileProgressDetails(obj: unknown): obj is FileProgressDetails {
  return (
    isProgressDetails(obj) &&
    'type' in obj &&
    obj.type === 'file' &&
    'filename' in obj &&
    typeof obj.filename === 'string'
  );
}

/**
 * Type guard for DecisionProgressDetails
 * @param obj Object to check
 * @returns True if the object is a valid DecisionProgressDetails
 */
export function isDecisionProgressDetails(obj: unknown): obj is DecisionProgressDetails {
  return (
    isProgressDetails(obj) &&
    'type' in obj &&
    obj.type === 'decision' &&
    'title' in obj &&
    typeof obj.title === 'string'
  );
}

/**
 * Type guard for ContextProgressDetails
 * @param obj Object to check
 * @returns True if the object is a valid ContextProgressDetails
 */
export function isContextProgressDetails(obj: unknown): obj is ContextProgressDetails {
  return (
    isProgressDetails(obj) &&
    'type' in obj &&
    obj.type === 'context'
  );
}

/**
 * Type guard for Decision
 * @param obj Object to check
 * @returns True if the object is a valid Decision
 */
export function isDecision(obj: unknown): obj is Decision {
  return (
    typeof obj === 'object' && 
    obj !== null &&
    'title' in obj &&
    typeof obj.title === 'string' &&
    'context' in obj &&
    typeof obj.context === 'string' &&
    'decision' in obj &&
    typeof obj.decision === 'string'
  );
}

/**
 * Type guard for ActiveContext
 * @param obj Object to check
 * @returns True if the object is a valid ActiveContext
 */
export function isActiveContext(obj: unknown): obj is ActiveContext {
  return (
    typeof obj === 'object' && 
    obj !== null &&
    (
      ('tasks' in obj && Array.isArray(obj.tasks)) ||
      ('issues' in obj && Array.isArray(obj.issues)) ||
      ('nextSteps' in obj && Array.isArray(obj.nextSteps)) ||
      ('projectState' in obj && typeof obj.projectState === 'string') ||
      ('sessionNotes' in obj && Array.isArray(obj.sessionNotes))
    )
  );
}

/**
 * Type guard for MemoryBankStatus
 * @param obj Object to check
 * @returns True if the object is a valid MemoryBankStatus
 */
export function isMemoryBankStatus(obj: unknown): obj is MemoryBankStatus {
  return (
    typeof obj === 'object' && 
    obj !== null &&
    'path' in obj &&
    typeof obj.path === 'string' &&
    'files' in obj &&
    Array.isArray(obj.files) &&
    'coreFilesPresent' in obj &&
    Array.isArray(obj.coreFilesPresent) &&
    'missingCoreFiles' in obj &&
    Array.isArray(obj.missingCoreFiles) &&
    'isComplete' in obj &&
    typeof obj.isComplete === 'boolean' &&
    'language' in obj &&
    typeof obj.language === 'string'
  );
}

/**
 * Type guard for ClineruleBase
 * @param obj Object to check
 * @returns True if the object is a valid ClineruleBase
 */
export function isClineruleBase(obj: unknown): obj is ClineruleBase {
  return (
    typeof obj === 'object' && 
    obj !== null &&
    'mode' in obj &&
    typeof obj.mode === 'string' &&
    'instructions' in obj &&
    typeof obj.instructions === 'object' &&
    obj.instructions !== null &&
    'general' in obj.instructions &&
    Array.isArray(obj.instructions.general)
  );
}

/**
 * Type guard for MemoryBankConfig
 * @param obj Object to check
 * @returns True if the object is a valid MemoryBankConfig
 */
export function isMemoryBankConfig(obj: unknown): obj is MemoryBankConfig {
  return (
    typeof obj === 'object' && 
    obj !== null &&
    (
      !('files_to_read' in obj) || Array.isArray(obj.files_to_read)
    ) &&
    (
      !('files_to_update' in obj) || Array.isArray(obj.files_to_update)
    ) &&
    (
      !('templates' in obj) || (
        typeof obj.templates === 'object' &&
        obj.templates !== null
      )
    ) &&
    (
      !('options' in obj) || (
        typeof obj.options === 'object' &&
        obj.options !== null
      )
    )
  );
}

/**
 * Type guard for ValidationResult
 * @param obj Object to check
 * @returns True if the object is a valid ValidationResult
 */
export function isValidationResult(obj: unknown): obj is ValidationResult {
  return (
    typeof obj === 'object' && 
    obj !== null &&
    'valid' in obj &&
    typeof obj.valid === 'boolean' &&
    'missingFiles' in obj &&
    Array.isArray(obj.missingFiles) &&
    'existingFiles' in obj &&
    Array.isArray(obj.existingFiles)
  );
} 