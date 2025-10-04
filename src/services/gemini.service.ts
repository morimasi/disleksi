import { Injectable, inject } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { Activity, GradeLevel, Topic, SubTopic, SentenceCompletionActivity, isWordScramble, isSimpleMath, isMultipleChoice, isOrdering, isDragDropMatch, isFillInTheBlanks, isTrueFalse, isVisualMatch, isMatchingPairs, isSequencingEvents } from '../models/activity.model';
import { ACTIVITY_CONFIGS } from './activity-config';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    // IMPORTANT: The API key is sourced from environment variables.
    // Do not hardcode or expose it in the client-side code.
    // This assumes `process.env.API_KEY` is available during the build process
    // or through server-side rendering environment variables.
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    } else {
      console.error('API Key not found. Please set the API_KEY environment variable.');
    }
  }

  async generateDashboardFeedback(progressData: string): Promise<string> {
    if (!this.ai) {
      throw new Error('Gemini AI client is not initialized. Check API Key.');
    }
    
    const prompt = `İşte bir öğrencinin ilerleme raporu:\n${progressData}\nBu verilere dayanarak, öğrenciye yönelik sıcak, cesaret verici ve kişiselleştirilmiş bir geri bildirim mesajı oluştur. Mesajın bir parçası olarak, en çok ilerleme kaydettiği bir alanı öv ve ardından 0 veya 1 yıldıza sahip olduğu bir konuyu bir sonraki adım olarak öner. Cevabın sadece 2-3 cümlelik, arkadaş canlısı bir metin olsun.`;

    try {
        const response = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              systemInstruction: "You are a friendly and encouraging educational assistant for a child with learning difficulties. Your name is 'Bilge Baykuş'. Always speak in a warm, motivating, and simple tone in Turkish. Never sound like a robot. Start your response by greeting the student warmly.",
            }
        });

        return response.text.trim();
    } catch (error) {
        console.error('Error generating dashboard feedback:', error);
        throw new Error('Failed to generate dashboard feedback.');
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
}