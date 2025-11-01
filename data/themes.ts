// Fix: Define a type for theme objects to ensure type safety.
export type Theme = {
    name: string;
    mode: 'light' | 'dark';
    colors: {
        '--primary-color': string;
        '--secondary-color': string;
        '--background-color': string;
        '--card-bg-color': string;
        '--text-color': string;
        '--light-text-color': string;
        '--border-color': string;
        '--shadow'?: string;
        '--border-radius'?: string;
    };
};

// Fix: Apply the Theme type to the THEMES object.
export const THEMES: { [key: string]: Theme } = {
    light_default: {
        name: 'Varsayılan Açık',
        mode: 'light',
        colors: {
            '--primary-color': '#3498db',
            '--secondary-color': '#2ecc71',
            '--background-color': '#f0f2f5',
            '--card-bg-color': '#ffffff',
            '--text-color': '#34495e',
            '--light-text-color': '#7f8c8d',
            '--border-color': '#ecf0f1',
        },
    },
    dark_default: {
        name: 'Varsayılan Koyu',
        mode: 'dark',
        colors: {
            '--primary-color': '#3498db',
            '--secondary-color': '#2ecc71',
            '--background-color': '#2c3e50',
            '--card-bg-color': '#34495e',
            '--text-color': '#ecf0f1',
            '--light-text-color': '#95a5a6',
            '--border-color': '#4a627a',
        },
    },
    light_ocean: {
        name: 'Okyanus Açık',
        mode: 'light',
        colors: {
            '--primary-color': '#1abc9c',
            '--secondary-color': '#f1c40f',
            '--background-color': '#e4f5f5',
            '--card-bg-color': '#ffffff',
            '--text-color': '#3d5252',
            '--light-text-color': '#7a8e8e',
            '--border-color': '#d1e0e0',
        },
    },
    dark_ocean: {
        name: 'Okyanus Koyu',
        mode: 'dark',
        colors: {
            '--primary-color': '#1abc9c',
            '--secondary-color': '#f1c40f',
            '--background-color': '#1f3a3d',
            '--card-bg-color': '#2a4f54',
            '--text-color': '#e4f5f5',
            '--light-text-color': '#88a4a4',
            '--border-color': '#3e6369',
        },
    },
    light_forest: {
        name: 'Orman Açık',
        mode: 'light',
        colors: {
            '--primary-color': '#27ae60',
            '--secondary-color': '#e67e22',
            '--background-color': '#f0faf5',
            '--card-bg-color': '#ffffff',
            '--text-color': '#2c3e50',
            '--light-text-color': '#6c7a89',
            '--border-color': '#e3e8e5',
        },
    },
    dark_forest: {
        name: 'Orman Koyu',
        mode: 'dark',
        colors: {
            '--primary-color': '#27ae60',
            '--secondary-color': '#e67e22',
            '--background-color': '#223028',
            '--card-bg-color': '#2d4035',
            '--text-color': '#f0faf5',
            '--light-text-color': '#8b9b91',
            '--border-color': '#405849',
        },
    },
    light_sunset: {
        name: 'Gün Batımı Açık',
        mode: 'light',
        colors: {
            '--primary-color': '#e74c3c',
            '--secondary-color': '#9b59b6',
            '--background-color': '#fff0eb',
            '--card-bg-color': '#ffffff',
            '--text-color': '#4a2c2c',
            '--light-text-color': '#8c6b6b',
            '--border-color': '#fbe0d5',
        },
    },
    dark_sunset: {
        name: 'Gün Batımı Koyu',
        mode: 'dark',
        colors: {
            '--primary-color': '#e74c3c',
            '--secondary-color': '#9b59b6',
            '--background-color': '#3b2f2f',
            '--card-bg-color': '#523e3e',
            '--text-color': '#fff0eb',
            '--light-text-color': '#d1abab',
            '--border-color': '#6e5454',
        },
    },
};