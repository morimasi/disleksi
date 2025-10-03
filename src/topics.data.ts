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
    title: 'Disleksi',
    description: 'Okuma, harf-ses ilişkisi ve kelime tanıma üzerine odaklanan etkinlikler.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>`,
    colorClasses: {
      bg: 'bg-blue-100',
      border: 'border-blue-400',
      accent: 'bg-blue-400',
    },
    subTopics: [
        { id: 'phonological-awareness', title: 'Fonolojik Farkındalık', description: 'Kelimelerdeki sesleri tanıma ve kullanma alıştırmaları.' },
        { id: 'letter-sound', title: 'Harf-Ses İlişkisi', description: 'Harfleri ve temsil ettikleri sesleri eşleştirme oyunları.' },
        { id: 'reading-fluency', title: 'Akıcı Okuma', description: 'Okuma hızını ve doğruluğunu artırmaya yönelik metinler.' },
        { id: 'reading-comprehension', title: 'Okuduğunu Anlama', description: 'Metinlerle ilgili soruları yanıtlama ve ana fikri bulma.' },
        { id: 'visual-processing', title: 'Görsel İşlemleme', description: 'Harf ve kelimeleri görsel olarak ayırt etme becerileri.' },
    ],
  },
  'diskalkuli': {
    title: 'Diskalkuli',
    description: 'Sayıları anlama, temel aritmetik ve problem çözme becerilerini geliştiren oyunlar.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>`,
    colorClasses: {
        bg: 'bg-yellow-100',
        border: 'border-yellow-400',
        accent: 'bg-yellow-400',
    },
    subTopics: [
        { id: 'number-sense', title: 'Sayı Hissi', description: 'Sayıları tanıma, sıralama ve karşılaştırma etkinlikleri.' },
        { id: 'basic-arithmetic', title: 'Temel Aritmetik', description: 'Toplama, çıkarma, çarpma ve bölme alıştırmaları.' },
        { id: 'problem-solving', title: 'Problem Çözme', description: 'Matematiksel düşünmeyi gerektiren günlük yaşam problemleri.' },
        { id: 'math-symbols', title: 'Matematik Sembolleri', description: 'Artı, eksi gibi matematiksel sembollerin anlamlarını öğrenme.' },
        { id: 'time-measurement', title: 'Zaman ve Ölçme', description: 'Saati okuma, uzunluk ve ağırlık birimlerini anlama.' },
    ]
  },
  'disgrafi': {
    title: 'Disgrafi',
    description: 'El yazısı, harf oluşturma ve yazılı ifade becerilerini destekleyen çalışmalar.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>`,
     colorClasses: {
        bg: 'bg-green-100',
        border: 'border-green-400',
        accent: 'bg-green-400',
    },
    subTopics: [
        { id: 'handwriting-legibility', title: 'Okunaklı El Yazısı', description: 'Harfleri daha net ve okunaklı yazma alıştırmaları.' },
        { id: 'letter-formation', title: 'Harf Şekillendirme', description: 'Harflerin doğru şekilde nasıl yazıldığını öğrenme.' },
        { id: 'writing-speed', title: 'Yazma Hızı', description: 'Daha akıcı ve hızlı yazma becerisini geliştirme.' },
        { id: 'sentence-construction', title: 'Cümle Kurma', description: 'Anlamlı ve dilbilgisi kurallarına uygun cümleler oluşturma.' },
        { id: 'punctuation-grammar', title: 'Noktalama ve Dilbilgisi', description: 'Nokta, virgül gibi işaretlerin doğru kullanımı.' },
    ]
  },
};
