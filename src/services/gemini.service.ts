import { Injectable } from '@angular/core';
import { GoogleGenAI, Chat, Type } from '@google/genai';
import {
  Activity,
  GradeLevel,
  SubTopic,
  Topic,
  isSpatialRelations,
  FiveWOneHStoryActivity,
} from '../models/activity.model';
import { StoryTheme } from '../components/five-w-one-h/five-w-one-h.component';
import { ACTIVITY_CONFIGS, fiveWOneHStorySchema } from './activity-config';
import { TOPICS_DATA } from '../topics.data';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;
  private chat: Chat | null = null;

  constructor() {
    // FIX: Initialize Gemini API client. The API key must be sourced from environment variables.
    if (!process.env.API_KEY) {
      console.error("API_KEY is not set in process.env. Please provide a valid API key.");
      this.ai = null!;
    } else {
      this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
  }

  private async generateAndParseActivity(prompt: string, schema: any): Promise<Activity> {
    if (!this.ai) {
      throw new Error('Gemini API client is not initialized. Check API Key.');
    }
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: schema,
          temperature: 0.7,
        }
      });

      const jsonString = response.text;
      // It's possible for the response to be wrapped in markdown ```json ... ```
      const cleanedJsonString = jsonString.replace(/^```json\s*|```\s*$/g, '').trim();
      const parsedActivity = JSON.parse(cleanedJsonString);
      
      // Post-processing for activities that need more generation
      if (isSpatialRelations(parsedActivity)) {
         for (const problem of parsedActivity.data.problems) {
            const imageResponse = await this.ai.models.generateImages({
                model: 'imagen-3.0-generate-002',
                prompt: problem.imagePrompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/jpeg',
                    aspectRatio: '1:1',
                }
            });
            const base64ImageBytes = imageResponse.generatedImages[0].image.imageBytes;
            problem.imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
         }
      }

      return parsedActivity as Activity;
    } catch (error) {
      console.error('Error generating or parsing activity from Gemini:', error);
      throw new Error('Etkinlik oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  }

  async generateActivity(topic: Topic, subTopic: SubTopic, gradeLevel: GradeLevel, options: { customPrompt?: string; difficulty?: 'easy' | 'medium' | 'hard'; problemCount?: number; readingTheme?: string }): Promise<Activity> {
    const topicConfig = ACTIVITY_CONFIGS[topic];
    const activityConfig = topicConfig.subtopics[subTopic.id] || topicConfig.fallback;

    let prompt = `Generate a JSON object for a Turkish learning activity for a '${gradeLevel}' student. The topic is '${topic}' and the sub-topic is '${subTopic.title}'. The activity should be: ${activityConfig.description}.`;
    
    if (options.customPrompt) {
      prompt += ` Use this creative prompt as inspiration: "${options.customPrompt}".`;
    }
    if (options.difficulty) {
      prompt += ` The difficulty level should be '${options.difficulty}'.`;
    }

    if (subTopic.id === 'visual-number-representation') {
        const optionCount = options.difficulty === 'easy' ? 3 : options.difficulty === 'hard' ? 5 : 4;
        prompt += ` Each problem must have exactly ${optionCount} options.`;
    }

    if (options.problemCount) {
        prompt += ` The activity should contain exactly ${options.problemCount} problems.`;
    }
    if (options.readingTheme) {
        prompt += ` The story theme should be about '${options.readingTheme}'.`;
    }
    
    prompt += ` The response MUST be a valid JSON object matching the provided schema. Do not wrap the JSON in markdown.`;

    return this.generateAndParseActivity(prompt, activityConfig.schema);
  }

  async generateReviewActivity(topic: Topic, weakSubTopics: SubTopic[]): Promise<Activity> {
      const weakTopicsString = weakSubTopics.map(st => st.title).join(', ');
      const prompt = `Generate a single, mixed-review JSON activity for a Turkish primary school student with learning difficulties in '${topic}'. The student needs to practice these specific areas: ${weakTopicsString}. 
      Create a 'multiple-choice' activity with 15 questions that combine concepts from all these weak areas. The questions should be engaging and varied. 
      The response MUST be a valid JSON object matching the 'multiple-choice' schema. Do not wrap the JSON in markdown.`;
      
      const config = ACTIVITY_CONFIGS['diskalkuli'].subtopics['time-measurement'];
      if (!config) throw new Error('Could not find a multiple choice schema for review activity');
      
      const reviewActivity = await this.generateAndParseActivity(prompt, config.schema);
      reviewActivity.title = `${TOPICS_DATA[topic].title} - Tekrar Etkinliği`;
      reviewActivity.instructions = "Hadi öğrendiklerimizi tekrar edelim!";
      return reviewActivity;
  }
  
  async generate5W1HActivity(gradeLevel: GradeLevel, theme: StoryTheme): Promise<Activity> {
      const themePrompt = theme === 'random' ? 'a random, engaging theme' : `a theme of '${theme}'`;
      const prompt = `Generate a JSON object for a Turkish 5W1H (5N1K) reading comprehension activity for a '${gradeLevel}' student. 
      The story should be short, engaging, and based on ${themePrompt}.
      The JSON object must contain a title, instructions, activityType ('five-w-one-h-story'), a short story, 6 comprehension questions (one for each of Who, What, Where, When, Why, How), and 2 inference questions.
      The response MUST be a valid JSON object matching the provided schema. Do not wrap the JSON in markdown.`;

      const activity = await this.generateAndParseActivity(prompt, fiveWOneHStorySchema) as FiveWOneHStoryActivity;
      return activity;
  }
  
  async getWordExplorerDetails(word: string): Promise<{ definition: string; sentence: string; imagePrompt: string }> {
    if (!this.ai) {
      throw new Error('Gemini API client is not initialized.');
    }
    const prompt = `For the Turkish word "${word}", provide a simple definition appropriate for a primary school child, an example sentence, and a simple prompt for an image generation model to illustrate the word. The response must be a valid JSON object with keys: "definition", "sentence", "imagePrompt". Do not wrap the JSON in markdown.`;
    
    try {
        const response = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        definition: { type: Type.STRING },
                        sentence: { type: Type.STRING },
                        imagePrompt: { type: Type.STRING }
                    },
                    required: ['definition', 'sentence', 'imagePrompt']
                }
            }
        });

        const jsonString = response.text.replace(/^```json\s*|```\s*$/g, '').trim();
        return JSON.parse(jsonString);

    } catch (error) {
      console.error('Error generating word explorer details:', error);
      throw new Error('Kelime detayları alınamadı.');
    }
  }
  
  async generateImageFromPrompt(prompt: string): Promise<string> {
    if (!this.ai) {
        throw new Error('Gemini API client is not initialized.');
    }
    const imageResponse = await this.ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '1:1',
        }
    });
    const base64ImageBytes = imageResponse.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
  }


  startChatSession(): void {
    if (!this.ai) return;
    if (!this.chat) {
      this.chat = this.ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: "You are a friendly, patient, and encouraging educational assistant named 'Bilge Baykuş' (Wise Owl). Your goal is to help young students in Turkey who have learning difficulties like dyslexia, dyscalculia, and dysgraphia. Speak in simple, clear, and positive Turkish. Use emojis to make the conversation fun and engaging. Keep your answers short and easy to understand. Your persona is a wise, kind owl who loves to learn. Never reveal you are an AI model. Address the user as a young student."
        }
      });
    }
  }

  resetChatSession(): void {
    this.chat = null;
  }

  async *sendMessageStream(message: string): AsyncGenerator<string> {
    if (!this.chat) {
        this.startChatSession();
    }
    if (!this.chat) {
        yield 'Üzgünüm, sohbet başlatılamadı.';
        return;
    }

    try {
        const responseStream = await this.chat.sendMessageStream({ message });
        for await (const chunk of responseStream) {
            yield chunk.text;
        }
    } catch (error) {
        console.error('Error sending chat message:', error);
        yield 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.';
    }
  }
}