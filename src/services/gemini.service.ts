
import { Injectable } from '@angular/core';
import { GoogleGenAI, Chat, Type } from '@google/genai';
import {
  Activity,
  GradeLevel,
  SubTopic,
  Topic,
  isSpatialRelations,
  FiveWOneHStoryActivity,
  isPictureSequencingStoryteller,
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
      } else if (isPictureSequencingStoryteller(parsedActivity)) {
        for (const problem of parsedActivity.data.problems) {
            const imageUrls = await Promise.all(
                problem.imagePrompts.map(prompt => this.generateImageFromPrompt(prompt))
            );

            const originalImages = imageUrls.map((url, index) => ({ id: index, url }));
            problem.correctOrder = originalImages.map(img => img.id);

            // Fisher-Yates shuffle
            for (let i = originalImages.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [originalImages[i], originalImages[j]] = [originalImages[j], originalImages[i]];
            }
            problem.images = originalImages;
        }
      }


      return parsedActivity as Activity;
    } catch (error) {
      console.error('Error generating or parsing activity from Gemini:', error);
      throw new Error('Etkinlik oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  }

  private getPersonaInstruction(subTopic: SubTopic): string {
    switch (subTopic.id) {
        // Math/Dyscalculia Personas
        case 'number-sense':
        case 'basic-arithmetic':
        case 'problem-solving':
        case 'math-symbols':
        case 'time-measurement':
        case 'estimation-skills':
        case 'fractions-decimals':
        case 'visual-arithmetic':
        case 'number-grouping-practice':
            return "a patient and encouraging math tutor who makes learning numbers fun and accessible by using clear, simple examples and visual aids.";

        // Writing/Dysgraphia Personas
        case 'handwriting-legibility':
        case 'letter-formation':
        case 'writing-speed':
        case 'sentence-construction':
        case 'punctuation-grammar':
        case 'fine-motor-skills':
        case 'writing-planning':
        case 'creative-writing-prompts':
        case 'keyboarding-skills':
        case 'picture-sequencing-storyteller':
            return "a creative and supportive writing assistant who inspires imagination and builds confidence in forming letters, words, and stories.";

        // Reading/Dyslexia Personas
        case 'phonological-awareness':
        case 'letter-sound':
        case 'reading-aloud-coach':
        case 'reading-comprehension':
        case 'vocabulary-morphology':
        case 'spelling-patterns':
        case 'working-memory-sequencing':
        case 'auditory-dictation':
        case 'word-explorer':
            // FIX: Removed 'five-w-one-h-story' as it is not a valid SubTopicId.
            // This activity is handled by a separate generation method.
            return "an engaging literacy coach who makes the world of sounds, words, and stories exciting and understandable.";
            
        // Spatial & Visual Personas
        case 'spatial-relations-positional':
        case 'spatial-relations-directional':
        case 'spatial-relations-visual-discrimination':
        case 'spatial-reasoning':
        case 'visual-processing':
        case 'visual-number-representation':
        case 'letter-form-recognition':
            // FIX: Removed 'visual-match' as it is not a valid SubTopicId.
            // Refactored by moving 'visual-number-representation' and 'letter-form-recognition' here
            // as this persona is a better fit for those visually-oriented subtopics.
            return "a playful visual and spatial guide who uses vivid imagery and clear examples to explain concepts of space, direction, shape, and visual details.";

        // Default for interactive stories or fallbacks
        case 'interactive-story':
             return "a master storyteller who weaves educational concepts into captivating adventures.";

        default:
            // A sensible fallback that uses the pedagogical goal directly
            return `an expert educator specializing in creating content that directly addresses the goal: "${subTopic.pedagogicalGoal}"`;
    }
  }

  async generateActivity(topic: Topic, subTopic: SubTopic, gradeLevel: GradeLevel, options: { customPrompt?: string; difficulty?: 'easy' | 'medium' | 'hard'; problemCount?: number; readingTheme?: string }): Promise<Activity> {
    const topicConfig = ACTIVITY_CONFIGS[topic];
    const activityConfig = topicConfig.subtopics[subTopic.id] || topicConfig.fallback;
    const personaInstruction = this.getPersonaInstruction(subTopic);

    // New, expert-level prompt
    let prompt = `You are an expert educational content creator. For this task, you will adopt a specific persona to generate the highest quality JSON object for a Turkish learning activity for students with learning disabilities.

    **Your Persona:** Act as ${personaInstruction}. Your content should reflect this role.

    **Target Audience:** A '${gradeLevel}' student diagnosed with '${topic}'.
    **Area of Focus:** '${subTopic.title}'.
    
    **Core Pedagogical Goal:** ${subTopic.pedagogicalGoal}

    **Activity Specification:**
    - The activity must be structured as: ${activityConfig.description}.
    - The content must be engaging, creative, and pedagogically sound, directly addressing the core goal and reflecting your assigned persona.
    - All text must be in clear and simple Turkish.
    `;
    
    if (options.customPrompt) {
      prompt += `- Use this creative prompt as inspiration: "${options.customPrompt}".\n`;
    }
    if (options.difficulty) {
      prompt += `- The difficulty level must be '${options.difficulty}'.\n`;
    }

    if (subTopic.id === 'visual-number-representation') {
        const optionCount = options.difficulty === 'easy' ? 3 : options.difficulty === 'hard' ? 5 : 4;
        prompt += `- Each problem must have exactly ${optionCount} options.\n`;
    }

    if (options.problemCount) {
        prompt += `- The activity must contain exactly ${options.problemCount} problems.\n`;
    }
    if (options.readingTheme) {
        prompt += `- The story theme must be about '${options.readingTheme}'.\n`;
    }
    
    prompt += `\nThe response MUST be a valid JSON object matching the provided schema. Do not output any text other than the JSON object itself. Do not wrap the JSON in markdown.`;

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

  async generateHint(activityType: string, problem: any, correctAnswer: any): Promise<string> {
    if (!this.ai) {
      throw new Error('Gemini API client is not initialized.');
    }
    const prompt = `A primary school student in Turkey is stuck on a learning activity. Provide a short, simple, and encouraging hint in Turkish.
    Do NOT give away the answer directly. Guide them to think about the problem.
    The activity type is: ${activityType}.
    The problem is: ${JSON.stringify(problem)}.
    The correct answer is: ${JSON.stringify(correctAnswer)}.
    
    Respond with a JSON object containing a single key "hint". The hint should be a single sentence.`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              hint: { type: Type.STRING },
            },
            required: ['hint'],
          },
        },
      });
      const jsonString = response.text.replace(/^```json\s*|```\s*$/g, '').trim();
      const parsed = JSON.parse(jsonString);
      return parsed.hint;
    } catch (error) {
      console.error('Error generating hint:', error);
      return 'Şu anda bir ipucu veremiyorum, ama denemeye devam et!';
    }
  }

  async getIncorrectAnswerFeedback(activityType: string, problem: any, correctAnswer: any, userAnswer: any): Promise<string> {
    if (!this.ai) {
      throw new Error('Gemini API client is not initialized.');
    }
    const prompt = `A primary school student in Turkey answered a question incorrectly. Provide a short, simple, and encouraging explanation in Turkish about why their answer might be wrong.
    Do NOT use harsh or negative language. Guide them towards the correct way of thinking without giving the answer.
    The activity type is: ${activityType}.
    The problem is: ${JSON.stringify(problem)}.
    The correct answer is: ${JSON.stringify(correctAnswer)}.
    The student's incorrect answer was: ${JSON.stringify(userAnswer)}.

    Respond with a JSON object containing a single key "feedback". The feedback should be one or two encouraging sentences.`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              feedback: { type: Type.STRING },
            },
            required: ['feedback'],
          },
        },
      });
      const jsonString = response.text.replace(/^```json\s*|```\s*$/g, '').trim();
      const parsed = JSON.parse(jsonString);
      return parsed.feedback;
    } catch (error) {
      console.error('Error generating feedback:', error);
      return 'Bu doğru değil. Tekrar denemek ister misin?';
    }
  }

  async getSentenceFeedback(prompt: string, userSentence: string): Promise<string> {
    if (!this.ai) {
      throw new Error('Gemini API client is not initialized.');
    }
    const apiPrompt = `You are a friendly and encouraging Turkish language teacher for a primary school student. The student was given a sentence starter and completed it. Your task is to provide positive and constructive feedback.

    Sentence Starter: "${prompt}"
    Student's full sentence: "${userSentence}"

    Evaluate the sentence based on:
    1.  Grammatical correctness (Is it a valid Turkish sentence?).
    2.  Creativity and relevance (Does it make sense and is it imaginative?).
    
    Your feedback should:
    - Always start with a positive comment (e.g., "Harika bir cümle!", "Çok yaratıcı!").
    - If there is a small grammatical error, gently point it out and suggest a correction. For example: "Cümlen çok güzel, sadece küçük bir düzeltme yapabiliriz: ...".
    - Be short, simple, and encouraging.
    - Be entirely in Turkish.

    Respond with a JSON object containing a single key "feedback".`;

    try {
        const response = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: apiPrompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        feedback: { type: Type.STRING },
                    },
                    required: ['feedback'],
                },
            },
        });
        const jsonString = response.text.replace(/^```json\s*|```\s*$/g, '').trim();
        const parsed = JSON.parse(jsonString);
        return parsed.feedback;
    } catch (error) {
        console.error('Error generating sentence feedback:', error);
        return 'Harika bir cümle! Yazmaya devam et.'; // Fallback feedback
    }
  }
}
