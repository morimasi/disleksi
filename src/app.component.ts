import { ChangeDetectionStrategy, Component, computed, signal, effect, ElementRef, inject } from '@angular/core';
import { Topic, SubTopic, SubTopicId } from './models/activity.model';
import { ActivityGeneratorComponent } from './components/activity-generator/activity-generator.component';
import { TOPICS_DATA } from './topics.data';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';

type FontSize = 'sm' | 'base' | 'lg';
const fontSizes: FontSize[] = ['sm', 'base', 'lg'];
const fontSizeLabels: Record<FontSize, string> = { sm: 'Küçük', base: 'Normal', lg: 'Büyük' };

export type FeedbackDuration = 'continuous' | 5 | 10;
export interface FeedbackSettings {
  enabled: boolean;
  duration: FeedbackDuration;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ActivityGeneratorComponent, SafeHtmlPipe],
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class AppComponent {
  selectedTopic = signal<Topic | null>(null);
  selectedSubTopic = signal<SubTopic | null>(null);

  topicsData = TOPICS_DATA;
  topicKeys = Object.keys(this.topicsData) as Topic[];

  currentTopicData = computed(() => {
    const topic = this.selectedTopic();
    return topic ? this.topicsData[topic] : null;
  });

  // --- Progress Tracking ---
  progressData = signal<Record<SubTopicId, number>>({});
  private readonly progressStorageKey = 'ogrenmeKoprusuProgressData';

  updateProgress(event: { subTopicId: SubTopicId; successRate: number }): void {
    const currentStars = this.progressData()[event.subTopicId] || 0;
    // Only update if the user did well and hasn't reached the max stars
    if (event.successRate >= 0.8 && currentStars < 3) {
      this.progressData.update(data => ({
        ...data,
        [event.subTopicId]: currentStars + 1
      }));
      try {
        localStorage.setItem(this.progressStorageKey, JSON.stringify(this.progressData()));
      } catch (e) {
        console.error('Could not save progress data to localStorage.', e);
      }
    }
  }

  // --- Accessibility Features ---
  
  // Accessibility Menu
  isAccessibilityMenuOpen = signal(false);
  private elementRef = inject(ElementRef);

  // Dyslexia-friendly font
  isDyslexiaFontEnabled = signal<boolean>(false);
  private readonly fontStorageKey = 'ogrenmeKoprusuFont';

  // Font size adjustment
  fontSize = signal<FontSize>('base');
  private readonly fontSizeStorageKey = 'ogrenmeKoprusuFontSize';

  // Feedback Settings
  feedbackEnabled = signal<boolean>(true);
  feedbackDuration = signal<FeedbackDuration>('continuous');
  private readonly feedbackEnabledStorageKey = 'ogrenmeKoprusuFeedbackEnabled';
  private readonly feedbackDurationStorageKey = 'ogrenmeKoprusuFeedbackDuration';

  feedbackSettings = computed<FeedbackSettings>(() => ({
    enabled: this.feedbackEnabled(),
    duration: this.feedbackDuration(),
  }));


  constructor() {
    // Load all data from localStorage on initialization
    this.loadAllPreferences();

    // Effect to apply/remove dyslexia font class to body
    effect(() => {
      if (this.isDyslexiaFontEnabled()) {
        document.body.classList.add('font-dyslexic');
      } else {
        document.body.classList.remove('font-dyslexic');
      }
    });

    // Effect to apply font size class to body
    effect(() => {
      // Clean up previous classes
      fontSizes.forEach(size => document.body.classList.remove(`font-size-${size}`));
      // Add current class
      document.body.classList.add(`font-size-${this.fontSize()}`);
    });
  }

  private loadAllPreferences(): void {
    try {
      // Progress Data
      const savedProgress = localStorage.getItem(this.progressStorageKey);
      if (savedProgress) {
        this.progressData.set(JSON.parse(savedProgress));
      }

      // Font Preference
      const savedFontPreference = localStorage.getItem(this.fontStorageKey);
      this.isDyslexiaFontEnabled.set(savedFontPreference === 'true');

      // Font Size
      const savedSize = localStorage.getItem(this.fontSizeStorageKey) as FontSize | null;
      if (savedSize && fontSizes.includes(savedSize)) {
        this.fontSize.set(savedSize);
      }

      // Feedback Settings
      const savedEnabled = localStorage.getItem(this.feedbackEnabledStorageKey);
      this.feedbackEnabled.set(savedEnabled !== 'false'); // Defaults to true if null or not 'false'

      const savedDuration = localStorage.getItem(this.feedbackDurationStorageKey);
      if (savedDuration === '5') {
        this.feedbackDuration.set(5);
      } else if (savedDuration === '10') {
        this.feedbackDuration.set(10);
      } else {
        this.feedbackDuration.set('continuous');
      }
    } catch (e) {
      console.error('Could not access localStorage for preferences.', e);
    }
  }
  
  // --- Accessibility Menu Methods ---
  toggleAccessibilityMenu(): void {
    this.isAccessibilityMenuOpen.update(isOpen => !isOpen);
  }

  onDocumentClick(event: MouseEvent): void {
    if (!this.isAccessibilityMenuOpen()) {
      return;
    }
    const container = this.elementRef.nativeElement.querySelector('.accessibility-container');
    if (container && !container.contains(event.target as Node)) {
      this.isAccessibilityMenuOpen.set(false);
    }
  }

  toggleDyslexiaFont(): void {
    this.isDyslexiaFontEnabled.update(enabled => {
        const newState = !enabled;
        try {
            localStorage.setItem(this.fontStorageKey, String(newState));
        } catch (e) {
            console.error('Could not save font preference to localStorage.', e);
        }
        return newState;
    });
  }

  // --- Font Size Methods ---
  fontSizeLabel = computed(() => fontSizeLabels[this.fontSize()]);
  isMinFontSize = computed(() => this.fontSize() === fontSizes[0]);
  isMaxFontSize = computed(() => this.fontSize() === fontSizes[fontSizes.length - 1]);

  private updateFontSize(newSize: FontSize) {
    this.fontSize.set(newSize);
    try {
      localStorage.setItem(this.fontSizeStorageKey, newSize);
    } catch (e) {
      console.error('Could not save font size preference to localStorage.', e);
    }
  }

  increaseFontSize(): void {
    const currentSize = this.fontSize();
    const currentIndex = fontSizes.indexOf(currentSize);
    if (currentIndex < fontSizes.length - 1) {
      this.updateFontSize(fontSizes[currentIndex + 1]);
    }
  }

  decreaseFontSize(): void {
    const currentSize = this.fontSize();
    const currentIndex = fontSizes.indexOf(currentSize);
    if (currentIndex > 0) {
      this.updateFontSize(fontSizes[currentIndex - 1]);
    }
  }
  
  // --- Feedback Settings Methods ---
  toggleFeedbackEnabled(): void {
    this.feedbackEnabled.update(enabled => {
      const newState = !enabled;
      try {
        localStorage.setItem(this.feedbackEnabledStorageKey, String(newState));
      } catch (e) {
        console.error('Could not save feedback enabled state.', e);
      }
      return newState;
    });
  }

  setFeedbackDuration(duration: FeedbackDuration): void {
    this.feedbackDuration.set(duration);
    try {
      localStorage.setItem(this.feedbackDurationStorageKey, String(duration));
    } catch (e) {
      console.error('Could not save feedback duration.', e);
    }
  }


  // --- Navigation Methods ---
  selectTopic(topic: Topic): void {
    this.selectedTopic.set(topic);
    this.selectedSubTopic.set(null);
  }

  selectSubTopic(subTopic: SubTopic): void {
    this.selectedSubTopic.set(subTopic);
  }

  resetToTopics(): void {
    this.selectedTopic.set(null);
    this.selectedSubTopic.set(null);
  }

  resetToSubTopics(): void {
    this.selectedSubTopic.set(null);
  }
}
