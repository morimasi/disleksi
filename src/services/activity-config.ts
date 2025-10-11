import { Type } from '@google/genai';
import { Topic, SubTopicId } from '../models/activity.model';

// --- Reusable Schemas ---

const readingAloudCoachSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: 'A fun and encouraging title in Turkish (e.g., "Okuma Yıldızı").' },
        instructions: { type: Type.STRING, description: 'Simple instructions in Turkish (e.g., "Metni sesli ve akıcı bir şekilde oku.").' },
        hint: { type: Type.STRING, description: 'A brief, encouraging tip about reading aloud in Turkish.' },
        activityType: { type: Type.STRING, description: "Should be 'reading-aloud-coach'." },
        data: {
            type: Type.OBJECT,
            properties: {
                paragraphs: {
                    type: Type.ARRAY,
                    description: 'An array of 5-7 short paragraphs of an engaging, grade-appropriate story or text in Turkish.',
                    items: { type: Type.STRING },
                },
            },
            required: ['paragraphs'],
        },
    },
    required: ['title', 'instructions', 'activityType', 'data'],
};

const wordExplorerSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: 'The title for the activity in Turkish, should be "Kelime Kâşifi".' },
        instructions: { type: Type.STRING, description: 'Simple instructions for the child in Turkish (e.g., "Hadi yeni bir kelime keşfedelim!").' },
        hint: { type: Type.STRING, description: 'A brief, encouraging tip in Turkish related to learning new words.' },
        activityType: { type: Type.STRING, description: "Should be 'word-explorer'." },
        data: {
            type: Type.OBJECT,
            properties: {
                word: { type: Type.STRING, description: 'A single, interesting, and grade-appropriate Turkish noun or verb.' },
            },
            required: ['word'],
        },
    },
    required: ['title', 'instructions', 'activityType', 'data'],
};

const visualArithmeticSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: 'A fun title for the activity in Turkish (e.g., "Meyve Matematiği").' },
        instructions: { type: Type.STRING, description: 'Simple instructions for the child in Turkish (e.g., "İşlemin sonucunu bul").' },
        hint: { type: Type.STRING, description: 'A brief, encouraging tip in Turkish.' },
        activityType: { type: Type.STRING, description: "Should be 'visual-arithmetic'." },
        data: {
            type: Type.OBJECT,
            properties: {
                problems: {
                    type: Type.ARRAY,
                    description: 'An array of 15 to 25 visual arithmetic problem objects.',
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            visualQuestion: { type: Type.STRING, description: "The math problem represented as a string of emojis (e.g., '🍎🍎 + 🍎🍎🍎')." },
                            answer: { type: Type.STRING, description: 'The correct numerical answer as a string (e.g., "5").' }
                        },
                        required: ['visualQuestion', 'answer'],
                    },
                },
            },
            required: ['problems'],
        },
    },
    required: ['title', 'instructions', 'activityType', 'data'],
};

const auditoryDictationSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: 'A fun title for the activity in Turkish (e.g., "Sihirli Kelimeler").' },
        instructions: { type: Type.STRING, description: 'Simple instructions for the child in Turkish (e.g., "Duyduğun kelimeyi yaz").' },
        hint: { type: Type.STRING, description: 'A brief, encouraging tip in Turkish.' },
        activityType: { type: Type.STRING, description: "Should be 'auditory-dictation'." },
        data: {
            type: Type.OBJECT,
            properties: {
                problems: {
                    type: Type.ARRAY,
                    description: 'An array of 25 dictation problem objects.',
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            wordToSpeak: { type: Type.STRING, description: 'The Turkish word the user should hear and type.' },
                        },
                        required: ['wordToSpeak'],
                    },
                },
            },
            required: ['problems'],
        },
    },
    required: ['title', 'instructions', 'activityType', 'data'],
};

const matchingPairsSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: 'A fun title for the activity in Turkish.' },
        instructions: { type: Type.STRING, description: 'Simple instructions for the child in Turkish (e.g., "Doğru çiftleri eşleştir").' },
        hint: { type: Type.STRING, description: 'A brief, encouraging tip in Turkish.' },
        activityType: { type: Type.STRING, description: "Should be 'matching-pairs'." },
        data: {
            type: Type.OBJECT,
            properties: {
                column1Title: { type: Type.STRING, description: "The title for the first column (e.g., 'Kelime')." },
                column2Title: { type: Type.STRING, description: "The title for the second column (e.g., 'Anlamı')." },
                pairs: {
                    type: Type.ARRAY,
                    description: 'An array of 20 to 25 objects, each representing a correct pair.',
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            item1: { type: Type.STRING, description: 'The item for the first column.' },
                            item2: { type: Type.STRING, description: 'The corresponding item for the second column.' }
                        },
                        required: ['item1', 'item2'],
                    },
                },
            },
            required: ['column1Title', 'column2Title', 'pairs'],
        },
    },
    required: ['title', 'instructions', 'activityType', 'data'],
};

const sequencingEventsSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: 'A fun title for the activity in Turkish.' },
        instructions: { type: Type.STRING, description: 'Simple instructions for the child in Turkish (e.g., "Olayları doğru sıraya diz").' },
        hint: { type: Type.STRING, description: 'A brief, encouraging tip in Turkish.' },
        activityType: { type: Type.STRING, description: "Should be 'sequencing-events'." },
        data: {
            type: Type.OBJECT,
            properties: {
                problems: {
                    type: Type.ARRAY,
                    description: 'An array of 3 to 5 sequencing problem objects.',
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            scenario: { type: Type.STRING, description: "The context or title for the sequence (e.g., 'Hikayeyi sırala')." },
                            events: {
                                type: Type.ARRAY,
                                description: 'An array of 5-7 strings representing events in a jumbled order.',
                                items: { type: Type.STRING }
                            },
                            correctOrder: {
                                type: Type.ARRAY,
                                description: 'The array of events in the correct chronological or logical order.',
                                items: { type: Type.STRING }
                            },
                        },
                        required: ['scenario', 'events', 'correctOrder'],
                    },
                },
            },
            required: ['problems'],
        },
    },
    required: ['title', 'instructions', 'activityType', 'data'],
};

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
          description: 'An array of 15 to 25 ordering problem objects.',
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
                    description: 'An array of 15 to 25 drag-and-drop problem objects.',
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

const fillInTheBlanksSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: 'A fun title for the activity in Turkish.' },
        instructions: { type: Type.STRING, description: 'Simple instructions for the child in Turkish (e.g., "Boşluğu doğru kelime ile tamamla").' },
        hint: { type: Type.STRING, description: 'A brief, encouraging tip in Turkish.' },
        activityType: { type: Type.STRING, description: "Should be 'fill-in-the-blanks'." },
        data: {
            type: Type.OBJECT,
            properties: {
                problems: {
                    type: Type.ARRAY,
                    description: 'An array of 15 to 25 fill-in-the-blank problem objects.',
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            prompt: { type: Type.STRING, description: "The sentence containing a double underscore '__' for the blank." },
                            correctAnswer: { type: Type.STRING, description: 'The correct word for the blank.' },
                        },
                        required: ['prompt', 'correctAnswer'],
                    },
                },
            },
            required: ['problems'],
        },
    },
    required: ['title', 'instructions', 'activityType', 'data'],
};

const trueFalseSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: 'A fun title for the activity in Turkish.' },
        instructions: { type: Type.STRING, description: 'Simple instructions for the child in Turkish (e.g., "İfadeler doğru mu yanlış mı?").' },
        hint: { type: Type.STRING, description: 'A brief, encouraging tip in Turkish.' },
        activityType: { type: Type.STRING, description: "Should be 'true-false'." },
        data: {
            type: Type.OBJECT,
            properties: {
                problems: {
                    type: Type.ARRAY,
                    description: 'An array of 15 to 25 true/false problem objects.',
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            statement: { type: Type.STRING, description: 'The statement to be evaluated.' },
                            isCorrect: { type: Type.BOOLEAN, description: 'True if the statement is correct, false otherwise.' },
                        },
                        required: ['statement', 'isCorrect'],
                    },
                },
            },
            required: ['problems'],
        },
    },
    required: ['title', 'instructions', 'activityType', 'data'],
};

const sentenceCompletionSchema = {
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
          description: 'An array of 15 sentence starter strings.',
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

 const multipleChoiceSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: 'A fun title for the activity in Turkish.' },
        instructions: { type: Type.STRING, description: 'Simple instructions for the child in Turkish.' },
        hint: { type: Type.STRING, description: 'A brief, encouraging tip in Turkish.' },
        activityType: { type: Type.STRING, description: "Should be 'multiple-choice'." },
        data: {
            type: Type.OBJECT,
            properties: {
                problems: {
                    type: Type.ARRAY,
                    description: 'An array of 25 multiple-choice problem objects.',
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING, description: 'The question or prompt to show the user.' },
                            options: {
                                type: Type.ARRAY,
                                description: 'An array of 3-4 strings, including the correct answer and distractors.',
                                items: { type: Type.STRING }
                            },
                            correctAnswer: { type: Type.STRING, description: 'The correct string from the options array.' }
                        },
                        required: ['question', 'options', 'correctAnswer'],
                    },
                },
            },
            required: ['problems'],
        },
    },
    required: ['title', 'instructions', 'activityType', 'data'],
};

const simpleMathSchema = {
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
                    description: 'An array of 15 to 25 math problem objects, depending on the sub-topic.',
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

const wordScrambleSchema = {
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
                    description: 'An array of 25 word objects.',
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

const visualMatchSchema = {
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
                    description: 'An array of 25 visual matching problem objects.',
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING, description: 'The number or concept to be represented, as a string (e.g., "7" or a word).' },
                            options: {
                                type: Type.ARRAY,
                                description: 'An array of 3-5 strings based on difficulty. These can be strings of repeated emojis to represent a quantity, or words that are visually similar.',
                                items: { type: Type.STRING }
                            },
                            correctAnswer: { type: Type.STRING, description: 'The correct string from the options array.' }
                        },
                        required: ['question', 'options', 'correctAnswer'],
                    },
                },
            },
            required: ['problems'],
        },
    },
    required: ['title', 'instructions', 'activityType', 'data'],
};

const microActivitySchema = {
    type: Type.OBJECT,
    description: "An optional, simple, one-question activity. Must be of type 'word-scramble', 'simple-math', or 'fill-in-the-blanks'.",
    properties: {
        title: { type: Type.STRING, description: "A title for the mini-challenge." },
        instructions: { type: Type.STRING, description: "Instructions for the mini-challenge." },
        activityType: { type: Type.STRING, description: "Either 'word-scramble', 'simple-math', or 'fill-in-the-blanks'." },
        data: {
            type: Type.OBJECT,
            properties: {
                words: {
                    type: Type.ARRAY,
                    description: "For 'word-scramble' type. Must contain only one item.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            scrambled: { type: Type.STRING },
                            correct: { type: Type.STRING },
                        },
                        required: ['scrambled', 'correct'],
                    },
                },
                problems: {
                    type: Type.ARRAY,
                    description: "For 'simple-math' or 'fill-in-the-blanks' types. Must contain only one item.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            // for simple-math
                            question: { type: Type.STRING },
                            answer: { type: Type.STRING },
                            // for fill-in-the-blanks
                            prompt: { type: Type.STRING },
                            correctAnswer: { type: Type.STRING },
                        },
                    },
                },
            },
        },
    },
    required: ['title', 'instructions', 'activityType', 'data'],
};

const interactiveStorySchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A captivating title for the story in Turkish." },
        instructions: { type: Type.STRING, description: "Simple instructions in Turkish, e.g., 'Hikayede ilerlemek için seçimler yap.'" },
        activityType: { type: Type.STRING, description: "Must be 'interactive-story'." },
        hint: { type: Type.STRING, description: 'A brief, encouraging tip in Turkish.' },
        data: {
            type: Type.OBJECT,
            properties: {
                startSceneId: { type: Type.STRING, description: "The ID of the first scene, e.g., 'scene1'." },
                scenes: {
                    type: Type.ARRAY,
                    description: "An array of 3-5 scene objects that form the story.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING, description: "A unique identifier for the scene, e.g., 'scene1'." },
                            text: { type: Type.STRING, description: "The text content of the scene." },
                            choices: {
                                type: Type.ARRAY,
                                description: "An array of choices for the user. An empty array signifies an ending scene.",
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        text: { type: Type.STRING, description: "The text for the choice button." },
                                        nextSceneId: { type: Type.STRING, description: "The ID of the scene this choice leads to." },
                                    },
                                    required: ['text', 'nextSceneId'],
                                },
                            },
                            microActivity: microActivitySchema
                        },
                        required: ['id', 'text', 'choices'],
                    }
                }
            },
            required: ['startSceneId', 'scenes']
        }
    },
    required: ['title', 'instructions', 'activityType', 'data']
};

export const fiveWOneHStorySchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: 'A fun title for the activity in Turkish (e.g., "Kayıp Uçurtmanın Gizemi").' },
    instructions: { type: Type.STRING, description: 'Simple instructions for the child in Turkish (e.g., "Hikayeyi oku ve soruları cevapla!").' },
    hint: { type: Type.STRING, description: 'A brief, encouraging tip in Turkish.' },
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
              answer: { type: Type.STRING, description: 'The concise answer to the question, based on the story.' },
              hint: { type: Type.STRING, description: 'A simple, one-sentence hint for the question in Turkish.' },
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

export const spatialRelationsSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: 'A fun title for the activity in Turkish.' },
        instructions: { type: Type.STRING, description: 'Simple instructions in Turkish (e.g., "Resme bak ve soruyu cevapla").' },
        hint: { type: Type.STRING, description: 'A brief, encouraging tip in Turkish.' },
        activityType: { type: Type.STRING, description: "Should be 'spatial-relations'." },
        data: {
            type: Type.OBJECT,
            properties: {
                problems: {
                    type: Type.ARRAY,
                    description: 'An array of 15 to 25 spatial relations problem objects.',
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            imagePrompt: { type: Type.STRING, description: "A simple, clear, descriptive prompt for an image generation model to create a visual scene. E.g., 'A red ball on top of a blue box'." },
                            question: { type: Type.STRING, description: 'The question about the scene in Turkish (e.g., "Top nerede?").' },
                            options: {
                                type: Type.ARRAY,
                                description: 'An array of 3-4 Turkish strings for multiple-choice options.',
                                items: { type: Type.STRING }
                            },
                            correctAnswer: { type: Type.STRING, description: 'The correct string from the options array.' },
                        },
                        required: ['imagePrompt', 'question', 'options', 'correctAnswer'],
                    },
                },
            },
            required: ['problems'],
        },
    },
    required: ['title', 'instructions', 'activityType', 'data'],
};

const pictureSequencingSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: 'A fun title for the activity in Turkish.' },
        instructions: { type: Type.STRING, description: 'Simple instructions in Turkish (e.g., "Resimleri doğru sıraya dizerek hikayeyi oluştur.").' },
        hint: { type: Type.STRING, description: 'A brief, encouraging tip in Turkish.' },
        activityType: { type: Type.STRING, description: "Should be 'picture-sequencing-storyteller'." },
        data: {
            type: Type.OBJECT,
            properties: {
                problems: {
                    type: Type.ARRAY,
                    description: 'An array of 1 to 2 picture sequencing problem objects.',
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            storyTitle: { type: Type.STRING, description: "A simple title for the short story in Turkish (e.g., 'Kardan Adam Yapmak')." },
                            imagePrompts: {
                                type: Type.ARRAY,
                                description: "An array of 4 simple, descriptive prompts for an image generation model to create a visual story sequence. The prompts should be in a logical, chronological order. Example: ['A child rolling a large snowball', 'The child placing a smaller snowball on top of the large one', 'The child adding a carrot for a nose and stones for eyes', 'A smiling snowman with a child next to it'].",
                                items: { type: Type.STRING }
                            },
                        },
                        required: ['storyTitle', 'imagePrompts'],
                    },
                },
            },
            required: ['problems'],
        },
    },
    required: ['title', 'instructions', 'activityType', 'data'],
};


// --- Activity Configuration Map ---

interface ActivityConfig {
    schema: any;
    description: string;
}

export const ACTIVITY_CONFIGS: Record<Topic, { subtopics: Partial<Record<SubTopicId, ActivityConfig>>, fallback: ActivityConfig }> = {
    'disleksi': {
        subtopics: {
            'phonological-awareness': {
                schema: trueFalseSchema,
                description: "a 'Phonological Awareness' true/false activity with 25 questions. Questions should focus on identifying rhyming Turkish words (e.g., 'The word *masa* rhymes with *kasa*.'), counting syllables (e.g., '*Kelebek* has 3 syllables.'), or identifying initial/final sounds (e.g., 'The word *kapı* starts with the 'k' sound.'). Some statements should be true, some false. The 'isCorrect' field must reflect the statement's truthfulness."
            },
            'letter-sound': {
                schema: auditoryDictationSchema,
                description: "an 'Auditory Dictation' activity to strengthen letter-sound relationships. Provide 25 common, phonetically regular Turkish words appropriate for the student's grade level. The user will hear the word and must type it correctly."
            },
            'auditory-dictation': {
                schema: auditoryDictationSchema,
                description: "an 'Auditory Dictation' activity with 25 questions. Provide common, phonetically regular Turkish words appropriate for primary school students. The user will hear the word and must type it correctly."
            },
            'reading-aloud-coach': {
                schema: readingAloudCoachSchema,
                description: "a 'Reading Aloud Coach' activity. Generate a short, engaging, and grade-appropriate story or informative text in Turkish, split into 5-7 paragraphs."
            },
            'reading-comprehension': {
                schema: sequencingEventsSchema,
                description: "a 'Sequencing Events' activity. The scenario should be about a short, simple story. The events should be 5-7 key plot points from the story that need to be put in chronological order."
            },
            'visual-processing': {
                schema: dragDropMatchSchema,
                description: "a 'Visual Processing' drag-and-drop activity with 25 problems. For each problem, the 'prompt' must be a simple Turkish sentence with a word missing, represented by a double underscore '__'. The 'options' should be an array of 3-4 words including the correct word for the sentence ('correctAnswer') and visually similar distractors. Distractors should be created by transposing letters (e.g., 've' for 'ev'), or using visually similar letters (e.g., 'd' for 'b'). The 'correctAnswer' must be the correctly spelled word that fits the context of the sentence."
            },
            'vocabulary-morphology': {
                schema: matchingPairsSchema,
                description: "a 'Vocabulary and Morphology' matching pairs activity. Column 1 should contain 20-25 Turkish root words, and Column 2 should contain their corresponding suffixes or prefixes that form a new, common word (e.g., item1: 'göz', item2: '-lük')."
            },
            'spelling-patterns': {
                schema: fillInTheBlanksSchema,
                description: "a 'Spelling Patterns' fill-in-the-blanks activity. For each problem, provide a Turkish sentence with a word missing that exemplifies a common spelling rule (like vowel harmony or consonant assimilation). The 'correctAnswer' should be the correctly spelled word for the blank."
            },
            'working-memory-sequencing': {
                schema: orderingSchema,
                description: "a 'Working Memory and Sequencing' ordering activity. The 'question' should be 'Öğeleri doğru sıraya diz.'. The 'items' should be a jumbled array of 5-7 simple Turkish words, numbers, or letters. The 'correctOrder' should be the logically ordered version (e.g., alphabetical, numerical)."
            },
            'interactive-story': {
                schema: interactiveStorySchema,
                description: "an 'Interactive Story' activity. This should be a branching narrative with 3-5 scenes. At least one scene must contain a 'microActivity' to proceed. The micro-activity must be a simple, one-question activity object of type 'word-scramble' or 'fill-in-the-blanks' relevant to the story's context."
            },
             'word-explorer': {
                schema: wordExplorerSchema,
                description: "a 'Word Explorer' activity. Generate a single, interesting, and grade-appropriate Turkish noun or verb as the 'word' field in the data object."
            },
        },
        fallback: {
            schema: wordScrambleSchema,
            description: "a 'word scramble' game where jumbled letters must be rearranged to form a correct Turkish word. Provide 25 words appropriate for the grade level and sub-topic."
        }
    },
    'diskalkuli': {
        subtopics: {
            'number-sense': {
                schema: visualArithmeticSchema,
                description: "a 'Visual Arithmetic' activity for number sense. Provide 15-25 problems using emojis to represent simple addition or comparison concepts. For example, the 'visualQuestion' could be '🍎🍎🍎 + 🍎' and the 'answer' should be '4'. Keep numbers small (under 10)."
            },
            'number-grouping-practice': {
                schema: multipleChoiceSchema,
                description: "a 'Number Grouping' multiple-choice activity with 25 questions. For each question, present a simple addition problem (e.g., '14 + 5'). The options should show different ways to group the numbers to solve it, with one being the correct strategy (e.g., '10 + 4 + 5'). The correct answer should be the string representing the correct grouping."
            },
            'visual-arithmetic': {
                schema: visualArithmeticSchema,
                description: "a 'Visual Arithmetic' activity. Provide 15-25 problems using emojis to represent simple addition, subtraction or multiplication. For example, the 'visualQuestion' could be '🍎🍎🍎 + 🍎' and the 'answer' should be '4'. Keep numbers appropriate for the grade level."
            },
            'basic-arithmetic': {
                schema: simpleMathSchema,
                description: "a set of 25 simple arithmetic problems (addition, subtraction, multiplication, division) appropriate for the grade level. Ensure a mix of operations if possible. Questions and answers must be in Turkish."
            },
            'problem-solving': {
                schema: sequencingEventsSchema,
                description: "a 'Sequencing Events' activity. The scenario is to sequence the steps to solve a simple math word problem. The events should be 3-4 steps like 'Read the problem', 'Find the numbers', 'Decide the operation (add/subtract)', and 'Solve'."
            },
            'math-symbols': {
                schema: matchingPairsSchema,
                description: "a 'Math Symbols' matching pairs activity. Column 1 should have 20-25 math symbols (e.g., '+', '>', '=') and Column 2 should have their Turkish names (e.g., 'Artı', 'Büyüktür', 'Eşittir')."
            },
            'time-measurement': {
                schema: multipleChoiceSchema,
                description: "an activity about time and measurement. Create 25 simple multiple-choice questions. Examples: '1 metre kaç santimetredir?', 'Saat 2'den bir saat sonra saat kaç olur?', or 'Hangisi daha ağırdır: bir fil mi, bir kedi mi?'. Provide a question, 3 options, and a correct answer for each. Questions and answers must be in Turkish."
            },
            'spatial-reasoning': {
                schema: multipleChoiceSchema,
                description: "a 'Spatial Reasoning' multiple-choice activity with 25 questions. The 'question' should ask to identify shapes, complete a visual pattern, or understand relative positions (e.g., 'Resimdeki masanın solunda ne var?'). The options should be simple words or phrases."
            },
            'estimation-skills': {
                schema: multipleChoiceSchema,
                description: "an 'Estimation Skills' multiple-choice activity with 25 questions. The 'question' should ask to estimate a quantity (e.g., 'Bu kavanozda yaklaşık kaç bilye var?') or choose the answer closest to a calculation result (e.g., '28 + 71 işleminin sonucu hangisine en yakındır?'). Provide plausible options."
            },
            'fractions-decimals': {
                schema: multipleChoiceSchema,
                description: "a 'Fractions and Decimals' multiple-choice activity with 25 questions. Create questions that involve comparing simple fractions (e.g., 'Hangisi daha büyüktür: 1/2 mi, 1/4 mü?'), converting fractions to decimals, or identifying visual representations of fractions. Provide a question, 3-4 options, and a correct answer for each."
            },
            'visual-number-representation': {
                schema: visualMatchSchema,
                description: "a 'Visual Number Representation' visual matching activity with 25 problems. For each problem, the 'question' is a number string (e.g., '7'). The 'options' should be an array of strings representing quantities with emojis or descriptive text (e.g., '7 Sarı Civciv', '🍎🍎🍎🍎🍎', 'beş top'). The 'correctAnswer' must be the string that correctly matches the number in the question. The number of options should depend on the difficulty level (easy: 3, medium: 4, hard: 5)."
            },
            'interactive-story': {
                schema: interactiveStorySchema,
                description: "an 'Interactive Story' activity. This should be a branching narrative with 3-5 scenes themed around a math-related adventure. At least one scene must contain a 'microActivity' to proceed. The micro-activity must be a simple, one-question activity object of type 'simple-math' relevant to the story's context."
            },
        },
        fallback: {
            schema: simpleMathSchema,
            description: "a set of 25 simple arithmetic problems appropriate for the sub-topic. Questions and answers must be in Turkish."
        }
    },
    'disgrafi': {
        subtopics: {
            'picture-sequencing-storyteller': {
                schema: pictureSequencingSchema,
                description: "a 'Picture Sequencing Storyteller' activity. Generate a simple story sequence with a clear title and 4 distinct, chronologically ordered image prompts. The prompts should describe simple actions that can be easily visualized."
            },
            'punctuation-grammar': {
                schema: trueFalseSchema,
                description: "a 'Punctuation and Grammar' true/false activity with 25 problems. For each problem, create a simple Turkish sentence as the 'statement'. Some statements should have correct punctuation and grammar, and some should have a common error (e.g., missing capital letter, missing period). The 'isCorrect' field must be a boolean representing whether the statement is grammatically correct. Example statement: 'ali okula gitti.' (isCorrect: false). Another example: 'Ayşe, topu Ali'ye attı.' (isCorrect: true)."
            },
            'letter-form-recognition': {
                schema: visualMatchSchema,
                description: "a 'Visual Match' activity for letter form recognition. For each problem, the 'question' should be a single Turkish letter (e.g., 'b'). The 'options' should be an array of 3-4 strings, where one is the correct letter ('correctAnswer'), and the others are visually similar but incorrectly formed versions (e.g., reversed, distorted, incomplete). The goal is to help the user distinguish correctly formed letters."
            },
            'writing-planning': {
                schema: sequencingEventsSchema,
                description: "a 'Writing Planning' sequencing activity. Provide 3-4 simple Turkish sentences that, when ordered correctly, form a short, coherent story or paragraph. The 'events' should be the jumbled sentences, and 'correctOrder' should be the sentences in the correct sequence."
            },
            'fine-motor-skills': {
                 schema: sentenceCompletionSchema,
                 description: "a set of 'sentence completion' prompts designed to be very short and simple to encourage the physical act of writing/typing without high cognitive load. Provide 15 very simple prompts like 'En sevdiğim renk...' or 'Bugün hava...'."
            },
            'sentence-construction': {
                 schema: sentenceCompletionSchema,
                 description: "a set of 'sentence completion' prompts for practicing advanced sentence construction. Generate 15 highly varied and creative prompts that encourage building complex sentences. The prompts must include different structures, such as introductory phrases (e.g., 'Güneşli bir günde...'), dependent clauses starting with conjunctions like 'çünkü' or 'eğer' (e.g., 'Çünkü çok yorgundu, ...'), or prompts that require compound elements to complete. The goal is to push the student to build longer, more structured, and grammatically diverse sentences suitable for their grade level."
            },
            'creative-writing-prompts': {
                schema: sentenceCompletionSchema,
                description: "a set of 'creative writing' prompts. Provide 15 imaginative, open-ended sentence starters that encourage storytelling and creativity. For example: 'Eğer hayvanlarla konuşabilseydim, ilk soracağım şey...', or 'Gizemli kutuyu açtığımda içinden...'."
            },
            'keyboarding-skills': {
                schema: sentenceCompletionSchema,
                description: "a set of 'keyboarding skills' practice prompts. Provide 15 short, simple Turkish sentences that are easy to type. The purpose is not sentence construction, but to provide text for typing practice. For example: 'Ali ata bak.', or 'Hızlı tilki, tembel köpeğin üzerinden atlar.'"
            },
            'interactive-story': {
                schema: interactiveStorySchema,
                description: "an 'Interactive Story' activity. This should be a branching narrative with 3-5 scenes. At least one scene must contain a 'microActivity' to proceed. The micro-activity must be a simple, one-question activity object of type 'sentence-completion' or 'fill-in-the-blanks' relevant to the story's context."
            },
        },
        fallback: {
            schema: sentenceCompletionSchema,
            description: "a set of 'sentence completion' prompts to encourage writing, related to the sub-topic. Provide 15 creative and simple prompts."
        }
    },
    'mekansal-farkindalik': {
        subtopics: {
            'spatial-relations-positional': {
                schema: spatialRelationsSchema,
                description: "a 'spatial relations' activity focusing on positional concepts (on, under, inside, next to, between, in front of, behind). The image prompts should describe creative and diverse scenes with 2-4 objects. Use a wide variety of objects (e.g., animals, furniture, food, toys) and colors. Example prompt: 'A happy cat sleeping inside a cardboard box, next to a tall green plant'."
            },
            'spatial-relations-directional': {
                schema: spatialRelationsSchema,
                description: "a 'spatial relations' activity focusing on directional concepts (right, left, above, below). The image prompts should describe creative and diverse scenes where object direction and relation is key. Use a wide variety of objects and colors. Example prompt: 'A yellow car is to the left of a red fire hydrant. A blue bird is flying above the car'."
            },
            'spatial-relations-visual-discrimination': {
                schema: spatialRelationsSchema,
                description: "a 'spatial relations' activity for visual discrimination. The image prompts should describe scenes with multiple similar objects, and the question should ask to identify one based on its unique position or feature. Use creative scenarios. Example prompt: 'Three teddy bears are sitting on a shelf. The middle teddy bear is wearing a blue bow tie'."
            }
        },
        fallback: {
            schema: spatialRelationsSchema,
            description: "a general 'spatial relations' activity with a mix of positional and directional concepts. The image prompts must be creative and varied, using different objects, colors, and scenarios for each problem."
        }
    }
};