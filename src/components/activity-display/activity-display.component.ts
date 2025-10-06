import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal, WritableSignal, OnDestroy, effect } from '@angular/core';
import { Activity, isSentenceCompletion, isSimpleMath, isWordScramble, isMultipleChoice, Topic, isOrdering, isDragDropMatch, DragDropMatchActivity, isFillInTheBlanks, isTrueFalse, FillInTheBlanksActivity, isVisualMatch, isMatchingPairs, isSequencingEvents, isInteractiveStory, InteractiveStoryActivity, InteractiveStoryChoice, isAuditoryDictation, isVisualArithmetic, SubTopicId, isFiveWOneHStory, FiveWOneHStoryData, FiveWOneHStoryActivity, isWordExplorer, MultipleChoiceProblem, isSpatialRelations, isReadingAloudCoach } from '../../models/activity.model';
import { TtsService } from '../../services/tts.service';
import { GeminiService } from '../../services/gemini.service';
import { FeedbackSettings } from '../../app.component';
import { SpeechRecognitionService } from '../../services/speech-recognition.service';
import { SafeHtml } from '@angular/platform-browser';

type AnswerStatus = 'correct' | 'incorrect' | 'unchecked';

@Component({
  selector: 'app-activity-display',
  templateUrl: './activity-display.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityDisplayComponent implements OnDestroy {
  showHint = signal(false);
  private hintTimeoutId: any = null;
  private ttsService = inject(TtsService);
  private geminiService = inject(GeminiService);
  speechService = inject(SpeechRecognitionService);

  activity = input.required<Activity>();
  displayActivity: WritableSignal<Activity | null> = signal(null);
  isRegeneratingImage = signal(false);

  topic = input.required<Topic>();
  subTopicId = input.required<SubTopicId | 'review'>();
  initialAnswers = input<any[] | null>(null);
  feedbackSettings = input.required<FeedbackSettings>();
  isPracticeSession = input<boolean>(false);
  
  sttTargetIndex = signal<number | null>(null);

  constructor() {
    effect(() => {
      const value = this.activity();
      this.displayActivity.set(value);
      this.initializeState(value);
      
      clearTimeout(this.hintTimeoutId);
      if (value.hint) {
        this.showHint.set(true);
        this.hintTimeoutId = setTimeout(() => {
          this.showHint.set(false);
        }, 7000);
      } else {
        this.showHint.set(false);
      }

      if (isWordExplorer(value)) {
          this.fetchWordDetails(value.data.word);
      }
    });

    effect(() => {
      const transcript = this.speechService.transcript();
      const targetIndex = this.sttTargetIndex();
      const activity = this.displayActivity();

      if (transcript && activity && isReadingAloudCoach(activity)) {
          this.checkReadingFluency();
          this.sttTargetIndex.set(null); // Reset after use
          return;
      }

      if (transcript && targetIndex !== null) {
        this.userAnswers.update(answers => {
          const newAnswers = [...answers];
          newAnswers[targetIndex] = transcript;
          return newAnswers;
        });
         this.answersChanged.emit(this.userAnswers());
        this.sttTargetIndex.set(null); // Reset after use
      }
    });
  }

  answersChanged = output<any[]>();
  nextActivity = output<void>();
  practiceSessionFinished = output<void>();
  activitySuccess = output<{ subTopicId: SubTopicId | 'review'; successRate: number, correctAnswers: number, totalQuestions: number }>();

  userAnswers: WritableSignal<(string | string[] | null)[]> = signal([]);
  answerStatuses: WritableSignal<AnswerStatus[]> = signal([]);
  showFeedback = signal(false);
  score = signal<string | null>(null);
  private feedbackTimeoutId: any = null;

  dynamicHints = signal<Record<number, string | null>>({});
  isHintLoading = signal<Record<number, boolean>>({});
  
  // --- AI Tutor State ---
  aiTutorFeedback = signal<Record<number, string | null>>({});
  isTutorLoading = signal<Record<number, boolean>>({});
  
  draggedOverIndex = signal<number | null>(null);

  selectedItem1Index = signal<number | null>(null);
  shuffledColumn2Items = signal<string[]>([]);

  showSuccessModal = signal(false);
  successSticker = signal<string>('');
  showConfetti = signal(false);
  showSuccessActions = signal(false);
  confettiPieces = signal<{left: string, animDelay: string, animDuration: string, color: string}[]>([]);
  
  history: WritableSignal<Record<number, string[]>> = signal({});
  historyIndex: WritableSignal<Record<number, number>> = signal({});

  // --- Interactive Story State ---
  currentSceneId = signal<string | null>(null);
  isMicroActivitySolved = signal(false);
  microActivityAnswer = signal<string | string[] | null>(null);
  microActivityStatus = signal<AnswerStatus>('unchecked');
  
  // --- 5N1K Story State ---
  currentStep = signal(0); // 0 for story, 1+ for questions
  allQuestions = signal<{ question: string; answer?: string; hint?: string }[]>([]);
  totalSteps = signal(0);
  comprehensionFeedback = signal<Record<number, { isCorrect: boolean; feedback: string; } | null>>({});
  inferenceFeedback = signal<Record<number, string | null>>({});
  isCheckingAnswer = signal(false);

  // --- Reading Aloud Coach State ---
  currentParagraphIndex = signal(0);
  readingFeedback = signal<Record<number, { feedback: string; incorrectWords: string[] } | null>>({});
  isCheckingReading = signal(false);

  // --- Word Explorer State ---
  wordExplorerState = signal({
    definition: '',
    sentences: [] as string[],
    synonym: '',
    imageBase64: '',
    comprehensionQuestion: null as MultipleChoiceProblem | null,
    loading: {
        definition: false,
        sentences: false,
        synonym: false,
        image: false,
        question: false,
    },
    comprehensionAnswer: '',
    comprehensionStatus: 'unchecked' as AnswerStatus
  });

  currentScene = computed(() => {
    const activity = this.displayActivity();
    const sceneId = this.currentSceneId();
    if (activity && isInteractiveStory(activity) && sceneId) {
        return activity.data.scenes.find(s => s.id === sceneId) || null;
    }
    return null;
  });

  canUndo(index: number): boolean {
    return (this.historyIndex()[index] ?? 0) > 0;
  }
  
  canRedo(index: number): boolean {
    const hist = this.history()[index];
    const idx = this.historyIndex()[index];
    return hist != null && idx < hist.length - 1;
  }

  private stickers = ['🌟', '🏆', '🎉', '👍', '🚀', '🧠', '💡', '✅', '🎯', '🥇'];

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
  isFiveWOneHStory = isFiveWOneHStory;
  isWordExplorer = isWordExplorer;
  isSpatialRelations = isSpatialRelations;
  isReadingAloudCoach = isReadingAloudCoach;

  topicColors = computed(() => {
    const topicName = this.topic();
    
    if (topicName === 'mekansal-farkindalik') {
        return {
            border: 'border-pink-400',
            progress: 'bg-pink-500',
            accentText: 'text-pink-500',
            hoverAccentText: 'hover:text-pink-600',
            questionNumberBg: 'bg-pink-100',
            questionNumberText: 'text-pink-700'
        };
    }

    const baseClasses = {
        border: `border-[rgb(var(--c-topic-${topicName}-400))]`,
        progress: `bg-[rgb(var(--c-topic-${topicName}-500))]`,
        accentText: `text-[rgb(var(--c-topic-${topicName}-500))]`,
        hoverAccentText: `hover:text-[rgb(var(--c-topic-${topicName}-600))]`,
        questionNumberBg: `bg-[rgb(var(--c-topic-${topicName}-100))]`,
        questionNumberText: `text-[rgb(var(--c-topic-${topicName}-700))]`
    };

    switch (this.topic()) {
        case 'disleksi': return {
             ...baseClasses,
             accentText: `text-[rgb(var(--c-accent-700))]`,
             hoverAccentText: `hover:text-[rgb(var(--c-accent-600))]`
        };
        case 'diskalkuli': return baseClasses;
        case 'disgrafi': return baseClasses;
        default: return {
            border: 'border-gray-300',
            progress: 'bg-gray-500',
            accentText: 'text-gray-700',
            hoverAccentText: 'hover:text-gray-600',
            questionNumberBg: 'bg-gray-100',
            questionNumberText: 'text-gray-700'
        };
    }
  });

  progress = computed(() => {
    const currentActivity = this.displayActivity();
    if (!currentActivity) {
      return { percentage: 0, completed: 0, total: 0 };
    }

    if (isInteractiveStory(currentActivity) || isWordExplorer(currentActivity)) {
        return { percentage: 100, completed: 1, total: 1 };
    }
    
    if(isReadingAloudCoach(currentActivity)) {
        const total = currentActivity.data.paragraphs.length;
        const completed = this.currentParagraphIndex();
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { percentage, completed, total };
    }

    if(isFiveWOneHStory(currentActivity)) {
        const step = this.currentStep();
        const total = this.totalSteps();
        if (total === 0) return { percentage: 0, completed: 0, total: 0 };
        const percentage = Math.round((step / total) * 100);
        return { percentage, completed: step, total };
    }

    const answers = this.userAnswers();
    if (!answers) {
      return { percentage: 0, completed: 0, total: 0 };
    }

    const answeredCount = answers.filter(answer => {
      if (Array.isArray(answer)) {
        return answer.length > 0;
      }
      return answer !== null && typeof answer === 'string' && answer.trim() !== '';
    }).length;

    let totalCount = 0;

    if (isWordScramble(currentActivity)) {
      totalCount = currentActivity.data.words.length;
    } else if (isSimpleMath(currentActivity) || isDragDropMatch(currentActivity) || isMultipleChoice(currentActivity) || isOrdering(currentActivity) || isFillInTheBlanks(currentActivity) || isTrueFalse(currentActivity) || isVisualMatch(currentActivity) || isSequencingEvents(currentActivity) || isAuditoryDictation(currentActivity) || isVisualArithmetic(currentActivity) || isSpatialRelations(currentActivity)) {
      totalCount = currentActivity.data.problems.length;
    } else if (isMatchingPairs(currentActivity)) {
        totalCount = currentActivity.data.pairs.length;
    } else if (isSentenceCompletion(currentActivity)) {
      totalCount = currentActivity.data.prompts.length;
    }

    if (totalCount === 0) {
      return { percentage: 0, completed: 0, total: 0 };
    }

    const percentage = Math.round((answeredCount / totalCount) * 100);
    return { percentage, completed: answeredCount, total: totalCount };
  });

  ngOnDestroy(): void {
    clearTimeout(this.hintTimeoutId);
    clearTimeout(this.feedbackTimeoutId);
    this.speechService.stop();
  }

  private initializeState(activity: Activity): void {
    // Reset general state
    this.showFeedback.set(false);
    this.score.set(null);
    this.dynamicHints.set({});
    this.isHintLoading.set({});
    this.aiTutorFeedback.set({});
    this.isTutorLoading.set({});
    
    // Reset story state
    this.currentSceneId.set(null);
    this.microActivityAnswer.set(null);
    this.microActivityStatus.set('unchecked');
    this.isMicroActivitySolved.set(false);
    
    // Reset 5N1K state
    this.currentStep.set(0);
    this.allQuestions.set([]);
    this.totalSteps.set(0);
    this.comprehensionFeedback.set({});
    this.inferenceFeedback.set({});
    this.isCheckingAnswer.set(false);

    // Reset Reading Aloud Coach state
    this.currentParagraphIndex.set(0);
    this.readingFeedback.set({});
    this.isCheckingReading.set(false);

    // Reset Word Explorer state
    this.wordExplorerState.set({
      definition: '', sentences: [], synonym: '', imageBase64: '', comprehensionQuestion: null,
      loading: { definition: false, sentences: false, synonym: false, image: false, question: false },
      comprehensionAnswer: '', comprehensionStatus: 'unchecked'
    });

    if (isInteractiveStory(activity) || isWordExplorer(activity) || isReadingAloudCoach(activity)) {
        this.currentSceneId.set(isInteractiveStory(activity) ? activity.data.startSceneId : null);
        this.userAnswers.set([]);
        this.answerStatuses.set([]);
        return;
    }
    
    if (isFiveWOneHStory(activity)) {
        const questions = [
            ...activity.data.comprehensionQuestions,
            ...activity.data.inferenceQuestions
        ];
        this.allQuestions.set(questions);
        this.totalSteps.set(questions.length + 1); // +1 for the story itself
        this.userAnswers.set(Array(questions.length).fill(''));
        this.answerStatuses.set(Array(questions.length).fill('unchecked'));
        this.currentStep.set(0);
        return;
    }

    let size = 0;
    if (isWordScramble(activity)) {
      size = activity.data.words.length;
    } else if (isSimpleMath(activity) || isDragDropMatch(activity) || isMultipleChoice(activity) || isOrdering(activity) || isFillInTheBlanks(activity) || isTrueFalse(activity) || isVisualMatch(activity) || isSequencingEvents(activity) || isAuditoryDictation(activity) || isVisualArithmetic(activity) || isSpatialRelations(activity)) {
      size = activity.data.problems.length;
    } else if (isMatchingPairs(activity)) {
      size = activity.data.pairs.length;
    } else if (isSentenceCompletion(activity)) {
      size = activity.data.prompts.length;
    }
    
    const initialUserAnswers = this.initialAnswers();
    if (isOrdering(activity) || isSequencingEvents(activity)) {
        const answers = (initialUserAnswers && initialUserAnswers.length === size) ? initialUserAnswers : Array(size).fill([]);
        this.userAnswers.set(answers as string[][]);
    } else if (isMatchingPairs(activity)) {
        this.userAnswers.set(Array(size).fill(null));
        const column2 = activity.data.pairs.map(p => p.item2);
        this.shuffledColumn2Items.set(column2.sort(() => Math.random() - 0.5));
        this.selectedItem1Index.set(null);
    } else {
        const answers = (initialUserAnswers && initialUserAnswers.length === size) ? initialUserAnswers : Array(size).fill('');
        this.userAnswers.set(answers as string[]);
    }
    
    this.answerStatuses.set(Array(size).fill('unchecked'));

    const initialHistory: Record<number, string[]> = {};
    const initialHistoryIndex: Record<number, number> = {};
    this.userAnswers().forEach((answer, index) => {
        initialHistory[index] = [answer as string];
        initialHistoryIndex[index] = 0;
    });
    this.history.set(initialHistory);
    this.historyIndex.set(initialHistoryIndex);
  }

  startSpeechRecognition(index: number): void {
    this.sttTargetIndex.set(index);
    this.speechService.start();
  }

  updateAnswer(index: number, event: Event): void {
    if (this.showFeedback()) return;
    const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    this.userAnswers.update(answers => {
      const newAnswers = [...answers];
      newAnswers[index] = value;
      return newAnswers;
    });
    
    this.history.update(h => {
        const currentHistory = h[index] ? h[index].slice(0, (this.historyIndex()[index] ?? -1) + 1) : [];
        const newHistoryForIndex = [...currentHistory, value];
        return {
            ...h,
            [index]: newHistoryForIndex
        };
    });
    this.historyIndex.update(i => ({
        ...i,
        [index]: (this.history()[index]?.length || 1) - 1
    }));
    
    this.answersChanged.emit(this.userAnswers());
  }

  undo(index: number): void {
    if (!this.canUndo(index)) return;

    this.historyIndex.update(i => ({ ...i, [index]: i[index] - 1 }));
    const previousValue = this.history()[index][this.historyIndex()[index]];

    this.userAnswers.update(answers => {
        const newAnswers = [...answers];
        newAnswers[index] = previousValue;
        return newAnswers;
    });
    this.answersChanged.emit(this.userAnswers());
  }

  redo(index: number): void {
    if (!this.canRedo(index)) return;

    this.historyIndex.update(i => ({ ...i, [index]: i[index] + 1 }));
    const nextValue = this.history()[index][this.historyIndex()[index]];

    this.userAnswers.update(answers => {
        const newAnswers = [...answers];
        newAnswers[index] = nextValue;
        return newAnswers;
    });
    this.answersChanged.emit(this.userAnswers());
  }

  clearAnswer(index: number): void {
    const clearedValue = '';
    this.userAnswers.update(answers => {
      const newAnswers = [...answers];
      newAnswers[index] = clearedValue;
      return newAnswers;
    });

    this.history.update(h => {
        const currentHistory = h[index] ? h[index].slice(0, (this.historyIndex()[index] ?? -1) + 1) : [];
        const newHistoryForIndex = [...currentHistory, clearedValue];
        return {
            ...h,
            [index]: newHistoryForIndex
        };
    });
    this.historyIndex.update(i => ({
        ...i,
        [index]: (this.history()[index]?.length || 1) - 1
    }));

    this.answersChanged.emit(this.userAnswers());
  }
  
  selectAnswer(index: number, option: string): void {
    if (this.showFeedback()) return;
    this.userAnswers.update(answers => {
      const newAnswers = [...answers];
      newAnswers[index] = option;
      return newAnswers;
    });
    this.answersChanged.emit(this.userAnswers());
  }

  selectOrderItem(problemIndex: number, item: string): void {
    if (this.showFeedback()) return;
    this.userAnswers.update(answers => {
      const newAnswers = [...answers];
      const currentOrder = (newAnswers[problemIndex] as string[] | undefined) || [];
      if (!currentOrder.includes(item)) {
        newAnswers[problemIndex] = [...currentOrder, item];
      }
      return newAnswers;
    });
    this.answersChanged.emit(this.userAnswers());
  }

  removeOrderItem(problemIndex: number, itemIndex: number): void {
    if (this.showFeedback()) return;
    this.userAnswers.update(answers => {
      const newAnswers = [...answers];
      const currentOrder = [...(newAnswers[problemIndex] as string[])];
      currentOrder.splice(itemIndex, 1);
      newAnswers[problemIndex] = currentOrder;
      return newAnswers;
    });
    this.answersChanged.emit(this.userAnswers());
  }
  
  getUserAnswerAsArray(index: number): string[] {
    const answer = this.userAnswers()[index];
    return Array.isArray(answer) ? answer : [];
  }

  isItemSelected(problemIndex: number, item: string): boolean {
    const currentOrder = this.getUserAnswerAsArray(problemIndex);
    return currentOrder.includes(item);
  }

  handleItem1Click(index: number): void {
    if (this.showFeedback()) return;
    
    if (this.userAnswers()[index] !== null) {
      this.userAnswers.update(answers => {
        const newAnswers = [...answers];
        newAnswers[index] = null;
        return newAnswers;
      });
      this.selectedItem1Index.set(null);
      return;
    }

    if(this.selectedItem1Index() === index) {
      this.selectedItem1Index.set(null);
    } else {
      this.selectedItem1Index.set(index);
    }
  }

  handleItem2Click(item2Text: string): void {
    if (this.showFeedback() || this.selectedItem1Index() === null) return;
    if (this.isItem2Selected(item2Text)) return;

    this.userAnswers.update(answers => {
      const newAnswers = [...answers];
      newAnswers[this.selectedItem1Index()!] = item2Text;
      return newAnswers;
    });
    this.selectedItem1Index.set(null);
    this.answersChanged.emit(this.userAnswers());
  }
  
  isItem2Selected(item: string): boolean {
    return (this.userAnswers() as (string | null)[])?.includes(item) ?? false;
  }
  
  onDragStart(event: DragEvent, option: string): void {
    event.dataTransfer?.setData('text/plain', option);
  }
  
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }
  
  onDrop(event: DragEvent, problemIndex: number): void {
    event.preventDefault();
    if (this.showFeedback()) return;
    const droppedData = event.dataTransfer?.getData('text/plain');
    if (droppedData) {
      this.userAnswers.update(answers => {
        const newAnswers = [...answers];
        newAnswers[problemIndex] = droppedData;
        return newAnswers;
      });
      this.answersChanged.emit(this.userAnswers());
    }
    this.draggedOverIndex.set(null);
  }

  async requestDynamicHint(problemIndex: number): Promise<void> {
    const currentActivity = this.displayActivity();
    if (!currentActivity || this.isHintLoading()[problemIndex] || this.dynamicHints()[problemIndex]) return;

    this.isHintLoading.update(loading => ({ ...loading, [problemIndex]: true }));
    
    try {
        const userAnswer = this.userAnswers()[problemIndex];
        const hint = await this.geminiService.generateHintForQuestion(currentActivity, problemIndex, userAnswer);
        this.dynamicHints.update(hints => ({...hints, [problemIndex]: hint}));
    } catch (error) {
        console.error('Failed to get dynamic hint', error);
        this.dynamicHints.update(hints => ({...hints, [problemIndex]: 'Üzgünüm, şu anda bir ipucu oluşturulamadı.'}));
    } finally {
        this.isHintLoading.update(loading => ({ ...loading, [problemIndex]: false }));
    }
  }

  async requestPedagogicalFeedback(problemIndex: number): Promise<void> {
    const currentActivity = this.displayActivity();
    if (!currentActivity || this.isTutorLoading()[problemIndex]) return;

    this.isTutorLoading.update(loading => ({ ...loading, [problemIndex]: true }));
    this.aiTutorFeedback.update(feedback => ({ ...feedback, [problemIndex]: null }));

    try {
        const userAnswer = this.userAnswers()[problemIndex];
        const feedback = await this.geminiService.generatePedagogicalFeedback(currentActivity, problemIndex, userAnswer);
        this.aiTutorFeedback.update(f => ({ ...f, [problemIndex]: feedback }));
    } catch (error) {
        console.error('Failed to get pedagogical feedback', error);
        this.aiTutorFeedback.update(f => ({ ...f, [problemIndex]: 'Üzgünüm, şu anda bir açıklama oluşturamıyorum.' }));
    } finally {
        this.isTutorLoading.update(loading => ({ ...loading, [problemIndex]: false }));
    }
  }

  checkAnswers(): void {
    clearTimeout(this.feedbackTimeoutId);
    const currentActivity = this.displayActivity();
    if (!currentActivity) return;

    if (isReadingAloudCoach(currentActivity)) {
        this.finishReadingActivity();
        return;
    }

    let newStatuses: AnswerStatus[] = [];
    let correctCount = 0;
    let totalCount = 0;
    const answers = this.userAnswers();

    if (isWordScramble(currentActivity)) {
      totalCount = currentActivity.data.words.length;
      newStatuses = answers.map((answer, index) => {
        const isCorrect = (answer as string).trim().toLowerCase() === currentActivity.data.words[index].correct.toLowerCase();
        if (isCorrect) correctCount++;
        return isCorrect ? 'correct' : 'incorrect';
      });
    } else if (isSimpleMath(currentActivity) || isDragDropMatch(currentActivity) || isVisualArithmetic(currentActivity)) {
      totalCount = currentActivity.data.problems.length;
      newStatuses = answers.map((answer, index) => {
        const correctAnswer = isSimpleMath(currentActivity) ? currentActivity.data.problems[index].answer 
            : isDragDropMatch(currentActivity) ? currentActivity.data.problems[index].correctAnswer 
            : currentActivity.data.problems[index].answer;
        const isCorrect = (answer as string).trim() === correctAnswer;
        if (isCorrect) correctCount++;
        return isCorrect ? 'correct' : 'incorrect';
      });
    } else if (isMultipleChoice(currentActivity) || isVisualMatch(currentActivity) || isSpatialRelations(currentActivity)) {
      totalCount = currentActivity.data.problems.length;
      newStatuses = answers.map((answer, index) => {
        const isCorrect = answer === currentActivity.data.problems[index].correctAnswer;
        if (isCorrect) correctCount++;
        return isCorrect ? 'correct' : 'incorrect';
      });
    } else if (isOrdering(currentActivity) || isSequencingEvents(currentActivity)) {
      totalCount = currentActivity.data.problems.length;
      newStatuses = answers.map((answer, index) => {
        const isCorrect = JSON.stringify(answer) === JSON.stringify(currentActivity.data.problems[index].correctOrder);
        if (isCorrect) correctCount++;
        return isCorrect ? 'correct' : 'incorrect';
      });
    } else if (isMatchingPairs(currentActivity)) {
        totalCount = currentActivity.data.pairs.length;
        newStatuses = answers.map((answer, index) => {
            const isCorrect = answer === currentActivity.data.pairs[index].item2;
            if (isCorrect) correctCount++;
            return isCorrect ? 'correct' : 'incorrect';
        });
    } else if (isFillInTheBlanks(currentActivity)) {
        totalCount = currentActivity.data.problems.length;
        newStatuses = answers.map((answer, index) => {
            const isCorrect = (answer as string).trim().toLowerCase() === currentActivity.data.problems[index].correctAnswer.toLowerCase();
            if (isCorrect) correctCount++;
            return isCorrect ? 'correct' : 'incorrect';
        });
    } else if (isTrueFalse(currentActivity)) {
        totalCount = currentActivity.data.problems.length;
        newStatuses = answers.map((answer, index) => {
            const correctAnswer = currentActivity.data.problems[index].isCorrect ? 'Doğru' : 'Yanlış';
            const isCorrect = answer === correctAnswer;
            if (isCorrect) correctCount++;
            return isCorrect ? 'correct' : 'incorrect';
        });
    } else if (isAuditoryDictation(currentActivity)) {
        totalCount = currentActivity.data.problems.length;
        newStatuses = answers.map((answer, index) => {
            const isCorrect = (answer as string).trim().toLowerCase() === currentActivity.data.problems[index].wordToSpeak.toLowerCase();
            if (isCorrect) correctCount++;
            return isCorrect ? 'correct' : 'incorrect';
        });
    }

    this.answerStatuses.set(newStatuses);
    this.score.set(`Sonuç: ${correctCount} / ${totalCount}`);

    const settings = this.feedbackSettings();
    if (settings.enabled) {
      this.showFeedback.set(true);
      if (typeof settings.duration === 'number') {
        this.feedbackTimeoutId = setTimeout(() => {
          this.showFeedback.set(false);
        }, settings.duration * 1000);
      }
    }

    if (totalCount > 0) {
      const successRate = correctCount / totalCount;
      if (successRate >= 0.8) {
        this.activitySuccess.emit({ subTopicId: this.subTopicId()!, successRate, correctAnswers: correctCount, totalQuestions: totalCount });
        this.triggerSuccessModal();
      }
    }
  }
  
  // --- INTERACTIVE STORY METHODS ---
  selectStoryChoice(choice: InteractiveStoryChoice) {
    this.currentSceneId.set(choice.nextSceneId);
    this.microActivityAnswer.set(null);
    this.microActivityStatus.set('unchecked');
    this.isMicroActivitySolved.set(false);

    // If the new scene is an ending scene (no choices, no micro-activity), trigger success.
    const newScene = this.currentScene();
    if(newScene && newScene.choices.length === 0 && !newScene.microActivity) {
      this.activitySuccess.emit({ subTopicId: this.subTopicId()!, successRate: 1, correctAnswers: 1, totalQuestions: 1 });
      this.triggerSuccessModal();
    }
  }

  updateMicroActivityAnswer(event: Event) {
    if (this.microActivityStatus() !== 'unchecked') return;
    const value = (event.target as HTMLInputElement).value;
    this.microActivityAnswer.set(value);
  }

  checkMicroActivityAnswer() {
    const scene = this.currentScene();
    if (!scene?.microActivity) return;

    const microActivity = scene.microActivity;
    let isCorrect = false;

    // We assume micro-activities have only one problem at index 0
    if (isWordScramble(microActivity)) {
        isCorrect = (this.microActivityAnswer() as string || '').trim().toLowerCase() === microActivity.data.words[0].correct.toLowerCase();
    } else if (isSimpleMath(microActivity)) {
        isCorrect = (this.microActivityAnswer() as string || '').trim() === microActivity.data.problems[0].answer;
    } else if (isFillInTheBlanks(microActivity)) {
        isCorrect = (this.microActivityAnswer() as string || '').trim().toLowerCase() === microActivity.data.problems[0].correctAnswer.toLowerCase();
    } else if (isSentenceCompletion(microActivity)) {
        // For sentence completion, any non-empty answer is "correct" to proceed.
        isCorrect = (this.microActivityAnswer() as string || '').trim().length > 0;
    }
    
    this.microActivityStatus.set(isCorrect ? 'correct' : 'incorrect');
    if(isCorrect) {
        setTimeout(() => this.isMicroActivitySolved.set(true), 1000); // give feedback time
    }
  }

  // --- 5N1K STORY METHODS ---
  goToStep(step: number): void {
    if (step >= 0 && step <= this.totalSteps()) {
      this.currentStep.set(step);
    }
  }

  async regenerateStoryImage(): Promise<void> {
    const act = this.displayActivity();
    if (!act || !isFiveWOneHStory(act) || this.isRegeneratingImage()) {
      return;
    }

    this.isRegeneratingImage.set(true);
    try {
      const newImageUrl = await this.geminiService.generateImageForStory(act.data.story);
      if (newImageUrl) {
        this.displayActivity.update(currentActivity => {
          if (currentActivity && isFiveWOneHStory(currentActivity)) {
            // Create a new activity object with the new image URL
            const updatedData = { ...currentActivity.data, imageUrl: newImageUrl };
            return { ...currentActivity, data: updatedData };
          }
          return currentActivity;
        });
      }
    } catch (error) {
      console.error("Failed to regenerate image", error);
    } finally {
      this.isRegeneratingImage.set(false);
    }
  }


  request5W1HHint(questionIndex: number, hint: string | undefined): void {
    if (hint) {
      this.dynamicHints.update(h => ({...h, [questionIndex]: hint}));
    }
  }

  async handleCheckComprehension(questionIndex: number): Promise<void> {
    const activity = this.displayActivity();
    if (!activity || !isFiveWOneHStory(activity) || this.isCheckingAnswer()) return;
    
    const userAnswer = this.userAnswers()[questionIndex] as string;
    if (!userAnswer || userAnswer.trim() === '') return;

    this.isCheckingAnswer.set(true);
    const question = activity.data.comprehensionQuestions[questionIndex];

    try {
      const result = await this.geminiService.checkComprehensionAnswer(activity.data.story, question.question, question.answer, userAnswer);
      this.comprehensionFeedback.update(f => ({ ...f, [questionIndex]: result }));
    } catch (e) {
      console.error(e);
      this.comprehensionFeedback.update(f => ({ ...f, [questionIndex]: { isCorrect: false, feedback: 'Cevap kontrol edilirken bir hata oluştu.' } }));
    } finally {
      this.isCheckingAnswer.set(false);
    }
  }

  async handleEvaluateInference(questionIndex: number): Promise<void> {
    const activity = this.displayActivity();
    if (!activity || !isFiveWOneHStory(activity) || this.isCheckingAnswer()) return;

    const allQuestionsIndex = activity.data.comprehensionQuestions.length + questionIndex;
    const userAnswer = this.userAnswers()[allQuestionsIndex] as string;
    if (!userAnswer || userAnswer.trim() === '') return;

    this.isCheckingAnswer.set(true);
    const question = activity.data.inferenceQuestions[questionIndex];

    try {
      const result = await this.geminiService.evaluateInferenceAnswer(activity.data.story, question.question, userAnswer);
      this.inferenceFeedback.update(f => ({ ...f, [questionIndex]: result }));
    } catch (e) {
      console.error(e);
      this.inferenceFeedback.update(f => ({ ...f, [questionIndex]: 'Harika bir fikir!' }));
    } finally {
      this.isCheckingAnswer.set(false);
    }
  }
  
  finish5W1HActivity(): void {
    const questionsCount = this.allQuestions().length;
    this.activitySuccess.emit({ 
      subTopicId: this.subTopicId()!,
      successRate: 1, 
      correctAnswers: questionsCount, 
      totalQuestions: questionsCount 
    });
    this.triggerSuccessModal();
  }

  // --- READING ALOUD COACH METHODS ---
  toggleReadingAloud(): void {
    if (this.speechService.isListening()) {
        this.speechService.stop();
    } else {
        this.sttTargetIndex.set(this.currentParagraphIndex());
        this.speechService.start();
    }
  }

  async checkReadingFluency(): Promise<void> {
    const activity = this.displayActivity();
    if (!activity || !isReadingAloudCoach(activity) || this.isCheckingReading()) return;
    
    const index = this.currentParagraphIndex();
    const originalText = activity.data.paragraphs[index];
    const transcript = this.speechService.transcript();

    if (!transcript) return;

    this.isCheckingReading.set(true);
    try {
        const result = await this.geminiService.evaluateReadingFluency(originalText, transcript);
        this.readingFeedback.update(f => ({ ...f, [index]: result }));
    } catch(e) {
        console.error(e);
        this.readingFeedback.update(f => ({ ...f, [index]: { feedback: 'Geri bildirim alınırken bir hata oluştu.', incorrectWords: [] } }));
    } finally {
        this.isCheckingReading.set(false);
    }
  }

  goToNextParagraph(): void {
    const activity = this.displayActivity();
    if (!activity || !isReadingAloudCoach(activity)) return;

    if (this.currentParagraphIndex() < activity.data.paragraphs.length - 1) {
        this.currentParagraphIndex.update(i => i + 1);
    }
  }

  finishReadingActivity(): void {
    const activity = this.displayActivity();
    if (!activity || !isReadingAloudCoach(activity)) return;
    
    const totalParagraphs = activity.data.paragraphs.length;
    const allFeedback = this.readingFeedback();
    const incorrectWordsCount = Object.values(allFeedback).reduce((acc, val) => acc + (val?.incorrectWords.length || 0), 0);
    
    // Consider the activity a "success" if it's completed, maybe with a penalty for many errors.
    // For now, completion is success.
    const successRate = 1.0;
    
    this.activitySuccess.emit({
        subTopicId: this.subTopicId()!,
        successRate: successRate,
        correctAnswers: totalParagraphs, // Base success on completing paragraphs
        totalQuestions: totalParagraphs
    });
    this.triggerSuccessModal();
  }
  
  highlightIncorrectWords(text: string, incorrectWords: string[] | undefined): string {
    if (!incorrectWords || incorrectWords.length === 0) {
        return text;
    }
    const regex = new RegExp(`\\b(${incorrectWords.join('|')})\\b`, 'gi');
    return text.replace(regex, `<mark class="bg-red-200 rounded-sm px-1">$&</mark>`);
  }

   // --- WORD EXPLORER METHODS ---
  async fetchWordDetails(word: string): Promise<void> {
    this.wordExplorerState.update(s => ({ ...s, loading: { definition: true, sentences: true, synonym: true, image: true, question: true } }));
    
    // Fetch all details in parallel
    const definitionPromise = this.geminiService.getWordDefinition(word);
    const sentencesPromise = this.geminiService.getExampleSentences(word);
    const synonymPromise = this.geminiService.getWordSynonym(word);
    const imagePromise = this.geminiService.generateImageForWord(word);

    try {
      const definition = await definitionPromise;
      this.wordExplorerState.update(s => ({ ...s, definition, loading: { ...s.loading, definition: false } }));
      
      const questionPromise = this.geminiService.generateComprehensionQuestion(word, definition);
      
      const sentences = await sentencesPromise;
      this.wordExplorerState.update(s => ({ ...s, sentences, loading: { ...s.loading, sentences: false } }));
      
      const synonym = await synonymPromise;
      this.wordExplorerState.update(s => ({ ...s, synonym, loading: { ...s.loading, synonym: false } }));
      
      const imageBytes = await imagePromise;
      this.wordExplorerState.update(s => ({ ...s, imageBase64: `data:image/jpeg;base64,${imageBytes}`, loading: { ...s.loading, image: false } }));

      const question = await questionPromise;
      this.wordExplorerState.update(s => ({ ...s, comprehensionQuestion: question, loading: { ...s.loading, question: false } }));

    } catch (error) {
      console.error("Error fetching word details:", error);
      // You can set error states for each part if needed
      this.wordExplorerState.update(s => ({ ...s, loading: { definition: false, sentences: false, synonym: false, image: false, question: false } }));
    }
  }

  checkWordExplorerAnswer(): void {
    const state = this.wordExplorerState();
    if (!state.comprehensionQuestion) return;

    const isCorrect = state.comprehensionAnswer === state.comprehensionQuestion.correctAnswer;
    this.wordExplorerState.update(s => ({ ...s, comprehensionStatus: isCorrect ? 'correct' : 'incorrect' }));

    if (isCorrect) {
      this.activitySuccess.emit({ 
        subTopicId: this.subTopicId()!, 
        successRate: 1, 
        correctAnswers: 1, 
        totalQuestions: 1 
      });
      this.triggerSuccessModal();
    }
  }


  private generateConfetti(): void {
    const pieces = [];
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
    for (let i = 0; i < 100; i++) {
        pieces.push({
            left: `${Math.random() * 100}%`,
            animDelay: `${Math.random() * 5}s`,
            animDuration: `${3 + Math.random() * 2}s`,
            color: colors[i % colors.length]
        });
    }
    this.confettiPieces.set(pieces);
  }

  private triggerSuccessModal(): void {
    const randomIndex = Math.floor(Math.random() * this.stickers.length);
    this.successSticker.set(this.stickers[randomIndex]);
    this.showSuccessModal.set(true);
    this.showSuccessActions.set(false);

    this.generateConfetti();
    this.showConfetti.set(true);

    setTimeout(() => {
        this.showSuccessActions.set(true);
    }, 1500);

    setTimeout(() => {
        this.showConfetti.set(false);
    }, 5000);
  }

  closeSuccessModal(): void {
    this.showSuccessModal.set(false);
    this.showConfetti.set(false);
    this.confettiPieces.set([]);
  }
  
  finishPracticeSession(): void {
    this.closeSuccessModal();
    this.practiceSessionFinished.emit();
  }

  requestNextActivity(): void {
    this.closeSuccessModal();
    this.nextActivity.emit();
  }

  speakText(text: string | undefined): void {
    if (text) {
      this.ttsService.speak(text);
    }
  }

  printActivity(): void {
    window.print();
  }

  getPromptParts(problem: DragDropMatchActivity['data']['problems'][0] | FillInTheBlanksActivity['data']['problems'][0]): string[] {
    return problem.prompt.split('__');
  }

  getStatusClasses(status: AnswerStatus): string {
    if (!this.showFeedback()) {
      return 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500';
    }
    switch (status) {
      case 'correct':
        return 'border-green-500 bg-green-50 ring-green-500 animate-pop-in';
      case 'incorrect':
        return 'border-red-500 bg-red-50 ring-red-500 animate-shake';
      default:
        return 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500';
    }
  }
}