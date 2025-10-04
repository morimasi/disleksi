import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal, WritableSignal } from '@angular/core';
import { Activity, GradeLevel, SubTopic, Topic, SubTopicId } from '../../models/activity.model';
import { GeminiService } from '../../services/gemini.service';
import { ActivityDisplayComponent } from '../activity-display/activity-display.component';
import { FeedbackSettings } from '../../app.component';

type Difficulty = 'easy' | 'medium' | 'hard';

@Component({
  selector: 'app-activity-generator',
  templateUrl: './activity-generator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ActivityDisplayComponent],
})
export class ActivityGeneratorComponent {
  topic = input.required<Topic>();
  subTopic = input.required<SubTopic>();
  feedbackSettings = input.required<FeedbackSettings>();
  customPrompts = input<string[] | undefined>();
  
  backToSubtopics = output<void>();
  activityCompleted = output<{ subTopicId: SubTopicId; successRate: number, correctAnswers: number, totalQuestions: number }>();

  private geminiService = inject(GeminiService);

  gradeLevel = signal<GradeLevel>('ilkokul');
  activity = signal<Activity | null>(null);
  activityWrapperVisible = signal(false);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  difficulty: WritableSignal<Difficulty> = signal('medium');
  problemCount = signal<3 | 5 | 7>(5);

  topicTitle = computed(() => {
    switch (this.topic()) {
      case 'disleksi': return 'Disleksi Etkinlikleri';
      case 'diskalkuli': return 'Diskalkuli Etkinlikleri';
      case 'disgrafi': return 'Disgrafi Etkinlikleri';
    }
  });
  
  onActivitySuccess(event: { successRate: number, correctAnswers: number, totalQuestions: number }): void {
    this.activityCompleted.emit({ 
      subTopicId: this.subTopic().id, 
      successRate: event.successRate,
      correctAnswers: event.correctAnswers,
      totalQuestions: event.totalQuestions
    });
  }

  async generateActivity(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    this.activityWrapperVisible.set(false); // Start fade-out

    if (this.activity()) {
        // Wait for fade-out animation to complete before fetching new data
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    const options: { customPrompt?: string; difficulty?: Difficulty; problemCount?: number } = {};
    const subTopicId = this.subTopic().id;
    const prompts = this.customPrompts();

    if (subTopicId === 'creative-writing-prompts' && prompts && prompts.length > 0) {
        options.customPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    }
    
    if (subTopicId === 'basic-arithmetic') {
        options.difficulty = this.difficulty();
        options.problemCount = this.problemCount();
    }
    
    try {
      const generatedActivity = await this.geminiService.generateActivity(this.topic(), this.subTopic(), this.gradeLevel(), options);
      this.activity.set(generatedActivity);
       // Let the view update before starting the fade-in
      await Promise.resolve();
      this.activityWrapperVisible.set(true);
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