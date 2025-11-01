import React from 'react';
import { styles } from '../styles';
import { ALGORITHMIC_SETTINGS } from '../services/settings';
import { ALGORITHMIC_GENERATORS } from '../services/generators';
import { MODULE_DESCRIPTIONS, MODULE_DATA } from '../data/modules';

const renderControl = (control, settings, onSettingsChange) => {
    const { id, type, label, options, min, max, step } = control;

    switch(type) {
        case 'select':
            const isNumeric = typeof control.options[0]?.value === 'number';
            return (
                <select 
                    id={id} 
                    value={settings[id] ?? ''} 
                    onChange={e => {
                        const value = isNumeric ? parseInt(e.target.value, 10) : e.target.value;
                        onSettingsChange(prev => ({ ...prev, [id]: value }));
                    }}
                    style={styles.settingInput}
                >
                    {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
            );
        case 'slider':
            return (
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <input 
                        type="range"
                        id={id}
                        min={min}
                        max={max}
                        step={step}
                        value={settings[id] || min}
                        onChange={e => onSettingsChange(prev => ({ ...prev, [id]: parseInt(e.target.value) }))}
                        style={styles.settingSlider}
                    />
                    <span style={{width: '30px', textAlign: 'right'}}>{settings[id] || min}</span>
                </div>
            );
        default:
            return <p>Bilinmeyen kontrol tipi: {type}</p>;
    }
};

export const SettingsPanel = ({ selectedModule, settings, onSettingsChange, onGenerateAi, onGenerateAlgorithmic, isLoading }) => {
    if (!selectedModule) {
        return (
            <aside style={styles.settingsPanel}>
                <div style={{...styles.placeholder, minHeight: 'auto', textAlign: 'left'}}>
                    Başlamak için yukarıdaki menüden bir modül seçin.
                </div>
            </aside>
        );
    }

    const moduleSettingsConfig = ALGORITHMIC_SETTINGS[selectedModule.id];
    const moduleDescription = MODULE_DESCRIPTIONS[selectedModule.id];
    const hasAlgorithm = !!ALGORITHMIC_GENERATORS[selectedModule.id];
    const category = Object.values(MODULE_DATA).find(cat => cat.modules.some(m => m.id === selectedModule.id));


    return (
        <aside style={styles.settingsPanel} className="no-print">
            <div>
                <div style={styles.settingsHeader}>
                    <h2 style={styles.settingsTitle}>{selectedModule.name}</h2>
                    <p style={styles.settingsDescription}>{moduleDescription || 'Bu modül için açıklama bulunamadı.'}</p>
                </div>

                {moduleSettingsConfig && (
                    <div style={styles.settingsGroup}>
                        {moduleSettingsConfig.controls.map(control => (
                            <div key={control.id} style={styles.settingControl}>
                                <label htmlFor={control.id} style={styles.settingLabel}>{control.label}</label>
                                {renderControl(control, settings, onSettingsChange)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <div style={styles.generationButtons}>
                <button 
                    onClick={() => onGenerateAi(settings)} 
                    disabled={isLoading} 
                    style={styles.generateButton(category.color)}
                >
                    {isLoading ? 'Hazırlanıyor...' : '🤖 Yapay Zeka ile Üret'}
                </button>
                 <button 
                    onClick={onGenerateAlgorithmic}
                    style={styles.algorithmicButton}
                    disabled={isLoading || !hasAlgorithm}
                    title={hasAlgorithm ? 'Ayarlara göre anında algoritma ile üret' : 'Bu modül için algoritmik üretici yok'}
                >
                    ⚙️ Algoritma ile Üret
                </button>
            </div>
        </aside>
    );
};