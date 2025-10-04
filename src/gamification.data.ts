import { Badge, AvatarItem } from "./models/gamification.model";

// Level thresholds: The minimum points needed to reach a certain level.
// Level 1 is from 0 points. Level 2 requires 100 points, etc.
export const LEVEL_THRESHOLDS: Record<number, number> = {
    1: 0,
    2: 100,
    3: 250,
    4: 500,
    5: 800,
    6: 1200,
    7: 1700,
    8: 2300,
    9: 3000,
    10: 4000,
    // Add more levels as needed
};

export const ALL_BADGES: Badge[] = [
    {
        id: 'badge_first_step',
        name: 'İlk Adım',
        description: 'İlk etkinliğini başarıyla tamamladın!',
        icon: '👟',
        unlockCondition: { type: 'completeSubTopic', value: 1 } // Special case: any 1 subtopic
    },
    {
        id: 'badge_perfect_score',
        name: 'Mükemmel Skor',
        description: 'Bir etkinliği hiç yanlış yapmadan tamamladın!',
        icon: '🎯',
        unlockCondition: { type: 'perfectScore', value: 1 }
    },
    {
        id: 'badge_level_5',
        name: 'Seviye 5 Kaşifi',
        description: '5. seviyeye ulaştın! Harika gidiyorsun.',
        icon: '⭐',
        unlockCondition: { type: 'level', value: 5 }
    },
    {
        id: 'badge_level_10',
        name: 'Seviye 10 Ustası',
        description: '10. seviyeye ulaştın! Sen bir öğrenme şampiyonusun.',
        icon: '🏆',
        unlockCondition: { type: 'level', value: 10 }
    },
    {
        id: 'badge_master_disleksi',
        name: 'Okuma Büyücüsü',
        description: 'Tüm Disleksi konularında ustalaştın!',
        icon: '📚',
        unlockCondition: { type: 'masterTopic', value: 'disleksi' }
    },
    {
        id: 'badge_master_diskalkuli',
        name: 'Matematik Sihirbazı',
        description: 'Tüm Diskalkuli konularında ustalaştın!',
        icon: '🧮',
        unlockCondition: { type: 'masterTopic', value: 'diskalkuli' }
    },
    {
        id: 'badge_master_disgrafi',
        name: 'Yazı Sanatçısı',
        description: 'Tüm Disgrafi konularında ustalaştın!',
        icon: '✍️',
        unlockCondition: { type: 'masterTopic', value: 'disgrafi' }
    },
     {
        id: 'badge_master_phonology',
        name: 'Ses Uzmanı',
        description: 'Fonolojik Farkındalık konusunda ustalaştın.',
        icon: '🔊',
        unlockCondition: { type: 'masterSubTopic', value: 'phonological-awareness' }
    },
    {
        id: 'badge_master_arithmetic',
        name: 'Aritmetik Ustası',
        description: 'Temel Aritmetik konusunda ustalaştın.',
        icon: '➕',
        unlockCondition: { type: 'masterSubTopic', value: 'basic-arithmetic' }
    },
];

export const ALL_AVATAR_ITEMS: AvatarItem[] = [
    {
        id: 'avatar_hat_wizard',
        name: 'Sihirbaz Şapkası',
        icon: '🧙',
        unlockCondition: { type: 'points', value: 300 }
    },
    {
        id: 'avatar_glasses_cool',
        name: 'Havalı Güneş Gözlüğü',
        icon: '😎',
        unlockCondition: { type: 'points', value: 600 }
    },
    {
        id: 'avatar_accessory_medal',
        name: 'Altın Madalya',
        icon: '🥇',
        unlockCondition: { type: 'level', value: 8 }
    },
    {
        id: 'avatar_accessory_rocket',
        name: 'Roket',
        icon: '🚀',
        unlockCondition: { type: 'level', value: 10 }
    },
];
