import { Injectable, inject } from '@angular/core';
import { GoogleGenAI, Type } from '@google/genai';
import { Activity, GradeLevel, Topic, SubTopic } from '../models/activity.model';

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


  async generateActivity(topic: Topic, subTopic: SubTopic, gradeLevel: GradeLevel): Promise<Activity> {
    if (!this.ai) {
        throw new Error('Gemini AI client is not initialized. Check API Key.');
    }

    let activityDescription = '';
    let responseSchema: any;

    // Define all possible schemas here
    const orderingSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'A fun title for the activity in Turkish.' },
        instructions: { type: Type.STRING, description: 'Simple instructions for the child in Turkish (e.g., "Sayıları küçükten büyüğe sırala").' },
        hint: { type: Type.STRING, description: 'A brief, encouraging tip in Turkish.' },
        activityType: { type: Type.STRING, description: "Should be 'ordering'." },
        data: {
          type: Type.OBJECT,
          properties: {
            problems: {
              type: Type.ARRAY,
              description: 'An array of 3 to 5 ordering problem objects.',
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING, description: "The instruction for this specific problem in Turkish (e.g., 'Küçükten büyüğe sırala')." },
                  items: {
                    type: Type.ARRAY,
                    description: 'An array of 3-5 strings (numbers or words) to be ordered. They must be jumbled.',
                    items: { type: Type.STRING }
                  },
                  correctOrder: {
                    type: Type.ARRAY,
                    description: 'The array of items in the correct order.',
                    items: { type: Type.STRING }
                  },
                },
                required: ['question', 'items', 'correctOrder'],
              },
            },
          },
          required: ['problems'],
        },
      },
      required: ['title', 'instructions', 'activityType', 'data'],
    };
    
    const dragDropMatchSchema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: 'A fun title for the activity in Turkish.' },
            instructions: { type: Type.STRING, description: 'Simple instructions for the child in Turkish (e.g., "Doğru parçayı boşluğa sürükle").' },
            hint: { type: Type.STRING, description: 'A brief, encouraging tip in Turkish.' },
            activityType: { type: Type.STRING, description: "Should be 'drag-drop-match'." },
            data: {
                type: Type.OBJECT,
                properties: {
                    problems: {
                        type: Type.ARRAY,
                        description: 'An array of 3 to 5 drag-and-drop problem objects.',
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                prompt: { type: Type.STRING, description: "The question or sentence containing a double underscore '__' for the drop zone." },
                                options: {
                                    type: Type.ARRAY,
                                    description: 'An array of 3-4 strings for the draggable options.',
                                    items: { type: Type.STRING }
                                },
                                correctAnswer: { type: Type.STRING, description: 'The correct string from the options array.' },
                            },
                            required: ['prompt', 'options', 'correctAnswer'],
                        },
                    },
                },
                required: ['problems'],
            },
        },
        required: ['title', 'instructions', 'activityType', 'data'],
    };


    switch (topic) {
      case 'disleksi':
        // Schemas for Dyslexia Activities
        const simpleMathSchemaForDyslexia = {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'A fun title for the activity in Turkish.' },
            instructions: { type: Type.STRING, description: 'Simple instructions for the child in Turkish.' },
            hint: { type: Type.STRING, description: 'A brief, encouraging, and informative tip in Turkish.' },
            activityType: { type: Type.STRING, description: "Should be 'simple-math'." },
            data: {
              type: Type.OBJECT,
              properties: {
                problems: {
                  type: Type.ARRAY,
                  description: 'An array of 3 to 5 question/answer problem objects.',
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING, description: "The question as a string." },
                      answer: { type: Type.STRING, description: 'The correct answer as a string.' },
                    },
                    required: ['question', 'answer'],
                  },
                },
              },
              required: ['problems'],
            },
          },
          required: ['title', 'instructions', 'activityType', 'data'],
        };

        const visualMatchSchemaForDyslexia = {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING, description: 'A fun title for the activity in Turkish.' },
                instructions: { type: Type.STRING, description: 'Simple instructions for the child in Turkish.' },
                hint: { type: Type.STRING, description: 'A brief, encouraging tip in Turkish.' },
                activityType: { type: Type.STRING, description: "Should be 'visual-match'." },
                data: {
                    type: Type.OBJECT,
                    properties: {
                        problems: {
                            type: Type.ARRAY,
                            description: 'An array of 5 visual matching problem objects.',
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    targetWord: { type: Type.STRING, description: 'The correct Turkish word, phrase, or sentence to find.' },
                                    options: {
                                        type: Type.ARRAY,
                                        description: 'An array of 3-4 strings, including the target and distractors.',
                                        items: { type: Type.STRING }
                                    },
                                },
                                required: ['targetWord', 'options'],
                            },
                        },
                    },
                    required: ['problems'],
                },
            },
            required: ['title', 'instructions', 'activityType', 'data'],
        };

        const wordScrambleSchemaForDyslexia = {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: 'A fun title for the activity in Turkish.' },
              instructions: { type: Type.STRING, description: 'Simple instructions for the child in Turkish.' },
              hint: { type: Type.STRING, description: 'A brief, encouraging, and informative tip in Turkish.' },
              activityType: { type: Type.STRING, description: "Should be 'word-scramble'." },
              data: {
                type: Type.OBJECT,
                properties: {
                  words: {
                    type: Type.ARRAY,
                    description: 'An array of 5 word objects.',
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        scrambled: { type: Type.STRING, description: 'The jumbled Turkish word.' },
                        correct: { type: Type.STRING, description: 'The correct Turkish word.' },
                      },
                      required: ['scrambled', 'correct'],
                    },
                  },
                },
                required: ['words'],
              },
            },
            required: ['title', 'instructions', 'activityType', 'data'],
        };
        
        switch (subTopic.id) {
            case 'phonological-awareness':
                responseSchema = simpleMathSchemaForDyslexia;
                activityDescription = "a 'Phonological Awareness' activity with 5 questions. Questions should focus on identifying rhyming Turkish words, counting syllables, or identifying initial/final sounds. Examples: 'Hangi kelime *kasa* ile kafiyelidir: *masa* mı, *kapı* mı?', 'Kelebek kelimesinde kaç hece var?', 'Araba kelimesi hangi sesle başlar?'. The answer should be the correct word or number.";
                break;
            case 'letter-sound':
                responseSchema = dragDropMatchSchema;
                activityDescription = "a 'Letter-Sound Relationship' drag-and-drop activity with 5 problems. For each problem, provide a common Turkish word with ONE letter missing, represented by a double underscore '__'. The 'prompt' field must contain this word. Also provide 3-4 letter 'options', including the correct one and some distractors. The 'correctAnswer' must be the single missing letter.";
                break;
            case 'reading-fluency':
                responseSchema = visualMatchSchemaForDyslexia;
                activityDescription = "a 'Reading Fluency' practice activity. For each item, provide a short, simple Turkish target sentence (3-5 words). Then provide 3-4 options. The options must include the correct target sentence and distractors that are very similar but have one or two words changed or reordered. The goal is to encourage careful and quick reading. The target sentence should be in the 'targetWord' field.";
                break;
            case 'reading-comprehension':
                responseSchema = simpleMathSchemaForDyslexia;
                activityDescription = "a 'Reading Comprehension' activity. Create 3-4 short passages (1-3 sentences each). After each passage, ask one simple comprehension question (e.g., 'Who went to the park?'). The entire passage and question MUST be in the 'question' field. The 'answer' field should contain only the correct answer. For example, Question: 'Ayşe parka gitti. Orada salıncağa bindi. Parka kim gitti?', Answer: 'Ayşe'.";
                break;
            case 'visual-processing':
                responseSchema = visualMatchSchemaForDyslexia;
                activityDescription = "a 'visual match' game. For each item, provide a target Turkish word and 3-4 options. The options must include the correct target word and visually similar distractors (e.g., using swapped letters like 'b'/'d', transposed letters like 'ev'/'ve', or letters with similar shapes). The goal is to test visual discrimination. Provide 5 items.";
                break;
            default:
                responseSchema = wordScrambleSchemaForDyslexia;
                activityDescription = "a 'word scramble' game where jumbled letters must be rearranged to form a correct Turkish word. Provide 5 words appropriate for the grade level and sub-topic.";
                break;
        }
        break;
      case 'diskalkuli':
        // All dyscalculia activities will use the simple-math format.
        // The prompt will be adjusted for each sub-topic to generate varied questions.
        const simpleMathSchemaForDyscalculia = {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'A fun title for the activity in Turkish.' },
            instructions: { type: Type.STRING, description: 'Simple instructions for the child in Turkish.' },
            hint: { type: Type.STRING, description: 'A brief, encouraging, and informative tip in Turkish.' },
            activityType: { type: Type.STRING, description: "Should be 'simple-math'." },
            data: {
              type: Type.OBJECT,
              properties: {
                problems: {
                  type: Type.ARRAY,
                  description: 'An array of 3 to 5 math problem objects, depending on the sub-topic.',
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING, description: "The math problem as a string." },
                      answer: { type: Type.STRING, description: 'The correct answer as a string.' },
                    },
                    required: ['question', 'answer'],
                  },
                },
              },
              required: ['problems'],
            },
          },
          required: ['title', 'instructions', 'activityType', 'data'],
        };
        
        switch (subTopic.id) {
            case 'number-sense':
                responseSchema = orderingSchema;
                activityDescription = "a 'Number Sense' ordering activity with 3-4 problems. For each problem, create a set of 4-5 numbers to be ordered. Provide the jumbled numbers in 'items' and the correctly sorted numbers (smallest to largest) in 'correctOrder'. The 'question' should be 'Sayıları küçükten büyüğe sırala'. Numbers and questions must be in Turkish.";
                break;
            case 'basic-arithmetic':
                responseSchema = simpleMathSchemaForDyscalculia;
                activityDescription = "a set of 5 simple arithmetic problems (addition, subtraction, multiplication, division) appropriate for the grade level. Ensure a mix of operations if possible. Questions and answers must be in Turkish.";
                break;
            case 'problem-solving':
                responseSchema = simpleMathSchemaForDyscalculia;
                activityDescription = "a set of 3-4 simple, real-world word problems that require basic arithmetic. The problems should be relatable for a child. For example: 'Ayşe'nin 5 kalemi vardı, arkadaşı ona 3 kalem daha verdi. Ayşe'nin şimdi kaç kalemi var?'. The answer should be the numerical value. Problems and answers must be in Turkish.";
                break;
            case 'math-symbols':
                responseSchema = dragDropMatchSchema;
                activityDescription = "a 'Math Symbols' drag-and-drop activity with 5 problems. For each problem, provide a simple mathematical equation with the operator or relation symbol missing, represented by a double underscore '__' (e.g., '10 __ 5 = 5' or '7 __ 9'). The 'prompt' field must contain this equation. Provide 3-4 symbol 'options' (e.g., '+', '-', '<', '>'). The 'correctAnswer' must be the correct symbol.";
                break;
            case 'time-measurement':
                responseSchema = simpleMathSchemaForDyscalculia;
                activityDescription = "an activity about time and measurement. Create 5 simple questions. Examples: '1 metre kaç santimetredir?', 'Saat 2'den bir saat sonra saat kaç olur?', or simple comparison questions like 'Hangisi daha ağırdır: bir fil mi, bir kedi mi?'. Questions and answers must be in Turkish.";
                break;
            default:
                // Fallback to basic arithmetic if subtopic is not matched for some reason
                responseSchema = simpleMathSchemaForDyscalculia;
                activityDescription = "a set of 5 simple arithmetic problems appropriate for the sub-topic. Questions and answers must be in Turkish.";
                break;
        }
        break;
      case 'disgrafi':
        activityDescription = "a set of 'sentence completion' prompts to encourage writing, related to the sub-topic. Provide 3 creative and simple prompts.";
        responseSchema = {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'A fun title for the activity in Turkish.' },
            instructions: { type: Type.STRING, description: 'Simple instructions for the child in Turkish.' },
            hint: { type: Type.STRING, description: 'A brief, encouraging, and informative tip in Turkish.' },
            activityType: { type: Type.STRING, description: "Should be 'sentence-completion'." },
            data: {
              type: Type.OBJECT,
              properties: {
                prompts: {
                  type: Type.ARRAY,
                  description: 'An array of 3 sentence starter strings.',
                  items: {
                    type: Type.STRING,
                  },
                },
              },
              required: ['prompts'],
            },
          },
          required: ['title', 'instructions', 'activityType', 'data'],
        };
        break;
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
        return JSON.parse(jsonStr) as Activity;
    } catch (error) {
        console.error('Error generating activity:', error);
        throw new Error('Failed to generate activity. Please check your API key and network connection.');
    }
  }
}