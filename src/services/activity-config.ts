import { Type } from '@google/genai';
import { Topic, SubTopicId } from '../models/activity.model';

// --- Reusable Schemas ---

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
                schema: fillInTheBlanksSchema,
                description: "a 'Letter-Sound Relationship' fill-in-the-blanks activity with 5 problems. For each problem, provide a common Turkish word with ONE letter or a digraph missing, represented by a double underscore '__'. The 'prompt' field must contain this word. The 'correctAnswer' must be the single missing letter or digraph."
            },
            'reading-fluency': {
                schema: multipleChoiceSchema,
                description: "a 'Reading Fluency' practice activity. The 'question' field should be 'Aşağıdaki cümlelerden hangisi doğrudur?'. For each item, provide a short, simple Turkish correct sentence (3-5 words) as the 'correctAnswer'. Then provide 3-4 'options' that include the correct sentence and distractors that are very similar but have one or two words changed or reordered. The goal is to encourage careful and quick reading."
            },
            'reading-comprehension': {
                schema: fillInTheBlanksSchema,
                description: "a 'Reading Comprehension' cloze test activity with 5 problems. For each problem, provide a simple Turkish sentence with one context-ually important word missing, represented by a double underscore '__'. The 'prompt' field must contain this sentence. The 'correctAnswer' must be the single missing word that makes sense in the sentence. For example, Prompt: 'Kedi süt __.', Correct Answer: 'içti'."
            },
            'visual-processing': {
                schema: dragDropMatchSchema,
                description: "a 'Visual Processing' drag-and-drop activity with 5 problems. For each problem, the 'prompt' must be a simple Turkish sentence with a word missing, represented by a double underscore '__'. The 'options' should be an array of 3-4 words including the correct word for the sentence ('correctAnswer') and visually similar distractors. Distractors should be created by transposing letters (e.g., 've' for 'ev'), or using visually similar letters (e.g., 'd' for 'b'). The 'correctAnswer' must be the correctly spelled word that fits the context of the sentence."
            },
            'vocabulary-morphology': {
                schema: dragDropMatchSchema,
                description: "a 'Vocabulary and Morphology' drag-and-drop activity with 5 problems. For each problem, the 'prompt' should be a Turkish root word with a placeholder for a prefix or suffix (e.g., 'göz__'). The 'options' should include the correct affix (e.g., 'lük') and some distractors. The 'correctAnswer' is the correct affix. The goal is to build new words."
            },
            'spelling-patterns': {
                schema: multipleChoiceSchema,
                description: "a 'Spelling Patterns' multiple-choice activity. The 'question' should be 'Hangi kelime doğru yazılmıştır?'. Provide a correctly spelled Turkish word as the 'correctAnswer' that exemplifies a common spelling rule or pattern (e.g., words with 'ğ', compound words, 'de/da' usage). The other 'options' must be common misspellings of that word. Provide 5 items."
            },
            'working-memory-sequencing': {
                schema: orderingSchema,
                description: "a 'Working Memory and Sequencing' ordering activity. The 'question' should be 'Öğeleri doğru sıraya diz.'. The 'items' should be a jumbled array of 3-5 simple Turkish words, numbers, or letters. The 'correctOrder' should be the logically ordered version (e.g., alphabetical, numerical)."
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
                schema: trueFalseSchema,
                description: "a 'Number Sense' true/false activity with 5 problems. For each problem, create a mathematical statement for comparison (e.g., '15 < 12' or '25 > 10'). The 'isCorrect' field must be a boolean representing the truthfulness of the statement. Statements and numbers must be in Turkish."
            },
            'basic-arithmetic': {
                schema: simpleMathSchema,
                description: "a set of 5 simple arithmetic problems (addition, subtraction, multiplication, division) appropriate for the grade level. Ensure a mix of operations if possible. Questions and answers must be in Turkish."
            },
            'problem-solving': {
                schema: simpleMathSchema,
                description: "a set of 3-4 simple, real-world word problems that require basic arithmetic. The problems should be relatable for a child. For example: 'Ayşe'nin 5 kalemi vardı, arkadaşı ona 3 kalem daha verdi. Ayşe'nin şimdi kaç kalemi var?'. The answer should be the numerical value. Problems and answers must be in Turkish."
            },
            'math-symbols': {
                schema: dragDropMatchSchema,
                description: "a 'Math Symbols' drag-and-drop activity with 5 problems. For each problem, provide a simple mathematical equation with the operator or relation symbol missing, represented by a double underscore '__' (e.g., '10 __ 5 = 5' or '7 __ 9'). The 'prompt' field must contain this equation. Provide 3-4 symbol 'options' (e.g., '+', '-', '<', '>'). The 'correctAnswer' must be the correct symbol."
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
                schema: orderingSchema,
                description: "a 'Writing Planning' ordering activity. Provide 3-4 simple Turkish sentences that, when ordered correctly, form a short, coherent story or paragraph. The 'items' should be the jumbled sentences, and 'correctOrder' should be the sentences in the correct sequence."
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
        },
        fallback: {
            schema: sentenceCompletionSchema,
            description: "a set of 'sentence completion' prompts to encourage writing, related to the sub-topic. Provide 3 creative and simple prompts."
        }
    },
};