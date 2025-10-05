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
    title: 'Disleksi Profesyonel Destek',
    description: 'Okuma, anlama ve dilin yapısal özelliklerine odaklanan profesyonel etkinlikler.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-[rgb(var(--c-topic-disleksi-500))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>`,
    colorClasses: {
      bg: 'bg-[rgb(var(--c-topic-disleksi-100))]',
      border: 'border-[rgb(var(--c-topic-disleksi-400))]',
      accent: 'bg-[rgb(var(--c-topic-disleksi-400))]',
    },
    subTopics: [
        { id: 'phonological-awareness', title: 'Fonolojik Farkındalık', description: 'Dilin ses yapısı üzerine farkındalık oluşturur. Kafiye, heceleme, ses birleştirme ve ayırma gibi becerilerle okumanın temelini sağlamlaştırır.' },
        { id: 'letter-sound', title: 'Harf-Ses İlişkisi (Fonetik)', description: 'Alfabedeki harfler ile temsil ettikleri sesler arasında otomatik ve güçlü bir bağ kurarak kodlama (yazma) ve dekodaj (okuma) becerilerini geliştirir.' },
        { id: 'reading-fluency', title: 'Akıcı Okuma', description: 'Kelimeleri doğru, hızlı ve uygun tonlama ile okuma becerisini geliştirir. Bu, okuduğunu anlamak için zihinsel kaynakları serbest bırakır.' },
        { id: 'reading-comprehension', title: 'Okuduğunu Anlama Stratejileri', description: 'Metindeki ana fikirleri, detayları ve örtük anlamları çıkarma, metni analiz etme ve çıkarım yapma gibi üst düzey anlama becerilerini hedefler.' },
        { id: 'visual-processing', title: 'Görsel İşlemleme ve Ayırt Etme', description: 'Görsel olarak benzer harfleri (b/d) ve kelimeleri (ev/ve) doğru ayırt etme, görsel hafızayı ve sıralama becerilerini güçlendirerek okuma hatalarını azaltır.' },
        { id: 'vocabulary-morphology', title: 'Kelime Bilgisi ve Morfoloji', description: 'Kelime dağarcığını, kelimelerin yapı taşları olan kökler ve ekler (morfoloji) aracılığıyla anlamlarını çözümleyerek stratejik olarak genişletir.' },
        { id: 'spelling-patterns', title: 'Yazım Kuralları ve Paternler', description: 'Türkçedeki ses-harf uyumu kurallarına (ünlü/ünsüz uyumu) ve sık karşılaşılan yazım kalıplarına odaklanarak imla becerilerini otomatikleştirir.' },
        { id: 'working-memory-sequencing', title: 'İşitsel Hafıza ve Sıralama', description: 'İşitsel bilgiyi (sesler, kelimeler, talimatlar) kısa süreli hafızada tutma, işleme ve doğru sırada tekrar etme kapasitesini artırarak anlama ve öğrenmeyi destekler.' },
        { id: 'auditory-dictation', title: 'İşitsel Yazma (Dikte)', description: 'Söylenen kelimeleri dinleyip doğru bir şekilde yazma becerisini geliştirir. Ses-harf bağlantısını güçlendirir.' },
        { id: 'interactive-story', title: 'Uygulamalı Hikaye Macerası', description: 'Kararlar vererek ilerlediğin, içinde mini oyunlar olan etkileşimli bir okuma macerası.' },
    ],
  },
  'diskalkuli': {
    title: 'Diskalkuli Profesyonel Destek',
    description: 'Sayı hissi, aritmetik ve matematiksel akıl yürütme becerilerini güçlendiren oyunlar.',
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
        { id: 'interactive-story', title: 'Uygulamalı Hikaye Macerası', description: 'Kararlar vererek ilerlediğin, içinde mini oyunlar olan etkileşimli bir matematik macerası.' },
    ]
  },
  'disgrafi': {
    title: 'Disgrafi Profesyonel Destek',
    description: 'Yazma mekaniği, düşünceleri organize etme ve yazılı ifade becerilerini destekler.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-[rgb(var(--c-topic-disgrafi-500))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>`,
     colorClasses: {
        bg: 'bg-[rgb(var(--c-topic-disgrafi-100))]',
        border: 'border-[rgb(var(--c-topic-disgrafi-400))]',
        accent: 'bg-[rgb(var(--c-topic-disgrafi-400))]',
    },
    subTopics: [
        { id: 'fine-motor-skills', title: 'İnce Motor Becerileri', description: 'Kalemin doğru kavranması, el-göz koordinasyonu ve harfleri oluşturmak için gereken kontrollü, hassas el hareketlerinin geliştirilmesini hedefler.' },
        { id: 'letter-formation', title: 'Harf Şekillendirme ve Otomatiklik', description: 'Her harfin doğru hareket dizilimi ile (formation) yazılmasını öğreterek harf yazımını otomatik, akıcı ve daha az yorucu hale getirir.' },
        { id: 'handwriting-legibility', title: 'Okunaklılık ve Yazı Düzeni', description: 'Harf boyutu tutarlılığı, kelime ve harf arası boşlukların uygunluğu ve satıra düzgün yerleşim gibi okunaklılığı artıran unsurlara odaklanır.' },
        { id: 'writing-speed', title: 'Yazma Hızı ve Akıcılığı', description: 'Yazı yazma işlemini otomatikleştirerek, düşünme hızı ile yazma hızı arasındaki farkı azaltmayı ve not alma gibi becerilerde akıcılığı artırmayı amaçlar.' },
        { id: 'sentence-construction', title: 'Cümle Kurma ve Yapılandırma', description: 'Basit, birleşik ve karmaşık cümle yapılarını kullanarak düşünceleri açık ve dilbilgisi açısından doğru bir şekilde ifade etme becerisini geliştirir.' },
        { id: 'punctuation-grammar', title: 'Noktalama ve Dilbilgisi', description: 'Cümlenin anlamını netleştirmek ve metni okunabilir kılmak için temel noktalama işaretlerinin ve dilbilgisi kurallarının doğru kullanımını öğretir.' },
        { id: 'writing-planning', title: 'Yazı Planlama ve Organizasyon', description: 'Yazmaya başlamadan önce düşünceleri organize etme, fikirleri mantıksal bir sıraya koyma ve yapılandırılmış bir taslak oluşturma stratejilerini öğretir.' },
        { id: 'creative-writing-prompts', title: 'Yaratıcı Yazma', description: 'Hayal gücünü harekete geçiren, açık uçlu ve yaratıcı senaryolar sunarak yazılı ifadeyi bir görevden keyifli bir kendini ifade etme aracına dönüştürür.' },
        { id: 'keyboarding-skills', title: 'Klavye Becerileri', description: 'Günümüz dijital dünyası için temel bir beceri olan on parmak klavye kullanımını, doğru duruş ve parmak konumlandırma teknikleriyle geliştirir.' },
        { id: 'interactive-story', title: 'Uygulamalı Hikaye Macerası', description: 'Kararlar vererek ilerlediğin, içinde mini oyunlar olan etkileşimli bir yazma macerası.' },
    ]
  },
};