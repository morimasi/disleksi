import {
  Activity,
  WordScrambleActivity,
  SimpleMathActivity,
  SentenceCompletionActivity,
  MultipleChoiceActivity,
  OrderingActivity,
  DragDropMatchActivity,
  FillInTheBlanksActivity,
  TrueFalseActivity,
  VisualMatchActivity,
  MatchingPairsActivity,
  SequencingEventsActivity,
  InteractiveStoryActivity,
  AuditoryDictationActivity,
  VisualArithmeticActivity,
  WordExplorerActivity,
  FiveWOneHStoryActivity,
  SpatialRelationsActivity,
  ReadingAloudActivity,
  PictureSequencingActivity,
} from './activity.model';

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

export function isSpatialRelations(activity: Activity): activity is SpatialRelationsActivity {
    return activity.activityType === 'spatial-relations';
}

export function isReadingAloudCoach(activity: Activity): activity is ReadingAloudActivity {
    return activity.activityType === 'reading-aloud-coach';
}

export function isPictureSequencingStoryteller(activity: Activity): activity is PictureSequencingActivity {
    return activity.activityType === 'picture-sequencing-storyteller';
}