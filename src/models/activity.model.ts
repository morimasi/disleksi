export type Topic = 'disleksi' | 'diskalkuli' | 'disgrafi';
export type GradeLevel = 'ilkokul' | 'ortaokul';

export type SubTopicId =
  | 'phonological-awareness' | 'letter-sound' | 'reading-fluency' | 'reading-comprehension' | 'visual-processing' | 'vocabulary-morphology' | 'spelling-patterns' | 'working-memory-sequencing' // Dyslexia
  | 'number-sense' | 'basic-arithmetic' | 'problem-solving' | 'math-symbols' | 'time-measurement' | 'spatial-reasoning' | 'estimation-skills' | 'fractions-decimals' | 'visual-number-representation' // Dyscalculia
  | 'handwriting-legibility' | 'letter-formation' | 'writing-speed' | 'sentence-construction' | 'punctuation-grammar' | 'fine-motor-skills' | 'writing-planning' | 'creative-writing-prompts' | 'keyboarding-skills' | 'letter-form-recognition' // Dysgraphia
  | 'interactive-story' // New dynamic activity type
  | 'auditory-dictation' // New for Dyslexia
  | 'visual-arithmetic' // New for Dyscalculia
  | 'word-explorer'; // New for Dyslexia

export interface SubTopic {
    id: SubTopicId | 'review'; // 'review' is a virtual ID for review sessions
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

export interface MultipleChoiceProblem { question: string; options: string[]; correctAnswer: string; }
export interface MultipleChoiceData {
  problems: MultipleChoiceProblem[];
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

// --- New Multisensory Activity Models ---
export interface AuditoryDictationData {
  problems: {
    wordToSpeak: string; // The word TTS will say and the user must type.
  }[];
}

export interface VisualArithmeticData {
    problems: {
        visualQuestion: string; // The problem shown with emojis, e.g., "🍎🍎 + 🍎🍎🍎"
        answer: string; // The numerical answer, e.g., "5"
    }[];
}


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
    scenes: Record<string, InteractiveStoryScene>; // A map of scene IDs to scene objects
}

// --- Word Explorer Model ---
export interface WordExplorerData {
  word: string;
}

// --- 5N1K Story Model ---
export interface FiveWOneHStoryData {
  story: string;
  comprehensionQuestions: { question: string; answer: string }[];
  inferenceQuestions: { question: string }[];
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
export type InteractiveStoryActivity = BaseActivity<InteractiveStoryData, 'interactive-story'>;
export type AuditoryDictationActivity = BaseActivity<AuditoryDictationData, 'auditory-dictation'>;
export type VisualArithmeticActivity = BaseActivity<VisualArithmeticData, 'visual-arithmetic'>;
export type WordExplorerActivity = BaseActivity<WordExplorerData, 'word-explorer'>;
export type FiveWOneHStoryActivity = BaseActivity<FiveWOneHStoryData, 'five-w-one-h-story'>;


export type Activity = WordScrambleActivity | SimpleMathActivity | SentenceCompletionActivity | MultipleChoiceActivity | OrderingActivity | DragDropMatchActivity | FillInTheBlanksActivity | TrueFalseActivity | VisualMatchActivity | MatchingPairsActivity | SequencingEventsActivity | InteractiveStoryActivity | AuditoryDictationActivity | VisualArithmeticActivity | WordExplorerActivity | FiveWOneHStoryActivity;

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

export function isInteractiveStory(activity: Activity): activity is InteractiveStoryActivity {
    return activity.activityType === 'interactive-story';
}

export function isAuditoryDictation(activity: Activity): activity is AuditoryDictationActivity {
    return activity.activityType === 'auditory-dictation';
}

export function isVisualArithmetic(activity: Activity): activity is VisualArithmeticActivity {
    return activity.activityType === 'visual-arithmetic';
}

export function isWordExplorer(activity: Activity): activity is WordExplorerActivity {
    return activity.activityType === 'word-explorer';
}

export function isFiveWOneHStory(activity: Activity): activity is FiveWOneHStoryActivity {
    return activity.activityType === 'five-w-one-h-story';
}
