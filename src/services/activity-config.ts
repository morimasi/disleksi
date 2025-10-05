import { Type } from '@google/genai';
import { Topic, SubTopicId } from '../models/activity.model';

// --- Reusable Schemas ---

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
                    description: 'An array of 3 to 5 visual arithmetic problem objects.',
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
                    description: 'An array of 5 dictation problem objects.',
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
                    description: 'An array of 4 to 6 objects, each representing a correct pair.',
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
                    description: 'An array of 1 to 2 sequencing problem objects.',
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            scenario: { type: Type.STRING, description: "The context or title for the sequence (e.g., 'Hikayeyi sırala')." },
                            events: {
                                type: Type.ARRAY,
                                description: 'An array of 3-5 strings representing events in a jumbled order.',
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
                    description: 'An array of 3 to 5 fill-in-the-blank problem objects.',
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
                    description: 'An array of 3 to 5 true/false problem objects.',
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
                    description: 'An array of 5 multiple-choice problem objects.',
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
                    description: 'An array of 5 visual matching problem objects.',
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING, description: 'The number or concept to be represented, as a string (e.g., "7" or a word).' },
                            options: {
                                type: Type.ARRAY,
                                description: 'An array of 3-4 strings. These can be strings of repeated emojis to represent a quantity, or words that are visually similar.',
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

const interactiveStorySchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A captivating title for the story in Turkish." },
        instructions: { type: Type.STRING, description: "Simple instructions in Turkish, e.g., 'Hikayede ilerlemek için seçimler yap.'" },
        activityType: { type: Type.STRING, description: "Should be 'interactive-story'." },
        hint: { type: Type.STRING, description: 'A brief, encouraging tip in Turkish.' },
        data: {
            type: Type.OBJECT,
            properties: {
                startSceneId: { type: Type.STRING, description: "The ID of the first scene." },
                scenes: {
                    type: Type.OBJECT,
                    description: "A map of scene IDs to scene objects. Must contain at least 3 scenes.",
                    properties: {}, // This allows for arbitrary keys (the scene IDs)
                }
            },
            required: ['startSceneId', 'scenes']
        }
    },
    required: ['title', 'instructions', 'activityType', 'data']
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
                description: "a 'Phonological Awareness' true/false activity with 5 questions. Questions should focus on identifying rhyming Turkish words (e.g., 'The word *masa* rhymes with *kasa*.'), counting syllables (e.g., '*Kelebek* has 3 syllables.'), or identifying initial/final sounds (e.g., 'The word *kapı* starts with the 'k' sound.'). Some statements should be true, some false. The 'isCorrect' field must reflect the statement's truthfulness."
            },
            'letter-sound': {
                schema: auditoryDictationSchema,
                description: "an 'Auditory Dictation' activity to strengthen letter-sound relationships. Provide 5 common, phonetically regular Turkish words appropriate for the student's grade level. The user will hear the word and must type it correctly."
            },
            'auditory-dictation': {
                schema: auditoryDictationSchema,
                description: "an 'Auditory Dictation' activity to strengthen letter-sound relationships. Provide 5 common, phonetically regular Turkish words appropriate for primary school students. The user will hear the word and must type it correctly."
            },
            'reading-fluency': {
                schema: multipleChoiceSchema,
                description: "a 'Reading Fluency' practice activity. The 'question' field should be 'Aşağıdaki cümlelerden hangisi doğrudur?'. For each item, provide a short, simple Turkish correct sentence (3-5 words) as the 'correctAnswer'. Then provide 3-4 'options' that include the correct sentence and distractors that are very similar but have one or two words changed or reordered. The goal is to encourage careful and quick reading."
            },
            'reading-comprehension': {
                schema: sequencingEventsSchema,
                description: "a 'Sequencing Events' activity. The scenario should be about a short, simple story. The events should be 3-5 key plot points from the story that need to be put in chronological order."
            },
            'visual-processing': {
                schema: dragDropMatchSchema,
                description: "a 'Visual Processing' drag-and-drop activity with 5 problems. For each problem, the 'prompt' must be a simple Turkish sentence with a word missing, represented by a double underscore '__'. The 'options' should be an array of 3-4 words including the correct word for the sentence ('correctAnswer') and visually similar distractors. Distractors should be created by transposing letters (e.g., 've' for 'ev'), or using visually similar letters (e.g., 'd' for 'b'). The 'correctAnswer' must be the correctly spelled word that fits the context of the sentence."
            },
            'vocabulary-morphology': {
                schema: matchingPairsSchema,
                description: "a 'Vocabulary and Morphology' matching pairs activity. Column 1 should contain 5 Turkish root words, and Column 2 should contain their corresponding suffixes or prefixes that form a new, common word (e.g., item1: 'göz', item2: '-lük')."
            },
            'spelling-patterns': {
                schema: fillInTheBlanksSchema,
                description: "a 'Spelling Patterns' fill-in-the-blanks activity. For each problem, provide a Turkish sentence with a word missing that exemplifies a common spelling rule (like vowel harmony or consonant assimilation). The 'correctAnswer' should be the correctly spelled word for the blank."
            },
            'working-memory-sequencing': {
                schema: orderingSchema,
                description: "a 'Working Memory and Sequencing' ordering activity. The 'question' should be 'Öğeleri doğru sıraya diz.'. The 'items' should be a jumbled array of 3-5 simple Turkish words, numbers, or letters. The 'correctOrder' should be the logically ordered version (e.g., alphabetical, numerical)."
            },
            'interactive-story': {
                schema: interactiveStorySchema,
                description: "an 'Interactive Story' activity. This should be a branching narrative with 3-5 scenes. At least one scene must contain a 'microActivity' to proceed. The micro-activity must be a simple, one-question activity object of type 'word-scramble' or 'fill-in-the-blanks' relevant to the story's context."
            },
        },
        fallback: {
            schema: wordScrambleSchema,
            description: "a 'word scramble' game where jumbled letters must be rearranged to form a correct Turkish word. Provide 5 words appropriate for the grade level and sub-topic."
        }
    },
    'diskalkuli': {
        subtopics: {
            'number-sense': {
                schema: visualArithmeticSchema,
                description: "a 'Visual Arithmetic' activity for number sense. Provide 5 problems using emojis to represent simple addition or comparison concepts. For example, the 'visualQuestion' could be '🍎🍎🍎 + 🍎' and the 'answer' should be '4'. Keep numbers small (under 10)."
            },
            'basic-arithmetic': {
                schema: simpleMathSchema,
                description: "a set of 5 simple arithmetic problems (addition, subtraction, multiplication, division) appropriate for the grade level. Ensure a mix of operations if possible. Questions and answers must be in Turkish."
            },
            'problem-solving': {
                schema: sequencingEventsSchema,
                description: "a 'Sequencing Events' activity. The scenario is to sequence the steps to solve a simple math word problem. The events should be 3-4 steps like 'Read the problem', 'Find the numbers', 'Decide the operation (add/subtract)', and 'Solve'."
            },
            'math-symbols': {
                schema: matchingPairsSchema,
                description: "a 'Math Symbols' matching pairs activity. Column 1 should have 5 math symbols (e.g., '+', '>', '=') and Column 2 should have their Turkish names (e.g., 'Artı', 'Büyüktür', 'Eşittir')."
            },
            'time-measurement': {
                schema: multipleChoiceSchema,
                description: "an activity about time and measurement. Create 5 simple multiple-choice questions. Examples: '1 metre kaç santimetredir?', 'Saat 2'den bir saat sonra saat kaç olur?', or 'Hangisi daha ağırdır: bir fil mi, bir kedi mi?'. Provide a question, 3 options, and a correct answer for each. Questions and answers must be in Turkish."
            },
            'spatial-reasoning': {
                schema: multipleChoiceSchema,
                description: "a 'Spatial Reasoning' multiple-choice activity with 5 questions. The 'question' should ask to identify shapes, complete a visual pattern, or understand relative positions (e.g., 'Resimdeki masanın solunda ne var?'). The options should be simple words or phrases."
            },
            'estimation-skills': {
                schema: multipleChoiceSchema,
                description: "an 'Estimation Skills' multiple-choice activity with 5 questions. The 'question' should ask to estimate a quantity (e.g., 'Bu kavanozda yaklaşık kaç bilye var?') or choose the answer closest to a calculation result (e.g., '28 + 71 işleminin sonucu hangisine en yakındır?'). Provide plausible options."
            },
            'fractions-decimals': {
                schema: multipleChoiceSchema,
                description: "a 'Fractions and Decimals' multiple-choice activity with 5 questions. Create questions that involve comparing simple fractions (e.g., 'Hangisi daha büyüktür: 1/2 mi, 1/4 mü?'), converting fractions to decimals, or identifying visual representations of fractions. Provide a question, 3-4 options, and a correct answer for each."
            },
            'visual-number-representation': {
                schema: visualMatchSchema,
                description: "a 'Visual Number Representation' visual matching activity with 5 problems. For each problem, the 'question' is a number string (e.g., '7'). The 'options' should be 3-4 short, descriptive strings of illustrated objects (e.g., '7 Sarı Civciv', '5 Kırmızı Top', '3 Yeşil Elma'). The 'correctAnswer' must be the string that correctly matches the number in the question. Use a variety of simple objects like fruits, animals, or toys."
            },
            'interactive-story': {
                schema: interactiveStorySchema,
                description: "an 'Interactive Story' activity. This should be a branching narrative with 3-5 scenes themed around a math-related adventure. At least one scene must contain a 'microActivity' to proceed. The micro-activity must be a simple, one-question activity object of type 'simple-math' relevant to the story's context."
            },
        },
        fallback: {
            schema: simpleMathSchema,
            description: "a set of 5 simple arithmetic problems appropriate for the sub-topic. Questions and answers must be in Turkish."
        }
    },
    'disgrafi': {
        subtopics: {
            'punctuation-grammar': {
                schema: trueFalseSchema,
                description: "a 'Punctuation and Grammar' true/false activity with 5 problems. For each problem, create a simple Turkish sentence as the 'statement'. Some statements should have correct punctuation and grammar, and some should have a common error (e.g., missing capital letter, missing period). The 'isCorrect' field must be a boolean representing whether the statement is grammatically correct. Example statement: 'ali okula gitti.' (isCorrect: false). Another example: 'Ayşe, topu Ali'ye attı.' (isCorrect: true)."
            },
            'writing-planning': {
                schema: sequencingEventsSchema,
                description: "a 'Writing Planning' sequencing activity. Provide 3-4 simple Turkish sentences that, when ordered correctly, form a short, coherent story or paragraph. The 'events' should be the jumbled sentences, and 'correctOrder' should be the sentences in the correct sequence."
            },
            'fine-motor-skills': {
                 schema: sentenceCompletionSchema,
                 description: "a set of 'sentence completion' prompts designed to be very short and simple to encourage the physical act of writing/typing without high cognitive load. Provide 3 very simple prompts like 'En sevdiğim renk...' or 'Bugün hava...'."
            },
            'sentence-construction': {
                 schema: sentenceCompletionSchema,
                 description: "a set of 'sentence completion' prompts for practicing advanced sentence construction. Generate 3 highly varied and creative prompts that encourage building complex sentences. The prompts must include different structures, such as introductory phrases (e.g., 'Güneşli bir günde...'), dependent clauses starting with conjunctions like 'çünkü' or 'eğer' (e.g., 'Çünkü çok yorgundu, ...'), or prompts that require compound elements to complete. The goal is to push the student to build longer, more structured, and grammatically diverse sentences suitable for their grade level."
            },
            'creative-writing-prompts': {
                schema: sentenceCompletionSchema,
                description: "a set of 'creative writing' prompts. Provide 3 imaginative, open-ended sentence starters that encourage storytelling and creativity. For example: 'Eğer hayvanlarla konuşabilseydim, ilk soracağım şey...', or 'Gizemli kutuyu açtığımda içinden...'."
            },
            'keyboarding-skills': {
                schema: sentenceCompletionSchema,
                description: "a set of 'keyboarding skills' practice prompts. Provide 3 short, simple Turkish sentences that are easy to type. The purpose is not sentence construction, but to provide text for typing practice. For example: 'Ali ata bak.', or 'Hızlı tilki, tembel köpeğin üzerinden atlar.'"
            },
            'interactive-story': {
                schema: interactiveStorySchema,
                description: "an 'Interactive Story' activity. This should be a branching narrative with 3-5 scenes. At least one scene must contain a 'microActivity' to proceed. The micro-activity must be a simple, one-question activity object of type 'sentence-completion' or 'fill-in-the-blanks' relevant to the story's context."
            },
        },
        fallback: {
            schema: sentenceCompletionSchema,
            description: "a set of 'sentence completion' prompts to encourage writing, related to the sub-topic. Provide 3 creative and simple prompts."
        }
    },
};