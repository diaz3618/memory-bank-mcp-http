import { ProgressTracker } from '../../core/ProgressTracker.js';

/**
 * Definition of Memory Bank context tools
 */
export const contextTools = [
  {
    name: 'update_active_context',
    description: 'Update the active context file',
    inputSchema: {
      type: 'object',
      properties: {
        tasks: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'List of ongoing tasks',
        },
        issues: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'List of known issues',
        },
        nextSteps: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'List of next steps',
        },
      },
    },
  },
];

/**
 * Processes the update_active_context tool
 * @param progressTracker ProgressTracker
 * @param context Context to be updated
 * @returns Operation result
 */
export async function handleUpdateActiveContext(
  progressTracker: ProgressTracker,
  context: {
    tasks?: string[];
    issues?: string[];
    nextSteps?: string[];
  }
) {
  try {
    await progressTracker.updateActiveContext(context);

    return {
      content: [
        {
          type: 'text',
          text: 'Active context updated successfully',
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error updating active context: ${error}`,
        },
      ],
      isError: true,
    };
  }
}