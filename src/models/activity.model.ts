export type Topic = 'disleksi' | 'diskalkuli' | 'disgrafi';
export type GradeLevel = 'ilkokul' | 'ortaokul';

export type SubTopicId =
  | 'phonological-awareness' | 'letter-sound' | 'reading-fluency' | 'reading-comprehension' | 'visual-processing' | 'vocabulary-morphology' | 'spelling-patterns' | 'working-memory-sequencing' // Dyslexia
  | 'number-sense' | 'basic-arithmetic' | 'problem-solving' | 'math-symbols' | 'time-measurement' | 'spatial-reasoning' | 'estimation-skills' | 'fractions-decimals' | 'visual-number-representation' // Dyscalculia
  | 'handwriting-legibility' | 'letter-formation' | 'writing-speed' | 'sentence-construction' | 'punctuation-grammar' | 'fine-motor-skills' | 'writing-planning' | 'creative-writing-prompts' | 'keyboarding-skills'; // Dysgraphia

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

export interface MultipleChoiceData {
  problems: { question: string; options: string[]; correctAnswer: string }[];
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

export interface FillInTheBlanksData {
    problems: {
        prompt: string; // The sentence with a placeholder like '__'
        correctAnswer: string; // The word that fills the blank
    }[];
}

export interface TrueFalseData {
  problems: { 
    statement: string; 
    isCorrect: boolean; // true for 'Doğru', false for 'Yanlış'
  }[];
}

export interface VisualMatchData {
  problems: {
    question: string; // The number or concept to match, e.g., "7"
    options: string[]; // Array of strings, which will be emoji strings, e.g., ["🍎🍎🍎", "🍎🍎🍎🍎🍎", "🍎🍎🍎🍎🍎🍎🍎"]
    correctAnswer: string; // The correct emoji string from the options
  }[];
}

export interface MatchingPairsData {
  column1Title: string;
  column2Title: string;
  pairs: { item1: string; item2: string }[];
}

export interface SequencingEventsData {
  problems: {
    scenario: string;
    events: string[];
    correctOrder: string[];
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
export type MultipleChoiceActivity = BaseActivity<MultipleChoiceData, 'multiple-choice'>;
export type OrderingActivity = BaseActivity<OrderingData, 'ordering'>;
export type DragDropMatchActivity = BaseActivity<DragDropMatchData, 'drag-drop-match'>;
export type FillInTheBlanksActivity = BaseActivity<FillInTheBlanksData, 'fill-in-the-blanks'>;
export type TrueFalseActivity = BaseActivity<TrueFalseData, 'true-false'>;
export type VisualMatchActivity = BaseActivity<VisualMatchData, 'visual-match'>;
export type MatchingPairsActivity = BaseActivity<MatchingPairsData, 'matching-pairs'>;
export type SequencingEventsActivity = BaseActivity<SequencingEventsData, 'sequencing-events'>;


export type Activity = WordScrambleActivity | SimpleMathActivity | SentenceCompletionActivity | MultipleChoiceActivity | OrderingActivity | DragDropMatchActivity | FillInTheBlanksActivity | TrueFalseActivity | VisualMatchActivity | MatchingPairsActivity | SequencingEventsActivity;

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

export function isMultipleChoice(activity: Activity): activity is MultipleChoiceActivity {
    return activity.activityType === 'multiple-choice';
}

export function isOrdering(activity: Activity): activity is OrderingActivity {
    return activity.activityType === 'ordering';
}

export function isDragDropMatch(activity: Activity): activity is DragDropMatchActivity {
    return activity.activityType === 'drag-drop-match';
}

export function isFillInTheBlanks(activity: Activity): activity is FillInTheBlanksActivity {
    return activity.activityType === 'fill-in-the-blanks';
}

export function isTrueFalse(activity: Activity): activity is TrueFalseActivity {
    return activity.activityType === 'true-false';
}

export function isVisualMatch(activity: Activity): activity is VisualMatchActivity {
    return activity.activityType === 'visual-match';
}

export function isMatchingPairs(activity: Activity): activity is MatchingPairsActivity {
    return activity.activityType === 'matching-pairs';
}

export function isSequencingEvents(activity: Activity): activity is SequencingEventsActivity {
    return activity.activityType === 'sequencing-events';
}
