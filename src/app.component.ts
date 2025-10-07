import { ChangeDetectionStrategy, Component, computed, signal, effect, ElementRef, inject, WritableSignal } from '@angular/core';
import { Topic, SubTopic, SubTopicId, Activity } from './models/activity.model';
import { ActivityGeneratorComponent } from './components/activity-generator/activity-generator.component';
import { TOPICS_DATA } from './topics.data';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { GeminiService } from './services/gemini.service';
import { GamificationService } from './services/gamification.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ActivityDisplayComponent } from './components/activity-display/activity-display.component';
import { AvatarCustomizerComponent } from './components/avatar-customizer/avatar-customizer.component';
import { ALL_AVATAR_ITEMS } from './gamification.data';
import { FiveWOneHComponent } from './components/five-w-one-h/five-w-one-h.component';
import { LevelUpModalComponent } from './components/level-up-modal/level-up-modal.component';
import { Badge, AvatarItem } from './models/gamification.model';
import { SkeletonLoaderComponent } from './components/skeleton-loader/skeleton-loader.component';

type FontSize = 'sm' | 'base' | 'lg';
const fontSizes: FontSize[] = ['sm', 'base', 'lg'];
const fontLabels: Record<FontSize, string> = { sm: 'Küçük', base: 'Normal', lg: 'Büyük' };

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

export type Theme = 'bridge' | 'forest' | 'ocean' | 'sunset';
export const themes: { id: Theme, name: string, color: string }[] = [
    { id: 'bridge', name: 'Köprü', color: 'bg-indigo-500' },
    { id: 'forest', name: 'Orman', color: 'bg-green-500' },
    { id: 'ocean', name: 'Okyanus', color: 'bg-cyan-500' },
    { id: 'sunset', name: 'Gün Batımı', color: 'bg-orange-500' },
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ActivityGeneratorComponent, ActivityDisplayComponent, SafeHtmlPipe, AvatarCustomizerComponent, FiveWOneHComponent, LevelUpModalComponent, SkeletonLoaderComponent],
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class AppComponent {
  private geminiService = inject(GeminiService);
  gamificationService = inject(GamificationService);
  selectedTopic = signal<Topic | null>(null);
  selectedSubTopic = signal<SubTopic | null>(null);
  
  // --- Admin & Login State ---
  showLogin = signal(true);
  isAdmin = signal(false);
  
  loginCredentials = signal({ username: '', password: '' });
  loginError = signal<string | null>(null);

  // --- Student Dashboard State ---
  currentView = signal<'activities' | 'profile' | '5n1k'>('activities');
  isGeneratingPdf = signal(false);
  showAvatarCustomizer = signal(false);

  // Navigation items for the new top navbar
  navItems = [
    {id: 'activities', name: 'Etkinlikler', icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20M1.222 11.222L12 17l10.778-5.778'}, 
    {id: '5n1k', name: '5N1K', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'},
    {id: 'profile', name: 'Profil', icon: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z'}
  ];
  
  // --- Dynamic Content Management ---
  private readonly topicsStorageKey = 'ogrenmeKoprusuTopicsData';
  topicsDataSignal: WritableSignal<Record<Topic, any>>;
  editingState = signal<Record<string, EditableContent>>({});
  
  // --- Custom Prompts Management ---
  customPrompts = signal<Partial<Record<SubTopicId, string[]>>>({});
  private readonly customPromptsStorageKey = 'ogrenmeKoprusuCustomPrompts';
  newPrompt = signal('');

  // --- Notification System ---
  notification = signal<{ message: string; type: 'success' | 'error' | 'achievement' } | null>(null);
  private notificationTimeout: any;

  // --- Gamification Enhancement ---
  levelUpInfo = signal<{ level: number; rewards: (Badge | AvatarItem)[] } | null>(null);

  // --- Smart Review System ---
  activeReviewActivity = signal<Activity | null>(null);
  isGeneratingReview = signal(false);
  
  // --- Practice Mode ---
  practiceModeSourceView = signal<'activities' | 'profile' | '5n1k' | null>(null);

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
  progressData = signal<Partial<Record<SubTopicId, number>>>({});
  private readonly progressStorageKey = 'ogrenmeKoprusuProgressData';

  strengths = computed(() => {
    const progress = this.progressData();
    const allSubTopics = this.topicKeys().flatMap(key => this.topicsDataSignal()[key].subTopics);
    return allSubTopics.filter(st => progress[st.id] === 3);
  });

  areasForImprovement = computed(() => {
    const progress = this.progressData();
    const allSubTopics = this.topicKeys().flatMap(key => this.topicsDataSignal()[key].subTopics);
    return allSubTopics.filter(st => (progress[st.id] || 0) < 3).sort((a,b) => (progress[a.id] || 0) - (progress[b.id] || 0));
  });

  weeklyActivityReport = computed(() => {
    const history = this.gamificationService.studentProfile().activityHistory || [];
    const topicsData = this.topicsDataSignal();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const last7Days: { day: string, count: number }[] = [];
    const dayLabels = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    
    let totalThisWeek = 0;
    const topicCounts: Record<string, number> = {};

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        const activitiesOnThisDay = history.filter(h => h.date === dateString);
        const count = activitiesOnThisDay.length;
        
        if(i <= 6) { // Count only for the past 7 days including today
            totalThisWeek += count;
            activitiesOnThisDay.forEach(activity => {
                topicCounts[activity.topic] = (topicCounts[activity.topic] || 0) + 1;
            });
        }

        last7Days.push({
            day: dayLabels[date.getDay()],
            count: count
        });
    }

    let mostPracticedTopic = 'Yok';
    if (Object.keys(topicCounts).length > 0) {
        const mostPracticedTopicKey = Object.keys(topicCounts).reduce((a, b) => topicCounts[a] > topicCounts[b] ? a : b);
        mostPracticedTopic = topicsData[mostPracticedTopicKey as Topic]?.title || 'Bilinmiyor';
    }
    
    const maxCount = Math.max(...last7Days.map(d => d.count), 1);

    return {
        chartData: last7Days,
        totalThisWeek,
        mostPracticedTopic,
        maxCount
    };
  });

  getTopicProgress(topicKey: Topic) {
    const topicData = this.topicsDataSignal()[topicKey];
    if (!topicData) return { stars: 0, maxStars: 0, percentage: 0 };
    
    const subTopicIds = topicData.subTopics.map((st: SubTopic) => st.id);
    const maxStars = subTopicIds.length * 3;
    const currentProgress = this.progressData();
    
    const stars = subTopicIds.reduce((acc: number, id: SubTopicId) => acc + Number(currentProgress[id] || 0), 0);

    const percentage = maxStars > 0 ? Math.round((stars / maxStars) * 100) : 0;
    
    return { stars, maxStars, percentage };
  }

  updateProgress(event: { subTopicId: SubTopicId | 'review'; topic: Topic; successRate: number, correctAnswers: number, totalQuestions: number }): void {
    if (event.subTopicId !== 'review') {
      const subTopicId = event.subTopicId;
      const currentStars = Number(this.progressData()[subTopicId] || 0);

      if (event.successRate >= 0.8 && currentStars < 3) {
        const newStars = currentStars + 1;
        this.progressData.update(data => ({
          ...data,
          [subTopicId]: newStars
        }));
        try {
          localStorage.setItem(this.progressStorageKey, JSON.stringify(this.progressData()));
        } catch (e) {
          console.error('Could not save progress data to localStorage.', e);
        }
      }

      const isPerfect = event.correctAnswers === event.totalQuestions;
      const contextualBadges = this.gamificationService.checkContextualBadges(subTopicId, this.progressData(), this.topicsDataSignal(), isPerfect);
      if (this.notifyOnBadgeUnlock()) {
        [...contextualBadges].forEach(unlockable => {
          this.showNotification(`Yeni Rozet: ${unlockable.name} ${unlockable.icon}`, 'achievement');
        });
      }
    }
    
    // Add points
    const pointsToAdd = event.correctAnswers * 10;
    const activityBonus = event.successRate >= 0.8 ? 50 : 0;
    const { newLevel, newItems, newBadges } = this.gamificationService.addPoints(pointsToAdd + activityBonus);

    // Show LEVEL UP MODAL instead of toast for level ups
    if (newLevel) {
        this.levelUpInfo.set({ level: newLevel, rewards: [...newItems, ...newBadges] });
    } else {
        // If not leveling up, show individual item/badge notifications
        if (this.notifyOnBadgeUnlock()) {
          [...newItems, ...newBadges].forEach(unlockable => {
            this.showNotification(`Yeni Ödül: ${unlockable.name} ${unlockable.icon}`, 'achievement');
          });
        }
    }
    
    // Update streak and activity history
    const streakResult = this.gamificationService.recordActivityCompletion(event.subTopicId, event.topic);
    if (this.notifyOnStreak() && streakResult.streakUpdated && streakResult.newStreak > 1) {
      this.showNotification(`${streakResult.newStreak} günlük seri! 🔥`, 'achievement');
    }

    // Check for daily challenge completion
    const dailyChallenge = this.gamificationService.dailyChallenge();
    if (dailyChallenge && event.subTopicId === dailyChallenge.subTopicId && !this.gamificationService.studentProfile().dailyChallengeCompleted) {
        const challengeResult = this.gamificationService.completeDailyChallenge();
        this.showNotification(`Günlük Görev Tamamlandı! +${challengeResult.points} Puan!`, 'achievement');
        // Handle notifications for unlocks from the daily challenge bonus
        if (challengeResult.newLevel) {
          // If a level up happens from daily challenge, show the modal as well
           this.levelUpInfo.set({ level: challengeResult.newLevel, rewards: [...challengeResult.newItems, ...challengeResult.newBadges] });
        } else {
            if (this.notifyOnBadgeUnlock()) {
              [...challengeResult.newItems, ...challengeResult.newBadges].forEach(unlockable => {
                this.showNotification(`Yeni Ödül: ${unlockable.name} ${unlockable.icon}`, 'achievement');
              });
            }
        }
    }
  }

  closeLevelUpModal(): void {
    this.levelUpInfo.set(null);
  }

  startDailyChallenge(): void {
    const challenge = this.gamificationService.dailyChallenge();
    if (!challenge || this.gamificationService.studentProfile().dailyChallengeCompleted) return;

    const topicData = this.topicsDataSignal()[challenge.topic];
    const subTopicData = topicData.subTopics.find((st: SubTopic) => st.id === challenge.subTopicId);

    if (subTopicData) {
        this.selectTopic(challenge.topic);
        this.selectSubTopic(subTopicData);
        this.currentView.set('activities');
    }
  }

  // --- Accessibility & Theming Features ---
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

  // --- Gamification Settings ---
  notifyOnStreak = signal<boolean>(true);
  notifyOnBadgeUnlock = signal<boolean>(true);
  dailyChallengeReminder = signal<boolean>(true);
  private readonly gamificationSettingsStorageKey = 'ogrenmeKoprusuGamificationSettings';


  // Theming
  private readonly themeStorageKey = 'ogrenmeKoprusuTheme';
  themes = themes;
  activeTheme = signal<Theme>(this.loadTheme());

  feedbackSettings = computed<FeedbackSettings>(() => ({
    enabled: this.feedbackEnabled(),
    duration: this.feedbackDuration(),
  }));

  equippedAvatarItems = computed(() => {
    const equippedIds = this.gamificationService.studentProfile().equippedItemIds;
    return ALL_AVATAR_ITEMS.filter(item => equippedIds.includes(item.id));
  });

  constructor() {
    this.topicsDataSignal = signal(this.loadTopicsData());
    this.loadAllPreferences();
    
    effect(() => {
      document.body.classList.toggle('font-dyslexic', this.isDyslexiaFontEnabled());
    });
    
    effect(() => {
      fontSizes.forEach(size => document.body.classList.remove(`font-size-${size}`));
      document.body.classList.add(`font-size-${this.fontSize()}`);
    });

    effect(() => {
        const theme = this.activeTheme();
        document.documentElement.dataset.theme = theme;
        try {
            localStorage.setItem(this.themeStorageKey, theme);
        } catch (e) {
            console.error('Could not save theme.', e);
        }
    });
  }

  private loadTheme(): Theme {
    try {
        const savedTheme = localStorage.getItem(this.themeStorageKey) as Theme | null;
        return savedTheme && themes.some(t => t.id === savedTheme) ? savedTheme : 'bridge';
    } catch (e) {
        return 'bridge';
    }
  }

  setTheme(theme: Theme): void {
    this.activeTheme.set(theme);
  }

  handleSaveAvatar(newItemIds: string[]): void {
    this.gamificationService.equipItems(newItemIds);
    this.showNotification('Görünümün kaydedildi!', 'success');
  }

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

  setView(view: 'activities' | 'profile' | '5n1k'): void {
    this.currentView.set(view);
  }

  async startTopicReview(topicKey: Topic): Promise<void> {
    this.isGeneratingReview.set(true);
    this.currentView.set('activities'); // Go back to the main screen to show the activity

    try {
        const allWeakSubTopics = this.areasForImprovement();
        const topicSubTopicIds = this.topicsDataSignal()[topicKey].subTopics.map((st: SubTopic) => st.id);
        
        const weakSubTopicsForTopic = allWeakSubTopics.filter(st => topicSubTopicIds.includes(st.id));

        if (weakSubTopicsForTopic.length === 0) {
            this.showNotification('Bu konuda geliştirilecek bir alan bulunamadı. Harika!', 'success');
            this.currentView.set('profile'); // Re-open dashboard
            return;
        }

        const reviewActivity = await this.geminiService.generateReviewActivity(topicKey, weakSubTopicsForTopic);
        this.activeReviewActivity.set(reviewActivity);

    } catch(e: any) {
        this.showNotification(e.message || 'Tekrar etkinliği oluşturulamadı.', 'error');
        // If it fails, don't leave the user on a blank screen
        if (!this.selectedTopic()) {
            this.resetToTopics();
        }
    } finally {
        this.isGeneratingReview.set(false);
    }
  }

  endReviewActivity(): void {
    this.activeReviewActivity.set(null);
    this.resetToTopics();
  }


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
      const newData = JSON.parse(JSON.stringify(data));
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
  
  private showNotification(message: string, type: 'success' | 'error' | 'achievement'): void {
    this.notification.set({ message, type });
    clearTimeout(this.notificationTimeout);
    this.notificationTimeout = setTimeout(() => {
      this.notification.set(null);
    }, 4000);
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

      const savedGamificationSettings = localStorage.getItem(this.gamificationSettingsStorageKey);
      if (savedGamificationSettings) {
        const settings = JSON.parse(savedGamificationSettings);
        this.notifyOnStreak.set(settings.notifyOnStreak ?? true);
        this.notifyOnBadgeUnlock.set(settings.notifyOnBadgeUnlock ?? true);
        this.dailyChallengeReminder.set(settings.dailyChallengeReminder ?? true);
      }
    } catch (e) {
      console.error('Could not access localStorage for preferences.', e);
    }
  }
  
  toggleAccessibilityMenu(): void {
    this.isAccessibilityMenuOpen.update(isOpen => !isOpen);
  }

  onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node;
    if (this.isAccessibilityMenuOpen()) {
      const container = this.elementRef.nativeElement.querySelector('.accessibility-container');
      if (container && !container.contains(target)) {
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

  fontSizeLabel = computed(() => fontLabels[this.fontSize()]);
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
  
  private saveGamificationSettings(): void {
    try {
      const settings = {
        notifyOnStreak: this.notifyOnStreak(),
        notifyOnBadgeUnlock: this.notifyOnBadgeUnlock(),
        dailyChallengeReminder: this.dailyChallengeReminder()
      };
      localStorage.setItem(this.gamificationSettingsStorageKey, JSON.stringify(settings));
    } catch(e) {
      console.error('Could not save gamification settings.', e);
    }
  }
  
  toggleNotifyOnStreak(): void {
    this.notifyOnStreak.update(v => !v);
    this.saveGamificationSettings();
  }

  toggleNotifyOnBadgeUnlock(): void {
    this.notifyOnBadgeUnlock.update(v => !v);
    this.saveGamificationSettings();
  }
  
  toggleDailyChallengeReminder(): void {
    this.dailyChallengeReminder.update(v => !v);
    this.saveGamificationSettings();
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
    this.activeReviewActivity.set(null);
  }

  resetToSubTopics(): void {
    this.selectedSubTopic.set(null);
  }

  startPractice(subTopicToPractice: SubTopic): void {
    const data = this.topicsDataSignal();
    const parentTopicKey = this.topicKeys().find(key => 
      data[key].subTopics.some((st: SubTopic) => st.id === subTopicToPractice.id)
    );

    if (parentTopicKey) {
      this.practiceModeSourceView.set(this.currentView());
      this.selectTopic(parentTopicKey);
      this.selectSubTopic(subTopicToPractice);
      this.currentView.set('activities');
    } else {
      console.error("Could not find parent topic for subtopic:", subTopicToPractice);
      this.showNotification('Etkinlik başlatılırken bir hata oluştu.', 'error');
    }
  }

  handlePracticeFinished(): void {
    const sourceView = this.practiceModeSourceView();
    if (sourceView) {
      this.setView(sourceView);
      this.resetToTopics();
      this.practiceModeSourceView.set(null);
    }
  }

  async downloadPdfReport(): Promise<void> {
    this.isGeneratingPdf.set(true);
    await new Promise(resolve => setTimeout(resolve, 50)); 
    
    const reportElement = document.querySelector('.printable-area') as HTMLElement;
    if (!reportElement) {
        console.error('Report element not found!');
        this.isGeneratingPdf.set(false);
        this.showNotification('Rapor oluşturulurken bir hata oluştu.', 'error');
        return;
    }

    try {
        const canvas = await html2canvas(reportElement, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#f8fafc' // a light background color matching the theme
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const canvasRatio = canvasWidth / canvasHeight;

        let imgWidth = pdfWidth - 20; // with margin
        let imgHeight = imgWidth / canvasRatio;
        
        if (imgHeight > pdfHeight - 20) {
            imgHeight = pdfHeight - 20;
            imgWidth = imgHeight * canvasRatio;
        }

        const xOffset = (pdfWidth - imgWidth) / 2;
        const yOffset = 10;

        pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
        pdf.save('basari-raporu.pdf');
    } catch (error) {
        console.error('Error generating PDF:', error);
        this.showNotification('Rapor PDF olarak indirilemedi.', 'error');
    } finally {
        this.isGeneratingPdf.set(false);
    }
  }
}
