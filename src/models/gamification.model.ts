import { SubTopicId, Topic } from "./activity.model";

export type AvatarItemCategory = 'head' | 'eyes' | 'neck' | 'accessory';

export interface DailyChallenge {
  subTopicId: SubTopicId;
  topic: Topic;
  title: string;
  description: string;
}

export interface ActivityRecord {
    date: string; // 'YYYY-MM-DD'
    subTopicId: SubTopicId;
    topic: Topic;
}

export interface StudentProfile {
    level: number;
    points: number;
    completedActivities: number;
    unlockedBadgeIds: string[];
    unlockedAvatarItemIds: string[];
    equippedItemIds: string[];
    currentStreak: number;
    lastActivityDate: string | null; // Stored as 'YYYY-MM-DD'
    dailyChallengeCompleted: boolean;
    lastChallengeDate: string | null; // Stored as 'YYYY-MM-DD'
    activityHistory: ActivityRecord[];
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string; // Emoji or SVG string
    unlockCondition: {
        type: 'points' | 'level' | 'completeSubTopic' | 'masterSubTopic' | 'masterTopic' | 'perfectScore' | 'activitiesCompleted';
        value: number | SubTopicId | Topic;
    };
}

export interface AvatarItem {
    id: string;
    name: string;
    icon: string; // Emoji or SVG string
    category: AvatarItemCategory;
    unlockCondition: {
        type: 'points' | 'level';
        value: number;
    };
}
