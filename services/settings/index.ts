import { DYSLEXIA_SETTINGS } from './dyslexia';
import { DYSCALCULIA_SETTINGS } from './dyscalculia';
import { DYSGRAPHIA_SETTINGS } from './dysgraphia';

// Type definition for a single control
type Control = {
    id: string;
    label: string;
    type: 'select' | 'slider' | 'toggle';
    // Fix: Add readonly to match 'as const' type inference
    options?: readonly { value: string | number; label: string }[];
    min?: number;
    max?: number;
    step?: number;
    tooltip?: string;
};

// Type definition for a group of controls
type SettingsGroup = {
    title: string;
    // Fix: Add readonly to match 'as const' type inference
    controls: readonly Control[];
};

// Type definition for a module's settings configuration
type ModuleSettingsConfig = {
    defaultSettings: Record<string, any>;
    // Fix: Add readonly to match 'as const' type inference
    groups: readonly SettingsGroup[];
};

// Type definition for the entire settings object
type AlgorithmicSettings = {
    [moduleId: string]: ModuleSettingsConfig;
};


export const ALGORITHMIC_SETTINGS: AlgorithmicSettings = {
    ...DYSLEXIA_SETTINGS,
    ...DYSCALCULIA_SETTINGS,
    ...DYSGRAPHIA_SETTINGS,
};
