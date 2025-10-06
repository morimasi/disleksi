import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GradeLevel, Activity } from '../../models/activity.model';
import { GeminiService } from '../../services/gemini.service';
import { ActivityDisplayComponent } from '../activity-display/activity-display.component';
import { FeedbackSettings } from '../../app.component';

export type StoryTheme = 'random' | 'adventure' | 'mystery' | 'sci-fi' | 'fantasy' | 'funny';

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
  selectedTheme = signal<StoryTheme>('random');

  storyThemes: {id: StoryTheme, name: string, icon: string, color: string}[] = [
    { id: 'random', name: 'Rastgele', icon: '🎲', color: 'bg-slate-200 hover:bg-slate-300' },
    { id: 'adventure', name: 'Macera', icon: '🏞️', color: 'bg-orange-200 hover:bg-orange-300' },
    { id: 'mystery', name: 'Gizem', icon: '🕵️', color: 'bg-purple-200 hover:bg-purple-300' },
    { id: 'sci-fi', name: 'Bilim Kurgu', icon: '🚀', color: 'bg-blue-200 hover:bg-blue-300' },
    { id: 'fantasy', name: 'Fantastik', icon: '🧙', color: 'bg-green-200 hover:bg-green-300' },
    { id: 'funny', name: 'Komik', icon: '😂', color: 'bg-yellow-200 hover:bg-yellow-300' },
  ];

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
      const activity = await this.geminiService.generate5W1HActivity(this.gradeLevel(), this.selectedTheme());
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