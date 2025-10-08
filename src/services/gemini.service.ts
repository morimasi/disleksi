import { Injectable } from '@angular/core';
import { GoogleGenAI, Type, Chat } from '@google/genai';
import { Activity, GradeLevel, Topic, SubTopic, isWordScramble, isSimpleMath, isMultipleChoice, isOrdering, isDragDropMatch, isFillInTheBlanks, isTrueFalse, isVisualMatch, isMatchingPairs, isSequencingEvents, isInteractiveStory, isSentenceCompletion, isAuditoryDictation, isVisualArithmetic, MultipleChoiceProblem, FiveWOneHStoryActivity, isSpatialRelations, isReadingAloudCoach } from '../models/activity.model';
import { ACTIVITY_CONFIGS, fiveWOneHStorySchema } from './activity-config';

const TURKISH_TUTOR_SYSTEM_INSTRUCTION = "Senin adın 'Bilge Baykuş'. Öğrenme güçlüğü çeken çocuklar için sıcak, motive edici ve basit bir tonda konuşan, arkadaş canlısı bir Türk eğitim asistanısın. Tüm yanıtların yalnızca Türkçe olmalıdır. Asla bir robot gibi konuşma.";

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private ai: GoogleGenAI | null = null;
  private chat: Chat | null = null;
  private chatSystemInstruction = `${TURKISH_TUTOR_SYSTEM_INSTRUCTION} Sen aynı zamanda arkadaş canlısı bir sohbet robotusun. Ana hedefin öğrencilere öğrenme güçlüklerinde yardımcı olmak, ama aynı zamanda arkadaşça ve teşvik edici sohbetler de yapabilirsin. Cevaplarını kısa ve bir çocuğun anlayabileceği kadar basit tut.`;

  constructor() {
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    } else {
      console.error('API Key not found. Please set the API_KEY environment variable.');
    }
  }

  // --- Chatbot Methods ---
  public startChatSession() {
      if (!this.ai) {
          throw new Error('Gemini AI client not initialized.');
      }
      if (!this.chat) {
          this.chat = this.ai.chats.create({
              model: 'gemini-2.5-flash',
              config: {
                  systemInstruction: this.chatSystemInstruction,
              },
          });
      }
  }

  public async *sendMessageStream(message: string): AsyncGenerator<string> {
      if (!this.chat) {
          this.startChatSession();
      }
      if (!this.chat) { // Still null, means AI is not initialized
          yield 'Üzgünüm, sohbet özelliği şu anda kullanılamıyor.';
          return;
      }

      try {
          const responseStream = await this.chat.sendMessageStream({ message });
          for await (const chunk of responseStream) {
              yield chunk.text;
          }
      } catch (error) {
          console.error('Error sending chat message:', error);
          yield 'Üzgünüm, bir hata oluştu. Lütfen tekrar dene.';
      }
  }

  public resetChatSession(): void {
      this.chat = null;
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
    } else if (isMultipleChoice(activity) || isVisualMatch(activity) || isSpatialRelations(activity)) {
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
              systemInstruction: TURKISH_TUTOR_SYSTEM_INSTRUCTION,
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
        const config = ACTIVITY_CONFIGS[topic].subtopics['reading-comprehension']; // Using a representative multiple-choice schema
        if (!config) throw new Error("Config not found for schema.");
        
        const response = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: TURKISH_TUTOR_SYSTEM_INSTRUCTION,
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
    } else if (isMultipleChoice(activity) || isVisualMatch(activity) || isSpatialRelations(activity)) {
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
    } else if (isInteractiveStory(activity) || isReadingAloudCoach(activity)) {
        return "Bu etkinlik türü için ipucu özelliği bulunmuyor.";
    }

    const prompt = `Bir öğrenme güçlüğü çeken ilkokul öğrencisi aşağıdaki soruda takıldı:\n\n${problemContext}\n${studentAnswer}\n\nDoğru cevabı doğrudan vermeden, öğrencinin doğru cevabı bulmasına yardımcı olacak tek cümlelik, çok basit, cesaret verici bir ipucu oluştur. İpucu Türkçe olmalıdır. Örnek: Karışık kelime "ealm" ise, ipucu "Kırmızı veya yeşil renkli bir meyvedir." olabilir. Matematik sorusu "5+3" ise, "5'in üzerine 3 daha saymayı dene." olabilir. Sadece ipucu cümlesini döndür.`;
    
    try {
        const response = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              systemInstruction: TURKISH_TUTOR_SYSTEM_INSTRUCTION,
            }
        });
        return response.text.trim();
    } catch (error) {
        console.error('Error generating hint:', error);
        throw new Error('Failed to generate hint.');
    }
  }
  
  async generateImageForStory(story: string): Promise<string | undefined> {
    if (!this.ai) {
      throw new Error('Gemini AI client is not initialized.');
    }
    try {
        const imagePrompt = `A vibrant and colorful children's book illustration depicting the following scene: ${story.substring(0, 200)}. Style: whimsical, friendly, digital painting.`;
        const imageResponse = await this.ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: imagePrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });
        
        if (imageResponse.generatedImages[0]?.image?.imageBytes) {
            const base64ImageBytes = imageResponse.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        return undefined;
    } catch (error) {
        console.error('Error generating story image:', error);
        return undefined;
    }
  }

  async generate5W1HActivity(gradeLevel: GradeLevel, theme: string): Promise<Activity> {
    if (!this.ai) {
      throw new Error('Gemini AI client is not initialized.');
    }

    let gradeLevelInstruction = '';
    if (gradeLevel === 'ortaokul') {
        gradeLevelInstruction = `The story should be complex and engaging, using richer vocabulary and varied sentence structures (including compound and complex sentences) suitable for a middle school student (grades 5-8). The plot can have more details, character development, or a simple twist. Comprehension questions should be clear, but inference questions should require deeper thinking about character motivations, themes, or consequences. The story should be around 4-5 paragraphs.`;
    } else { // ilkokul
        gradeLevelInstruction = `The story should be simple, creative, and clear, using accessible language and shorter sentences suitable for a primary school student (grades 1-4). The plot should be straightforward and easy to follow with a clear beginning, middle, and end. All questions should be direct and clear. The story should be around 3-4 paragraphs.`;
    }

    const themeInstruction = theme === 'random' ? 'The story can be about any fun topic.' : ` The story must be in the '${theme}' genre.`;

    const prompt = `Generate a complete, creative, and unique 'five-w-one-h-story' activity in Turkish for a '${gradeLevel}' student. ${gradeLevelInstruction}${themeInstruction} The activity needs a title, instructions, a brief hint, and a data object. The data object must contain: a story, exactly 6 comprehension questions (one for each 5W1H/5N1K category: Kim, Ne, Nerede, Ne Zaman, Nasıl, Neden) with concise answers and a simple hint for each, and exactly 2 inference/reasoning questions. Respond ONLY with a valid JSON object that conforms to the provided schema. All content must be in Turkish.`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: TURKISH_TUTOR_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: fiveWOneHStorySchema,
        },
      });
      const jsonStr = response.text.trim();
      const activity = JSON.parse(jsonStr) as FiveWOneHStoryActivity;

      const imageUrl = await this.generateImageForStory(activity.data.story);
      if (imageUrl) {
        activity.data.imageUrl = imageUrl;
      }

      return activity;
    } catch (error) {
      console.error('Error generating 5N1K story activity:', error);
      throw new Error('Hikaye etkinliği oluşturulamadı. Lütfen tekrar deneyin.');
    }
  }

  async checkComprehensionAnswer(story: string, question: string, correctAnswer: string, userAnswer: string): Promise<{ isCorrect: boolean; feedback: string; }> {
    if (!this.ai) throw new Error('AI client not initialized.');
    
    const prompt = `A student is answering a reading comprehension question.
    Their answers might be simple or phrased differently. Your task is to check if their answer is semantically correct, even if it's not a word-for-word match with the expected answer. Consider synonyms and alternative correct phrasings.

    - Story: "${story}"
    - Question: "${question}"
    - Expected Answer: "${correctAnswer}"
    - Student's Answer: "${userAnswer}"

    Analyze the student's answer. Is it correct in meaning?
    Provide brief, encouraging, and simple feedback.
    Respond ONLY with a valid JSON object in the format: { "isCorrect": boolean, "feedback": "your feedback" }`;
    
    try {
        const response = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: TURKISH_TUTOR_SYSTEM_INSTRUCTION,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        isCorrect: { type: Type.BOOLEAN },
                        feedback: { type: Type.STRING }
                    },
                    required: ['isCorrect', 'feedback']
                }
            }
        });
        return JSON.parse(response.text.trim());
    } catch (error) {
        console.error('Error checking comprehension answer:', error);
        return { isCorrect: false, feedback: 'Cevabını kontrol ederken bir sorun oluştu.' };
    }
  }

  async evaluateInferenceAnswer(story: string, question: string, userAnswer: string): Promise<string> {
    if (!this.ai) throw new Error('AI client not initialized.');
    
    const prompt = `A student is answering an inference question about a story.
    Story: "${story}".
    Question: "${question}".
    Student's Answer: "${userAnswer}".
    Provide 1-2 sentences of encouraging feedback. Do not say if the answer is right or wrong. Instead, praise their thinking and perhaps suggest another way to look at it to deepen their understanding. The response should be only the feedback text.`;
    
    try {
        const response = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: TURKISH_TUTOR_SYSTEM_INSTRUCTION
            }
        });
        return response.text.trim();
    } catch (error) {
        console.error('Error evaluating inference answer:', error);
        return 'Harika bir düşünce! Bu konuda daha fazla ne söyleyebilirsin?';
    }
  }

  async evaluateReadingFluency(originalText: string, studentTranscript: string): Promise<{ feedback: string; incorrectWords: string[] }> {
    if (!this.ai) throw new Error('AI client not initialized.');

    const prompt = `The student read a text aloud. Compare the original text with the transcript of what they said.
    - Identify words the student missed, mispronounced, or stumbled on.
    - Provide very simple, positive, and encouraging feedback in one or two sentences. Focus on what they did well, and gently point out one or two things to practice. Do not be harsh or overly critical.
    - List the specific words that were incorrect.

    Original Text: "${originalText}"
    Student's Transcript: "${studentTranscript}"

    Respond ONLY with a valid JSON object in the format: { "feedback": "your feedback", "incorrectWords": ["word1", "word2"] }`;

    try {
        const response = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: TURKISH_TUTOR_SYSTEM_INSTRUCTION,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        feedback: { type: Type.STRING },
                        incorrectWords: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ['feedback', 'incorrectWords']
                }
            }
        });
        return JSON.parse(response.text.trim());
    } catch (error) {
        console.error('Error evaluating reading fluency:', error);
        return { feedback: 'Geri bildirim oluşturulurken bir hata oluştu.', incorrectWords: [] };
    }
  }


  async generateActivity(topic: Topic, subTopic: SubTopic, gradeLevel: GradeLevel, options: { customPrompt?: string; difficulty?: 'easy' | 'medium' | 'hard'; problemCount?: number, readingTheme?: string } = {}): Promise<Activity> {
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
        // This logic won't work for 'mekansal-farkindalik'. It's okay, interactive stories are not in that topic.
        const theme = themes[topic as 'disleksi' | 'diskalkuli' | 'disgrafi'];
        activityDescription = activityDescription.replace('THEME_PLACEHOLDER', theme);
    }
    
    if (subTopic.id === 'reading-aloud-coach' && options.readingTheme) {
      const themeMap = {
        animals: 'hayvanlar',
        space: 'uzay',
        nature: 'doğa',
        'fairy-tale': 'masallar'
      }
      activityDescription += ` The topic of the text should be about ${themeMap[options.readingTheme as keyof typeof themeMap]}.`;
    }

    const prompt = `You are an expert in creating engaging educational activities for children with learning difficulties. Generate an activity for a Turkish-speaking '${gradeLevel}' student with ${topic}. Specifically, this activity should focus on the sub-topic: '${subTopic.title}'. The activity is ${activityDescription}. Also, include a 'hint' field containing a single, brief, encouraging, and informative tip or 'did you know?' fact in Turkish related to the topic and sub-topic, suitable for a child. This hint should be no more than one or two sentences. Please respond ONLY with a valid JSON object that conforms to the provided schema. The language of the content must be Turkish.`;

    try {
        const response = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: TURKISH_TUTOR_SYSTEM_INSTRUCTION,
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
            },
        });

        const jsonStr = response.text.trim();
        const activity = JSON.parse(jsonStr) as Activity;

        if (isSpatialRelations(activity)) {
            const imageGenerationPromises = activity.data.problems.map(async (problem) => {
                try {
                    const imageResponse = await this.ai.models.generateImages({
                        model: 'imagen-3.0-generate-002',
                        prompt: `A simple, colorful, clear illustration for a children's activity. Style: cartoon, friendly, clean background. Scene: ${problem.imagePrompt}`,
                        config: {
                            numberOfImages: 1,
                            outputMimeType: 'image/jpeg',
                            aspectRatio: '1:1',
                        },
                    });

                    if (imageResponse.generatedImages[0]?.image?.imageBytes) {
                        const base64ImageBytes = imageResponse.generatedImages[0].image.imageBytes;
                        problem.imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
                    } else {
                        problem.imageUrl = ''; 
                        console.warn(`Image generation failed for prompt: ${problem.imagePrompt}`);
                    }
                } catch(imgError) {
                     problem.imageUrl = '';
                     console.error(`Error generating image for prompt: ${problem.imagePrompt}`, imgError);
                }
            });
            await Promise.all(imageGenerationPromises);
        }

        // Defensive check: If a custom prompt was used, ensure only that prompt is in the final activity data.
        if (subTopic.id === 'creative-writing-prompts' && options.customPrompt) {
            (activity.data as { prompts: string[] }).prompts = [options.customPrompt];
        }
        
        return activity;
    } catch (error) {
        console.error('Error generating activity:', error);
        throw new Error('Etkinlik oluşturulamadı. Lütfen tekrar deneyin.');
    }
  }

  // --- Word Explorer Methods ---
  async getWordDefinition(word: string): Promise<string> {
    if (!this.ai) throw new Error('AI client not initialized.');
    const prompt = `Explain the meaning of the Turkish word '${word}' in a very simple, single sentence suitable for a 7-year-old child.`;
    const response = await this.ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { systemInstruction: TURKISH_TUTOR_SYSTEM_INSTRUCTION } });
    return response.text.trim();
  }

  async getExampleSentences(word: string): Promise<string[]> {
    if (!this.ai) throw new Error('AI client not initialized.');
    const prompt = `Create 2 simple, different example sentences in Turkish using the word '${word}'. Respond with a JSON object.`;
    const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: TURKISH_TUTOR_SYSTEM_INSTRUCTION,
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
    const response = await this.ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { systemInstruction: TURKISH_TUTOR_SYSTEM_INSTRUCTION } });
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
            systemInstruction: TURKISH_TUTOR_SYSTEM_INSTRUCTION,
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
