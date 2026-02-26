import path from 'path';
import { FileUtils } from './FileUtils.js';

/**
 * Utility class for migrating Memory Bank files
 */
export class MigrationUtils {
  /**
   * Migrates Memory Bank files from camelCase to kebab-case naming convention
   * 
   * @param memoryBankDir - Path to the Memory Bank directory
   * @returns Object with migration results
   */
  static async migrateFileNamingConvention(memoryBankDir: string): Promise<{
    success: boolean;
    migratedFiles: string[];
    errors: string[];
  }> {
    const result = {
      success: true,
      migratedFiles: [] as string[],
      errors: [] as string[],
    };

    // File mapping from old to new naming convention
    const fileMapping = [
      { oldName: 'productContext.md', newName: 'product-context.md' },
      { oldName: 'activeContext.md', newName: 'active-context.md' },
      { oldName: 'decisionLog.md', newName: 'decision-log.md' },
      { oldName: 'systemPatterns.md', newName: 'system-patterns.md' },
    ];

    // Check if directory exists
    if (!(await FileUtils.fileExists(memoryBankDir)) || !(await FileUtils.isDirectory(memoryBankDir))) {
      result.success = false;
      result.errors.push(`Memory Bank directory not found: ${memoryBankDir}`);
      return result;
    }

    // Process each file
    for (const mapping of fileMapping) {
      const oldPath = path.join(memoryBankDir, mapping.oldName);
      const newPath = path.join(memoryBankDir, mapping.newName);

      try {
        // Check if old file exists
        if (await FileUtils.fileExists(oldPath)) {
          // Check if new file already exists
          if (await FileUtils.fileExists(newPath)) {
            result.errors.push(`Target file already exists: ${mapping.newName}`);
            continue;
          }

          // Read content from old file
          const content = await FileUtils.readFile(oldPath);
          
          // Write content to new file
          await FileUtils.writeFile(newPath, content);
          
          // Delete old file
          await FileUtils.deleteFile(oldPath);
          
          result.migratedFiles.push(mapping.oldName);
        }
      } catch (error) {
        result.success = false;
        result.errors.push(`Error migrating ${mapping.oldName}: ${error}`);
      }
    }

    return result;
  }
} 