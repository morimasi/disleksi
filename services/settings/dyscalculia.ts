export const DYSCALCULIA_SETTINGS = {
    'dyscalculia-arithmetic-fluency': {
        defaultSettings: { operation: '+', range: 20, layout: 'horizontal', problemCount: 12 },
        controls: [
            { 
                id: 'operation', 
                label: 'İşlem Türü', 
                type: 'select', 
                options: [
                    { value: '+', label: 'Toplama (+)' },
                    { value: '-', label: 'Çıkarma (-)' }
                ] 
            },
            { 
                id: 'range', 
                label: 'En Büyük Sayı', 
                type: 'slider', 
                min: 10, 
                max: 100, 
                step: 5 
            },
            {
                id: 'layout',
                label: 'Problem Düzeni',
                type: 'select',
                options: [
                    { value: 'horizontal', label: 'Yatay' },
                    { value: 'vertical', label: 'Dikey' }
                ]
            },
            {
                id: 'problemCount',
                label: 'Problem Sayısı',
                type: 'slider',
                min: 4, max: 24, step: 1
            }
        ]
    },
    'dyscalculia-number-sense': {
        defaultSettings: { maxNumber: 10, objectType: 'stars', arrangement: 'grid' },
        controls: [
            {
                id: 'maxNumber',
                label: 'En Büyük Sayı',
                type: 'slider',
                min: 5, max: 20, step: 1
            },
            {
                id: 'objectType',
                label: 'Nesne Türü',
                type: 'select',
                options: [
                    { value: 'stars', label: 'Yıldızlar ⭐' },
                    { value: 'apples', label: 'Elmalar 🍎' },
                    { value: 'balloons', label: 'Balonlar 🎈' },
                    { value: 'circles', label: 'Daireler 🔵' }
                ]
            },
            {
                id: 'arrangement',
                label: 'Nesne Düzeni',
                type: 'select',
                options: [
                    { value: 'grid', label: 'Izgara' },
                    { value: 'line', label: 'Doğrusal' },
                    { value: 'random', label: 'Dağınık' },
                ]
            }
        ]
    },
    'dyscalculia-problem-solving': {
        defaultSettings: { operation: '+', range: 20, theme: 'fruits' },
        controls: [
            {
                id: 'operation',
                label: 'İşlem Türü',
                type: 'select',
                options: [
                    { value: '+', label: 'Toplama (+)' },
                    { value: '-', label: 'Çıkarma (-)' }
                ]
            },
            {
                id: 'range',
                label: 'En Büyük Sayı (Sonuç için)',
                type: 'slider',
                min: 10, max: 50, step: 1
            },
            {
                id: 'theme',
                label: 'Problem Teması',
                type: 'select',
                options: [
                    { value: 'fruits', label: 'Meyveler 🍎' },
                    { value: 'toys', label: 'Oyuncaklar 🧸' },
                    { value: 'animals', label: 'Hayvanlar 🐈' },
                    { value: 'sweets', label: 'Şekerlemeler 🍪' },
                ]
            }
        ]
    },
};
