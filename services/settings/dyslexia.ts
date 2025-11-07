export const DYSLEXIA_SETTINGS = {
    'dyslexia-letter-detective': {
        defaultSettings: { pair: 'b-d', gridSize: 5, density: 0.4, case: 'lowercase', font: 'sans-serif', problemCount: 8 },
        groups: [
            {
                title: 'Temel İçerik',
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
                        ],
                        tooltip: 'Görsel olarak benzer ve sıkça karıştırılan harf çiftlerinden birini seçin.'
                    },
                    {
                        id: 'case',
                        label: 'Harf Büyüklüğü',
                        type: 'select',
                        options: [
                            { value: 'lowercase', label: 'Küçük Harf' },
                            { value: 'uppercase', label: 'Büyük Harf' },
                        ],
                        tooltip: 'Çalışmanın büyük harflerle mi yoksa küçük harflerle mi yapılacağını belirleyin.'
                    }
                ]
            },
            {
                title: 'Zorluk ve Görünüm',
                controls: [
                    {
                        id: 'gridSize',
                        label: 'Izgara Boyutu (NxN)',
                        type: 'slider',
                        min: 4, max: 8, step: 1,
                        tooltip: 'Daha büyük ızgara, görsel tarama alanını ve zorluğu artırır.'
                    },
                    {
                        id: 'density',
                        label: 'Hedef Yoğunluğu',
                        type: 'slider',
                        min: 0.2, max: 2.0, step: 0.1,
                        tooltip: 'Izgaradaki doğru (hedef) harflerin oranını ayarlayın. Düşük yoğunluk, hedefi bulmayı zorlaştırır.'
                    },
                    {
                        id: 'font',
                        label: 'Yazı Tipi',
                        type: 'select',
                        options: [
                           { value: 'sans-serif', label: 'Standart Okunaklı' },
                           { value: 'serif', label: 'Tırnaklı Yazı' },
                           { value: 'dyslexic-friendly', label: 'Disleksi Dostu' }
                        ],
                        tooltip: "Disleksi dostu yazı tipleri, harflerin daha kolay ayırt edilmesine yardımcı olabilir."
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
     'dyslexia-rhyming': {
        defaultSettings: { setIndex: 0, difficulty: 'easy', visualAid: true, problemCount: 8 },
        groups: [
             {
                title: 'İçerik',
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
                        ],
                        tooltip: 'Farklı ses gruplarıyla çalışmak için bir kafiye seti seçin.'
                    },
                    {
                        id: 'difficulty',
                        label: 'Çeldirici Zorluğu',
                        type: 'select',
                        options: [
                            { value: 'easy', label: 'Kolay (Farklı sesler)' },
                            { value: 'hard', label: 'Zor (Benzer sesler)' },
                        ],
                        tooltip: "'Zor' seçeneği, fonolojik olarak daha yakın çeldiriciler sunarak etkinliği zorlaştırır."
                    },
                ]
            },
            {
                title: 'Görsel Yardımcılar',
                controls: [
                    {
                        id: 'visualAid',
                        label: 'Görsel İpuçları',
                        type: 'toggle',
                        tooltip: 'Açık olduğunda, hedef kelimeyi temsil eden bir resim (ikon) gösterilir. Bu, kelimeyi tanımakta zorlanan çocuklar için yardımcı olabilir.'
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
    'dyslexia-reading-aloud': {
        defaultSettings: { difficulty: 'easy', problemCount: 8 },
        groups: [
            {
                title: 'Metin Ayarları',
                controls: [
                    {
                        id: 'difficulty',
                        label: 'Metin Zorluk Seviyesi',
                        type: 'select',
                        options: [
                            { value: 'easy', label: 'Kolay (Kısa Cümleler)' },
                            { value: 'medium', label: 'Orta (Birleşik Cümleler)' },
                            { value: 'hard', label: 'Zor (Tekerlemeler)' },
                        ],
                        tooltip: "Okuma akıcılığı pratiği için metnin karmaşıklığını ayarlayın."
                    },
                    {
                        id: 'problemCount',
                        label: 'Cümle Sayısı',
                        type: 'slider',
                        min: 4, max: 12, step: 1
                    }
                ]
            }
        ]
    },
    'dyslexia-meaning-explorer': {
        defaultSettings: { difficulty: 'easy', problemCount: 4 },
        groups: [
             {
                title: 'Metin Ayarları',
                controls: [
                    {
                        id: 'difficulty',
                        label: 'Metin Karmaşıklığı',
                        type: 'select',
                        options: [
                            { value: 'easy', label: 'Basit Metin (Kim, Ne, Nerede)' },
                            { value: 'hard', label: 'Orta Düzey Metin (Neden, Nasıl)' },
                        ],
                        tooltip: "Okuduğunu anlama becerisinin seviyesine göre metin zorluğunu seçin."
                    },
                     {
                        id: 'problemCount',
                        label: 'Paragraf Sayısı',
                        type: 'slider',
                        min: 1, max: 5, step: 1
                    }
                ]
            }
        ]
    },
    'dyslexia-word-explorer': {
        defaultSettings: { difficulty: 'easy', problemCount: 6 },
        groups: [ { title: 'Kelime Ayarları', controls: [ { id: 'difficulty', label: 'Kelime Zorluğu', type: 'select', options: [ { value: 'easy', label: 'Sık Kullanılan Kelimeler' }, { value: 'hard', label: 'Akademik Kelimeler' }, ] }, { id: 'problemCount', label: 'Soru Sayısı', type: 'slider', min: 2, max: 8, step: 1 } ] } ]
    },
    'dyslexia-visual-master': {
        defaultSettings: { length: 3, itemType: 'shapes', problemCount: 6 },
        groups: [ { title: 'Hafıza Ayarları', controls: [ { id: 'length', label: 'Sıra Uzunluğu', type: 'slider', min: 3, max: 6, step: 1, tooltip: 'Hatırlanması gereken öğe sayısını artırarak görsel-sıralı hafıza becerisini zorlaştırın.' }, { id: 'itemType', label: 'Öğe Türü', type: 'select', options: [ { value: 'shapes', label: 'Şekiller' }, { value: 'letters', label: 'Harfler' }, { value: 'numbers', label: 'Rakamlar' } ] }, { id: 'problemCount', label: 'Soru Sayısı', type: 'slider', min: 2, max: 8, step: 1 } ] } ]
    },
    'dyslexia-word-hunter': {
        defaultSettings: { syllable: 'el', problemCount: 6 },
        groups: [ { title: 'Hece Ayarları', controls: [ { id: 'syllable', label: 'Aranacak Hece', type: 'select', options: [ { value: 'el', label: 'el' }, { value: 'ka', label: 'ka' }, { value: 'ba', label: 'ba' }, { value: 'ok', label: 'ok' } ] }, { id: 'problemCount', label: 'Soru Sayısı', type: 'slider', min: 2, max: 8, step: 1 } ] } ]
    },
    'dyslexia-spelling-champion': {
        defaultSettings: { word: 'tren', problemCount: 8 },
        groups: [ { title: 'Yazım Ayarları', controls: [ { id: 'word', label: 'Sık Karıştırılan Kelime', type: 'select', options: [ { value: 'tren', label: 'tren / tiren' }, { value: 'yanlış', label: 'yanlış / yanlız' }, { value: 'herkes', label: 'herkes / herkez' }, { value: 'kral', label: 'kral / kıral' }, { value: 'spor', label: 'spor / sipor' } ] }, { id: 'problemCount', label: 'Soru Sayısı', type: 'slider', min: 4, max: 12, step: 1 } ] } ]
    },
    'dyslexia-memory-player': {
        defaultSettings: { itemCount: 3, problemCount: 6 },
        groups: [ { title: 'Hafıza Ayarları', controls: [ { id: 'itemCount', label: 'Nesne Sayısı', type: 'slider', min: 3, max: 5, step: 1, tooltip: 'Sıradaki nesne sayısını artırmak, kısa süreli görsel hafızayı daha fazla zorlar.' }, { id: 'problemCount', label: 'Soru Sayısı', type: 'slider', min: 2, max: 8, step: 1 } ] } ]
    },
    'dyslexia-auditory-writing': {
        defaultSettings: { difficulty: 'easy', activityType: 'fill-blank', problemCount: 8 },
        groups: [ { title: 'Yazma Ayarları', controls: [ { id: 'activityType', label: 'Etkinlik Türü', type: 'select', options: [ { value: 'fill-blank', label: 'Eksik Harfi Doldurma' }, { value: 'join-syllables', label: 'Heceleri Birleştirme' } ] }, { id: 'difficulty', label: 'Zorluk', type: 'select', options: [ { value: 'easy', label: 'Kolay (Bir harf eksik)' }, { value: 'hard', label: 'Zor (İki harf eksik)' } ], tooltip: "Bu ayar sadece 'Eksik Harfi Doldurma' etkinliği için geçerlidir." }, { id: 'problemCount', label: 'Soru Sayısı', type: 'slider', min: 4, max: 12, step: 1 } ] } ]
    },
    // Ortak modül için de ayar ekleyelim
    'common-story-adventure': {
        defaultSettings: { problemCount: 3 },
        groups: [ { title: 'Hikaye Ayarları', controls: [ { id: 'problemCount', label: 'Etkinlik Sayısı', type: 'slider', min: 1, max: 4, step: 1 } ] } ]
    }
} as const;