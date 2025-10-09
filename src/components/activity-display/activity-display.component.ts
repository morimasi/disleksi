import {
  ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal, WritableSignal
} from '@angular/core';
// FIX: Import InteractiveStoryActivity to resolve type error.
import {
  Activity, MultipleChoiceProblem, isAuditoryDictation, isDragDropMatch, isFillInTheBlanks,
  isFiveWOneHStory, isInteractiveStory, isMatchingPairs, isMultipleChoice, isOrdering,
  isReadingAloudCoach, isSentenceCompletion, isSequencingEvents, isSimpleMath, isSpatialRelations,
  isTrueFalse, isVisualArithmetic, isVisualMatch, isWordExplorer, isWordScramble,
  InteractiveStoryScene, SubTopicId, WordExplorerData, AuditoryDictationData, VisualArithmeticData,
  ReadingAloudData, FiveWOneHStoryData, InteractiveStoryData, MatchingPairsData, OrderingData,
  MultipleChoiceData, SequencingEventsData, SimpleMathData, SpatialRelationsData,
  WordScrambleData, TrueFalseData, FillInTheBlanksData, DragDropMatchData, SentenceCompletionData, Topic, InteractiveStoryActivity
} from '../../models/activity.model';
import { TtsService } from '../../services/tts.service';
import { SpeechRecognitionService } from '../../services/speech-recognition.service';
import { GeminiService } from '../../services/gemini.service';
import { FeedbackSettings } from '../../app.component';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';

type AnswerStatus = 'unanswered' | 'correct' | 'incorrect';

interface ProblemState {
  status: AnswerStatus;
  userAnswer: any;
  feedbackText: string | null;
}

// FIX: This entire component was missing, causing multiple import errors.
// This new implementation provides the core functionality to display and interact with all activity types.
@Component({
  selector: 'app-activity-display',
  standalone: true,
  imports: [SafeHtmlPipe],
  templateUrl: './activity-display.component.html',
  styleUrls: ['./activity-display.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityDisplayComponent {
  activity = input.required<Activity | null>();
  feedbackSettings = input.required<FeedbackSettings>();
  topic = input.required<Topic>();
  subTopicId = input.required<SubTopicId | 'review'>();
  isPracticeSession = input<boolean>(false);
  initialAnswers = input<any[] | null>(null);

  activitySuccess = output<{ subTopicId: SubTopicId | 'review'; successRate: number, correctAnswers: number, totalQuestions: number }>();
  nextActivity = output<void>();
  practiceSessionFinished = output<void>();


  // Injected Services
  ttsService = inject(TtsService);
  speechRecognitionService = inject(SpeechRecognitionService);
  private geminiService = inject(GeminiService);

  // Component State
  problemStates: WritableSignal<ProblemState[]> = signal([]);
  currentProblemIndex = signal(0);
  isCompleted = signal(false);
  showConfetti = signal(false);
  
  // Word Explorer specific state
  wordExplorerDetails = signal<{ definition: string; sentence: string; imageUrl: string; } | null>(null);
  wordExplorerLoading = signal(false);

  // Interactive Story specific state
  currentScene = signal<InteractiveStoryScene | null>(null);
  storyAnswerStatus = signal<AnswerStatus>('unanswered');
  storyUserAnswer = signal('');

  // Type guards for template
  isWordScramble = isWordScramble;
  isSimpleMath = isSimpleMath;
  isSentenceCompletion = isSentenceCompletion;
  isMultipleChoice = isMultipleChoice;
  isOrdering = isOrdering;
  isDragDropMatch = isDragDropMatch;
  isFillInTheBlanks = isFillInTheBlanks;
  isTrueFalse = isTrueFalse;
  isVisualMatch = isVisualMatch;
  isMatchingPairs = isMatchingPairs;
  isSequencingEvents = isSequencingEvents;
  isInteractiveStory = isInteractiveStory;
  isAuditoryDictation = isAuditoryDictation;
  isVisualArithmetic = isVisualArithmetic;
  isWordExplorer = isWordExplorer;
  isFiveWOneHStory = isFiveWOneHStory;
  isSpatialRelations = isSpatialRelations;
  isReadingAloudCoach = isReadingAloudCoach;

  constructor() {
    effect(() => {
      const act = this.activity();
      if (act) {
        this.initializeState(act);
        if (isWordExplorer(act)) {
          this.fetchWordExplorerDetails(act.data.word);
        }
        if (isInteractiveStory(act)) {
            this.currentScene.set(act.data.scenes.find(s => s.id === act.data.startSceneId) ?? null);
        }
      }
    }, { allowSignalWrites: true });
  }

  private initializeState(activity: Activity): void {
    this.isCompleted.set(false);
    this.showConfetti.set(false);
    this.currentProblemIndex.set(0);
    let problemCount = 0;

    if (isInteractiveStory(activity) || isWordExplorer(activity) || isSentenceCompletion(activity)) {
        problemCount = 1; 
    } else if (isReadingAloudCoach(activity)) {
        problemCount = activity.data.paragraphs.length;
    } else if (isFiveWOneHStory(activity)) {
        problemCount = activity.data.comprehensionQuestions.length;
    } else if ('data' in activity && 'problems' in activity.data && Array.isArray(activity.data.problems)) {
        problemCount = activity.data.problems.length;
    } else if (isWordScramble(activity)) {
        problemCount = activity.data.words.length;
    }

    this.problemStates.set(Array(problemCount).fill(0).map((_, i) => ({
      status: 'unanswered',
      userAnswer: this.initialAnswers() ? this.initialAnswers()![i] : null,
      feedbackText: null
    })));
  }

  private async fetchWordExplorerDetails(word: string) {
    this.wordExplorerLoading.set(true);
    try {
        const details = await this.geminiService.getWordExplorerDetails(word);
        const imageUrl = await this.geminiService.generateImageFromPrompt(details.imagePrompt);
        this.wordExplorerDetails.set({ ...details, imageUrl });
    } catch (error) {
        console.error("Failed to fetch word explorer details", error);
    } finally {
        this.wordExplorerLoading.set(false);
    }
  }

  // --- Computed Signals for Template ---
  totalProblems = computed(() => this.problemStates().length);
  correctAnswersCount = computed(() => this.problemStates().filter(p => p.status === 'correct').length);
  progressPercentage = computed(() => {
    const total = this.totalProblems();
    if (total === 0) return 0;
    const completed = this.problemStates().filter(p => p.status !== 'unanswered').length;
    return (completed / total) * 100;
  });

  currentProblem = computed(() => {
    const act = this.activity();
    if (!act || this.isCompleted()) return null;

    if (isInteractiveStory(act) || isWordExplorer(act)) {
        return act.data;
    }
    
    const index = this.currentProblemIndex();
    
    if (isReadingAloudCoach(act)) {
        return act.data.paragraphs[index];
    }
    if (isFiveWOneHStory(act)) {
        return act.data.comprehensionQuestions[index];
    }
    if ('data' in act && 'problems' in act.data && Array.isArray(act.data.problems)) {
        return act.data.problems[index];
    }
    if (isWordScramble(act)) {
        return act.data.words[index];
    }
    return null;
  });

  currentProblemState = computed(() => this.problemStates()[this.currentProblemIndex()]);

  // --- Event Handlers ---
  handleAnswer(answer: any): void {
    const act = this.activity();
    if (!act || this.isCompleted() || this.currentProblemState().status !== 'unanswered') return;

    let isCorrect = false;
    let correctAnswer: any = null;
    const currentProblem = this.currentProblem();
    
    if(!currentProblem) return;

    if (isSimpleMath(act) || isFillInTheBlanks(act) || isAuditoryDictation(act) || isVisualArithmetic(act) || isWordScramble(act) || isFiveWOneHStory(act)) {
      correctAnswer = 'correct' in currentProblem ? currentProblem.correct : (currentProblem as any).answer || (currentProblem as any).correctAnswer || (currentProblem as any).wordToSpeak;
      isCorrect = (answer as string).trim().toLowerCase() === correctAnswer.toLowerCase();
    } else if (isTrueFalse(act)) {
        correctAnswer = (currentProblem as any).isCorrect;
        isCorrect = answer === correctAnswer;
    } else if (isMultipleChoice(act) || isVisualMatch(act) || isSpatialRelations(act) || isDragDropMatch(act)) {
        correctAnswer = (currentProblem as any).correctAnswer;
        isCorrect = answer === correctAnswer;
    } else {
        // For activity types without a single correct answer
        isCorrect = true;
    }
    
    const status: AnswerStatus = isCorrect ? 'correct' : 'incorrect';
    const feedbackText = this.feedbackSettings().enabled
      ? (isCorrect ? 'Harika! Doğru cevap.' : `Doğru değil. Doğru cevap: ${correctAnswer}`)
      : null;

    this.problemStates.update(states => {
      states[this.currentProblemIndex()] = { status, userAnswer: answer, feedbackText };
      return [...states];
    });

    if (this.feedbackSettings().duration !== 'continuous') {
      setTimeout(() => this.nextProblem(), this.feedbackSettings().duration === 5 ? 5000 : 10000);
    }
  }

  nextProblem(): void {
    if (this.currentProblemIndex() < this.totalProblems() - 1) {
      this.currentProblemIndex.update(i => i + 1);
    } else {
      this.finishActivity();
    }
  }

  finishActivity(): void {
    this.isCompleted.set(true);
    const successRate = this.totalProblems() > 0 ? this.correctAnswersCount() / this.totalProblems() : 0;
    
    if (successRate === 1) {
      this.showConfetti.set(true);
      setTimeout(() => this.showConfetti.set(false), 5000); // Confetti lasts 5 seconds
    }

    this.activitySuccess.emit({
        subTopicId: this.subTopicId(),
        successRate,
        correctAnswers: this.correctAnswersCount(),
        totalQuestions: this.totalProblems()
    });
  }

  handleStoryChoice(nextSceneId: string): void {
      const act = this.activity() as InteractiveStoryActivity;
      if(!act) return;

      const microActivity = this.currentScene()?.microActivity;
      if(microActivity && this.storyAnswerStatus() !== 'correct'){
        let isCorrect = false;
        const microData = microActivity.data as any;
        if(isSimpleMath(microActivity)){
            isCorrect = this.storyUserAnswer().trim().toLowerCase() === microData.problems[0].answer.toLowerCase();
        } else if (isWordScramble(microActivity)) {
             isCorrect = this.storyUserAnswer().trim().toLowerCase() === (microData.words[0].correct as string).toLowerCase();
        } else if (isFillInTheBlanks(microActivity)) {
             isCorrect = this.storyUserAnswer().trim().toLowerCase() === microData.problems[0].correctAnswer.toLowerCase();
        }
        
        if (isCorrect) {
            this.storyAnswerStatus.set('correct');
            setTimeout(() => { // a little delay to show success
                this.currentScene.set(act.data.scenes.find(s => s.id === nextSceneId) ?? null);
                this.storyAnswerStatus.set('unanswered');
                this.storyUserAnswer.set('');
            }, 1000);
        } else {
            this.storyAnswerStatus.set('incorrect');
        }
        return;
      }

      this.currentScene.set(act.data.scenes.find(s => s.id === nextSceneId) ?? null);
  }

  handleRestartOrNext(): void {
      if(this.isPracticeSession()) {
          this.practiceSessionFinished.emit();
      } else {
          this.nextActivity.emit();
      }
  }
  
  restartActivity(): void {
    this.initializeState(this.activity()!);
  }

  speak(text: string): void {
    this.ttsService.speak(text);
  }
}
