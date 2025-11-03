// Bir "blueprint", yapay zekanın üreteceği belirli, pedagojik olarak sağlam bir etkinliği tanımlar.
// Bir modülü belirli bir göreve bağlar ve yapay zekaya hangi kullanıcı ayarlarını kullanacağını söyler.
type AiActivityBlueprint = {
    name: string; // Etkinlik türü için dahili ad
    settings: string[]; // Bu etkinliğin kullandığı ayarlar panelindeki ayar kimliklerinin listesi
    description: string; // Yapay zeka için bu özel etkinliğe yönelik ayrıntılı talimat. {settingId} gibi yer tutucular değiştirilecektir.
    weight?: number; // Bu etkinliğin seçilme olasılığı. Varsayılan 1'dir.
};

type BlueprintLibrary = {
    [moduleId: string]: AiActivityBlueprint[];
};

export const AI_ACTIVITY_BLUEPRINTS: BlueprintLibrary = {
    // === DİSLEKSİ ===
    'dyslexia-letter-detective': [
        {
            name: 'Harf Izgarası Avı',
            settings: ['pair', 'gridSize', 'density'],
            description: `Bir harf ızgarası oluştur. Izgara {gridSize}x{gridSize} boyutunda olsun. Izgaradaki harfler '{targetLetter}' ve '{distractorLetter}' harflerinin bir karışımı olmalı. Hedef harf olan '{targetLetter}' yaklaşık olarak %{density} yoğunluğunda görünmelidir. Izgaranın üstüne "Tüm '{targetLetter}' harflerini daire içine al." şeklinde bir yönerge ekle. Harfler, kullanıcının seçtiği '{pair}' ayarından türetilir.`
        },
        {
            name: 'Doğru Kelimeyi Bul',
            settings: ['pair'],
            description: `Basit bir resim (örneğin '{targetLetter}' harfi ile başlayan bir nesne) ve yanında üç kelime seçeneği içeren bir aktivite oluştur. Seçeneklerden biri doğru yazılmış kelime olmalı, diğer ikisi ise '{distractorLetter}' harfi kullanılarak oluşturulmuş çeldirici kelimeler olmalı (örneğin, hedef 'bal' ise çeldiriciler 'dal', 'bol' olabilir). Kullanıcı doğru kelimeyi daire içine almalıdır. Kullanılacak harfler '{pair}' ayarından gelir.`
        },
        {
            name: 'Eksik Harfi Tamamla',
            settings: ['pair'],
            description: `Görsel bir nesne ve altında eksik harfli bir kelime içeren bir aktivite oluştur. Eksik harf ya da '{targetLetter}' ya da '{distractorLetter}' olmalıdır. Örneğin, bir 'bebek' resmi ve altında ' _ebek' yazısı. Kullanıcı boşluğu doğru harfle doldurmalıdır. Kullanılacak harfler '{pair}' ayarından gelir.`
        },
    ],
    'dyslexia-rhyming': [
        {
            name: 'Kafiyeli Çiftleri Eşleştir',
            settings: ['setIndex'],
            description: `İki sütun halinde kelimeler listesi oluştur. Sol sütundaki her kelimenin sağ sütunda kafiyeli bir karşılığı olmalı. Kullanıcı, kafiyeli kelimeleri çizgilerle birleştirmelidir. Kullanılacak kelime seti '{setIndex}' ayarına göre belirlenir. Örneğin, 'el' ile 'tel', 'taş' ile 'kaş'.`
        },
        {
            name: 'Farklı Olanı Bul',
            settings: ['setIndex', 'difficulty'],
            description: `Dört kelimeden oluşan bir grup oluştur. Kelimelerden üçü birbiriyle kafiyeli olmalı, biri ise olmamalı. Kullanıcı kafiyeli olmayan kelimeyi bulup işaretlemelidir. Kelime seti '{setIndex}' ayarına, çeldiricinin zorluğu ise '{difficulty}' ayarına göre belirlenir.`
        },
    ],
    'dyslexia-auditory-writing': [
         {
            name: 'Eksik Harfi Tamamla',
            settings: ['difficulty'],
            description: `Görsel bir nesne (kedi 🐈, elma 🍎, ev 🏠 gibi) ve altında eksik harfli bir kelime içeren bir aktivite oluştur. Eksik harf sayısı '{difficulty}' ayarına göre belirlenir (easy: bir harf, hard: iki harf). Kullanıcı boşlukları doğru harflerle doldurmalıdır.`
        },
         {
            name: 'Heceleri Birleştir',
            settings: [],
            description: `Basit ve bilinen bir kelimeyi (kitap, kalem, araba gibi) hecelerine ayırarak göster. Kullanıcıdan bu heceleri birleştirip kelimenin tamamını aşağıdaki boşluğa yazmasını iste.`
        }
    ],

    // === DİSKALKULİ ===
    'dyscalculia-number-sense': [
        {
            name: 'Nesneleri Say',
            settings: ['maxNumber', 'objectType', 'arrangement'],
            description: `Rastgele sayıda ({maxNumber} sınırını geçmeyecek şekilde) nesne içeren bir kutu çiz. Nesnelerin türü '{objectType}' (örneğin elmalar, yıldızlar) ve dizilimi '{arrangement}' (örneğin ızgara, dağınık) olmalı. Kutunun altına "Kaç tane var? Say ve yaz." şeklinde bir yönerge ve çocuğun sayıyı yazması için boş bir kutucuk ekle.`
        },
        {
            name: 'Hangisi Daha Fazla/Az?',
            settings: ['objectType'],
            description: `Yan yana iki grup nesne çiz. Gruplardaki nesne sayıları birbirinden farklı olmalı. Nesne türü '{objectType}' ayarına göre belirlenir. Yönerge olarak "Daha fazla olan grubu daire içine al." yaz.`
        },
        {
            name: 'Sayı Doğrusunda Göster',
            settings: ['maxNumber'],
            description: `0'dan {maxNumber}'a kadar bir sayı doğrusu çiz. Sayı doğrusunun üzerinde rastgele bir noktayı işaretle. Yönerge olarak "İşaretli nokta hangi sayıyı gösteriyor? Yaz." yaz ve altına boş bir kutucuk ekle.`
        },
    ],
    'dyscalculia-arithmetic-fluency': [
        {
            name: 'İşlem Pratiği',
            settings: ['operation', 'range', 'layout'],
            description: `Basit bir matematik işlemi oluştur. İşlem türü '{operation}', işlemdeki sayılar '{range}' aralığında olmalı ve problemin düzeni '{layout}' (yatay veya dikey) şeklinde olmalı. Sonucu yazmak için boş bir alan bırak. Örneğin, '12 + 5 = ___'.`
        },
        {
            name: 'Sayı Bağı (Number Bonds)',
            settings: ['range'],
            description: `Bir bütün ve iki parçadan oluşan bir sayı bağı şeması çiz. Sayılardan birini boş bırak ({range} sayısını aşmayacak şekilde). Kullanıcı eksik olan sayıyı bulup yazmalıdır.`
        },
    ],
     'dyscalculia-visual-arithmetic': [
        {
            name: 'Görsel Toplama/Çıkarma',
            settings: [],
            description: `Somut nesneler (elma 🍎, top ⚽️ gibi) kullanarak bir toplama veya çıkarma işlemi oluştur. Örneğin, '[🍎🍎] + [🍎🍎🍎] = ?'. Kullanıcı nesneleri sayarak veya çizerek sonucu bulmalıdır. Boş bir cevap kutusu ekle.`
        }
    ],

    // === DİSGRAFİ ===
    'dysgraphia-fine-motor': [
        {
            name: 'Yol Takibi',
            settings: ['pathComplexity', 'theme'],
            description: `Bir başlangıç ve bir bitiş noktası olan bir yol çiz. Yolun karmaşıklığı '{pathComplexity}' ayarına göre (basit, orta, karmaşık) belirlenmeli. Başlangıç ve bitiş noktalarına '{theme}' temasına uygun ikonlar koy (örneğin, araba ve ev). Yönerge olarak "Çizgilerin üzerinden giderek ...'yı ...'ya ulaştır." yaz.`
        },
        {
            name: 'Noktaları Birleştir',
            settings: [],
            description: `Sayılarla sıralanmış noktalardan oluşan basit bir şekil (ev, yıldız, araba gibi) oluştur. Kullanıcı, sayıları sırayla takip ederek noktaları birleştirmeli ve şekli ortaya çıkarmalıdır.`
        },
    ],
    'dysgraphia-letter-formation': [
        {
            name: 'Harf Üzerinden Gitme',
            settings: ['letter', 'case', 'style'],
            description: `Çalışılacak harf olan '{letter}' harfini ({case} büyüklüğünde) yazma pratiği için bir alan oluştur. Yazma stili '{style}' ayarına göre (noktalı, oklu, boş) olmalı. Bir satırda birkaç tekrar yapma imkanı sun.`
        },
        {
            name: 'Doğru Oluşturulmuş Harfi Bul',
            settings: ['letter', 'case'],
            description: `Birkaç tane '{letter}' harfi ({case} büyüklüğünde) göster. Bunlardan biri doğru şekilde oluşturulmuşken, diğerleri hatalı olsun (örneğin ters, eğik, eksik). Kullanıcıdan doğru olanı bulup daire içine almasını iste.`
        },
    ],
    'dysgraphia-picture-sequencing': [
        {
            name: 'Olay Sıralama',
            settings: [],
            description: `3 veya 4 adımdan oluşan basit bir olayı (örneğin sandviç yapma, diş fırçalama) anlatan resimleri karışık sırada ver. Kullanıcıdan resimleri doğru sıraya koymak için kutucuklara 1, 2, 3... yazmasını iste.`
        }
    ]
};