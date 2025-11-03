import { MODULE_DATA } from '../data/modules';
import { AI_ACTIVITY_BLUEPRINTS } from './aiActivityBlueprints';

// Helper to select a weighted random blueprint
const selectWeightedBlueprint = (blueprints) => {
    const totalWeight = blueprints.reduce((sum, bp) => sum + (bp.weight || 1), 0);
    let random = Math.random() * totalWeight;
    for (const blueprint of blueprints) {
        random -= (blueprint.weight || 1);
        if (random <= 0) {
            return blueprint;
        }
    }
    return blueprints[0];
};

export const generateAiPrompt = (selectedModule, settings, appearanceSettings) => {
    const settingsString = JSON.stringify(settings, null, 2);
    
    const layoutInstructions = {
        'auto': 'Esnek bir akış düzeni kullan (CSS Flexbox ve flex-wrap: wrap).',
        'columns-2': '2 sütunlu bir ızgara düzeni kullan (CSS Grid ve grid-template-columns: 1fr 1fr).',
        'columns-3': '3 sütunlu bir ızgara düzeni kullan (CSS Grid ve grid-template-columns: 1fr 1fr 1fr).',
        'grid': 'İçerik boyutuna uyum sağlayan dinamik bir ızgara düzeni kullan (CSS Grid ve grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))).'
    };
    const currentLayoutInstruction = layoutInstructions[appearanceSettings.layout] || layoutInstructions['auto'];

    const categoryKey = Object.keys(MODULE_DATA).find(key => 
        MODULE_DATA[key].modules.some(m => m.id === selectedModule.id)
    );

    let categorySpecifics = '';
    switch(categoryKey) {
        case 'dyslexia':
            categorySpecifics = `**Kategori Odağı (Disleksi):** Açık, sans-serif yazı tiplerine, geniş harf aralıklarına ve düzenli tasarıma öncelik ver. Etkinlikler somut olarak fonolojik farkındalığı, harf-ses uyumunu ve kod çözmeyi hedeflemelidir. Özel bir ayırt etme görevi olmadıkça, görsel olarak benzer harfleri yan yana kullanmaktan kaçın.`;
            break;
        case 'dyscalculia':
            categorySpecifics = `**Kategori Odağı (Diskalkuli):** Sayıların görsel ve somut temsillerini (onluk çerçeveler, sayı doğruları, nesneler gibi) vurgula. Kelime problemlerinde basit bir dil kullan. Sayıların net ve iyi aralıklı olduğundan emin ol. Etkinlikler sayı hissi, miktar ve temel işlemlere somut bir şekilde odaklanmalıdır.`;
            break;
        case 'dysgraphia':
            categorySpecifics = `**Kategori Odağı (Disgrafi):** Yazmak için bolca alan sağla. Harf oluşumu için net görsel kılavuzlar (kesikli çizgiler veya başlangıç noktaları gibi) kullan. Etkinlikler ince motor kontrolü, harf oluşumu, boşluk bırakma ve düşünceleri yazılı dile dökme üzerine odaklanmalıdır.`;
            break;
    }

    // --- NEW LOGIC USING BLUEPRINTS ---
    const moduleBlueprints = AI_ACTIVITY_BLUEPRINTS[selectedModule.id];
    let taskList = '';

    if (moduleBlueprints && moduleBlueprints.length > 0) {
        const activityCount = 4; // Generate 4 different sub-activities for variety
        let usedBlueprintNames = new Set();
        
        for (let i = 0; i < activityCount; i++) {
             // Ensure variety by not picking the same blueprint type twice if possible
            let availableBlueprints = moduleBlueprints.filter(bp => !usedBlueprintNames.has(bp.name));
            if (availableBlueprints.length === 0) {
                 availableBlueprints = moduleBlueprints; // Reset if all have been used
                 usedBlueprintNames.clear();
            }
            
            const blueprint = selectWeightedBlueprint(availableBlueprints);
            usedBlueprintNames.add(blueprint.name);
            
            let instruction = blueprint.description;

            // Inject settings into the instruction
            if (blueprint.settings) {
                blueprint.settings.forEach(settingKey => {
                    const value = settings[settingKey];
                    if (value !== undefined) {
                        // Special handling for 'pair' setting to extract target/distractor
                        if (settingKey === 'pair') {
                            const [target, distractor] = value.split('-');
                            instruction = instruction.replace(/{targetLetter}/g, target).replace(/{distractorLetter}/g, distractor);
                        }
                        // Generic replacement for {settingKey}
                        const regex = new RegExp(`{${settingKey}}`, 'g');
                        instruction = instruction.replace(regex, String(value));
                    }
                });
            }
            taskList += `\n**Alt Görev ${i + 1}: ${blueprint.name}**\n${instruction}\n`;
        }

    } else {
        // Fallback for modules without blueprints
        taskList = `**Genel Görev:**\nKullanıcının seçtiği "${selectedModule.name}" modülü için çeşitli ve etkileşimli alıştırmalar oluştur. Şu ayarlara dikkat et: ${settingsString}`;
    }


    return `
    **Rol & Kişilik:** Doktora düzeyinde bir özel eğitim terapisti ve profesyonel bir pedagojik grafik tasarımcı olarak hareket et. Çıktın sadece bir çalışma sayfası değil; yüksek kaliteli, uzman tarafından hazırlanmış bir öğrenme materyalidir. Çalışman temiz, ilgi çekici, pedagojik olarak sağlam ve TAMAMLANMIŞ olmalıdır.

    **MUTLAK KURAL: BOŞ VEYA YER TUTUCU İÇERİK YOK.** Üretilen her bir etkinlik tam olarak doldurulmuş, net talimatlara, çözülebilir problemlere ve ilgi çekici içeriğe sahip olmalıdır. Asla "Etkinlik" veya benzeri yer tutucular çıkarma. Kullanıcı bitmiş, kullanılabilir bir ürün almalıdır. İyi, tam bir alt etkinlik örneği: \`<div style="..."><p>Kayıp harfi bul ve yaz.</p><div style="font-size: 2em;">🐈</div><p style="font-size: 1.5em; letter-spacing: 5px;">ke_i</p></div>\`. KÖTÜ, eksik bir etkinlik örneği: \`<div style="..."><p>Etkinlik</p></div>\`. ASLA kötü etkinlikler üretme.

    **Ana Görev:** Aşağıdaki görev listesini harfiyen uygulayarak, yazdırmaya hazır, A4 boyutunda HTML çalışma sayfaları dizisi oluştur. Üretilen etkinlikleri sayfa(lar) üzerinde düzenleme talimatına göre yerleştir. İçerik bir A4 sayfasına sığmazsa, MUTLAKA özel ayırıcıyı kullanarak yeni bir sayfaya devam etmelisin: \`<!-- PAGE_BREAK -->\`.

    **Fiziksel Etkileşim Zorunluluğu (KRİTİK):** Çocuğun çalışma sayfasıyla FİZİKSEL olarak etkileşime girmesi GEREKİR. Her bir alt etkinlik çizim, yazma, daire içine alma, birleştirme, boyama veya kesme içermelidir. Pasif okuma yok.

    **Görev Listesi (KRİTİK - Bu görevleri tam olarak uygula):**
    ${taskList}

    **Kategoriye Özel Talimatlar (KRİTİK):**
    ${categorySpecifics}

    **Dinamik Düzen Zorunluluğu (KRİTİK):** Alt etkinlikleri her sayfada kullanıcının seçtiği düzene göre yerleştir.
    - **Kullanıcının seçtiği düzen:** ${appearanceSettings.layout}.
    - **Uygulama:** ${currentLayoutInstruction}
    - Alt etkinliklerin kapsayıcısı \`display: grid; grid-template-columns: ...; gap: ${appearanceSettings.itemSpacing}px;\` gibi bir stil özelliğine sahip olmalıdır. Boşluk (gap) kritiktir.

    **Tasarım ve Biçim Zorunlulukları (KRİTİK):**
    1.  **Biçim:** Çıktı MUTLAKA \`<div ...>\` ile başlayıp \`</div>\` ile biten HTML blokları olmalıdır. \`<html>\` veya \`<body>\` etiketlerini DAHİL ETME.
    2.  **Ana Sayfa Kapsayıcısı:** HER sayfa için, tüm çalışma sayfasını \`<div style="font-family: 'Poppins', sans-serif; height: 100%; display: flex; flex-direction: column;"> ... </div>\` içinde sarmala.
    3.  **Etkinlikler Kapsayıcısı:** Ana Sayfa Kapsayıcısı içinde, başlıktan sonra, tüm alt etkinlikleri gerekli düzeni uygulayan tek bir kapsayıcı div içine yerleştir. Örn: \`<div style="display: grid; grid-template-columns: 1fr 1fr; gap: ${appearanceSettings.itemSpacing}px; flex-grow: 1;"> ... alt etkinlikler buraya ... </div>\`.
    4.  **Netlik ve Estetik:** Yüksek kontrast, büyük okunabilir yazı tipleri ve bol beyaz alan kullan. Çizimler için satır içi SVG'ler kullanarak net ve yazdırılabilir olmalarını sağla. Genel tasarım modern, dostça, profesyonel ve TAMAMLANMIŞ hissettirmelidir.
    5.  **Dil:** Tüm metinler Türkçe olmalıdır.
    6.  **Sayfa Ayırıcı:** Birden fazla sayfa oluşturursan, bunları MUTLAKA tam olarak \`<!-- PAGE_BREAK -->\` ile ayırmalısın.
    7.  **Görsel Özelleştirme (YENİ KURAL):** SVG içindeki renkler için MUTLAKA CSS değişkenleri kullan. Örneğin, \`fill="var(--primary-color)"\` veya \`stroke="var(--secondary-color)"\`. Bu, görsellerin uygulama temasıyla birlikte değişmesini sağlar. Asla sabitlenmiş renk kodları (#ff0000 gibi) kullanma.

    **Son Komut:** "${selectedModule.name}" modülü için tüm kurallara uyarak ve görev listesini uygulayarak çalışma sayfasını oluştur.
    `;
};