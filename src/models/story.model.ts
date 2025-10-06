// Import only the TYPE of Activity to prevent circular dependencies
import type { Activity } from './activity.model';

// --- Interactive Story Models ---
export interface InteractiveStoryChoice {
  text: string;
  nextSceneId: string;
}

export interface InteractiveStoryScene {
  id: string;
  text: string;
  choices: InteractiveStoryChoice[];
  // An embedded activity that must be completed to proceed.
  // It's a full Activity object, but should only contain ONE problem.
  microActivity?: Activity;
}

export interface InteractiveStoryData {
    startSceneId: string;
    scenes: InteractiveStoryScene[]; // An array of scene objects
}

// --- 5N1K Story Model ---
export interface FiveWOneHStoryData {
  story: string;
  imageUrl?: string;
  comprehensionQuestions: { question: string; answer: string; hint?: string }[];
  inferenceQuestions: { question: string }[];
}
