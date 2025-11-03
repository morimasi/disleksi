export const DYSGRAPHIA_SETTINGS = {
    'dysgraphia-letter-formation': {
        defaultSettings: { letter: 'a', case: 'lowercase', style: 'dotted', problemCount: 12 },
        groups: [
            {
                title: 'Harf Seçimi',
                controls: [
                    {
                        id: 'letter',
                        label: 'Çalışılacak Harf',
                        type: 'select',
                        options: ['a', 'b', 'c', 'ç', 'd', 'e', 'f', 'g', 'ğ', 'h', 'ı', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'ö', 'p', 'r', 's', 'ş', 't', 'u', 'ü', 'v', 'y', 'z'].map(l => ({ value: l, label: l.toUpperCase() + l }))
                    },
                    {
                        id: 'case',
                        label: 'Harf Büyüklüğü',
                        type: 'select',
                        options: [
                            { value: 'lowercase', label: 'Sadece Küçük Harf' },
                            { value: 'uppercase', label: 'Sadece Büyük Harf' },
                            { value: 'both', label: 'Büyük ve Küçük Harf' }
                        ],
                        tooltip: "Yazı pratiğinin büyük harf mi, küçük harf mi, yoksa her ikisiyle mi yapılacağını belirleyin."
                    },
                ]
            },
            {
                title: 'Yazı Rehberi',
                controls: [
                    {
                        id: 'style',
                        label: 'Rehber Stili',
                        type: 'select',
                        options: [
                            { value: 'dotted', label: 'Noktalı (Üzerinden Gitme)' },
                            { value: 'arrows', label: 'Yönlendirme Oklu' },
                            { value: 'simple', label: 'Boş (Tekrar Etme)' },
                        ],
                        tooltip: "Çocuğun harfi nasıl yazacağını yönlendiren görsel rehberin türünü seçin."
                    },
                    {
                        id: 'problemCount',
                        label: 'Tekrar Sayısı',
                        type: 'slider',
                        min: 4, max: 20, step: 1
                    }
                ]
            }
        ]
    },
    'dysgraphia-fine-motor': {
        defaultSettings: { pathComplexity: 'medium', theme: 'animals', problemCount: 8 },
        groups: [
            {
                title: 'Etkinlik İçeriği',
                controls: [
                    {
                        id: 'pathComplexity',
                        label: 'Yol Karmaşıklığı',
                        type: 'select',
                        options: [
                            { value: 'simple', label: 'Basit Düz' },
                            { value: 'medium', label: 'Orta Dalgalı' },
                            { value: 'complex', label: 'Karmaşık Döngülü' }
                        ],
                        tooltip: "Çizilecek yolun zorluk seviyesini çocuğun ince motor beceri düzeyine göre ayarlayın."
                    },
                    {
                        id: 'theme',
                        label: 'Tema',
                        type: 'select',
                        options: [
                            { value: 'animals', label: 'Hayvanlar 🐌' },
                            { value: 'vehicles', label: 'Taşıtlar 🚗' },
                            { value: 'nature', label: 'Doğa 🦋' },
                            { value: 'space', label: 'Uzay 🚀' },
                        ],
                        tooltip: "Etkinliği çocuğun ilgisini çekecek bir tema ile daha motive edici hale getirin."
                    },
                    {
                        id: 'problemCount',
                        label: 'Soru Sayısı',
                        type: 'slider',
                        min: 2, max: 10, step: 1
                    }
                ]
            }
        ]
    },
    'dysgraphia-picture-sequencing': {
        defaultSettings: { storyType: 'sandwich', problemCount: 3 },
        groups: [
            {
                title: 'Sıralama Ayarları',
                controls: [
                    {
                        id: 'storyType',
                        label: 'Sıralanacak Hikaye',
                        type: 'select',
                        options: [
                           { value: 'sandwich', label: 'Sandviç Yapma' },
                           { value: 'brushing', label: 'Diş Fırçalama' },
                           { value: 'planting', label: 'Çiçek Ekme' }
                        ],
                        tooltip: "Düşünceleri organize etme ve planlama becerisini geliştirmek için sıralanacak olayı seçin."
                    },
                     {
                        id: 'problemCount',
                        label: 'Etkinlik Sayısı',
                        type: 'slider',
                        min: 1, max: 4, step: 1
                    }
                ]
            }
        ]
    },
    'dysgraphia-sentence-building': {
        defaultSettings: { problemCount: 6 },
        groups: [ { title: 'Genel Ayarlar', controls: [ { id: 'problemCount', label: 'Soru Sayısı', type: 'slider', min: 2, max: 8, step: 1 } ] } ]
    },
    'dysgraphia-punctuation': {
        defaultSettings: { problemCount: 6 },
        groups: [ { title: 'Genel Ayarlar', controls: [ { id: 'problemCount', label: 'Soru Sayısı', type: 'slider', min: 2, max: 8, step: 1 } ] } ]
    },
    'dysgraphia-creative-writing': {
        defaultSettings: { problemCount: 3 },
        groups: [ { title: 'Genel Ayarlar', controls: [ { id: 'problemCount', label: 'Soru Sayısı', type: 'slider', min: 1, max: 4, step: 1 } ] } ]
    },
     'dysgraphia-letter-form-recognition': {
        defaultSettings: { problemCount: 6 },
        groups: [ { title: 'Genel Ayarlar', controls: [ { id: 'problemCount', label: 'Soru Sayısı', type: 'slider', min: 2, max: 8, step: 1 } ] } ]
    },
     'dysgraphia-legible-writing': {
        defaultSettings: { problemCount: 6 },
        groups: [ { title: 'Genel Ayarlar', controls: [ { id: 'problemCount', label: 'Soru Sayısı', type: 'slider', min: 2, max: 8, step: 1 } ] } ]
    },
    'dysgraphia-writing-speed': {
        defaultSettings: { problemCount: 6 },
        groups: [ { title: 'Genel Ayarlar', controls: [ { id: 'problemCount', label: 'Soru Sayısı', type: 'slider', min: 2, max: 8, step: 1 } ] } ]
    },
    'dysgraphia-writing-planning': {
        defaultSettings: { problemCount: 6 },
        groups: [ { title: 'Genel Ayarlar', controls: [ { id: 'problemCount', label: 'Soru Sayısı', type: 'slider', min: 2, max: 8, step: 1 } ] } ]
    }
} as const;