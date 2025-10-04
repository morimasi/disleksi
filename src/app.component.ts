import { ChangeDetectionStrategy, Component, computed, signal, effect, ElementRef, inject, WritableSignal } from '@angular/core';
import { Topic, SubTopic, SubTopicId } from './models/activity.model';
import { ActivityGeneratorComponent } from './components/activity-generator/activity-generator.component';
import { TOPICS_DATA } from './topics.data';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { GeminiService } from './services/gemini.service';

type FontSize = 'sm' | 'base' | 'lg';
const fontSizes: FontSize[] = ['sm', 'base', 'lg'];
const fontSizeLabels: Record<FontSize, string> = { sm: 'Küçük', base: 'Normal', lg: 'Büyük' };

export type FeedbackDuration = 'continuous' | 5 | 10;
export interface FeedbackSettings {
  enabled: boolean;
  duration: FeedbackDuration;
}

interface EditableContent {
  title: string;
  description: string;
}

interface SearchResult {
  topicKey: Topic;
  topic: any;
  subTopic: SubTopic;
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
  private geminiService = inject(GeminiService);
  selectedTopic = signal<Topic | null>(null);
  selectedSubTopic = signal<SubTopic | null>(null);
  
  // --- Admin & Login State ---
  showLogin = signal(true);
  isAdmin = signal(false);
  isSidebarOpen = signal(false); // For mobile admin menu
  loginCredentials = signal({ username: '', password: '' });
  loginError = signal<string | null>(null);

  // --- Student Dashboard State ---
  showStudentDashboard = signal(false);
  isGeneratingFeedback = signal(false);
  aiFeedback = signal<string | null>(null);

  // --- Dynamic Content Management ---
  private readonly topicsStorageKey = 'ogrenmeKoprusuTopicsData';
  topicsDataSignal: WritableSignal<Record<Topic, any>>;
  editingState = signal<Record<string, EditableContent>>({});
  
  // --- Custom Prompts Management ---
  customPrompts = signal<Partial<Record<SubTopicId, string[]>>>({});
  private readonly customPromptsStorageKey = 'ogrenmeKoprusuCustomPrompts';
  newPrompt = signal('');

  // --- Notification System ---
  notification = signal<{ message: string; type: 'success' | 'error' } | null>(null);
  private notificationTimeout: any;

  // --- Search Functionality ---
  searchQuery = signal('');
  searchResults = computed<SearchResult[]>(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) {
      return [];
    }
    const data = this.topicsDataSignal();
    const results: SearchResult[] = [];

    for (const topicKey of Object.keys(data) as Topic[]) {
      const topic = data[topicKey];
      // Search topic title and description
      if (topic.title.toLowerCase().includes(query) || topic.description.toLowerCase().includes(query)) {
        // If topic matches, add all its subtopics to results
        for (const subTopic of topic.subTopics) {
           if (!results.some(r => r.subTopic.id === subTopic.id)) {
              results.push({ topicKey, topic, subTopic });
           }
        }
      } else {
        // If topic doesn't match, search subtopics
        for (const subTopic of topic.subTopics) {
          if (subTopic.title.toLowerCase().includes(query) || subTopic.description.toLowerCase().includes(query)) {
            if (!results.some(r => r.subTopic.id === subTopic.id)) {
              results.push({ topicKey, topic, subTopic });
            }
          }
        }
      }
    }
    return results;
  });

  topicKeys = computed(() => Object.keys(this.topicsDataSignal()) as Topic[]);

  currentTopicData = computed(() => {
    const topic = this.selectedTopic();
    return topic ? this.topicsDataSignal()[topic] : null;
  });

  // --- Progress Tracking ---
  // FIX: Changed type to Partial<Record<...>> to allow an empty object as a valid initial state.
  progressData = signal<Partial<Record<SubTopicId, number>>>({});
  private readonly progressStorageKey = 'ogrenmeKoprusuProgressData';

  studentStats = computed(() => {
    const progress = this.progressData();
    const allSubTopics = this.topicKeys().flatMap(key => this.topicsDataSignal()[key].subTopics);
    const maxStars = allSubTopics.length * 3;

    // FIX: Values from localStorage can be strings. Convert to numbers before reducing to prevent type errors.
    const totalStars = Object.values(progress)
      .map(stars => Number(stars || 0))
      .reduce((sum, stars) => sum + stars, 0);

    const totalScore = totalStars * 10; // Each star is 10 points
    const overallPercentage = maxStars > 0 ? Math.round((totalStars / maxStars) * 100) : 0;

    return { totalStars, totalScore, maxStars, overallPercentage };
  });

  topicProgress = computed(() => (topicKey: Topic) => {
    const topicData = this.topicsDataSignal()[topicKey];
    if (!topicData) return { stars: 0, maxStars: 0, percentage: 0 };
    
    const subTopicIds = topicData.subTopics.map((st: SubTopic) => st.id);
    const maxStars = subTopicIds.length * 3;
    const currentProgress = this.progressData();
    
    // FIX: Coerce progress value to a number as it may be a string from localStorage to prevent string concatenation.
    const stars = subTopicIds.reduce((acc: number, id: SubTopicId) => acc + Number(currentProgress[id] || 0), 0);

    const percentage = maxStars > 0 ? Math.round((stars / maxStars) * 100) : 0;
    
    return { stars, maxStars, percentage };
  });

  updateProgress(event: { subTopicId: SubTopicId; successRate: number }): void {
    // FIX: Ensure currentStars is a number to prevent string concatenation (e.g., '1' + 1 results in '11').
    const currentStars = Number(this.progressData()[event.subTopicId] || 0);
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
  isAccessibilityMenuOpen = signal(false);
  private elementRef = inject(ElementRef);
  isDyslexiaFontEnabled = signal<boolean>(false);
  private readonly fontStorageKey = 'ogrenmeKoprusuFont';
  fontSize = signal<FontSize>('base');
  private readonly fontSizeStorageKey = 'ogrenmeKoprusuFontSize';
  feedbackEnabled = signal<boolean>(true);
  feedbackDuration = signal<FeedbackDuration>('continuous');
  private readonly feedbackEnabledStorageKey = 'ogrenmeKoprusuFeedbackEnabled';
  private readonly feedbackDurationStorageKey = 'ogrenmeKoprusuFeedbackDuration';

  feedbackSettings = computed<FeedbackSettings>(() => ({
    enabled: this.feedbackEnabled(),
    duration: this.feedbackDuration(),
  }));

  constructor() {
    // Initialize dynamic topics data
    this.topicsDataSignal = signal(this.loadTopicsData());

    this.loadAllPreferences();
    
    effect(() => {
      document.body.classList.toggle('font-dyslexic', this.isDyslexiaFontEnabled());
    });
    
    effect(() => {
      fontSizes.forEach(size => document.body.classList.remove(`font-size-${size}`));
      document.body.classList.add(`font-size-${this.fontSize()}`);
    });
  }

  // --- Admin & Login Methods ---
  handleLoginInput(field: 'username' | 'password', event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.loginCredentials.update(creds => ({ ...creds, [field]: value }));
  }

  handleAdminLogin(): void {
    const { username, password } = this.loginCredentials();
    if (username === 'admin' && password === 'admin123') {
      this.isAdmin.set(true);
      this.showLogin.set(false);
      this.loginError.set(null);
    } else {
      this.loginError.set('Geçersiz kullanıcı adı veya şifre.');
    }
  }

  continueAsStudent(): void {
    this.showLogin.set(false);
    this.isAdmin.set(false);
  }

  logout(): void {
    this.isAdmin.set(false);
    this.showLogin.set(true);
  }

  // --- Student Dashboard Methods ---
  async openStudentDashboard(): Promise<void> {
    this.showStudentDashboard.set(true);
    this.isGeneratingFeedback.set(true);
    this.aiFeedback.set(null);

    try {
        const progress = this.progressData();
        const topicsData = this.topicsDataSignal();
        let progressString = '';

        this.topicKeys().forEach(topicKey => {
            const topic = topicsData[topicKey];
            progressString += `${topic.title} Alanı:\n`;
            topic.subTopics.forEach((subTopic: SubTopic) => {
                const stars = progress[subTopic.id] || 0;
                progressString += `- ${subTopic.title}: ${stars}/3 yıldız\n`;
            });
        });
        
        const feedback = await this.geminiService.generateDashboardFeedback(progressString);
        this.aiFeedback.set(feedback);
    } catch (error) {
        console.error('Failed to generate AI feedback:', error);
        this.aiFeedback.set('Üzgünüm, şu anda bir geri bildirim oluşturamadım. Lütfen daha sonra tekrar dene.');
    } finally {
        this.isGeneratingFeedback.set(false);
    }
  }

  // --- Content Management Methods ---
  private loadTopicsData(): Record<Topic, any> {
    try {
      const savedData = localStorage.getItem(this.topicsStorageKey);
      return savedData ? JSON.parse(savedData) : TOPICS_DATA;
    } catch (e) {
      console.error('Could not load topics data from localStorage, using default.', e);
      return TOPICS_DATA;
    }
  }

  private saveTopicsData(): void {
    try {
      localStorage.setItem(this.topicsStorageKey, JSON.stringify(this.topicsDataSignal()));
      this.showNotification('Değişiklikler başarıyla kaydedildi.', 'success');
    } catch (e) {
      console.error('Could not save topics data to localStorage.', e);
      this.showNotification('Değişiklikler kaydedilemedi.', 'error');
    }
  }
  
  startEditing(id: string, currentData: EditableContent): void {
    this.editingState.update(state => ({
      ...state,
      [id]: { ...currentData }
    }));
  }

  updateEditingContent(id: string, field: 'title' | 'description', event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.editingState.update(state => ({
      ...state,
      [id]: { ...state[id], [field]: value }
    }));
  }
  
  saveEdit(id: string, isSubTopic: boolean, topicId?: Topic): void {
    const editedContent = this.editingState()[id];
    if (!editedContent) return;

    this.topicsDataSignal.update(data => {
      const newData = JSON.parse(JSON.stringify(data)); // Deep copy to avoid issues
      if (isSubTopic && topicId) {
        const topic = newData[topicId];
        topic.subTopics = topic.subTopics.map((sub: SubTopic) => 
          sub.id === id ? { ...sub, ...editedContent } : sub
        );
      } else {
        const topic = newData[id as Topic];
        topic.title = editedContent.title;
        topic.description = editedContent.description;
      }
      return newData;
    });

    this.saveTopicsData();
    this.cancelEdit(id);
  }

  cancelEdit(id: string): void {
    this.editingState.update(state => {
      const newState = { ...state };
      delete newState[id];
      return newState;
    });
  }

  // --- Custom Prompt Methods ---
  addCustomPrompt(subTopicId: SubTopicId): void {
    const prompt = this.newPrompt().trim();
    if (!prompt) return;

    this.customPrompts.update(prompts => {
      const current = prompts[subTopicId] || [];
      return { ...prompts, [subTopicId]: [...current, prompt] };
    });
    this.saveCustomPrompts();
    this.newPrompt.set('');
  }

  removeCustomPrompt(subTopicId: SubTopicId, index: number): void {
    this.customPrompts.update(prompts => {
      const current = [...(prompts[subTopicId] || [])];
      current.splice(index, 1);
      return { ...prompts, [subTopicId]: current };
    });
    this.saveCustomPrompts();
  }

  private saveCustomPrompts(): void {
    try {
      localStorage.setItem(this.customPromptsStorageKey, JSON.stringify(this.customPrompts()));
    } catch (e) {
      console.error('Could not save custom prompts to localStorage.', e);
    }
  }
  
  private showNotification(message: string, type: 'success' | 'error'): void {
    this.notification.set({ message, type });
    clearTimeout(this.notificationTimeout);
    this.notificationTimeout = setTimeout(() => {
      this.notification.set(null);
    }, 3000);
  }
  
  private loadAllPreferences(): void {
    try {
      const savedProgress = localStorage.getItem(this.progressStorageKey);
      if (savedProgress) this.progressData.set(JSON.parse(savedProgress));

      const savedPrompts = localStorage.getItem(this.customPromptsStorageKey);
      if (savedPrompts) this.customPrompts.set(JSON.parse(savedPrompts));

      this.isDyslexiaFontEnabled.set(localStorage.getItem(this.fontStorageKey) === 'true');

      const savedSize = localStorage.getItem(this.fontSizeStorageKey) as FontSize | null;
      if (savedSize && fontSizes.includes(savedSize)) this.fontSize.set(savedSize);

      this.feedbackEnabled.set(localStorage.getItem(this.feedbackEnabledStorageKey) !== 'false');

      const savedDuration = localStorage.getItem(this.feedbackDurationStorageKey);
      this.feedbackDuration.set(savedDuration === '5' ? 5 : savedDuration === '10' ? 10 : 'continuous');
    } catch (e) {
      console.error('Could not access localStorage for preferences.', e);
    }
  }
  
  toggleAccessibilityMenu(): void {
    this.isAccessibilityMenuOpen.update(isOpen => !isOpen);
  }

  onDocumentClick(event: MouseEvent): void {
    if (this.isAccessibilityMenuOpen()) {
      const container = this.elementRef.nativeElement.querySelector('.accessibility-container');
      if (container && !container.contains(event.target as Node)) {
        this.isAccessibilityMenuOpen.set(false);
      }
    }
  }

  toggleDyslexiaFont(): void {
    this.isDyslexiaFontEnabled.update(enabled => {
        const newState = !enabled;
        try {
            localStorage.setItem(this.fontStorageKey, String(newState));
        } catch (e) {
            console.error('Could not save font preference.', e);
        }
        return newState;
    });
  }

  fontSizeLabel = computed(() => fontSizeLabels[this.fontSize()]);
  isMinFontSize = computed(() => this.fontSize() === fontSizes[0]);
  isMaxFontSize = computed(() => this.fontSize() === fontSizes[fontSizes.length - 1]);

  private updateFontSize(newSize: FontSize) {
    this.fontSize.set(newSize);
    try {
      localStorage.setItem(this.fontSizeStorageKey, newSize);
    } catch (e) {
      console.error('Could not save font size.', e);
    }
  }

  increaseFontSize(): void {
    const currentIndex = fontSizes.indexOf(this.fontSize());
    if (currentIndex < fontSizes.length - 1) {
      this.updateFontSize(fontSizes[currentIndex + 1]);
    }
  }

  decreaseFontSize(): void {
    const currentIndex = fontSizes.indexOf(this.fontSize());
    if (currentIndex > 0) {
      this.updateFontSize(fontSizes[currentIndex - 1]);
    }
  }
  
  toggleFeedbackEnabled(): void {
    this.feedbackEnabled.update(enabled => {
      const newState = !enabled;
      try {
        localStorage.setItem(this.feedbackEnabledStorageKey, String(newState));
      } catch (e) { console.error('Could not save feedback state.', e); }
      return newState;
    });
  }

  setFeedbackDuration(duration: FeedbackDuration): void {
    this.feedbackDuration.set(duration);
    try {
      localStorage.setItem(this.feedbackDurationStorageKey, String(duration));
    } catch (e) { console.error('Could not save feedback duration.', e); }
  }

  selectTopic(topic: Topic): void {
    this.selectedTopic.set(topic);
    this.selectedSubTopic.set(null);
  }

  selectSubTopic(subTopic: SubTopic): void {
    this.selectedSubTopic.set(subTopic);
  }

  selectSearchResult(result: SearchResult): void {
    this.selectedTopic.set(result.topicKey);
    this.selectedSubTopic.set(result.subTopic);
    this.searchQuery.set(''); // Clear search after selection
  }

  resetToTopics(): void {
    this.selectedTopic.set(null);
    this.selectedSubTopic.set(null);
  }

  resetToSubTopics(): void {
    this.selectedSubTopic.set(null);
  }
}