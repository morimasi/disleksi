import {
  ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal, WritableSignal
} from '@angular/core';
// FIX: Import InteractiveStoryActivity to resolve type error.
import {
  Activity, MultipleChoiceProblem, isAuditoryDictation, isDragDropMatch, isFillInTheBlanks,
  isFiveWOneHStory, isInteractiveStory, isMatchingPairs, isMultipleChoice, isOrdering,
  isPictureSequencingStoryteller,
  isReadingAloudCoach, isSentenceCompletion, isSequencingEvents, isSimpleMath, isSpatialRelations,
  isTrueFalse, isVisualArithmetic, isVisualMatch, isWordExplorer, isWordScramble,
  InteractiveStoryScene, SubTopicId, WordExplorerData, AuditoryDictationData, VisualArithmeticData,
  ReadingAloudData, FiveWOneHStoryData, InteractiveStoryData, MatchingPairsData, OrderingData,
  MultipleChoiceData, SequencingEventsData, SimpleMathData, SpatialRelationsData,
  WordScrambleData, TrueFalseData, FillInTheBlanksData, DragDropMatchData, SentenceCompletionData, Topic, InteractiveStoryActivity, PictureSequencingProblem, MatchingPairsData as MatchingPairsDataType
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
  hint: string | null;
  isGeneratingHint: boolean;
  isGeneratingFeedback: boolean;
  aiSentenceFeedback: string | null;
  isGeneratingSentenceFeedback: boolean;
}

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
  
  // Matching Pairs specific state
  shuffledColumn1 = signal<string[]>([]);
  shuffledColumn2 = signal<string[]>([]);
  selectedItemCol1 = signal<{ item: string; index: number } | null>(null);
  isCheckingPairs = signal(false);

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
  isPictureSequencingStoryteller = isPictureSequencingStoryteller;

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
    });
  }
  
  private shuffleArray(array: any[]): any[] {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  private initializeState(activity: Activity): void {
    this.isCompleted.set(false);
    this.showConfetti.set(false);
    this.currentProblemIndex.set(0);
    let problemCount = 0;

    if (isInteractiveStory(activity) || isWordExplorer(activity)) {
        problemCount = 1; 
    } else if (isReadingAloudCoach(activity)) {
        problemCount = activity.data.paragraphs.length;
    } else if (isSentenceCompletion(activity)) {
        problemCount = activity.data.prompts.length;
    } else if (isMatchingPairs(activity)) {
        problemCount = 1;
        const pairs = [...activity.data.pairs];
        this.shuffledColumn1.set(this.shuffleArray(pairs.map(p => p.item1)));
        this.shuffledColumn2.set(this.shuffleArray(pairs.map(p => p.item2)));
        this.selectedItemCol1.set(null);
        this.isCheckingPairs.set(false);
    } else if (isFiveWOneHStory(activity)) {
        problemCount = activity.data.comprehensionQuestions.length;
    } else if ('data' in activity && 'problems' in activity.data && Array.isArray(activity.data.problems)) {
        problemCount = activity.data.problems.length;
    } else if (isWordScramble(activity)) {
        problemCount = activity.data.words.length;
    }

    const initialUserAnswer = isPictureSequencingStoryteller(activity) ? [] : (isMatchingPairs(activity) ? {} : null);

    this.problemStates.set(Array(problemCount).fill(0).map((_, i) => ({
      status: 'unanswered',
      userAnswer: this.initialAnswers() ? this.initialAnswers()![i] : initialUserAnswer,
      feedbackText: null,
      hint: null,
      isGeneratingHint: false,
      isGeneratingFeedback: false,
      aiSentenceFeedback: null,
      isGeneratingSentenceFeedback: false,
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

    if (isInteractiveStory(act) || isWordExplorer(act) || isMatchingPairs(act)) {
        return act.data;
    }
    
    const index = this.currentProblemIndex();
    
    if (isReadingAloudCoach(act)) {
        return act.data.paragraphs[index];
    }
    if (isSentenceCompletion(act)) {
        return act.data.prompts[index];
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
  async handleAnswer(answer: any): Promise<void> {
    const act = this.activity();
    if (!act || this.isCompleted() || this.currentProblemState().status !== 'unanswered') return;

    const currentProblem = this.currentProblem();
    if(!currentProblem) return;
    
    // Special handling for sentence completion with AI feedback
    if (isSentenceCompletion(act)) {
        this.problemStates.update(states => {
            const current = states[this.currentProblemIndex()];
            current.userAnswer = answer;
            current.isGeneratingSentenceFeedback = true;
            return [...states];
        });

        try {
            const feedback = await this.geminiService.getSentenceFeedback(currentProblem as string, answer);
            this.problemStates.update(states => {
                states[this.currentProblemIndex()].aiSentenceFeedback = feedback;
                return [...states];
            });
        } catch (e) {
            console.error("Failed to get sentence feedback", e);
            this.problemStates.update(states => {
                states[this.currentProblemIndex()].aiSentenceFeedback = "Harika bir cümle! Devam et."; // Fallback
                return [...states];
            });
        } finally {
             this.problemStates.update(states => {
                const current = states[this.currentProblemIndex()];
                current.isGeneratingSentenceFeedback = false;
                current.status = 'correct'; // Mark as complete to show the 'Next' button
                return [...states];
            });
        }
        return; // End execution here for this activity type
    }

    let isCorrect = false;
    let correctAnswer: any = null;
    
    if (isReadingAloudCoach(act)) {
        isCorrect = true; // Practice activities are always "correct" for progression
    } else if (isSimpleMath(act) || isFillInTheBlanks(act) || isAuditoryDictation(act) || isVisualArithmetic(act) || isWordScramble(act) || isFiveWOneHStory(act)) {
      correctAnswer = 'correct' in currentProblem ? currentProblem.correct : (currentProblem as any).answer || (currentProblem as any).correctAnswer || (currentProblem as any).wordToSpeak;
      isCorrect = (answer as string).trim().toLowerCase() === correctAnswer.toLowerCase();
    } else if (isTrueFalse(act)) {
        correctAnswer = (currentProblem as any).isCorrect;
        isCorrect = answer === correctAnswer;
    } else if (isMultipleChoice(act) || isVisualMatch(act) || isSpatialRelations(act) || isDragDropMatch(act)) {
        correctAnswer = (currentProblem as any).correctAnswer;
        isCorrect = answer === correctAnswer;
    } else if (isPictureSequencingStoryteller(act)) {
        const problemData = currentProblem as PictureSequencingProblem;
        correctAnswer = problemData.correctOrder;
        isCorrect = JSON.stringify(answer) === JSON.stringify(correctAnswer);
    } else {
        isCorrect = true;
    }
    
    const status: AnswerStatus = isCorrect ? 'correct' : 'incorrect';
    
    this.problemStates.update(states => {
      states[this.currentProblemIndex()].userAnswer = answer;
      states[this.currentProblemIndex()].status = status;
      return [...states];
    });

    if (this.feedbackSettings().enabled && !isSentenceCompletion(act) && !isReadingAloudCoach(act)) {
        if (isCorrect) {
            this.problemStates.update(states => {
                states[this.currentProblemIndex()].feedbackText = 'Harika! Doğru cevap.';
                return [...states];
            });
        } else {
            const supportedTypesForFeedback = ['simple-math', 'multiple-choice', 'fill-in-the-blanks', 'true-false', 'visual-match', 'spatial-relations', 'word-scramble'];
            if (supportedTypesForFeedback.includes(act.activityType)) {
                 this.problemStates.update(states => {
                    states[this.currentProblemIndex()].isGeneratingFeedback = true;
                    return [...states];
                });
                try {
                    const feedbackText = await this.geminiService.getIncorrectAnswerFeedback(act.activityType, currentProblem, correctAnswer, answer);
                    this.problemStates.update(states => {
                        states[this.currentProblemIndex()].feedbackText = feedbackText;
                        states[this.currentProblemIndex()].isGeneratingFeedback = false;
                        return [...states];
                    });
                } catch(e) {
                    console.error(e);
                     this.problemStates.update(states => {
                        states[this.currentProblemIndex()].feedbackText = 'Bu doğru değil. Tekrar denemek ister misin?';
                        states[this.currentProblemIndex()].isGeneratingFeedback = false;
                        return [...states];
                    });
                }
            } else {
                 this.problemStates.update(states => {
                    states[this.currentProblemIndex()].feedbackText = 'Doğru değil. Tekrar dene!';
                    return [...states];
                });
            }
        }
    }

    if (this.feedbackSettings().duration !== 'continuous' && !isSentenceCompletion(act) && !isReadingAloudCoach(act)) {
      setTimeout(() => this.nextProblem(), this.feedbackSettings().duration === 5 ? 5000 : 10000);
    }
  }

  async requestHint(): Promise<void> {
    const act = this.activity();
    const problem = this.currentProblem();
    if (!act || !problem || this.currentProblemState().isGeneratingHint || this.currentProblemState().hint) return;

    this.problemStates.update(states => {
        states[this.currentProblemIndex()].isGeneratingHint = true;
        return [...states];
    });

    try {
        const problemData = this.currentProblem() as any;
        let correctAnswer: any = null;

        if (isSimpleMath(act) || isFillInTheBlanks(act) || isAuditoryDictation(act) || isVisualArithmetic(act) || isWordScramble(act) || isFiveWOneHStory(act)) {
          correctAnswer = problemData.correct ?? problemData.answer ?? problemData.correctAnswer ?? problemData.wordToSpeak;
        } else if (isTrueFalse(act)) {
            correctAnswer = problemData.isCorrect;
        } else if (isMultipleChoice(act) || isVisualMatch(act) || isSpatialRelations(act) || isDragDropMatch(act)) {
            correctAnswer = problemData.correctAnswer;
        } else if (isPictureSequencingStoryteller(act)) {
            correctAnswer = problemData.correctOrder;
        }

        const hint = await this.geminiService.generateHint(act.activityType, problemData, correctAnswer);
        
        this.problemStates.update(states => {
            states[this.currentProblemIndex()].hint = hint;
            return [...states];
        });

    } catch (error) {
        console.error("Failed to get hint", error);
        this.problemStates.update(states => {
            states[this.currentProblemIndex()].hint = "Üzgünüm, şu anda ipucu verilemiyor.";
            return [...states];
        });
    } finally {
        this.problemStates.update(states => {
            states[this.currentProblemIndex()].isGeneratingHint = false;
            return [...states];
        });
    }
  }

  nextProblem(): void {
    const act = this.activity();
    if (act && this.isReadingAloudCoach(act)) {
        this.speechRecognitionService.transcript.set('');
        this.speechRecognitionService.error.set(null);
    }
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

  // --- Picture Sequencing Logic ---
  selectPicture(pictureId: number): void {
    this.problemStates.update(states => {
      const currentUserAnswer = states[this.currentProblemIndex()].userAnswer as number[];
      if (!currentUserAnswer.includes(pictureId)) {
        states[this.currentProblemIndex()].userAnswer = [...currentUserAnswer, pictureId];
      }
      return [...states];
    });
  }

  removePictureFromSequence(index: number): void {
    this.problemStates.update(states => {
      const currentUserAnswer = states[this.currentProblemIndex()].userAnswer as number[];
      currentUserAnswer.splice(index, 1);
      states[this.currentProblemIndex()].userAnswer = [...currentUserAnswer];
      return [...states];
    });
  }
  
  getPictureUrl(pictureId: number): string | undefined {
    const problem = this.currentProblem() as PictureSequencingProblem;
    return problem?.images.find(img => img.id === pictureId)?.url;
  }
  
  // --- Matching Pairs Logic ---
  selectMatchingItem(item: string, index: number, column: 1 | 2): void {
    const state = this.currentProblemState();
    if (state.status !== 'unanswered') return;

    if (column === 1) {
        this.selectedItemCol1.set({ item, index });
    } else if (column === 2 && this.selectedItemCol1()) {
        const col1Item = this.selectedItemCol1()!.item;
        this.problemStates.update(states => {
            states[0].userAnswer[col1Item] = item;
            return [...states];
        });
        this.selectedItemCol1.set(null);
    }
  }
  
  checkMatchingAnswers(): void {
    this.isCheckingPairs.set(true);
    const act = this.activity();
    if (!act || !isMatchingPairs(act)) return;

    const userPairs = this.currentProblemState().userAnswer;
    const correctPairs = act.data.pairs;
    let correctCount = 0;

    for (const correctPair of correctPairs) {
        if (userPairs[correctPair.item1] === correctPair.item2) {
            correctCount++;
        }
    }
    
    const isCorrect = correctCount === correctPairs.length;
    const status = isCorrect ? 'correct' : 'incorrect';
    
    this.problemStates.update(states => {
        states[0].status = status;
        states[0].feedbackText = isCorrect ? 'Harika! Tüm eşleştirmeler doğru.' : `${correctPairs.length} eşleştirmeden ${correctCount} tanesi doğru.`;
        return [...states];
    });
    
    if (this.feedbackSettings().duration !== 'continuous') {
      setTimeout(() => this.nextProblem(), this.feedbackSettings().duration === 5 ? 5000 : 10000);
    }
  }
  
  isPairCorrect(item1: string): boolean {
    const act = this.activity();
    if (!act || !isMatchingPairs(act) || this.currentProblemState().status === 'unanswered') return false;
    const userPairedItem2 = this.currentProblemState().userAnswer[item1];
    if (!userPairedItem2) return false;
    return !!act.data.pairs.find(p => p.item1 === item1 && p.item2 === userPairedItem2);
  }
}