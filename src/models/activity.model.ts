import { FiveWOneHStoryData, InteractiveStoryData } from './story.model';
export * from './story.model';
export * from './activity.typeguards';

export type Topic = 'disleksi' | 'diskalkuli' | 'disgrafi' | 'mekansal-farkindalik';
export type GradeLevel = 'ilkokul' | 'ortaokul';

export type SubTopicId =
  | 'phonological-awareness' | 'letter-sound' | 'reading-aloud-coach' | 'reading-comprehension' | 'visual-processing' | 'vocabulary-morphology' | 'spelling-patterns' | 'working-memory-sequencing' // Dyslexia
  | 'number-sense' | 'basic-arithmetic' | 'problem-solving' | 'math-symbols' | 'time-measurement' | 'spatial-reasoning' | 'estimation-skills' | 'fractions-decimals' | 'visual-number-representation' | 'number-grouping-practice' // Dyscalculia
  | 'handwriting-legibility' | 'letter-formation' | 'writing-speed' | 'sentence-construction' | 'punctuation-grammar' | 'fine-motor-skills' | 'writing-planning' | 'creative-writing-prompts' | 'keyboarding-skills' | 'letter-form-recognition' | 'picture-sequencing-storyteller' // Dysgraphia
  | 'interactive-story' // New dynamic activity type
  | 'auditory-dictation' // New for Dyslexia
  | 'visual-arithmetic' // New for Dyscalculia
  | 'word-explorer' // New for Dyslexia
  // New Spatial Relations SubTopics
  | 'spatial-relations-positional' 
  | 'spatial-relations-directional' 
  | 'spatial-relations-visual-discrimination';

export interface SubTopic {
    id: SubTopicId | 'review'; // 'review' is a virtual ID for review sessions
    title: string;
    description: string;
    pedagogicalGoal: string;
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

// --- Word Explorer Model ---
export interface WordExplorerData {
  word: string;
}

// --- New Spatial Relations Model ---
export interface SpatialRelationsProblem {
    imagePrompt: string; // The prompt used to generate the image
    imageUrl: string; // The base64 data URL of the generated image
    question: string;
    options: string[];
    correctAnswer: string;
}

export interface SpatialRelationsData {
    problems: SpatialRelationsProblem[];
}

// --- New Reading Aloud Coach Model ---
export interface ReadingAloudData {
  paragraphs: string[];
}

// --- New Picture Sequencing Model ---
export interface PictureSequencingProblem {
  storyTitle: string;
  // Gemini provides these
  imagePrompts: string[];
  // Service generates these
  images: { id: number; url: string }[]; // Shuffled list of images
  correctOrder: number[]; // Sequence of original IDs
}
export interface PictureSequencingData {
  problems: PictureSequencingProblem[];
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
export type SpatialRelationsActivity = BaseActivity<SpatialRelationsData, 'spatial-relations'>;
export type ReadingAloudActivity = BaseActivity<ReadingAloudData, 'reading-aloud-coach'>;
export type PictureSequencingActivity = BaseActivity<PictureSequencingData, 'picture-sequencing-storyteller'>;


export type Activity = WordScrambleActivity | SimpleMathActivity | SentenceCompletionActivity | MultipleChoiceActivity | OrderingActivity | DragDropMatchActivity | FillInTheBlanksActivity | TrueFalseActivity | VisualMatchActivity | MatchingPairsActivity | SequencingEventsActivity | InteractiveStoryActivity | AuditoryDictationActivity | VisualArithmeticActivity | WordExplorerActivity | FiveWOneHStoryActivity | SpatialRelationsActivity | ReadingAloudActivity | PictureSequencingActivity;