import React, { useState, useRef, useEffect } from 'react';
import { styles } from '../styles';
import { MODULE_DATA } from '../data/modules';
import { ThemeSelector } from './ThemeSelector';
import { THEMES } from '../data/themes';

const DropdownMenu = ({ category, onModuleSelect, selectedModuleId, closeMenu }) => {
    return (
        <div style={styles.dropdownMenu}>
            {category.modules.map(module => (
                <a 
                    href="#" 
                    key={module.id} 
                    onClick={(e) => {
                        e.preventDefault();
                        onModuleSelect(module);
                        closeMenu();
                    }}
                    style={{
                        ...styles.moduleLink,
                        ...(selectedModuleId === module.id ? styles.moduleLinkActive : {})
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = selectedModuleId === module.id ? styles.moduleLinkActive.backgroundColor : styles.moduleLinkHover.backgroundColor}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = selectedModuleId === module.id ? styles.moduleLinkActive.backgroundColor : 'transparent'}
                >
                    {module.name}
                </a>
            ))}
        </div>
    );
};

export const TopNavBar = ({ onModuleSelect, onShowSaved, onShowFeedback, savedCount, selectedModuleId, onThemeChange, activeThemeKey }) => {
    const [openMenuKey, setOpenMenuKey] = useState(null);
    const [isThemeSelectorVisible, setThemeSelectorVisible] = useState(false);
    const navRef = useRef(null);

    const handleTabClick = (key) => {
        setThemeSelectorVisible(false);
        setOpenMenuKey(prev => (prev === key ? null : key));
    };

    const handleThemeButtonClick = () => {
        setOpenMenuKey(null);
        setThemeSelectorVisible(prev => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setOpenMenuKey(null);
                setThemeSelectorVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedCategoryKey = selectedModuleId ? Object.keys(MODULE_DATA).find(key => MODULE_DATA[key].modules.some(m => m.id === selectedModuleId)) : null;

    return (
        <nav style={styles.topNav} ref={navRef} className="no-print">
            <div style={styles.topNavBranding}>
                <span style={{fontSize: '1.5rem'}}>🎓</span>
                <h1 style={styles.topNavTitle}>Öğrenme Köprüsü</h1>
            </div>

            <div style={styles.topNavTabs}>
                {Object.entries(MODULE_DATA).map(([key, category]) => (
                    <div key={key} style={{position: 'relative', height: '100%'}}>
                        <button 
                            onClick={() => handleTabClick(key)}
                            style={{
                                ...styles.categoryTab,
                                ...(selectedCategoryKey === key ? styles.categoryTabActive : {})
                            }}
                        >
                            {category.title}
                        </button>
                        {openMenuKey === key && (
                             <DropdownMenu 
                                category={category} 
                                onModuleSelect={onModuleSelect} 
                                selectedModuleId={selectedModuleId}
                                closeMenu={() => setOpenMenuKey(null)}
                            />
                        )}
                    </div>
                ))}
            </div>

            <div style={styles.topNavActions}>
                 <button 
                    onClick={onShowFeedback} 
                    style={styles.topNavButton}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = styles.topNavButtonHover.backgroundColor}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    Geri Bildirim
                </button>
                <button 
                    onClick={onShowSaved} 
                    style={styles.topNavButton}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = styles.topNavButtonHover.backgroundColor}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    Kaydedilenler ({savedCount})
                </button>
                <div style={{position: 'relative'}}>
                    <button 
                        onClick={handleThemeButtonClick} 
                        style={styles.topNavButton}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = styles.topNavButtonHover.backgroundColor}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        🎨 Temalar
                    </button>
                    {isThemeSelectorVisible && (
                        <ThemeSelector 
                            themes={THEMES}
                            activeThemeKey={activeThemeKey}
                            onThemeChange={onThemeChange}
                            onClose={() => setThemeSelectorVisible(false)}
                        />
                    )}
                </div>
            </div>
        </nav>
    );
};