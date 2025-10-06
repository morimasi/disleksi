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
        unlockCondition: { type: 'activitiesCompleted', value: 1 }
    },
    {
        id: 'badge_perfect_score',
        name: 'Mükemmel Skor',
        description: 'Bir etkinliği hiç yanlış yapmadan tamamladın!',
        icon: '🎯',
        unlockCondition: { type: 'perfectScore', value: 1 }
    },
    {
        id: 'badge_explorer',
        name: 'Meraklı Kaşif',
        description: '10 farklı etkinlik tamamladın!',
        icon: '🧭',
        unlockCondition: { type: 'activitiesCompleted', value: 10 }
    },
    {
        id: 'badge_veteran',
        name: 'Etkinlik Ustası',
        description: '25 farklı etkinlik tamamladın!',
        icon: '🏅',
        unlockCondition: { type: 'activitiesCompleted', value: 25 }
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
        name: 'Aritmetik Dehası',
        description: 'Temel Aritmetik konusunda ustalaştın.',
        icon: '➕',
        unlockCondition: { type: 'masterSubTopic', value: 'basic-arithmetic' }
    },
    {
        id: 'badge_master_comprehension',
        name: 'Anlama Uzmanı',
        description: 'Okuduğunu Anlama konusunda ustalaştın.',
        icon: '🧐',
        unlockCondition: { type: 'masterSubTopic', value: 'reading-comprehension' }
    },
    {
        id: 'badge_master_problem_solving',
        name: 'Problem Çözücü',
        description: 'Problem Çözme Stratejileri konusunda ustalaştın.',
        icon: '💡',
        unlockCondition: { type: 'masterSubTopic', value: 'problem-solving' }
    },
    {
        id: 'badge_master_sentence_construction',
        name: 'Cümle Kurma Ustası',
        description: 'Cümle Kurma konusunda ustalaştın.',
        icon: '📝',
        unlockCondition: { type: 'masterSubTopic', value: 'sentence-construction' }
    },
    {
        id: 'badge_master_reading_fluency',
        name: 'Hız Canavarı',
        description: 'Akıcı Okuma konusunda ustalaştın.',
        icon: '💨',
// FIX: Corrected invalid SubTopicId from 'reading-fluency' to 'reading-aloud-coach'.
        unlockCondition: { type: 'masterSubTopic', value: 'reading-aloud-coach' }
    },
    {
        id: 'badge_master_letter_sound',
        name: 'Harf Avcısı',
        description: 'Harf-Ses İlişkisi konusunda ustalaştın.',
        icon: '🔤',
        unlockCondition: { type: 'masterSubTopic', value: 'letter-sound' }
    },
    {
        id: 'badge_master_creative_writing',
        name: 'Hayalperest Yazar',
        description: 'Yaratıcı Yazma konusunda ustalaştın.',
        icon: '🌈',
        unlockCondition: { type: 'masterSubTopic', value: 'creative-writing-prompts' }
    }
];

export const ALL_AVATAR_ITEMS: AvatarItem[] = [
    {
        id: 'avatar_bowtie',
        name: 'Papyon',
        icon: '🎀',
        category: 'neck',
        unlockCondition: { type: 'level', value: 2 }
    },
    {
        id: 'avatar_scarf',
        name: 'Şık Atkı',
        icon: '🧣',
        category: 'neck',
        unlockCondition: { type: 'level', value: 3 }
    },
    {
        id: 'avatar_hat_wizard',
        name: 'Sihirbaz Şapkası',
        icon: '🧙',
        category: 'head',
        unlockCondition: { type: 'points', value: 300 }
    },
    {
        id: 'avatar_monocle',
        name: 'Monokl',
        icon: '🧐',
        category: 'eyes',
        unlockCondition: { type: 'level', value: 4 }
    },
    {
        id: 'avatar_glasses_cool',
        name: 'Havalı Güneş Gözlüğü',
        icon: '😎',
        category: 'eyes',
        unlockCondition: { type: 'points', value: 600 }
    },
    {
        id: 'avatar_cape',
        name: 'Süper Pelerin',
        icon: '🦸',
        category: 'accessory',
        unlockCondition: { type: 'level', value: 6 }
    },
    {
        id: 'avatar_hat_detective',
        name: 'Dedektif Şapkası',
        icon: '🕵️',
        category: 'head',
        unlockCondition: { type: 'level', value: 7 }
    },
    {
        id: 'avatar_accessory_medal',
        name: 'Altın Madalya',
        icon: '🥇',
        category: 'neck',
        unlockCondition: { type: 'level', value: 8 }
    },
    {
        id: 'avatar_crown',
        name: 'Kraliyet Tacı',
        icon: '👑',
        category: 'head',
        unlockCondition: { type: 'level', value: 9 }
    },
    {
        id: 'avatar_accessory_rocket',
        name: 'Roket',
        icon: '🚀',
        category: 'accessory',
        unlockCondition: { type: 'level', value: 10 }
    },
];
