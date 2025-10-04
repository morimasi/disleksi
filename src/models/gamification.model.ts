import { SubTopicId, Topic } from "./activity.model";

export interface StudentProfile {
    level: number;
    points: number;
    unlockedBadgeIds: string[];
    unlockedAvatarItemIds: string[];
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string; // Emoji or SVG string
    unlockCondition: {
        type: 'points' | 'level' | 'completeSubTopic' | 'masterSubTopic' | 'masterTopic' | 'perfectScore';
        value: number | SubTopicId | Topic;
    };
}

export interface AvatarItem {
    id: string;
    name: string;
    icon: string; // Emoji or SVG string
    unlockCondition: {
        type: 'points' | 'level';
        value: number;
    };
}
