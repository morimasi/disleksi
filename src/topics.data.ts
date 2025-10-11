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
        { id: 'phonological-awareness', title: 'Ses Büyücüsü', description: 'Kelimelerin sesleriyle oyna! Kafiyeleri yakala, heceleri say ve sesleri birleştirerek okumanın sihirli temelini at.', pedagogicalGoal: 'Disleksili bireylerin fonolojik işlemleme zorluklarını hedef alarak, kelimeleri oluşturan ses birimlerini (fonemler) tanıma, ayırt etme ve manipüle etme becerisini geliştirmek. Bu, okuma akıcılığı ve doğruluğunun temelini oluşturur.' },
        { id: 'letter-sound', title: 'Harf Dedektifi', description: 'Harflerin gizli seslerini ortaya çıkar! Her harfin sesini öğrenerek okuma ve yazma kodlarını bir profesyonel gibi çöz.', pedagogicalGoal: 'Harf-ses eşleşmesini (grafem-fonem ilişkisi) otomatikleştirerek dekodaj becerilerini güçlendirmek. Bu, dislekside sıkça görülen yavaş ve hatalı okumanın önüne geçmek için kritik bir adımdır.' },
        { id: 'reading-aloud-coach', title: 'Sesli Okuma Koçu', description: 'Metni sesli ve akıcı bir şekilde oku! Yapay zeka koçun anında geri bildirim verecek. Okumanı hızlandır ve daha özgüvenli ol!', pedagogicalGoal: 'Okuma akıcılığını (doğruluk, hız ve prozodi) artırmak. Yapay zeka geri bildirimiyle öğrencinin kendi hatalarını fark etmesini ve düzeltmesini sağlayarak öz-denetim becerilerini geliştirmek.' },
        { id: 'reading-comprehension', title: 'Anlam Kâşifi', description: 'Metinlerin derinliklerine dal! Ana fikirleri bul, gizli ipuçlarını yakala ve bir hikaye ustası gibi çıkarımlar yap.', pedagogicalGoal: 'Sadece kelimeleri çözmekle kalmayıp, okunan metnin anlamını derinlemesine anlama, ana fikri çıkarma, çıkarım yapma ve metin içi bağlantıları kurma gibi üst düzey anlama becerilerini geliştirmek.' },
        { id: 'word-explorer', title: 'Kelime Kâşifi', description: 'Yeni bir kelime öğren, anlamını, cümledeki kullanımını ve resmini keşfet. Kelime hazineni genişlet!', pedagogicalGoal: 'Kelime dağarcığını zenginleştirerek okuduğunu anlama kapasitesini artırmak. Bir kelimenin çoklu duyusal (görsel, işitsel, anlamsal) temsillerini oluşturarak kalıcı öğrenmeyi desteklemek.' },
        { id: 'visual-processing', title: 'Görsel Usta', description: 'Gözlerini bir kartal gibi kullan! Benzer harfleri (b/d) ve kelimeleri (ev/ve) ayırt et, okuma hatalarını azalt.', pedagogicalGoal: 'Dislekside yaygın olan görsel işlemleme ve ayırt etme zorluklarını hedeflemek. Harf ve kelime formlarını doğru tanıma, görsel sıralama ve takip becerilerini güçlendirerek okuma doğruluğunu artırmak.' },
        { id: 'vocabulary-morphology', title: 'Kelime Avcısı', description: 'Kelimelerin yapı taşlarını (kökler ve ekler) keşfet. Kelime dağarcığını zenginleştirerek anlama gücünü artır.', pedagogicalGoal: 'Morfolojik farkındalık yaratarak kelime tanıma ve anlamlandırma becerilerini geliştirmek. Kelimelerin kök ve eklerden oluştuğunu anlamak, yeni kelimelerin anlamını tahmin etmeyi kolaylaştırır.' },
        { id: 'spelling-patterns', title: 'Yazım Şampiyonu', description: 'Türkçenin yazım kurallarını öğrenerek kelimeleri doğru yazmanın ustası ol. Yazıların hatasız ve pırıl pırıl parlasın.', pedagogicalGoal: 'Ortografik (yazım) kuralları ve desenleri içselleştirerek yazım becerilerini otomatikleştirmek. Bu, disleksi ve disgrafide sıkça görülen yazım hatalarını azaltmayı hedefler.' },
        { id: 'working-memory-sequencing', title: 'Hafıza Oyuncusu', description: 'Söylenenleri aklında tut ve doğru sıraya koy. Dinleme ve anlama becerilerini güçlendirerek öğrenmeyi kolaylaştır.', pedagogicalGoal: 'İşitsel ve görsel çalışma belleği kapasitesini ve sıralama becerilerini geliştirmek. Bu, çok adımlı talimatları takip etme, okuduğunu anlama ve matematiksel problem çözme için temel bir yetenektir.' },
        { id: 'auditory-dictation', title: 'İşitsel Yazma (Dikte)', description: 'Kulağına fısıldanan kelimeleri harflere dök. Dinleme ve yazma becerilerini birleştirerek dikkatini geliştir.', pedagogicalGoal: 'İşitsel işlemleme, ses-harf eşleştirme ve yazım becerilerini entegre bir şekilde çalıştırmak. Dikte, fonolojik farkındalığı yazıya dökme yeteneğini doğrudan ölçer ve geliştirir.' },
        { id: 'interactive-story', title: 'Uygulamalı Hikaye Macerası', description: 'Kendi maceranın kahramanı ol! Kararlar vererek hikayeyi sen yönlendir ve heyecan dolu sonlara ulaş.', pedagogicalGoal: 'Okuma motivasyonunu artırırken, karar verme ve sonuçlarını anlama becerisini geliştirmek. Okuma sürecini interaktif ve kontrolün öğrencide olduğu bir deneyime dönüştürerek öğrenmeye karşı olumlu bir tutum oluşturmak.' },
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
        { id: 'number-sense', title: 'Sayı Hissi ve Miktar Kavramı', description: 'Sayıların büyüklüklerini sezgisel olarak anlama, karşılaştırma, sıralama ve sayı doğrusu üzerinde konumlandırma gibi temel sayısal muhakeme becerilerini geliştirir.', pedagogicalGoal: 'Diskalkulinin temelinde yatan zayıf sayı hissini (number sense) güçlendirmek. Sayıların soyut semboller olmadığını, belirli miktarları temsil ettiğini ve birbirleriyle ilişkili olduğunu içselleştirmek.' },
        { id: 'basic-arithmetic', title: 'Temel Aritmetik Akıcılığı', description: 'Dört temel işlemde (toplama, çıkarma, çarpma, bölme) doğruluk ve akıcılık kazanmaya yönelik, strateji gelişimini destekleyen alıştırmalar içerir.', pedagogicalGoal: 'Temel matematiksel işlemleri otomatikleştirerek bilişsel yükü azaltmak. Bu, öğrencinin daha karmaşık problem çözme görevlerine odaklanabilmesi için zihinsel kaynaklarını serbest bırakmasını sağlar.' },
        { id: 'number-grouping-practice', title: 'Sayı Gruplama Alıştırması', description: 'Sayıları gruplara ayırarak toplama ve çıkarma işlemlerini kolayca yap! Gruplama stratejileriyle matematiği sev.', pedagogicalGoal: 'Onluk sistemi ve basamak değeri kavramlarını somutlaştırarak temel aritmetik stratejileri (örneğin, 10\'a tamamlama) öğretmek. Bu, parmakla sayma bağımlılığını azaltır.' },
        { id: 'problem-solving', title: 'Problem Çözme Stratejileri', description: 'Matematiksel problemleri anlama, analiz etme, uygun stratejiyi seçme ve çözümü uygulama adımlarını içeren, gerçek hayat senaryolarına dayalı beceriler.', pedagogicalGoal: 'Sözel problemleri anlama ve matematiksel dile çevirme becerisini geliştirmek. Diskalkulili bireylerin problemdeki gereksiz bilgileri ayıklama ve çözüm için gereken adımları sıralama zorluklarını hedeflemek.' },
        { id: 'math-symbols', title: 'Matematiksel Dil ve Semboller', description: 'Matematiksel işlemleri ve ilişkileri ifade eden temel sembollerin (+, -, ×, ÷, =, <, >) anlamlarını ve doğru kullanımını pekiştirir.', pedagogicalGoal: 'Matematiksel sembollerin (örn. +, <) anlamlarını ve işlevlerini kalıcı olarak öğrenmek. Sembollerin soyut doğası nedeniyle yaşanan kafa karışıklıklarını ortadan kaldırmak.' },
        { id: 'time-measurement', title: 'Zaman, Ölçme ve Geometri', description: 'Zaman (saat), para, ölçü birimleri (uzunluk, ağırlık) ve temel geometrik kavramlar gibi günlük yaşam için kritik matematiksel becerileri kapsar.', pedagogicalGoal: 'Matematiğin para, saat, ölçüm gibi soyut ve sıralı kavramlarını gerçek hayat bağlamlarında somutlaştırarak öğrenmeyi kolaylaştırmak.' },
        { id: 'spatial-reasoning', title: 'Uzamsal Akıl Yürütme', description: 'Nesneleri zihinde canlandırma, mekansal ilişkileri (altında, üstünde) kavrama ve görsel desenleri analiz etme gibi temel uzamsal becerileri hedefler. Geometri için kritik bir temel oluşturur.', pedagogicalGoal: 'Görsel-mekansal akıl yürütme becerilerini güçlendirmek. Bu, geometri, basamak değeri anlayışı ve sayı doğrusu üzerindeki konumlandırma gibi birçok matematiksel alan için temel oluşturur.' },
        { id: 'estimation-skills', title: 'Tahmin Becerileri', description: 'Bir işlem yapmadan önce sonucun yaklaşık ne olabileceğini veya bir miktarın büyüklüğünü mantıklı bir şekilde kestirme (yuvarlama, kıyaslama) becerisini güçlendirir.', pedagogicalGoal: 'Sayıların büyüklükleri hakkında sezgisel bir anlayış geliştirerek, bir cevabın "makul" olup olmadığını değerlendirme yeteneği kazandırmak. Bu, işlem hatalarını fark etmede önemli bir öz-denetim mekanizmasıdır.' },
        { id: 'fractions-decimals', title: 'Kesirler ve Ondalık Sayılar', description: 'Bir bütünün parçalarını temsil eden kesirler ve ondalık sayılar arasındaki ilişkiyi somut örneklerle kurarak bu soyut kavramları anlaşılır kılar.', pedagogicalGoal: 'Kesirler ve ondalık sayılar gibi soyut ve genellikle zorlayıcı bulunan kavramları, görsel ve somut temsiller kullanarak anlaşılır hale getirmek ve parça-bütün ilişkisini güçlendirmek.' },
        { id: 'visual-number-representation', title: 'Sayıların Görsel Temsili', description: 'Sayıların sadece soyut semboller olmadığını, aynı zamanda belirli miktarları temsil ettiğini görsel materyaller (nesne grupları, sayı doğruları) aracılığıyla içselleştirir.', pedagogicalGoal: 'Sayı sembolleri (örn. "7") ile temsil ettikleri gerçek miktar (örn. yedi elma) arasında güçlü ve otomatik bir bağlantı kurmak. Bu, diskalkulinin temelindeki bir eksikliği gidermeyi hedefler.' },
        { id: 'visual-arithmetic', title: 'Görsel Aritmetik', description: 'Sayıları ve işlemleri somut nesnelerle (resimler, emojiler) göstererek matematiksel kavramların anlaşılmasını kolaylaştırır.', pedagogicalGoal: 'Soyut matematiksel işlemleri somut ve görsel temsillerle destekleyerek kavramsal anlayışı derinleştirmek. Sayıların ve işlemlerin ne anlama geldiğini görselleştirerek öğrenciye yardımcı olmak.' },
        { id: 'interactive-story', title: 'Uygulamalı Hikaye Macerası', description: 'Kendi maceranın kahramanı ol! Kararlar vererek hikayeyi sen yönlendir ve heyecan dolu sonlara ulaş.', pedagogicalGoal: 'Matematik kaygısını azaltmak ve motivasyonu artırmak. Matematiksel problem çözmeyi, ilgi çekici bir hikaye bağlamına yerleştirerek öğrenme sürecini eğlenceli ve anlamlı hale getirmek.' },
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
        { id: 'fine-motor-skills', title: 'İnce Motor Becerileri', description: 'Kalemini ustaca yönet! El-göz koordinasyonunu geliştirerek harfleri daha kontrollü ve rahat çiz.', pedagogicalGoal: 'Yazı yazmak için gereken ince kas kontrolünü, el-göz koordinasyonunu ve el becerisini artırmak. Bu, kalemi doğru tutma ve harfleri oluşturmak için gereken akıcı hareketleri yapabilmenin temelidir.' },
        { id: 'letter-formation', title: 'Harf Şekillendirme', description: 'Her harfi doğru ve akıcı bir şekilde yazmayı öğren. Harflerin dansını keşfet ve yazını güzelleştir.', pedagogicalGoal: 'Harflerin doğru ve tutarlı bir şekilde oluşturulması için gereken motor planlamayı (grafomotor) otomatikleştirmek. Bu, harflerin ters yazılması veya yanlış yerden başlanması gibi sorunları azaltır.' },
        { id: 'letter-form-recognition', title: 'Harf Formu Tanıma', description: 'Doğru yazılmış harfleri tanıyarak el-göz koordinasyonu ve harf yazım hafızasını geliştirir.', pedagogicalGoal: 'Harflerin doğru formlarını görsel olarak tanıma ve ayırt etme becerisini güçlendirmek. Bu, öğrencinin kendi yazdığı harflerin doğruluğunu kontrol etmesine yardımcı olur.' },
        { id: 'handwriting-legibility', title: 'Okunaklı Yazı', description: 'Yazını bir sanat eseri gibi düzenle! Harf boyutu, boşluklar ve düzgün sıralama ile pırıl pırıl bir yazıya sahip ol.', pedagogicalGoal: 'Yazının okunabilirliğini artırmak için harfler arası, kelimeler arası boşluk bırakma, harf boyutunu tutarlı kılma ve satıra düzgün yazma gibi görsel-mekansal becerileri geliştirmek.' },
        { id: 'picture-sequencing-storyteller', title: 'Resim Sıralama Hikayecisi', description: 'Resimleri mantıklı bir sıraya dizerek kendi hikayeni anlat! Görsel anlatım becerilerini geliştir.', pedagogicalGoal: 'Disgrafide sıklıkla zorlanılan düşünceleri organize etme ve sıralama becerisini, yazı eyleminin motor yükü olmadan geliştirmek. Bu, hikaye yapısını planlama pratiği sağlar.' },
        { id: 'writing-speed', title: 'Yazma Hızı', description: 'Düşüncelerinin hızına yetiş! Yazma işlemini otomatikleştirerek daha hızlı ve akıcı bir şekilde not al, hikayeler yaz.', pedagogicalGoal: 'Harf oluşumunu ve yazma eylemini otomatikleştirerek yazma hızını ve akıcılığını artırmak. Bu, öğrencinin düşünme hızına yazısının yetişmesini sağlayarak bilişsel yükü azaltır.' },
        { id: 'sentence-construction', title: 'Cümle Kurma Sanatı', description: 'Kelimeleri birleştirerek güçlü cümleler inşa et. Düşüncelerini açık ve doğru bir şekilde ifade etmeyi öğren.', pedagogicalGoal: 'Düşünceleri tam ve dilbilgisel olarak doğru cümlelere dönüştürme becerisini geliştirmek. Kelime sıralaması, cümle yapısı ve anlam bütünlüğü üzerine odaklanmak.' },
        { id: 'punctuation-grammar', title: 'Noktalama İşaretleri', description: 'Noktalar, virgüller ve diğer işaretlerle cümlelerine anlam kat. Yazılarını daha anlaşılır ve profesyonel hale getir.', pedagogicalGoal: 'Yazılı ifadenin netliğini ve doğruluğunu artırmak için temel dilbilgisi kurallarını ve noktalama işaretlerinin işlevlerini öğretmek.' },
        { id: 'writing-planning', title: 'Yazı Planlama', description: 'Bir yazar gibi düşün! Fikirlerini organize et, bir taslak oluştur ve yazmaya başlamadan önce yol haritanı çiz.', pedagogicalGoal: 'Yazmaya başlamadan önce fikirleri planlama, organize etme ve yapılandırma gibi üst düzey yürütücü işlev becerilerini geliştirmek. Bu, disgrafideki "boş sayfa korkusu" ve düzensiz yazı sorunlarını hedefler.' },
        { id: 'creative-writing-prompts', title: 'Yaratıcı Yazarlık', description: 'Hayal gücünü serbest bırak! İlginç başlangıçlarla kendi öykülerini, maceralarını ve dünyalarını yarat.', pedagogicalGoal: 'Yazma eyleminin mekanik zorluklarından ziyade, fikir üretme ve hayal gücünü kullanma kısmına odaklanarak yazmaya karşı motivasyonu ve olumlu tutumu artırmak.' },
        { id: 'keyboarding-skills', title: 'Klavye Becerileri', description: 'Parmaklarını dans ettir! On parmak klavye kullanarak dijital dünyada hız ve yetenek kazan.', pedagogicalGoal: 'El yazısının motor zorluklarını aşmak için alternatif bir yazma yöntemi sunmak. Klavye becerilerini geliştirerek, öğrencinin düşüncelerini daha hızlı ve daha az yorularak ifade etmesini sağlamak.' },
        { id: 'interactive-story', title: 'Uygulamalı Hikaye Macerası', description: 'Kendi maceranın kahramanı ol! Kararlar vererek hikayeyi sen yönlendir ve heyecan dolu sonlara ulaş.', pedagogicalGoal: 'Yazma ve planlama sürecini, motivasyonu yüksek ve interaktif bir bağlamda sunmak. Öğrencinin seçimlerinin hikayeyi nasıl şekillendirdiğini görmesi, neden-sonuç ilişkisini ve anlatı yapısını anlamasına yardımcı olur.' },
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
        { id: 'spatial-relations-positional', title: 'Konumsal Kavramlar', description: '"Üstünde, altında, yanında" gibi temel pozisyonları resimlerle ve oyunlarla öğren, nesnelerin yerini kolayca anla.', pedagogicalGoal: 'Öğrenme güçlüğü olan bireylerin, özellikle diskalkuli ve disgrafide görülen, nesneler arasındaki konumsal ilişkileri (üstünde, altında, yanında vb.) anlama ve ifade etme becerisini geliştirmek.' },
        { id: 'spatial-relations-directional', title: 'Yön Kavramları', description: '"Sağ, sol, yukarı, aşağı" gibi yönleri ayırt ederek bir harita okuyucusu gibi yönünü bul.', pedagogicalGoal: 'Sağ-sol ayrımı gibi yön kavramlarını içselleştirmek. Bu, harf (b/d) ve sayı (12/21) karıştırmalarının azaltılmasına ve matematiksel işlemlerde basamak takibine yardımcı olur.' },
        { id: 'spatial-relations-visual-discrimination', title: 'Görsel Ayırt Etme', description: 'Nesneleri farklı açılardan tanıyarak bir dedektif gibi detayları fark et. Görsel zekan gelişsin!', pedagogicalGoal: 'Benzer şekiller, harfler veya sayılar arasındaki ince farkları ayırt etme yeteneğini güçlendirmek. Bu, okuma ve matematik doğruluğu için kritik olan görsel işlemleme hızını ve dikkatini artırır.' },
    ],
  },
};