import { Injectable, signal, WritableSignal, computed } from '@angular/core';
import { StudentProfile, Badge, AvatarItem, DailyChallenge, ActivityRecord } from '../models/gamification.model';
import { ALL_BADGES, ALL_AVATAR_ITEMS, LEVEL_THRESHOLDS } from '../gamification.data';
import { SubTopicId, Topic, SubTopic } from '../models/activity.model';
import { TOPICS_DATA } from '../topics.data';

@Injectable({
  providedIn: 'root'
})
export class GamificationService {
    private readonly profileStorageKey = 'ogrenmeKoprusuStudentProfile';

    studentProfile: WritableSignal<StudentProfile>;
    dailyChallenge = signal<DailyChallenge | null>(null);
    
    unlockedBadges = computed(() => {
        const profile = this.studentProfile();
        return ALL_BADGES.filter(badge => profile.unlockedBadgeIds.includes(badge.id));
    });

    unlockedAvatarItems = computed(() => {
        const profile = this.studentProfile();
        return ALL_AVATAR_ITEMS.filter(item => profile.unlockedAvatarItemIds.includes(item.id));
    });
    
    currentLevelInfo = computed(() => {
        const profile = this.studentProfile();
        const currentLevel = profile.level;
        const currentLevelPoints = LEVEL_THRESHOLDS[currentLevel];
        const nextLevel = currentLevel + 1;
        const nextLevelPoints = LEVEL_THRESHOLDS[nextLevel];

        if (!nextLevelPoints) { // Max level reached
            return {
                level: currentLevel,
                points: profile.points,
                progressPercentage: 100,
                pointsToNextLevel: 0
            };
        }

        const pointsInCurrentLevel = profile.points - currentLevelPoints;
        const pointsForNextLevel = nextLevelPoints - currentLevelPoints;
        const progressPercentage = Math.round((pointsInCurrentLevel / pointsForNextLevel) * 100);
        
        return {
            level: currentLevel,
            points: profile.points,
            progressPercentage,
            pointsToNextLevel: nextLevelPoints - profile.points
        };
    });


    constructor() {
        this.studentProfile = signal(this.loadProfile());
        this.checkForNewDay();
        this.generateDailyChallenge();
    }

    private loadProfile(): StudentProfile {
        try {
            const savedProfile = localStorage.getItem(this.profileStorageKey);
            if (savedProfile) {
                const profile = JSON.parse(savedProfile);
                // Ensure new fields exist for backward compatibility
                if (!profile.completedActivities) profile.completedActivities = 0;
                if (!profile.equippedItemIds) profile.equippedItemIds = [];
                if (!profile.currentStreak) profile.currentStreak = 0;
                if (!profile.lastActivityDate) profile.lastActivityDate = null;
                if (!profile.dailyChallengeCompleted) profile.dailyChallengeCompleted = false;
                if (!profile.lastChallengeDate) profile.lastChallengeDate = null;
                if (!profile.activityHistory) profile.activityHistory = [];
                return profile;
            }
        } catch (e) {
            console.error('Failed to load student profile from localStorage.', e);
        }
        // Return default profile if nothing is saved or loading fails
        return {
            level: 1,
            points: 0,
            completedActivities: 0,
            unlockedBadgeIds: [],
            unlockedAvatarItemIds: [],
            equippedItemIds: [],
            currentStreak: 0,
            lastActivityDate: null,
            dailyChallengeCompleted: false,
            lastChallengeDate: null,
            activityHistory: [],
        };
    }

    private saveProfile(): void {
        try {
            localStorage.setItem(this.profileStorageKey, JSON.stringify(this.studentProfile()));
        } catch (e) {
            console.error('Failed to save student profile to localStorage.', e);
        }
    }

    private getTodayDateString(): string {
        return new Date().toISOString().split('T')[0];
    }

    checkForNewDay(): void {
        const today = this.getTodayDateString();
        const profile = this.studentProfile();
        const lastChallengeDate = profile.lastChallengeDate;
        const lastActivityDate = profile.lastActivityDate;
        let needsUpdate = false;
        let updatedProfile = { ...profile };

        // 1. Reset daily challenge if it's a new day
        if (lastChallengeDate !== today) {
            updatedProfile.dailyChallengeCompleted = false;
            updatedProfile.lastChallengeDate = today;
            this.generateDailyChallenge();
            needsUpdate = true;
        }

        // 2. Check and reset streak if needed
        if (lastActivityDate) {
            const lastDate = new Date(lastActivityDate);
            const todayDate = new Date(today);
            const yesterdayDate = new Date(todayDate);
            yesterdayDate.setDate(yesterdayDate.getDate() - 1);
            
            // If the last activity was not today or yesterday, reset streak.
            if (lastDate.toDateString() !== todayDate.toDateString() && lastDate.toDateString() !== yesterdayDate.toDateString()) {
                 updatedProfile.currentStreak = 0;
                 needsUpdate = true;
            }
        }

        if (needsUpdate) {
            this.studentProfile.set(updatedProfile);
            this.saveProfile();
        }
    }

    // FIX: Corrected type error by ensuring daily challenges are only generated from subtopics with a valid `SubTopicId`.
    generateDailyChallenge(): void {
        const today = this.getTodayDateString();
        // Generate only if it's for a new day.
        if (this.studentProfile().lastChallengeDate === today && this.dailyChallenge()) {
            return;
        }

        const allSubTopics: { topic: Topic; subTopicId: SubTopicId; title: string }[] = [];
        (Object.keys(TOPICS_DATA) as Topic[]).forEach(topicKey => {
            TOPICS_DATA[topicKey].subTopics.forEach(subTopic => {
                if (subTopic.id !== 'interactive-story' && subTopic.id !== 'word-explorer' && subTopic.id !== 'creative-writing-prompts' && subTopic.id !== 'review') {
                    allSubTopics.push({ topic: topicKey, subTopicId: subTopic.id, title: subTopic.title });
                }
            });
        });

        if (allSubTopics.length === 0) {
            this.dailyChallenge.set(null);
            return;
        }

        const randomIndex = Math.floor(Math.random() * allSubTopics.length);
        const challengeInfo = allSubTopics[randomIndex];
        
        const newChallenge: DailyChallenge = {
            topic: challengeInfo.topic,
            subTopicId: challengeInfo.subTopicId,
            title: challengeInfo.title,
            description: `"${TOPICS_DATA[challengeInfo.topic].title}" kategorisinden bir etkinlik.`
        };

        this.dailyChallenge.set(newChallenge);
    }

    private updateStreak(): { streakUpdated: boolean, newStreak: number } {
        const today = this.getTodayDateString();
        let streakUpdated = false;
        let newStreak = this.studentProfile().currentStreak;

        this.studentProfile.update(profile => {
            const lastActivity = profile.lastActivityDate;
            
            if (!lastActivity) { // First activity ever
                newStreak = 1;
                streakUpdated = true;
            } else if (lastActivity !== today) {
                const lastDate = new Date(lastActivity);
                const todayDate = new Date(today);
                const yesterdayDate = new Date(todayDate);
                yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                
                if (lastDate.toDateString() === yesterdayDate.toDateString()) {
                    newStreak = profile.currentStreak + 1;
                    streakUpdated = true;
                } else {
                    newStreak = 1;
                    streakUpdated = true;
                }
            }

            return { ...profile, currentStreak: newStreak, lastActivityDate: today };
        });
        
        return { streakUpdated, newStreak };
    }

    recordActivityCompletion(subTopicId: SubTopicId | 'review', topic: Topic): { streakUpdated: boolean, newStreak: number } {
      // FIX: The type guard `subTopicId !== 'review'` was not being correctly inferred inside the signal's `update` closure.
      // Capturing the narrowed type in a new constant before the closure ensures the correct type is used.
      if (subTopicId !== 'review') {
        const activitySubTopicId = subTopicId;
        this.studentProfile.update(profile => {
            const newHistory: ActivityRecord[] = [...(profile.activityHistory || []), { date: this.getTodayDateString(), subTopicId: activitySubTopicId, topic }];
            // Optional: limit history size to last ~3 months
            if (newHistory.length > 200) {
                newHistory.shift();
            }
            return { ...profile, activityHistory: newHistory };
        });
      }

        const result = this.updateStreak();
        this.saveProfile(); // a single save operation after all updates
        return result;
    }

    completeDailyChallenge(): { points: number, newLevel: number | null, newItems: AvatarItem[], newBadges: Badge[] } {
        const bonusPoints = 100;
        let unlockResult = { newLevel: null as number | null, newItems: [] as AvatarItem[], newBadges: [] as Badge[] };

        const wasAlreadyCompleted = this.studentProfile().dailyChallengeCompleted;
        if (wasAlreadyCompleted) {
            return { points: 0, ...unlockResult };
        }

        this.studentProfile.update(profile => ({...profile, dailyChallengeCompleted: true}));
        
        unlockResult = this.addPoints(bonusPoints, { isActivityCompletion: false });
        
        return { points: bonusPoints, ...unlockResult };
    }

    equipItems(newItemIds: string[]): void {
        this.studentProfile.update(profile => ({
            ...profile,
            equippedItemIds: newItemIds
        }));
        this.saveProfile();
    }

    addPoints(points: number, options: { isActivityCompletion?: boolean } = {}): { newLevel: number | null, newItems: AvatarItem[], newBadges: Badge[] } {
        const { isActivityCompletion = true } = options;
        let newLevel: number | null = null;
        let newItems: AvatarItem[] = [];
        let newBadges: Badge[] = [];
        
        this.studentProfile.update(profile => {
            const oldPoints = profile.points;
            const newPoints = oldPoints + points;
            const newCompletedActivities = (profile.completedActivities || 0) + (isActivityCompletion ? 1 : 0);
            
            const newlyUnlockedItems = ALL_AVATAR_ITEMS.filter(item => 
                !profile.unlockedAvatarItemIds.includes(item.id) &&
                item.unlockCondition.type === 'points' &&
                newPoints >= item.unlockCondition.value
            );
            newItems = newlyUnlockedItems;
            const newUnlockedItemIds = newlyUnlockedItems.map(item => item.id);

            const newlyUnlockedBadgesByPoints = ALL_BADGES.filter(badge =>
                !profile.unlockedBadgeIds.includes(badge.id) &&
                badge.unlockCondition.type === 'points' &&
                typeof badge.unlockCondition.value === 'number' &&
                newPoints >= badge.unlockCondition.value
            );
             const newlyUnlockedBadgesByActivityCount = ALL_BADGES.filter(badge =>
                !profile.unlockedBadgeIds.includes(badge.id) &&
                badge.unlockCondition.type === 'activitiesCompleted' &&
                typeof badge.unlockCondition.value === 'number' &&
                newCompletedActivities >= badge.unlockCondition.value
            );
            newBadges.push(...newlyUnlockedBadgesByPoints, ...newlyUnlockedBadgesByActivityCount);
            const newUnlockedBadgeIds = newBadges.map(b => b.id);

            return {
                ...profile,
                points: newPoints,
                completedActivities: newCompletedActivities,
                unlockedAvatarItemIds: [...profile.unlockedAvatarItemIds, ...newUnlockedItemIds],
                unlockedBadgeIds: [...profile.unlockedBadgeIds, ...newUnlockedBadgeIds]
            };
        });

        const levelCheckResult = this.checkForLevelUp();
        if (levelCheckResult.newLevel) {
            newLevel = levelCheckResult.newLevel;
            levelCheckResult.newItems.forEach(item => {
                if (!newItems.some(i => i.id === item.id)) newItems.push(item);
            });
            levelCheckResult.newBadges.forEach(badge => {
                if (!newBadges.some(b => b.id === badge.id)) newBadges.push(badge);
            });
        }

        this.saveProfile();
        return { newLevel, newItems, newBadges };
    }

    private checkForLevelUp(): { newLevel: number | null, newItems: AvatarItem[], newBadges: Badge[] } {
        const profile = this.studentProfile();
        const currentLevel = profile.level;
        const nextLevel = currentLevel + 1;
        const pointsNeeded = LEVEL_THRESHOLDS[nextLevel];
        
        if (pointsNeeded && profile.points >= pointsNeeded) {
            const newlyUnlockedItems = ALL_AVATAR_ITEMS.filter(item =>
                !profile.unlockedAvatarItemIds.includes(item.id) &&
                item.unlockCondition.type === 'level' &&
                nextLevel >= item.unlockCondition.value
            );

            const newlyUnlockedBadges = ALL_BADGES.filter(badge =>
                !profile.unlockedBadgeIds.includes(badge.id) &&
                badge.unlockCondition.type === 'level' &&
                typeof badge.unlockCondition.value === 'number' &&
                nextLevel >= badge.unlockCondition.value
            );

            this.studentProfile.update(p => ({
                ...p,
                level: nextLevel,
                unlockedAvatarItemIds: [...p.unlockedAvatarItemIds, ...newlyUnlockedItems.map(item => item.id)],
                unlockedBadgeIds: [...p.unlockedBadgeIds, ...newlyUnlockedBadges.map(b => b.id)],
            }));
            
            const furtherLevelUps = this.checkForLevelUp();

            return {
                newLevel: nextLevel,
                newItems: [...newlyUnlockedItems, ...furtherLevelUps.newItems],
                newBadges: [...newlyUnlockedBadges, ...furtherLevelUps.newBadges],
            };
        }
        
        return { newLevel: null, newItems: [], newBadges: [] };
    }

    checkContextualBadges(
        completedSubTopicId: SubTopicId,
        allProgress: Partial<Record<SubTopicId, number>>,
        topicsData: Record<Topic, any>,
        isPerfectScore: boolean
    ): Badge[] {
        const newlyUnlockedBadges: Badge[] = [];
        const profile = this.studentProfile();

        ALL_BADGES.forEach(badge => {
            if (profile.unlockedBadgeIds.includes(badge.id)) return;

            let unlocked = false;
            const { type, value } = badge.unlockCondition;

            switch (type) {
                case 'perfectScore':
                     if (isPerfectScore) {
                        unlocked = true;
                     }
                    break;
                case 'masterSubTopic':
                    if (completedSubTopicId === value && allProgress[completedSubTopicId] === 3) {
                        unlocked = true;
                    }
                    break;
                case 'masterTopic': {
                    const topic = topicsData[value as Topic];
                    if (topic && topic.subTopics) {
                        const allMastered = (topic.subTopics as SubTopic[])
                            .filter((st: SubTopic) => st.id !== 'review' && st.id !== 'interactive-story' && st.id !== 'word-explorer')
                            .every((subTopic: SubTopic) => allProgress[subTopic.id as SubTopicId] === 3);

                        if (allMastered) {
                            unlocked = true;
                        }
                    }
                    break;
                }
            }

            if (unlocked) {
                newlyUnlockedBadges.push(badge);
            }
        });

        if (newlyUnlockedBadges.length > 0) {
            this.studentProfile.update(p => ({
                ...p,
                unlockedBadgeIds: [...p.unlockedBadgeIds, ...newlyUnlockedBadges.map(b => b.id)]
            }));
            this.saveProfile();
        }

        return newlyUnlockedBadges;
    }
}
