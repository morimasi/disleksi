export type Topic = 'disleksi' | 'diskalkuli' | 'disgrafi';
export type GradeLevel = 'ilkokul' | 'ortaokul';

export type SubTopicId =
  | 'phonological-awareness' | 'letter-sound' | 'reading-fluency' | 'reading-comprehension' | 'visual-processing' // Dyslexia
  | 'number-sense' | 'basic-arithmetic' | 'problem-solving' | 'math-symbols' | 'time-measurement' // Dyscalculia
  | 'handwriting-legibility' | 'letter-formation' | 'writing-speed' | 'sentence-construction' | 'punctuation-grammar'; // Dysgraphia

export interface SubTopic {
    id: SubTopicId;
    title: string;
    description: string;
}

export interface WordScrambleData {
  words: { scrambled: string; correct: string }[];
}

export interface SimpleMathData {
  problems: { question: string; answer: string }[];
}

export interface SentenceCompletionData {
  prompts: string[];
}

export interface VisualMatchData {
  problems: { targetWord: string; options: string[] }[];
}

export interface OrderingData {
  problems: {
    question: string;
    items: string[]; // The items to be ordered, in a jumbled state
    correctOrder: string[]; // The items in the correct order
  }[];
}

export interface DragDropMatchData {
  problems: {
    prompt: string; // The question or sentence with a placeholder like '__'
    options: string[]; // The draggable options
    correctAnswer: string; // The correct option to be dropped
  }[];
}


interface BaseActivity<T, U extends string> {
  title: string;
  instructions: string;
  activityType: U;
  hint?: string;
  data: T;
}

export type WordScrambleActivity = BaseActivity<WordScrambleData, 'word-scramble'>;
export type SimpleMathActivity = BaseActivity<SimpleMathData, 'simple-math'>;
export type SentenceCompletionActivity = BaseActivity<SentenceCompletionData, 'sentence-completion'>;
export type VisualMatchActivity = BaseActivity<VisualMatchData, 'visual-match'>;
export type OrderingActivity = BaseActivity<OrderingData, 'ordering'>;
export type DragDropMatchActivity = BaseActivity<DragDropMatchData, 'drag-drop-match'>;


export type Activity = WordScrambleActivity | SimpleMathActivity | SentenceCompletionActivity | VisualMatchActivity | OrderingActivity | DragDropMatchActivity;

// Type guards to help TypeScript understand which activity type is being used.
export function isWordScramble(activity: Activity): activity is WordScrambleActivity {
    return activity.activityType === 'word-scramble';
}

export function isSimpleMath(activity: Activity): activity is SimpleMathActivity {
    return activity.activityType === 'simple-math';
}

export function isSentenceCompletion(activity: Activity): activity is SentenceCompletionActivity {
    return activity.activityType === 'sentence-completion';
}

export function isVisualMatch(activity: Activity): activity is VisualMatchActivity {
    return activity.activityType === 'visual-match';
}

export function isOrdering(activity: Activity): activity is OrderingActivity {
    return activity.activityType === 'ordering';
}

export function isDragDropMatch(activity: Activity): activity is DragDropMatchActivity {
    return activity.activityType === 'drag-drop-match';
}
