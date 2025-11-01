import { DYSLEXIA_SETTINGS } from './dyslexia';
import { DYSCALCULIA_SETTINGS } from './dyscalculia';
import { DYSGRAPHIA_SETTINGS } from './dysgraphia';

export const ALGORITHMIC_SETTINGS = {
    ...DYSLEXIA_SETTINGS,
    ...DYSCALCULIA_SETTINGS,
    ...DYSGRAPHIA_SETTINGS,
};
