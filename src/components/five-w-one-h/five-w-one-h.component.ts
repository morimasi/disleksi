import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GradeLevel, Activity } from '../../models/activity.model';
import { GeminiService } from '../../services/gemini.service';
import { ActivityDisplayComponent } from '../activity-display/activity-display.component';
import { FeedbackSettings } from '../../app.component';

export type StoryTheme = 'random' | 'adventure' | 'mystery' | 'sci-fi' | 'fantasy' | 'funny' | 'friendship' | 'school' | 'nature' | 'history' | 'sports' | 'art';

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

  storyThemes: {id: StoryTheme, name: string, icon: string, baseClasses: string, selectedClasses: string}[] = [
    { id: 'random', name: 'Rastgele', icon: '🎲', baseClasses: 'bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-200', selectedClasses: 'bg-slate-200 text-slate-900 border-slate-500' },
    { id: 'adventure', name: 'Macera', icon: '🏞️', baseClasses: 'bg-orange-100 text-orange-700 border-orange-200 hover:border-orange-400 hover:bg-orange-200', selectedClasses: 'bg-orange-200 text-orange-900 border-orange-500' },
    { id: 'mystery', name: 'Gizem', icon: '🕵️', baseClasses: 'bg-purple-100 text-purple-700 border-purple-200 hover:border-purple-400 hover:bg-purple-200', selectedClasses: 'bg-purple-200 text-purple-900 border-purple-500' },
    { id: 'sci-fi', name: 'Bilim Kurgu', icon: '🚀', baseClasses: 'bg-blue-100 text-blue-700 border-blue-200 hover:border-blue-400 hover:bg-blue-200', selectedClasses: 'bg-blue-200 text-blue-900 border-blue-500' },
    { id: 'fantasy', name: 'Fantastik', icon: '🧙', baseClasses: 'bg-green-100 text-green-700 border-green-200 hover:border-green-400 hover:bg-green-200', selectedClasses: 'bg-green-200 text-green-900 border-green-500' },
    { id: 'funny', name: 'Komik', icon: '😂', baseClasses: 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:border-yellow-400 hover:bg-yellow-200', selectedClasses: 'bg-yellow-200 text-yellow-900 border-yellow-500' },
    { id: 'friendship', name: 'Arkadaşlık', icon: '🤝', baseClasses: 'bg-pink-100 text-pink-700 border-pink-200 hover:border-pink-400 hover:bg-pink-200', selectedClasses: 'bg-pink-200 text-pink-900 border-pink-500' },
    { id: 'school', name: 'Okul', icon: '🏫', baseClasses: 'bg-teal-100 text-teal-700 border-teal-200 hover:border-teal-400 hover:bg-teal-200', selectedClasses: 'bg-teal-200 text-teal-900 border-teal-500' },
    { id: 'nature', name: 'Doğa', icon: '🌳', baseClasses: 'bg-lime-100 text-lime-700 border-lime-200 hover:border-lime-400 hover:bg-lime-200', selectedClasses: 'bg-lime-200 text-lime-900 border-lime-500' },
    { id: 'history', name: 'Tarih', icon: '🏛️', baseClasses: 'bg-amber-100 text-amber-700 border-amber-200 hover:border-amber-400 hover:bg-amber-200', selectedClasses: 'bg-amber-200 text-amber-900 border-amber-500' },
    { id: 'sports', name: 'Spor', icon: '⚽', baseClasses: 'bg-red-100 text-red-700 border-red-200 hover:border-red-400 hover:bg-red-200', selectedClasses: 'bg-red-200 text-red-900 border-red-500' },
    { id: 'art', name: 'Sanat', icon: '🎨', baseClasses: 'bg-cyan-100 text-cyan-700 border-cyan-200 hover:border-cyan-400 hover:bg-cyan-200', selectedClasses: 'bg-cyan-200 text-cyan-900 border-cyan-500' },
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