export const DYSCALCULIA_SETTINGS = {
    'dyscalculia-arithmetic-fluency': {
        defaultSettings: { operation: '+', range: 20, visualAids: false, problemCount: 12 },
        groups: [
            {
                title: 'Temel Ayarlar',
                controls: [
                    { 
                        id: 'operation', 
                        label: 'İşlem Türü', 
                        type: 'select', 
                        options: [
                            { value: '+', label: 'Toplama (+)' },
                            { value: '-', label: 'Çıkarma (-)' }
                        ],
                        tooltip: "Çalışılacak temel aritmetik becerisini seçin."
                    },
                    { 
                        id: 'range', 
                        label: 'Sayı Aralığı (En Büyük Sayı)', 
                        type: 'slider', 
                        min: 10, 
                        max: 100, 
                        step: 5,
                        tooltip: "İşlemlerde kullanılacak sayıların maksimum değerini belirleyin."
                    },
                    {
                        id: 'problemCount',
                        label: 'Soru Sayısı',
                        type: 'slider',
                        min: 4, max: 24, step: 1,
                        tooltip: "Çalışma sayfasında kaç adet soru olacağını ayarlayın."
                    }
                ]
            },
            {
                title: 'Görsel Destekler',
                controls: [
                    {
                        id: 'visualAids',
                        label: 'Sayı Bloğu Desteği',
                        type: 'toggle',
                        tooltip: "Her sayının yanında, o sayıyı temsil eden onluk blokların gösterilip gösterilmeyeceğini seçin. Bu, sayı miktarını somutlaştırmaya yardımcı olur."
                    }
                ]
            }
        ]
    },
    'dyscalculia-number-sense': {
        defaultSettings: { maxNumber: 10, objectType: 'stars', arrangement: 'grid', problemCount: 12 },
        groups: [
             {
                title: 'İçerik Ayarları',
                controls: [
                    {
                        id: 'maxNumber',
                        label: 'En Fazla Nesne Sayısı',
                        type: 'slider',
                        min: 5, max: 20, step: 1,
                        tooltip: "Her bir soruda gösterilecek maksimum nesne sayısını belirleyin."
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
                        ],
                        tooltip: "Sayıları temsil etmek için kullanılacak görsel nesneyi seçin."
                    },
                ]
            },
            {
                title: 'Pedagojik Düzen',
                controls: [
                    {
                        id: 'arrangement',
                        label: 'Nesne Düzeni',
                        type: 'select',
                        options: [
                            { value: 'random', label: 'Dağınık' },
                            { value: 'grid', label: 'Izgara' },
                            { value: 'ten-frame', label: 'Onluk Çerçeve' },
                        ],
                        tooltip: "Nesnelerin dizilimi, sayı algısını etkiler. 'Onluk Çerçeve' onluk sisteme dayalı anlamayı güçlendirir."
                    },
                     {
                        id: 'problemCount',
                        label: 'Soru Sayısı',
                        type: 'slider',
                        min: 4, max: 12, step: 1
                    }
                ]
            }
        ]
    },
    'dyscalculia-problem-solving': {
        defaultSettings: { operation: '+', range: 20, theme: 'fruits', problemCount: 6 },
        groups: [
            {
                title: 'Problem Yapısı',
                controls: [
                    {
                        id: 'operation',
                        label: 'İşlem Türü',
                        type: 'select',
                        options: [
                            { value: '+', label: 'Toplama (+)' },
                            { value: '-', label: 'Çıkarma (-)' }
                        ],
                        tooltip: "Problemlerin hangi temel işlem üzerine kurulacağını seçin."
                    },
                    {
                        id: 'range',
                        label: 'En Büyük Sayı (Sonuç)',
                        type: 'slider',
                        min: 10, max: 50, step: 1,
                        tooltip: "Problemdeki sayıların ve sonucun ulaşabileceği maksimum değeri ayarlayın."
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
                        ],
                        tooltip: "Problemlerin içeriğini çocuğun ilgisini çekecek bir tema ile zenginleştirin."
                    },
                     {
                        id: 'problemCount',
                        label: 'Problem Sayısı',
                        type: 'slider',
                        min: 2, max: 8, step: 1
                    }
                ]
            }
        ]
    },
    'dyscalculia-number-grouping': {
        defaultSettings: { maxItems: 25, problemCount: 6 },
        groups: [
            {
                title: 'Gruplama Ayarları',
                controls: [
                     {
                        id: 'maxItems',
                        label: 'Maksimum Nesne Sayısı',
                        type: 'slider',
                        min: 11, max: 49, step: 1,
                        tooltip: "Gruplanacak toplam nesne sayısının üst limitini belirleyin."
                    },
                    {
                        id: 'problemCount',
                        label: 'Soru Sayısı',
                        type: 'slider',
                        min: 2, max: 8, step: 1
                    }
                ]
            }
        ]
    },
    'dyscalculia-math-language': {
        defaultSettings: { activityType: 'match', problemCount: 6 },
         groups: [
            {
                title: 'Etkinlik Ayarları',
                controls: [
                     {
                        id: 'activityType',
                        label: 'Etkinlik Türü',
                        type: 'select',
                        options: [
                            { value: 'match', label: 'Sembol-İsim Eşleştirme' },
                            { value: 'fill-operator', label: 'Eksik İşlemi Bulma (+/-)' },
                            { value: 'fill-comparison', label: 'Eksik Karşılaştırmayı Bulma (>/<)' },
                        ],
                        tooltip: "Matematiksel dilin farklı yönlerine odaklanan bir etkinlik türü seçin."
                    },
                    {
                        id: 'problemCount',
                        label: 'Soru Sayısı',
                        type: 'slider',
                        min: 4, max: 12, step: 1
                    }
                ]
            }
        ]
    },
     'dyscalculia-time-measurement-geometry': {
        defaultSettings: { problemCount: 6 },
        groups: [ { title: 'Genel Ayarlar', controls: [ { id: 'problemCount', label: 'Soru Sayısı', type: 'slider', min: 2, max: 8, step: 1 } ] } ]
    },
    'dyscalculia-spatial-reasoning': {
        defaultSettings: { problemCount: 6 },
        groups: [ { title: 'Genel Ayarlar', controls: [ { id: 'problemCount', label: 'Soru Sayısı', type: 'slider', min: 2, max: 8, step: 1 } ] } ]
    },
     'dyscalculia-estimation-skills': {
        defaultSettings: { problemCount: 6 },
        groups: [ { title: 'Genel Ayarlar', controls: [ { id: 'problemCount', label: 'Soru Sayısı', type: 'slider', min: 2, max: 8, step: 1 } ] } ]
    },
     'dyscalculia-fractions-decimals': {
        defaultSettings: { problemCount: 6 },
        groups: [ { title: 'Genel Ayarlar', controls: [ { id: 'problemCount', label: 'Soru Sayısı', type: 'slider', min: 2, max: 8, step: 1 } ] } ]
    },
     'dyscalculia-visual-representation': {
        defaultSettings: { problemCount: 6 },
        groups: [ { title: 'Genel Ayarlar', controls: [ { id: 'problemCount', label: 'Soru Sayısı', type: 'slider', min: 2, max: 8, step: 1 } ] } ]
    },
     'dyscalculia-visual-arithmetic': {
        defaultSettings: { problemCount: 8 },
        groups: [ { title: 'Genel Ayarlar', controls: [ { id: 'problemCount', label: 'Soru Sayısı', type: 'slider', min: 4, max: 12, step: 1 } ] } ]
    }
} as const;