import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal, WritableSignal, OnDestroy } from '@angular/core';
import { Activity, isSentenceCompletion, isSimpleMath, isWordScramble, isVisualMatch, Topic, isOrdering, isDragDropMatch, DragDropMatchActivity } from '../../models/activity.model';
import { TtsService } from '../../services/tts.service';
import { FeedbackSettings } from '../../app.component';

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

  activity = input.required<Activity>({
    alias: 'activity',
    transform: (value: Activity) => {
      this.initializeState(value);
      
      // Handle the hint display
      clearTimeout(this.hintTimeoutId); // Clear any existing timeout
      if (value.hint) {
        this.showHint.set(true);
        this.hintTimeoutId = setTimeout(() => {
          this.showHint.set(false);
        }, 7000); // 7 seconds
      } else {
        this.showHint.set(false);
      }

      return value;
    }
  });
  topic = input.required<Topic>();
  initialAnswers = input<any[] | null>(null);
  feedbackSettings = input.required<FeedbackSettings>();
  
  answersChanged = output<any[]>();
  nextActivity = output<void>();
  activitySuccess = output<number>();

  userAnswers: WritableSignal<(string | string[])[]> = signal([]);
  answerStatuses: WritableSignal<AnswerStatus[]> = signal([]);
  showFeedback = signal(false);
  score = signal<string | null>(null);
  private feedbackTimeoutId: any = null;
  
  // Drag and Drop State
  draggedOverIndex = signal<number | null>(null);

  // New signals for success modal and animation
  showSuccessModal = signal(false);
  successSticker = signal<string>('');
  showConfetti = signal(false);
  showSuccessActions = signal(false);
  confettiPieces = signal<{left: string, animDelay: string, animDuration: string, color: string}[]>([]);
  
  // Stickers collection
  private stickers = ['🌟', '🏆', '🎉', '👍', '🚀', '🧠', '💡', '✅', '🎯', '🥇'];

  // Type guards for use in the template
  isWordScramble = isWordScramble;
  isSimpleMath = isSimpleMath;
  isSentenceCompletion = isSentenceCompletion;
  isVisualMatch = isVisualMatch;
  isOrdering = isOrdering;
  isDragDropMatch = isDragDropMatch;

  topicColors = computed(() => {
    switch (this.topic()) {
      case 'disleksi': return { 
          border: 'border-blue-400', 
          progress: 'bg-blue-500', 
          accentText: 'text-indigo-700', 
          hoverAccentText: 'hover:text-indigo-600',
          questionNumberBg: 'bg-blue-100', 
          questionNumberText: 'text-blue-700'
      };
      case 'diskalkuli': return { 
          border: 'border-yellow-400', 
          progress: 'bg-yellow-500', 
          accentText: 'text-amber-700', 
          hoverAccentText: 'hover:text-amber-600',
          questionNumberBg: 'bg-yellow-100', 
          questionNumberText: 'text-yellow-700'
      };
      case 'disgrafi': return { 
          border: 'border-green-400', 
          progress: 'bg-green-500', 
          accentText: 'text-green-700', 
          hoverAccentText: 'hover:text-green-600',
          questionNumberBg: 'bg-green-100', 
          questionNumberText: 'text-green-700'
      };
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
    const currentActivity = this.activity();
    const answers = this.userAnswers();
    if (!currentActivity || !answers) {
      return { percentage: 0, completed: 0, total: 0 };
    }

    const answeredCount = answers.filter(answer => {
      if (Array.isArray(answer)) {
        return answer.length > 0;
      }
      return typeof answer === 'string' && answer.trim() !== '';
    }).length;

    let totalCount = 0;

    if (this.isWordScramble(currentActivity)) {
      totalCount = currentActivity.data.words.length;
    } else if (this.isSimpleMath(currentActivity) || this.isDragDropMatch(currentActivity)) {
      totalCount = currentActivity.data.problems.length;
    } else if (this.isSentenceCompletion(currentActivity)) {
      totalCount = currentActivity.data.prompts.length;
    } else if (this.isVisualMatch(currentActivity)) {
      totalCount = currentActivity.data.problems.length;
    } else if (this.isOrdering(currentActivity)) {
      totalCount = currentActivity.data.problems.length;
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
  }

  private initializeState(activity: Activity): void {
    let size = 0;
    if (isWordScramble(activity)) {
      size = activity.data.words.length;
    } else if (isSimpleMath(activity) || isDragDropMatch(activity)) {
      size = activity.data.problems.length;
    } else if (isSentenceCompletion(activity)) {
      size = activity.data.prompts.length;
    } else if (isVisualMatch(activity)) {
      size = activity.data.problems.length;
    } else if (isOrdering(activity)) {
      size = activity.data.problems.length;
    }
    
    const initialUserAnswers = this.initialAnswers();
    if (isOrdering(activity)) {
        const answers = (initialUserAnswers && initialUserAnswers.length === size) ? initialUserAnswers : Array(size).fill([]);
        this.userAnswers.set(answers as string[][]);
    } else {
        const answers = (initialUserAnswers && initialUserAnswers.length === size) ? initialUserAnswers : Array(size).fill('');
        this.userAnswers.set(answers as string[]);
    }
    
    this.answerStatuses.set(Array(size).fill('unchecked'));
    this.showFeedback.set(false);
    this.score.set(null);
  }

  // For text inputs/textareas
  updateAnswer(index: number, event: Event): void {
    const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    this.userAnswers.update(answers => {
      const newAnswers = [...answers];
      newAnswers[index] = value;
      return newAnswers;
    });
    this.answersChanged.emit(this.userAnswers());
  }
  
  // For clickable options (visual-match)
  selectAnswer(index: number, option: string): void {
    if (this.showFeedback()) return;
    this.userAnswers.update(answers => {
      const newAnswers = [...answers];
      newAnswers[index] = option;
      return newAnswers;
    });
    this.answersChanged.emit(this.userAnswers());
  }

  // --- Methods for Ordering Activity ---
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
  
  // --- Template Helpers for Ordering ---
  getUserAnswerAsArray(index: number): string[] {
    const answer = this.userAnswers()[index];
    return Array.isArray(answer) ? answer : [];
  }

  isItemSelected(problemIndex: number, item: string): boolean {
    const currentOrder = this.getUserAnswerAsArray(problemIndex);
    return currentOrder.includes(item);
  }
  
  // --- Methods for Drag and Drop ---
  onDragStart(event: DragEvent, option: string): void {
    event.dataTransfer?.setData('text/plain', option);
  }
  
  onDragOver(event: DragEvent): void {
    event.preventDefault(); // This is necessary to allow dropping
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

  // --- Check Answers Logic ---
  checkAnswers(): void {
    clearTimeout(this.feedbackTimeoutId); // Clear previous timeout if any
    const currentActivity = this.activity();
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
    } else if (isSimpleMath(currentActivity) || isDragDropMatch(currentActivity)) {
      totalCount = currentActivity.data.problems.length;
      newStatuses = answers.map((answer, index) => {
        const correctAnswer = isSimpleMath(currentActivity) ? currentActivity.data.problems[index].answer : currentActivity.data.problems[index].correctAnswer;
        const isCorrect = (answer as string).trim() === correctAnswer;
        if (isCorrect) correctCount++;
        return isCorrect ? 'correct' : 'incorrect';
      });
    } else if (isVisualMatch(currentActivity)) {
      totalCount = currentActivity.data.problems.length;
      newStatuses = answers.map((answer, index) => {
        const isCorrect = answer === currentActivity.data.problems[index].targetWord;
        if (isCorrect) correctCount++;
        return isCorrect ? 'correct' : 'incorrect';
      });
    } else if (isOrdering(currentActivity)) {
      totalCount = currentActivity.data.problems.length;
      newStatuses = answers.map((answer, index) => {
        const isCorrect = JSON.stringify(answer) === JSON.stringify(currentActivity.data.problems[index].correctOrder);
        if (isCorrect) correctCount++;
        return isCorrect ? 'correct' : 'incorrect';
      });
    }

    this.answerStatuses.set(newStatuses);
    this.score.set(`Sonuç: ${correctCount} / ${totalCount}`);

    // Handle feedback display based on settings
    const settings = this.feedbackSettings();
    if (settings.enabled) {
      this.showFeedback.set(true);
      if (typeof settings.duration === 'number') {
        this.feedbackTimeoutId = setTimeout(() => {
          this.showFeedback.set(false);
        }, settings.duration * 1000);
      }
    }

    // Check for success, emit event, and show modal
    if (totalCount > 0) {
      const successRate = correctCount / totalCount;
      if (successRate >= 0.8) {
        this.activitySuccess.emit(successRate);
        this.triggerSuccessModal();
      }
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

    // Generate confetti and show it
    this.generateConfetti();
    this.showConfetti.set(true);

    // After a short delay, show the action buttons
    setTimeout(() => {
        this.showSuccessActions.set(true);
    }, 1500);

    // Stop confetti after a few seconds
    setTimeout(() => {
        this.showConfetti.set(false);
    }, 5000);
  }

  closeSuccessModal(): void {
    this.showSuccessModal.set(false);
    this.showConfetti.set(false);
    this.confettiPieces.set([]); // Clear confetti data
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

  getPromptParts(problem: DragDropMatchActivity['data']['problems'][0]): string[] {
    return problem.prompt.split('__');
  }

  statusClasses(status: AnswerStatus): string {
    if (!this.showFeedback()) return 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500';
    switch (status) {
      case 'correct':
        return 'border-green-500 bg-green-50 ring-green-500';
      case 'incorrect':
        return 'border-red-500 bg-red-50 ring-red-500';
      default:
        return 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500';
    }
  }
}