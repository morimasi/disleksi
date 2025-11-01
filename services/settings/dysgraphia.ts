export const DYSGRAPHIA_SETTINGS = {
    'dysgraphia-letter-formation': {
        defaultSettings: { letter: 'a', case: 'lowercase', style: 'dotted' },
        controls: [
            {
                id: 'letter',
                label: 'Çalışılacak Harf',
                type: 'select',
                options: ['a', 'b', 'c', 'd', 'e', 'k', 'l', 'm', 's', 't', 'u', 'y'].map(l => ({ value: l, label: l }))
            },
            {
                id: 'case',
                label: 'Harf Büyüklüğü',
                type: 'select',
                options: [
                    { value: 'lowercase', label: 'Küçük Harf' },
                    { value: 'uppercase', label: 'Büyük Harf' }
                ]
            },
            {
                id: 'style',
                label: 'Yazma Stili',
                type: 'select',
                options: [
                    { value: 'dotted', label: 'Noktalı (Üzerinden Gitme)' },
                    { value: 'arrows', label: 'Yönlendirme Oklu' },
                    { value: 'simple', label: 'Boş (Tekrar Etme)' },
                ]
            }
        ]
    },
    'dysgraphia-fine-motor': {
        defaultSettings: { pathComplexity: 'medium', theme: 'animals' },
        controls: [
            {
                id: 'pathComplexity',
                label: 'Yol Karmaşıklığı',
                type: 'select',
                options: [
                    { value: 'simple', label: 'Basit Düz' },
                    { value: 'medium', label: 'Orta Dalgalı' },
                    { value: 'complex', label: 'Karmaşık Döngülü' }
                ]
            },
            {
                id: 'theme',
                label: 'Tema',
                type: 'select',
                options: [
                    { value: 'animals', label: 'Hayvanlar' },
                    { value: 'vehicles', label: 'Taşıtlar' },
                    { value: 'nature', label: 'Doğa' },
                    { value: 'space', label: 'Uzay' },
                ]
            }
        ]
    },
};
