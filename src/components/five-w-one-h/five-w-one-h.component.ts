import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GradeLevel, Activity } from '../../models/activity.model';
import { GeminiService } from '../../services/gemini.service';
import { ActivityDisplayComponent } from '../activity-display/activity-display.component';
import { FeedbackSettings } from '../../app.component';

@Component({
  selector: 'app-five-w-one-h',
  templateUrl: './five-w-one-h.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ActivityDisplayComponent],
})
export class FiveWOneHComponent {
  private geminiService = inject(GeminiService);

  gradeLevel = signal<GradeLevel>('ilkokul');
  generatedActivity = signal<Activity | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Provide a default feedback setting for the activity display
  feedbackSettings = signal<FeedbackSettings>({
    enabled: true,
    duration: 'continuous'
  });

  async generateStory(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    this.generatedActivity.set(null);
    
    try {
      const activity = await this.geminiService.generate5W1HActivity(this.gradeLevel());
      this.generatedActivity.set(activity);
    } catch (e: any) {
      this.error.set(e.message || 'Hikaye ve sorular oluşturulurken bir hata oluştu.');
    } finally {
      this.loading.set(false);
    }
  }

  reset(): void {
    this.generatedActivity.set(null);
    this.error.set(null);
    this.loading.set(false);
  }
  
  print(): void {
    window.print();
  }
}