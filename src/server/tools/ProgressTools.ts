import { ProgressTracker } from '../../core/ProgressTracker.js';

/**
 * Definition of Memory Bank progress tools
 */
export const progressTools = [
  {
    name: 'track_progress',
    description: 'Track progress and update Memory Bank files',
    inputSchema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          description: "Action performed (e.g., 'Implemented feature', 'Fixed bug')",
        },
        description: {
          type: 'string',
          description: 'Detailed description of the progress',
        },
        updateActiveContext: {
          type: 'boolean',
          description: 'Whether to update the active context file',
          default: true,
        },
      },
      required: ['action', 'description'],
    },
  },
];

/**
 * Processes the track_progress tool
 * @param progressTracker ProgressTracker
 * @param action Action performed
 * @param description Description of the action
 * @returns Operation result
 */
export async function handleTrackProgress(
  progressTracker: ProgressTracker,
  action: string,
  description: string
) {
  await progressTracker.trackProgress(action, { description });
  return {
    content: [
      {
        type: 'text',
        text: `Progress tracked: ${action} - ${description}`,
      },
    ],
  };
}