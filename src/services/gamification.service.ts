import { Injectable, signal, WritableSignal, computed } from '@angular/core';
import { StudentProfile, Badge, AvatarItem } from '../models/gamification.model';
import { ALL_BADGES, ALL_AVATAR_ITEMS, LEVEL_THRESHOLDS } from '../gamification.data';
import { SubTopicId, Topic, SubTopic } from '../models/activity.model';

@Injectable({
  providedIn: 'root'
})
export class GamificationService {
    private readonly profileStorageKey = 'ogrenmeKoprusuStudentProfile';

    studentProfile: WritableSignal<StudentProfile>;
    
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
    }

    private loadProfile(): StudentProfile {
        try {
            const savedProfile = localStorage.getItem(this.profileStorageKey);
            if (savedProfile) {
                const profile = JSON.parse(savedProfile);
                // Ensure completedActivities exists for backward compatibility
                if (!profile.completedActivities) {
                    profile.completedActivities = 0;
                }
                if (!profile.equippedItemIds) {
                    profile.equippedItemIds = [];
                }
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
        };
    }

    private saveProfile(): void {
        try {
            localStorage.setItem(this.profileStorageKey, JSON.stringify(this.studentProfile()));
        } catch (e) {
            console.error('Failed to save student profile to localStorage.', e);
        }
    }

    equipItems(newItemIds: string[]): void {
        this.studentProfile.update(profile => ({
            ...profile,
            equippedItemIds: newItemIds
        }));
        this.saveProfile();
    }

    addPoints(points: number): { newLevel: number | null, newItems: AvatarItem[], newBadges: Badge[] } {
        let newLevel: number | null = null;
        let newItems: AvatarItem[] = [];
        let newBadges: Badge[] = [];
        
        this.studentProfile.update(profile => {
            const oldPoints = profile.points;
            const newPoints = oldPoints + points;
            const newCompletedActivities = (profile.completedActivities || 0) + 1;
            
            // Check for avatar item unlocks based on points
            const newlyUnlockedItems = ALL_AVATAR_ITEMS.filter(item => 
                !profile.unlockedAvatarItemIds.includes(item.id) &&
                item.unlockCondition.type === 'points' &&
                newPoints >= item.unlockCondition.value
            );
            newItems = newlyUnlockedItems;
            const newUnlockedItemIds = newlyUnlockedItems.map(item => item.id);

            // Check for badge unlocks based on points and activity count
            const newlyUnlockedBadgesByPoints = ALL_BADGES.filter(badge =>
                !profile.unlockedBadgeIds.includes(badge.id) &&
                badge.unlockCondition.type === 'points' &&
                // FIX: Add type guard to ensure value is a number before comparison.
                typeof badge.unlockCondition.value === 'number' &&
                newPoints >= badge.unlockCondition.value
            );
             const newlyUnlockedBadgesByActivityCount = ALL_BADGES.filter(badge =>
                !profile.unlockedBadgeIds.includes(badge.id) &&
                badge.unlockCondition.type === 'activitiesCompleted' &&
                // FIX: Add type guard to ensure value is a number before comparison.
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

        // Check for level up
        const levelCheckResult = this.checkForLevelUp();
        if (levelCheckResult.newLevel) {
            newLevel = levelCheckResult.newLevel;
            // Avoid duplicating items/badges if unlocked by both level and another metric simultaneously
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
            // Level up!
            const newlyUnlockedItems = ALL_AVATAR_ITEMS.filter(item =>
                !profile.unlockedAvatarItemIds.includes(item.id) &&
                item.unlockCondition.type === 'level' &&
                nextLevel >= item.unlockCondition.value
            );

            const newlyUnlockedBadges = ALL_BADGES.filter(badge =>
                !profile.unlockedBadgeIds.includes(badge.id) &&
                badge.unlockCondition.type === 'level' &&
                // FIX: Add type guard to ensure value is a number before comparison.
                typeof badge.unlockCondition.value === 'number' &&
                nextLevel >= badge.unlockCondition.value
            );

            this.studentProfile.update(p => ({
                ...p,
                level: nextLevel,
                unlockedAvatarItemIds: [...p.unlockedAvatarItemIds, ...newlyUnlockedItems.map(item => item.id)],
                unlockedBadgeIds: [...p.unlockedBadgeIds, ...newlyUnlockedBadges.map(b => b.id)],
            }));
            
            // Recursively check if the user can level up again
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
                case 'masterTopic':
                    const topic = topicsData[value as Topic];
                    if (topic && topic.subTopics.every((st: SubTopic) => allProgress[st.id] === 3)) {
                         unlocked = true;
                    }
                    break;
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