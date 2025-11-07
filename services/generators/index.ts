import {
    generateRhymingActivity,
    generateLetterDetectiveActivity,
    generateReadingAloudActivity,
    generateMeaningExplorerActivity,
    generateWordExplorerActivity,
    generateVisualMasterActivity,
    generateWordHunterActivity,
    generateSpellingChampionActivity,
    generateMemoryPlayerActivity,
    generateAuditoryWritingActivity,
} from './dyslexia';

import {
    generateNumberSenseActivity,
    generateArithmeticFluencyActivity,
    generateNumberGroupingActivity,
    generateProblemSolvingActivity,
    generateMathLanguageActivity,
    generateTimeMeasurementGeometryActivity,
    generateSpatialReasoningActivity,
    generateEstimationSkillsActivity,
    generateFractionsDecimalsActivity,
    generateVisualRepresentationActivity,
    generateVisualArithmeticActivity,
} from './dyscalculia';

import {
    generateFineMotorActivity,
    generateLetterFormationActivity,
    generateLetterFormRecognitionActivity,
    generateLegibleWritingActivity,
    generatePictureSequencingActivity,
    generateWritingSpeedActivity,
    generateSentenceBuildingActivity,
    generatePunctuationActivity,
    generateWritingPlanningActivity,
    generateCreativeWritingActivity,
    generateCommonStoryAdventureActivity,
} from './dysgraphia';

export const ALGORITHMIC_GENERATORS = {
    // Dyslexia
    'dyslexia-rhyming': generateRhymingActivity,
    'dyslexia-letter-detective': generateLetterDetectiveActivity,
    'dyslexia-reading-aloud': generateReadingAloudActivity,
    'dyslexia-meaning-explorer': generateMeaningExplorerActivity,
    'dyslexia-word-explorer': generateWordExplorerActivity,
    'dyslexia-visual-master': generateVisualMasterActivity,
    'dyslexia-word-hunter': generateWordHunterActivity,
    'dyslexia-spelling-champion': generateSpellingChampionActivity,
    'dyslexia-memory-player': generateMemoryPlayerActivity,
    'dyslexia-auditory-writing': generateAuditoryWritingActivity,
    
    // Dyscalculia
    'dyscalculia-number-sense': generateNumberSenseActivity,
    'dyscalculia-arithmetic-fluency': generateArithmeticFluencyActivity,
    'dyscalculia-number-grouping': generateNumberGroupingActivity,
    'dyscalculia-problem-solving': generateProblemSolvingActivity,
    'dyscalculia-math-language': generateMathLanguageActivity,
    'dyscalculia-time-measurement-geometry': generateTimeMeasurementGeometryActivity,
    'dyscalculia-spatial-reasoning': generateSpatialReasoningActivity,
    'dyscalculia-estimation-skills': generateEstimationSkillsActivity,
    'dyscalculia-fractions-decimals': generateFractionsDecimalsActivity,
    'dyscalculia-visual-representation': generateVisualRepresentationActivity,
    'dyscalculia-visual-arithmetic': generateVisualArithmeticActivity,

    // Dysgraphia
    'dysgraphia-fine-motor': generateFineMotorActivity,
    'dysgraphia-letter-formation': generateLetterFormationActivity,
    'dysgraphia-letter-form-recognition': generateLetterFormRecognitionActivity,
    'dysgraphia-legible-writing': generateLegibleWritingActivity,
    'dysgraphia-picture-sequencing': generatePictureSequencingActivity,
    'dysgraphia-writing-speed': generateWritingSpeedActivity,
    'dysgraphia-sentence-building': generateSentenceBuildingActivity,
    'dysgraphia-punctuation': generatePunctuationActivity,
    'dysgraphia-writing-planning': generateWritingPlanningActivity,
    'dysgraphia-creative-writing': generateCreativeWritingActivity,
    
    // Common Module
    'common-story-adventure': generateCommonStoryAdventureActivity,
};
