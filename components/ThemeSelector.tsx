import React from 'react';
import { styles } from '../styles';
import { type Theme } from '../data/themes';

// Fix: Add explicit types for component props and function parameters to resolve type inference errors.
interface ThemeSelectorProps {
    themes: { [key: string]: Theme };
    activeThemeKey: string;
    onThemeChange: (key: string) => void;
    onClose: () => void;
}

export const ThemeSelector = ({ themes, activeThemeKey, onThemeChange, onClose }: ThemeSelectorProps) => {
    const lightThemes = Object.entries(themes).filter(([_, theme]) => theme.mode === 'light');
    const darkThemes = Object.entries(themes).filter(([_, theme]) => theme.mode === 'dark');

    const renderThemeOption = (key: string, theme: Theme) => (
        <div
            key={key}
            onClick={() => onThemeChange(key)}
            style={{
                ...styles.themeItem,
                ...(activeThemeKey === key ? styles.themeItemActive : {}),
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = styles.themeItemHover.backgroundColor}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
            <div style={{...styles.themeSwatch, backgroundColor: theme.colors['--primary-color']}}></div>
            <span style={styles.themeName}>{theme.name}</span>
        </div>
    );

    return (
        <div style={styles.themeSelectorPopover}>
            <div>
                <h3 style={styles.themeSelectorHeader}>Açık Temalar</h3>
                <div style={styles.themeSelectorGrid}>
                    {lightThemes.map(([key, theme]) => renderThemeOption(key, theme))}
                </div>
            </div>
            <div style={{marginTop: '0.75rem'}}>
                <h3 style={styles.themeSelectorHeader}>Koyu Temalar</h3>
                <div style={styles.themeSelectorGrid}>
                    {darkThemes.map(([key, theme]) => renderThemeOption(key, theme))}
                </div>
            </div>
        </div>
    );
};