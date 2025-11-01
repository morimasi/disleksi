import React from 'react';
import { styles } from '../styles';

export const ThemeSelector = ({ themes, activeThemeKey, onThemeChange, onClose }) => {
    const lightThemes = Object.entries(themes).filter(([_, theme]) => theme.mode === 'light');
    const darkThemes = Object.entries(themes).filter(([_, theme]) => theme.mode === 'dark');

    const renderThemeOption = (key, theme) => (
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