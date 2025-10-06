import { Topic, SubTopic } from './models/activity.model';

interface TopicColorClasses {
  bg: string;
  border: string;
  accent: string;
}

interface TopicData {
  title: string;
  description: string;
  icon: string;
  colorClasses: TopicColorClasses;
  subTopics: SubTopic[];
}

export const TOPICS_DATA: Record<Topic, TopicData> = {
  'disleksi': {
    title: 'Disleksi Kelime Macerası',
    description: 'Kelimelerin ve seslerin gizemli dünyasında bir keşfe çık! Okuma ve anlama süper güçlerini geliştir.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-[rgb(var(--c-topic-disleksi-500))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>`,
    colorClasses: {
      bg: 'bg-[rgb(var(--c-topic-disleksi-100))]',
      border: 'border-[rgb(var(--c-topic-disleksi-400))]',
      accent: 'bg-[rgb(var(--c-topic-disleksi-400))]',
    },
    subTopics: [
        { id: 'phonological-awareness', title: 'Ses Büyücüsü', description: 'Kelimelerin sesleriyle oyna! Kafiyeleri yakala, heceleri say ve sesleri birleştirerek okumanın sihirli temelini at.' },
        { id: 'letter-sound', title: 'Harf Dedektifi', description: 'Harflerin gizli seslerini ortaya çıkar! Her harfin sesini öğrenerek okuma ve yazma kodlarını bir profesyonel gibi çöz.' },
        { id: 'reading-aloud-coach', title: 'Sesli Okuma Koçu', description: 'Metinleri sesli oku, yapay zeka koçun sana anında geri bildirim versin. Okumanı hızlandır ve daha özgüvenli ol!' },
        { id: 'reading-comprehension', title: 'Anlam Kâşifi', description: 'Metinlerin derinliklerine dal! Ana fikirleri bul, gizli ipuçlarını yakala ve bir hikaye ustası gibi çıkarımlar yap.' },
        { id: 'word-explorer', title: 'Kelime Kâşifi', description: 'Yeni bir kelime öğren, anlamını, cümledeki kullanımını ve resmini keşfet. Kelime hazineni genişlet!' },
        { id: 'visual-processing', title: 'Görsel Usta', description: 'Gözlerini bir kartal gibi kullan! Benzer harfleri (b/d) ve kelimeleri (ev/ve) ayırt et, okuma hatalarını azalt.' },
        { id: 'vocabulary-morphology', title: 'Kelime Avcısı', description: 'Kelimelerin yapı taşlarını (kökler ve ekler) keşfet. Kelime dağarcığını zenginleştirerek anlama gücünü artır.' },
        { id: 'spelling-patterns', title: 'Yazım Şampiyonu', description: 'Türkçenin yazım kurallarını öğrenerek kelimeleri doğru yazmanın ustası ol. Yazıların hatasız ve pırıl pırıl parlasın.' },
        { id: 'working-memory-sequencing', title: 'Hafıza Oyuncusu', description: 'Söylenenleri aklında tut ve doğru sıraya koy. Dinleme ve anlama becerilerini güçlendirerek öğrenmeyi kolaylaştır.' },
        { id: 'auditory-dictation', title: 'İşitsel Yazma (Dikte)', description: 'Kulağına fısıldanan kelimeleri harflere dök. Dinleme ve yazma becerilerini birleştirerek dikkatini geliştir.' },
        { id: 'interactive-story', title: 'Uygulamalı Hikaye Macerası', description: 'Kendi maceranın kahramanı ol! Kararlar vererek hikayeyi sen yönlendir ve heyecan dolu sonlara ulaş.' },
    ],
  },
  'diskalkuli': {
    title: 'Diskalkuli Sayı Macerası',
    description: 'Sayıların eğlenceli dünyasına adım at! Oyunlarla matematik becerilerini geliştir ve sayıların efendisi ol.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-[rgb(var(--c-topic-diskalkuli-500))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>`,
    colorClasses: {
        bg: 'bg-[rgb(var(--c-topic-diskalkuli-100))]',
        border: 'border-[rgb(var(--c-topic-diskalkuli-400))]',
        accent: 'bg-[rgb(var(--c-topic-diskalkuli-400))]',
    },
    subTopics: [
        { id: 'number-sense', title: 'Sayı Hissi ve Miktar Kavramı', description: 'Sayıların büyüklüklerini sezgisel olarak anlama, karşılaştırma, sıralama ve sayı doğrusu üzerinde konumlandırma gibi temel sayısal muhakeme becerilerini geliştirir.' },
        { id: 'basic-arithmetic', title: 'Temel Aritmetik Akıcılığı', description: 'Dört temel işlemde (toplama, çıkarma, çarpma, bölme) doğruluk ve akıcılık kazanmaya yönelik, strateji gelişimini destekleyen alıştırmalar içerir.' },
        { id: 'problem-solving', title: 'Problem Çözme Stratejileri', description: 'Matematiksel problemleri anlama, analiz etme, uygun stratejiyi seçme ve çözümü uygulama adımlarını içeren, gerçek hayat senaryolarına dayalı beceriler.' },
        { id: 'math-symbols', title: 'Matematiksel Dil ve Semboller', description: 'Matematiksel işlemleri ve ilişkileri ifade eden temel sembollerin (+, -, ×, ÷, =, <, >) anlamlarını ve doğru kullanımını pekiştirir.' },
        { id: 'time-measurement', title: 'Zaman, Ölçme ve Geometri', description: 'Zaman (saat), para, ölçü birimleri (uzunluk, ağırlık) ve temel geometrik kavramlar gibi günlük yaşam için kritik matematiksel becerileri kapsar.' },
        { id: 'spatial-reasoning', title: 'Uzamsal Akıl Yürütme', description: 'Nesneleri zihinde canlandırma, mekansal ilişkileri (altında, üstünde) kavrama ve görsel desenleri analiz etme gibi temel uzamsal becerileri hedefler. Geometri için kritik bir temel oluşturur.' },
        { id: 'estimation-skills', title: 'Tahmin Becerileri', description: 'Bir işlem yapmadan önce sonucun yaklaşık ne olabileceğini veya bir miktarın büyüklüğünü mantıklı bir şekilde kestirme (yuvarlama, kıyaslama) becerisini güçlendirir.' },
        { id: 'fractions-decimals', title: 'Kesirler ve Ondalık Sayılar', description: 'Bir bütünün parçalarını temsil eden kesirler ve ondalık sayılar arasındaki ilişkiyi somut örneklerle kurarak bu soyut kavramları anlaşılır kılar.' },
        { id: 'visual-number-representation', title: 'Sayıların Görsel Temsili', description: 'Sayıların sadece soyut semboller olmadığını, aynı zamanda belirli miktarları temsil ettiğini görsel materyaller (nesne grupları, sayı doğruları) aracılığıyla içselleştirir.' },
        { id: 'visual-arithmetic', title: 'Görsel Aritmetik', description: 'Sayıları ve işlemleri somut nesnelerle (resimler, emojiler) göstererek matematiksel kavramların anlaşılmasını kolaylaştırır.' },
        { id: 'interactive-story', title: 'Uygulamalı Hikaye Macerası', description: 'Kendi maceranın kahramanı ol! Kararlar vererek hikayeyi sen yönlendir ve heyecan dolu sonlara ulaş.' },
    ]
  },
  'disgrafi': {
    title: 'Disgrafi Yazı Atölyesi',
    description: 'Kalemini bir sihirli değnek gibi kullan! Harfleri şekillendir, düşüncelerini organize et ve kendi hikayelerini yaz.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-[rgb(var(--c-topic-disgrafi-500))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>`,
     colorClasses: {
        bg: 'bg-[rgb(var(--c-topic-disgrafi-100))]',
        border: 'border-[rgb(var(--c-topic-disgrafi-400))]',
        accent: 'bg-[rgb(var(--c-topic-disgrafi-400))]',
    },
    subTopics: [
        { id: 'fine-motor-skills', title: 'İnce Motor Becerileri', description: 'Kalemini ustaca yönet! El-göz koordinasyonunu geliştirerek harfleri daha kontrollü ve rahat çiz.' },
        { id: 'letter-formation', title: 'Harf Şekillendirme', description: 'Her harfi doğru ve akıcı bir şekilde yazmayı öğren. Harflerin dansını keşfet ve yazını güzelleştir.' },
        { id: 'letter-form-recognition', title: 'Harf Formu Tanıma', description: 'Doğru yazılmış harfleri tanıyarak el-göz koordinasyonu ve harf yazım hafızasını geliştirir.' },
        { id: 'handwriting-legibility', title: 'Okunaklı Yazı', description: 'Yazını bir sanat eseri gibi düzenle! Harf boyutu, boşluklar ve düzgün sıralama ile pırıl pırıl bir yazıya sahip ol.' },
        { id: 'writing-speed', title: 'Yazma Hızı', description: 'Düşüncelerinin hızına yetiş! Yazma işlemini otomatikleştirerek daha hızlı ve akıcı bir şekilde not al, hikayeler yaz.' },
        { id: 'sentence-construction', title: 'Cümle Kurma Sanatı', description: 'Kelimeleri birleştirerek güçlü cümleler inşa et. Düşüncelerini açık ve doğru bir şekilde ifade etmeyi öğren.' },
        { id: 'punctuation-grammar', title: 'Noktalama İşaretleri', description: 'Noktalar, virgüller ve diğer işaretlerle cümlelerine anlam kat. Yazılarını daha anlaşılır ve profesyonel hale getir.' },
        { id: 'writing-planning', title: 'Yazı Planlama', description: 'Bir yazar gibi düşün! Fikirlerini organize et, bir taslak oluştur ve yazmaya başlamadan önce yol haritanı çiz.' },
        { id: 'creative-writing-prompts', title: 'Yaratıcı Yazarlık', description: 'Hayal gücünü serbest bırak! İlginç başlangıçlarla kendi öykülerini, maceralarını ve dünyalarını yarat.' },
        { id: 'keyboarding-skills', title: 'Klavye Becerileri', description: 'Parmaklarını dans ettir! On parmak klavye kullanarak dijital dünyada hız ve yetenek kazan.' },
        { id: 'interactive-story', title: 'Uygulamalı Hikaye Macerası', description: 'Kendi maceranın kahramanı ol! Kararlar vererek hikayeyi sen yönlendir ve heyecan dolu sonlara ulaş.' },
    ]
  },
  'mekansal-farkindalik': {
    title: 'Mekânsal Farkındalık Keşfi',
    description: 'Etrafındaki dünyanın sırlarını çöz! Nesnelerin yerlerini, yönlerini ve birbiriyle olan ilişkilerini eğlenceli görsellerle keşfet.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-7 7m7-7l-7-7" /></svg>`,
    colorClasses: {
      bg: 'bg-pink-100',
      border: 'border-pink-400',
      accent: 'bg-pink-400',
    },
    subTopics: [
        { id: 'spatial-relations-positional', title: 'Konumsal Kavramlar', description: '"Üstünde, altında, yanında" gibi temel pozisyonları resimlerle ve oyunlarla öğren, nesnelerin yerini kolayca anla.' },
        { id: 'spatial-relations-directional', title: 'Yön Kavramları', description: '"Sağ, sol, yukarı, aşağı" gibi yönleri ayırt ederek bir harita okuyucusu gibi yönünü bul.' },
        { id: 'spatial-relations-visual-discrimination', title: 'Görsel Ayırt Etme', description: 'Nesneleri farklı açılardan tanıyarak bir dedektif gibi detayları fark et. Görsel zekan gelişsin!' },
    ],
  },
};