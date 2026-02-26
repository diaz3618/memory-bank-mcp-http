import { ProgressTracker } from '../../core/ProgressTracker.js';

/**
 * Definition of Memory Bank decision tools
 */
export const decisionTools = [
  {
    name: 'log_decision',
    description: 'Log a decision in the decision log',
    inputSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Decision title',
        },
        context: {
          type: 'string',
          description: 'Decision context',
        },
        decision: {
          type: 'string',
          description: 'The decision made',
        },
        alternatives: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Alternatives considered',
        },
        consequences: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Consequences of the decision',
        },
      },
      required: ['title', 'context', 'decision'],
    },
  },
];

/**
 * Processes the log_decision tool
 * @param progressTracker ProgressTracker
 * @param decision Decision to be logged
 * @returns Operation result
 */
export async function handleLogDecision(
  progressTracker: ProgressTracker,
  decision: {
    title: string;
    context: string;
    decision: string;
    alternatives?: string[] | string;
    consequences?: string[] | string;
  }
) {
  try {
    await progressTracker.logDecision(decision);

    // Also track this as progress
    await progressTracker.trackProgress('Decision Made', {
      description: decision.title,
    });

    return {
      content: [
        {
          type: 'text',
          text: `Decision logged: ${decision.title}`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error logging decision: ${error}`,
        },
      ],
      isError: true,
    };
  }
}