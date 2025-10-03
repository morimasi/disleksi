import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { Activity, GradeLevel, SubTopic, Topic, SubTopicId } from '../../models/activity.model';
import { GeminiService } from '../../services/gemini.service';
import { ActivityDisplayComponent } from '../activity-display/activity-display.component';
import { FeedbackSettings } from '../../app.component';

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
  
  backToSubtopics = output<void>();
  activityCompleted = output<{ subTopicId: SubTopicId; successRate: number }>();

  private geminiService = inject(GeminiService);

  gradeLevel = signal<GradeLevel>('ilkokul');
  activity = signal<Activity | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  topicTitle = computed(() => {
    switch (this.topic()) {
      case 'disleksi': return 'Disleksi Etkinlikleri';
      case 'diskalkuli': return 'Diskalkuli Etkinlikleri';
      case 'disgrafi': return 'Disgrafi Etkinlikleri';
    }
  });
  
  onActivitySuccess(successRate: number): void {
    this.activityCompleted.emit({ subTopicId: this.subTopic().id, successRate });
  }

  async generateActivity(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    this.activity.set(null);
    try {
      const generatedActivity = await this.geminiService.generateActivity(this.topic(), this.subTopic(), this.gradeLevel());
      this.activity.set(generatedActivity);
    } catch (e: any) {
      this.error.set(e.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      this.loading.set(false);
    }
  }

  goBack(): void {
    this.activity.set(null);
    this.error.set(null);
    this.backToSubtopics.emit();
  }
}
