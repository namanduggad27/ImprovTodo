import type { ImprovPrompt } from '../types/todo';

export const IMPROV_PROMPTS: ImprovPrompt[] = [
  {
    id: 'imp-1',
    title: 'The 2-Minute Sprint',
    category: 'quick-win',
    description: 'Pick the smallest annoying task on your list and finish it before a 120-second timer runs out.',
    timeEstimate: '2 mins'
  },
  {
    id: 'imp-2',
    title: 'Reverse Brainstorming',
    category: 'creative',
    description: 'Instead of thinking how to solve a problem, list 3 ways to make it worse. Then flip those ideas into solutions!',
    timeEstimate: '5 mins'
  },
  {
    id: 'imp-3',
    title: 'Yes, And... Action!',
    category: 'mindset',
    description: 'Take your biggest blocker right now. Say "Yes, this is hard, AND I will do the very first 30 seconds of it right now."',
    timeEstimate: '3 mins'
  },
  {
    id: 'imp-4',
    title: 'Change of Scenery',
    category: 'action',
    description: 'Stand up, stretch, and move your workspace (even just to a different chair or standing up) for the next 15 minutes.',
    timeEstimate: '15 mins'
  },
  {
    id: 'imp-5',
    title: 'The Bad Draft Challenge',
    category: 'creative',
    description: 'Give yourself permission to write or create the absolute worst first draft possible in 5 minutes. No editing allowed.',
    timeEstimate: '5 mins'
  },
  {
    id: 'imp-6',
    title: 'Character Swap',
    category: 'mindset',
    description: 'Imagine how your favorite fictional character or mentor would tackle your next todo item. Adopt their attitude!',
    timeEstimate: '5 mins'
  },
  {
    id: 'imp-7',
    title: 'Micro-Reward Loop',
    category: 'quick-win',
    description: 'Decide on a fun 2-minute reward (a favorite song, a snack, a quick game) that you get immediately after finishing your next task.',
    timeEstimate: '2 mins'
  },
  {
    id: 'imp-8',
    title: 'The Headline Test',
    category: 'creative',
    description: 'Write a catchy newspaper headline summarizing what success looks like for your project today.',
    timeEstimate: '3 mins'
  }
];
