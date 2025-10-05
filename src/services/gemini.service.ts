import { Injectable } from '@angular/core';
import { GoogleGenAI, Type } from '@google/genai';
import { Activity, GradeLevel, Topic, SubTopic, isWordScramble, isSimpleMath, isMultipleChoice, isOrdering, isDragDropMatch, isFillInTheBlanks, isTrueFalse, isVisualMatch, isMatchingPairs, isSequencingEvents, isInteractiveStory, isSentenceCompletion, isAuditoryDictation, isVisualArithmetic, MultipleChoiceProblem } from '../models/activity.model';
import { ACTIVITY_CONFIGS } from './activity-config';


@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    } else {
      console.error('API Key not found. Please set the API_KEY environment variable.');
    }
  }

  async generatePedagogicalFeedback(activity: Activity, problemIndex: number, userAnswer: string | string[] | null): Promise<string> {
    if (!this.ai) {
      throw new Error('Gemini AI client not initialized.');
    }

    let problemContext = '';
    let studentResponse = `Öğrencinin cevabı: "${Array.isArray(userAnswer) ? userAnswer.join(', ') : userAnswer}"`;
    let correctAnswerInfo = '';
    
    // Extract problem details and correct answer based on activity type
    if (isWordScramble(activity)) {
        const problem = activity.data.words[problemIndex];
        problemContext = `Soru Tipi: Karışık Kelime\nKarışık kelime: "${problem.scrambled}".`;
        correctAnswerInfo = `Doğru cevap: "${problem.correct}".`;
    } else if (isSimpleMath(activity)) {
        const problem = activity.data.problems[problemIndex];
        problemContext = `Soru Tipi: Matematik Problemi\nSoru: "${problem.question}".`;
        correctAnswerInfo = `Doğru cevap: "${problem.answer}".`;
    } else if (isMultipleChoice(activity) || isVisualMatch(activity)) {
        const problem = activity.data.problems[problemIndex];
        problemContext = `Soru Tipi: Çoktan Seçmeli\nSoru: "${problem.question}"\nSeçenekler: ${problem.options.join(', ')}.`;
        correctAnswerInfo = `Doğru cevap: "${problem.correctAnswer}".`;
    } else if (isTrueFalse(activity)) {
        const problem = activity.data.problems[problemIndex];
        problemContext = `Soru Tipi: Doğru/Yanlış\nİfade: "${problem.statement}".`;
        correctAnswerInfo = `Doğru cevap: "${problem.isCorrect ? 'Doğru' : 'Yanlış'}".`;
    } else if (isFillInTheBlanks(activity)) {
        const problem = activity.data.problems[problemIndex];
        problemContext = `Soru Tipi: Boşluk Doldurma\nCümle: "${problem.prompt}".`;
        correctAnswerInfo = `Doğru cevap: "${problem.correctAnswer}".`;
    } else if (isAuditoryDictation(activity)) {
        const problem = activity.data.problems[problemIndex];
        problemContext = `Soru Tipi: İşitsel Yazma\nSöylenen kelime: "${problem.wordToSpeak}".`;
        correctAnswerInfo = `Doğru cevap: "${problem.wordToSpeak}".`;
    } else if (isVisualArithmetic(activity)) {
        const problem = activity.data.problems[problemIndex];
        problemContext = `Soru Tipi: Görsel Aritmetik\nSoru: "${problem.visualQuestion}".`;
        correctAnswerInfo = `Doğru cevap: "${problem.answer}".`;
    } else {
        return "Bu etkinlik türü için açıklama henüz mevcut değil.";
    }

    const prompt = `Bir öğrenme güçlüğü çeken ilkokul öğrencisi aşağıdaki soruyu yanıtladı:\n\n${problemContext}\n${correctAnswerInfo}\n${studentResponse}\n\nÖğrencinin cevabının neden yanlış (veya doğru) olduğunu, 2-3 cümlelik çok basit, cesaret verici ve pedagojik bir dille açıkla. Nazikçe doğru cevabın arkasındaki mantığa yönlendir. Cevabın SADECE açıklama metni olsun.`;

    try {
        const response = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              systemInstruction: "Senin adın 'Bilge Baykuş'. Öğrenme güçlüğü çeken çocuklar için sıcak, motive edici ve basit bir tonda konuşan, arkadaş canlısı bir eğitim asistanısın. Asla bir robot gibi konuşma.",
            }
        });
        return response.text.trim();
    } catch (error) {
        console.error('Error generating pedagogical feedback:', error);
        return 'Üzgünüm, şu anda bir açıklama oluşturamıyorum.';
    }
  }

  async generateReviewActivity(topic: Topic, weakSubTopics: SubTopic[]): Promise<Activity> {
    if (!this.ai) {
        throw new Error('Gemini AI client is not initialized.');
    }

    const subTopicTitles = weakSubTopics.map(st => st.title).join(', ');
    const prompt = `Bir öğrencinin "${topic}" kategorisindeki en çok zorlandığı alanlar şunlardır: ${subTopicTitles}. Bu alanların her birinden birer tane olmak üzere, toplamda 5 soruluk karma bir 'çoktan seçmeli' etkinlik oluştur. Sorular çeşitli ve ilgi çekici olmalıdır. Yanıtı, Çoktan Seçmeli Etkinlik şemasına uyan geçerli bir JSON nesnesi olarak döndür. İçerik dili Türkçe olmalıdır.`;

    try {
        const config = ACTIVITY_CONFIGS[topic].subtopics['reading-fluency']; // Using a representative multiple-choice schema
        if (!config) throw new Error("Config not found for schema.");
        
        const response = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: config.schema,
            },
        });

        const jsonStr = response.text.trim();
        const activity = JSON.parse(jsonStr) as Activity;
        activity.title = `${topic === 'disleksi' ? 'Okuma' : topic === 'diskalkuli' ? 'Matematik' : 'Yazma'} Tekrarı`;
        activity.instructions = "Zorlandığın konuları tekrar etme zamanı!";
        return activity;

    } catch (error) {
        console.error('Error generating review activity:', error);
        throw new Error('Tekrar etkinliği oluşturulamadı.');
    }
  }

  async generateHintForQuestion(activity: Activity, problemIndex: number, userAnswer?: string | string[] | null): Promise<string> {
    if (!this.ai) {
      throw new Error('Gemini AI client is not initialized. Check API Key.');
    }

    let problemContext = '';
    let studentAnswer = userAnswer ? `Öğrencinin cevabı: "${Array.isArray(userAnswer) ? userAnswer.join(', ') : userAnswer}"` : "Öğrenci henüz cevap vermedi.";

    if (isWordScramble(activity)) {
      const problem = activity.data.words[problemIndex];
      problemContext = `Soru Tipi: Karışık Kelime\nKarışık kelime: "${problem.scrambled}".`;
    } else if (isSimpleMath(activity)) {
      const problem = activity.data.problems[problemIndex];
      problemContext = `Soru Tipi: Matematik Problemi\nSoru: "${problem.question}".`;
    } else if (isMultipleChoice(activity) || isVisualMatch(activity)) {
      const problem = activity.data.problems[problemIndex];
      problemContext = `Soru Tipi: Çoktan Seçmeli\nSoru: "${problem.question}"\nSeçenekler: ${problem.options.join(', ')}.`;
    } else if (isOrdering(activity)) {
      const problem = activity.data.problems[problemIndex];
      problemContext = `Soru Tipi: Sıralama\nSoru: "${problem.question}"\nSıralanacaklar: ${problem.items.join(', ')}.`;
    } else if (isSequencingEvents(activity)) {
        const problem = activity.data.problems[problemIndex];
        problemContext = `Soru Tipi: Olay Sıralama\nSenaryo: "${problem.scenario}"\nSıralanacaklar: ${problem.events.join(', ')}.`;
    } else if (isDragDropMatch(activity)) {
      const problem = activity.data.problems[problemIndex];
      problemContext = `Soru Tipi: Sürükle Bırak\nCümle: "${problem.prompt.replace('__', '___')}"\nSeçenekler: ${problem.options.join(', ')}.`;
    } else if (isFillInTheBlanks(activity)) {
      const problem = activity.data.problems[problemIndex];
      problemContext = `Soru Tipi: Boşluk Doldurma\nCümle: "${problem.prompt.replace('__', '___')}".`;
    } else if (isTrueFalse(activity)) {
      const problem = activity.data.problems[problemIndex];
      problemContext = `Soru Tipi: Doğru/Yanlış\nİfade: "${problem.statement}".`;
    } else if (isMatchingPairs(activity)) {
      const problem = activity.data.pairs[problemIndex];
      problemContext = `Soru Tipi: Eşleştirme\nEşleştirilecek: "${problem.item1}". Eşleştirme seçenekleri: ${activity.data.pairs.map(p => p.item2).join(', ')}.`;
    } else if (isAuditoryDictation(activity)) {
        const problem = activity.data.problems[problemIndex];
        problemContext = `Soru Tipi: İşitsel Yazma.\nİpucu, kelimenin ilk harfi olabilir. Söylenen kelime: ${problem.wordToSpeak}`;
    } else if (isVisualArithmetic(activity)) {
        const problem = activity.data.problems[problemIndex];
        problemContext = `Soru Tipi: Görsel Aritmetik.\nSoru: ${problem.visualQuestion}. İpucu, nesneleri saymaya teşvik edebilir.`;
    } else if (isSentenceCompletion(activity)) {
        const problem = activity.data.prompts[problemIndex];
        problemContext = `Soru Tipi: Cümle Tamamlama\nCümle başlangıcı: "${problem}".`;
    } else if (isInteractiveStory(activity)) {
        return "Bu etkinlik türü için ipucu özelliği bulunmuyor.";
    }

    const prompt = `Bir öğrenme güçlüğü çeken ilkokul öğrencisi aşağıdaki soruda takıldı:\n\n${problemContext}\n${studentAnswer}\n\nDoğru cevabı doğrudan vermeden, öğrencinin doğru cevabı bulmasına yardımcı olacak tek cümlelik, çok basit, cesaret verici bir ipucu oluştur. İpucu Türkçe olmalıdır. Örnek: Karışık kelime "ealm" ise, ipucu "Kırmızı veya yeşil renkli bir meyvedir." olabilir. Matematik sorusu "5+3" ise, "5'in üzerine 3 daha saymayı dene." olabilir. Sadece ipucu cümlesini döndür.`;
    
    try {
        const response = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              systemInstruction: "You are a friendly and helpful teaching assistant for a child. Your language is Turkish. You are encouraging and simple in your explanations.",
            }
        });
        return response.text.trim();
    } catch (error) {
        console.error('Error generating hint:', error);
        throw new Error('Failed to generate hint.');
    }
  }
  
  async generate5W1HActivity(gradeLevel: GradeLevel): Promise<Activity> {
    if (!this.ai) {
      throw new Error('Gemini AI client is not initialized.');
    }

    const prompt = `Generate a complete 'five-w-one-h-story' activity in Turkish for a '${gradeLevel}' student. The activity needs a title, instructions, and a data object containing a short story (3-4 paragraphs), exactly 6 comprehension questions (one for each 5N1K category with concise answers from the text), and exactly 2 inference/reasoning questions. Respond ONLY with a valid JSON object that conforms to the provided schema. All content must be in Turkish.`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'A fun title for the activity in Turkish (e.g., "Kayıp Uçurtmanın Gizemi").' },
        instructions: { type: Type.STRING, description: 'Simple instructions for the child in Turkish (e.g., "Hikayeyi oku ve soruları cevapla!").' },
        activityType: { type: Type.STRING, description: "Must be 'five-w-one-h-story'." },
        data: {
          type: Type.OBJECT,
          properties: {
            story: { type: Type.STRING, description: 'The generated short story in Turkish.' },
            comprehensionQuestions: {
              type: Type.ARRAY,
              description: 'An array of exactly 6 questions based on the story, one for each 5N1K category.',
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING, description: 'The 5N1K question in Turkish (e.g., "Hikayedeki ana karakter kimdi?").' },
                  answer: { type: Type.STRING, description: 'The concise answer to the question, based on the story.' }
                },
                required: ['question', 'answer']
              }
            },
            inferenceQuestions: {
                type: Type.ARRAY,
                description: 'An array of 2 questions that require inference or reasoning.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING, description: 'The inference question in Turkish (e.g., "Sence karakter neden böyle davrandı?").' }
                    },
                    required: ['question']
                }
            }
          },
          required: ['story', 'comprehensionQuestions', 'inferenceQuestions']
        }
      },
      required: ['title', 'instructions', 'activityType', 'data']
    };

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
        },
      });
      const jsonStr = response.text.trim();
      return JSON.parse(jsonStr) as Activity;
    } catch (error) {
      console.error('Error generating 5N1K story activity:', error);
      throw new Error('Hikaye etkinliği oluşturulamadı. Lütfen tekrar deneyin.');
    }
  }


  async generateActivity(topic: Topic, subTopic: SubTopic, gradeLevel: GradeLevel, options: { customPrompt?: string; difficulty?: 'easy' | 'medium' | 'hard'; problemCount?: number } = {}): Promise<Activity> {
    if (!this.ai) {
        throw new Error('Gemini AI client is not initialized. Check API Key.');
    }

    const topicConfig = ACTIVITY_CONFIGS[topic];
    if (!topicConfig) {
        throw new Error(`Configuration for topic '${topic}' not found.`);
    }

    const config = topicConfig.subtopics[subTopic.id] ?? topicConfig.fallback;
    const responseSchema = config.schema;
    let activityDescription = config.description;

    // Handle custom creative writing prompt
    if (subTopic.id === 'creative-writing-prompts' && options.customPrompt) {
        activityDescription = `a 'sentence completion' activity using the following single, exact prompt for the user: "${options.customPrompt}". The activity should only have this one prompt.`;
    }

    // Handle difficulty for basic arithmetic
    if (subTopic.id === 'basic-arithmetic') {
        if (options.difficulty) {
            const difficultyInstruction = {
                easy: "The problems should be at an 'easy' difficulty level, focusing on single-digit numbers and simple addition/subtraction.",
                medium: "The problems should be at a 'medium' difficulty level, including two-digit numbers and simple multiplication.",
                hard: "The problems should be at a 'hard' difficulty level, including larger numbers, division, or simple multi-step questions."
            };
            activityDescription += ` ${difficultyInstruction[options.difficulty]}`;
        }
        if (options.problemCount) {
             activityDescription = activityDescription.replace(/a set of \d+/, `a set of ${options.problemCount}`);
        }
    }
     if (subTopic.id === 'interactive-story') {
        const themes = {
            disleksi: 'a reading-focused adventure about finding a lost book or deciphering a secret message',
            diskalkuli: 'a math-focused adventure about solving puzzles in a treasure hunt or managing a magical potion shop',
            disgrafi: 'a writing-focused adventure about completing a story, writing a ship\'s log, or creating a spell'
        };
        activityDescription = activityDescription.replace('THEME_PLACEHOLDER', themes[topic]);
    }

    const prompt = `You are an expert in creating engaging educational activities for children with learning difficulties. Generate an activity for a Turkish-speaking '${gradeLevel}' student with ${topic}. Specifically, this activity should focus on the sub-topic: '${subTopic.title}'. The activity is ${activityDescription}. Also, include a 'hint' field containing a single, brief, encouraging, and informative tip or 'did you know?' fact in Turkish related to the topic and sub-topic, suitable for a child. This hint should be no more than one or two sentences. Please respond ONLY with a valid JSON object that conforms to the provided schema. The language of the content must be Turkish.`;

    try {
        const response = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
            },
        });

        const jsonStr = response.text.trim();
        const activity = JSON.parse(jsonStr) as Activity;

        // Defensive check: If a custom prompt was used, ensure only that prompt is in the final activity data.
        if (subTopic.id === 'creative-writing-prompts' && options.customPrompt) {
            (activity.data as { prompts: string[] }).prompts = [options.customPrompt];
        }
        
        return activity;
    } catch (error) {
        console.error('Error generating activity:', error);
        throw new Error('Failed to generate activity. Please check your API key and network connection.');
    }
  }

  // --- Word Explorer Methods ---
  async getWordDefinition(word: string): Promise<string> {
    if (!this.ai) throw new Error('AI client not initialized.');
    const prompt = `Explain the meaning of the Turkish word '${word}' in a very simple, single sentence suitable for a 7-year-old child. Speak like a friendly owl character.`;
    const response = await this.ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    return response.text.trim();
  }

  async getExampleSentences(word: string): Promise<string[]> {
    if (!this.ai) throw new Error('AI client not initialized.');
    const prompt = `Create 2 simple, different example sentences in Turkish using the word '${word}'. Respond with a JSON object.`;
    const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    sentences: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                }
            }
        }
    });
    const result = JSON.parse(response.text.trim());
    return result.sentences;
  }
  
  async getWordSynonym(word: string): Promise<string> {
    if (!this.ai) throw new Error('AI client not initialized.');
    const prompt = `What is a common Turkish synonym for the word '${word}'? If there isn't a good one, respond with 'Uygun bir eş anlamlısı bulunamadı.'. Respond with ONLY the synonym or the message.`;
    const response = await this.ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    return response.text.trim();
  }

  async generateImageForWord(word: string): Promise<string> {
    if (!this.ai) throw new Error('AI client not initialized.');
    const prompt = `A colorful, simple, and clear illustration for a children's book, representing the meaning of the Turkish word: '${word}'. Style: vibrant, cartoon, friendly, centered object on a clean background.`;
    const response = await this.ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
    });
    return response.generatedImages[0].image.imageBytes;
  }

  async generateComprehensionQuestion(word: string, definition: string): Promise<MultipleChoiceProblem> {
    if (!this.ai) throw new Error('AI client not initialized.');
    const prompt = `Create a multiple-choice question in Turkish to check if a child understood the word '${word}', which means '${definition}'. The question should be 'Aşağıdaki cümlelerin hangisinde "${word}" kelimesi doğru kullanılmıştır?'. Provide one correct sentence and two incorrect but plausible-looking sentences as options. The incorrect sentences should use the word in a wrong context. Return a valid JSON object.`;
    const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctAnswer: { type: Type.STRING }
                },
                 required: ['question', 'options', 'correctAnswer'],
            }
        }
    });
    return JSON.parse(response.text.trim());
  }
}