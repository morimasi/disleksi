export const DYSLEXIA_SETTINGS = {
    'dyslexia-letter-detective': {
        defaultSettings: { pair: 'b-d', gridSize: 5, density: 0.4 },
        controls: [
            { 
                id: 'pair', 
                label: 'Karıştırılan Harf Çifti', 
                type: 'select', 
                options: [
                    { value: 'b-d', label: 'b / d' },
                    { value: 'p-q', label: 'p / q' },
                    { value: 'm-n', label: 'm / n' },
                    { value: 's-z', label: 's / z' },
                    { value: 'f-t', label: 'f / t' },
                    { value: 'i-ı', label: 'i / ı' },
                    { value: 'o-ö', label: 'o / ö' },
                    { value: 'u-ü', label: 'u / ü' },
                ] 
            },
            {
                id: 'gridSize',
                label: 'Izgara Boyutu (NxN)',
                type: 'slider',
                min: 4, max: 8, step: 1
            },
            {
                id: 'density',
                label: 'Hedef Harf Yoğunluğu',
                type: 'slider',
                min: 0.2, max: 0.8, step: 0.1
            }
        ]
    },
     'dyslexia-rhyming': {
        defaultSettings: { setIndex: 0, difficulty: 'easy' },
        controls: [
            {
                id: 'setIndex',
                label: 'Kafiye Seti',
                type: 'select',
                options: [
                    { value: 0, label: 'Set 1 (el/tel)' },
                    { value: 1, label: 'Set 2 (taş/kaş)' },
                    { value: 2, label: 'Set 3 (yüz/güz)' },
                    { value: 3, label: 'Set 4 (kale/lale)' },
                ]
            },
            {
                id: 'difficulty',
                label: 'Zorluk',
                type: 'select',
                options: [
                    { value: 'easy', label: 'Kolay (Farklı sesler)' },
                    { value: 'hard', label: 'Zor (Benzer sesler)' },
                ]
            }
        ]
    },
    'dyslexia-reading-aloud': {
        defaultSettings: { difficulty: 'easy' },
        controls: [
            {
                id: 'difficulty',
                label: 'Zorluk Seviyesi',
                type: 'select',
                options: [
                    { value: 'easy', label: 'Kolay (Kısa Cümleler)' },
                    { value: 'medium', label: 'Orta (Uzun Cümleler)' },
                    { value: 'hard', label: 'Zor (Tekerlemeler)' },
                ]
            }
        ]
    },
    'dyslexia-meaning-explorer': {
        defaultSettings: { difficulty: 'easy' },
        controls: [
            {
                id: 'difficulty',
                label: 'Metin Karmaşıklığı',
                type: 'select',
                options: [
                    { value: 'easy', label: 'Basit Metin' },
                    { value: 'hard', label: 'Orta Düzey Metin' },
                ]
            }
        ]
    },
    'dyslexia-word-explorer': {
        defaultSettings: { difficulty: 'easy' },
        controls: [
            {
                id: 'difficulty',
                label: 'Kelime Zorluğu',
                type: 'select',
                options: [
                    { value: 'easy', label: 'Yaygın Kelimeler' },
                    { value: 'hard', label: 'Az Bilinen Kelimeler' },
                ]
            }
        ]
    },
    'dyslexia-visual-master': {
        defaultSettings: { length: 3 },
        controls: [
            {
                id: 'length',
                label: 'Sıra Uzunluğu',
                type: 'slider',
                min: 3, max: 5, step: 1
            }
        ]
    },
    'dyslexia-word-hunter': {
        defaultSettings: { syllable: 'el' },
        controls: [
            {
                id: 'syllable',
                label: 'Aranacak Hece',
                type: 'select',
                options: [
                    { value: 'el', label: 'el' },
                    { value: 'ka', label: 'ka' },
                    { value: 'ba', label: 'ba' },
                ]
            }
        ]
    },
    'dyslexia-spelling-champion': {
        defaultSettings: { word: 'tren' },
        controls: [
            {
                id: 'word',
                label: 'Kelime',
                type: 'select',
                options: [
                    { value: 'tren', label: 'tren / tiren' },
                    { value: 'yanlış', label: 'yanlış / yanlız' },
                    { value: 'herkes', label: 'herkes / herkez' },
                    { value: 'kral', label: 'kral / kıral' },
                ]
            }
        ]
    },
    'dyslexia-memory-player': {
        defaultSettings: { itemCount: 3 },
        controls: [
            {
                id: 'itemCount',
                label: 'Nesne Sayısı',
                type: 'slider',
                min: 3, max: 5, step: 1
            }
        ]
    },
    'dyslexia-auditory-writing': {
        defaultSettings: { difficulty: 'easy' },
        controls: [
            {
                id: 'difficulty',
                label: 'Zorluk',
                type: 'select',
                options: [
                    { value: 'easy', label: 'Kolay (Bir harf eksik)' },
                    { value: 'hard', label: 'Zor (İki harf eksik)' },
                ]
            }
        ]
    }
};