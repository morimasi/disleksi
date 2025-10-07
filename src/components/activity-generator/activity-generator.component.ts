import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal, WritableSignal } from '@angular/core';
import { Activity, GradeLevel, SubTopic, Topic, SubTopicId } from '../../models/activity.model';
import { GeminiService } from '../../services/gemini.service';
import { ActivityDisplayComponent } from '../activity-display/activity-display.component';
import { FeedbackSettings } from '../../app.component';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';

type Difficulty = 'easy' | 'medium' | 'hard';
type ReadingTheme = 'animals' | 'space' | 'nature' | 'fairy-tale';

@Component({
  selector: 'app-activity-generator',
  templateUrl: './activity-generator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ActivityDisplayComponent, SkeletonLoaderComponent],
})
export class ActivityGeneratorComponent {
  topic = input.required<Topic>();
  subTopic = input.required<SubTopic>();
  feedbackSettings = input.required<FeedbackSettings>();
  customPrompts = input<string[] | undefined>();
  isPracticeSession = input<boolean>(false);
  
  backToSubtopics = output<void>();
  activityCompleted = output<{ subTopicId: SubTopicId | 'review'; topic: Topic; successRate: number, correctAnswers: number, totalQuestions: number }>();
  practiceFinished = output<void>();

  private geminiService = inject(GeminiService);

  gradeLevel = signal<GradeLevel>('ilkokul');
  activity = signal<Activity | null>(null);
  activityWrapperVisible = signal(false);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  difficulty: WritableSignal<Difficulty> = signal('medium');
  problemCount = signal<3 | 5 | 7>(5);
  readingTheme = signal<ReadingTheme>('animals');

  readingThemes: {id: ReadingTheme, name: string, icon: string}[] = [
    { id: 'animals', name: 'Hayvanlar', icon: '🐾' },
    { id: 'space', name: 'Uzay', icon: '🚀' },
    { id: 'nature', name: 'Doğa', icon: '🌳' },
    { id: 'fairy-tale', name: 'Masallar', icon: ' castle' },
  ];

  topicTitle = computed(() => {
    switch (this.topic()) {
      case 'disleksi': return 'Disleksi Etkinlikleri';
      case 'diskalkuli': return 'Diskalkuli Etkinlikleri';
      case 'disgrafi': return 'Disgrafi Etkinlikleri';
    }
  });
  
  onActivitySuccess(event: { subTopicId: SubTopicId | 'review'; successRate: number, correctAnswers: number, totalQuestions: number }): void {
    this.activityCompleted.emit({ 
      subTopicId: event.subTopicId, 
      topic: this.topic(),
      successRate: event.successRate,
      correctAnswers: event.correctAnswers,
      totalQuestions: event.totalQuestions
    });
  }

  onPracticeSessionFinished(): void {
    this.practiceFinished.emit();
  }

  async generateActivity(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    
    // If an activity already exists, we are generating a new one.
    // The skeleton loader will be shown instead of the old activity.
    if (this.activity()) {
      this.activity.set(null);
    }
    
    const options: { customPrompt?: string; difficulty?: Difficulty; problemCount?: number; readingTheme?: ReadingTheme } = {};
    const subTopicId = this.subTopic().id;
    const prompts = this.customPrompts();

    if (subTopicId === 'creative-writing-prompts' && prompts && prompts.length > 0) {
        options.customPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    }
    
    if (subTopicId === 'basic-arithmetic') {
        options.difficulty = this.difficulty();
        options.problemCount = this.problemCount();
    }
    
    if (subTopicId === 'reading-aloud-coach') {
      options.readingTheme = this.readingTheme();
    }
    
    try {
      // Add a small delay to make the skeleton loader visible and feel responsive
      await new Promise(resolve => setTimeout(resolve, 300));
      const generatedActivity = await this.geminiService.generateActivity(this.topic(), this.subTopic(), this.gradeLevel(), options);
      this.activity.set(generatedActivity);
    } catch (e: any) {
      this.error.set(e.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
      this.activity.set(null); // Clear activity on error
    } finally {
      this.loading.set(false);
    }
  }

  goBack(): void {
    this.activity.set(null);
    this.error.set(null);
    this.activityWrapperVisible.set(false);
    this.backToSubtopics.emit();
  }
}
