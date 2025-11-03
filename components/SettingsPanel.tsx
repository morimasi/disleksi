import React from 'react';
import { styles } from '../styles';
import { ALGORITHMIC_SETTINGS } from '../services/settings';
import { ALGORITHMIC_GENERATORS } from '../services/generators';
import { MODULE_DESCRIPTIONS, MODULE_DATA } from '../data/modules';

const Tooltip = ({ text }) => {
    const [visible, setVisible] = React.useState(false);
    return (
        <span 
            style={styles.tooltipIcon} 
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            ⓘ
            {visible && (
                <div style={{
                    position: 'absolute',
                    left: '100%',
                    top: '0',
                    marginLeft: '10px',
                    width: '200px',
                    backgroundColor: 'var(--card-bg-color)',
                    color: 'var(--text-color)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '10px',
                    fontSize: '0.8rem',
                    boxShadow: 'var(--shadow)',
                    zIndex: 100,
                    textAlign: 'left'
                }}>{text}</div>
            )}
        </span>
    );
};


const renderControl = (control, settings, onSettingsChange) => {
    const { id, type, label, options, min, max, step, tooltip } = control;
    const value = settings[id];

    const labelWithTooltip = (
        <label htmlFor={id} style={styles.settingLabel}>
            {label}
            {tooltip && <Tooltip text={tooltip} />}
        </label>
    );

    switch(type) {
        case 'select':
            const isNumeric = typeof control.options[0]?.value === 'number';
            return (
                <div key={id} style={styles.settingControl}>
                    {labelWithTooltip}
                    <select 
                        id={id} 
                        value={value ?? ''} 
                        onChange={e => {
                            const val = isNumeric ? parseInt(e.target.value, 10) : e.target.value;
                            onSettingsChange(prev => ({ ...prev, [id]: val }));
                        }}
                        style={styles.settingInput}
                    >
                        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </div>
            );
        case 'slider':
            return (
                 <div key={id} style={styles.settingControl}>
                    {labelWithTooltip}
                    <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                        <input 
                            type="range"
                            id={id}
                            min={min}
                            max={max}
                            step={step}
                            value={value || min}
                            onChange={e => onSettingsChange(prev => ({ ...prev, [id]: parseFloat(e.target.value) }))}
                            style={styles.settingSlider}
                        />
                        <span style={{width: '40px', textAlign: 'right', color: 'var(--light-text-color)', fontSize: '0.9em'}}>{value || min}</span>
                    </div>
                </div>
            );
        case 'toggle':
            return (
                <div key={id} style={styles.settingToggle}>
                    {labelWithTooltip}
                    <label style={styles.toggleSwitch}>
                        <input 
                            type="checkbox" 
                            checked={!!value}
                            onChange={e => onSettingsChange(prev => ({ ...prev, [id]: e.target.checked }))}
                            style={styles.toggleSwitchInput}
                        />
                        <span style={{...styles.toggleSlider, ...styles.toggleSliderBefore, ...(value ? {backgroundColor: 'var(--primary-color)', transform: 'translateX(20px)'} : {})}}></span>
                    </label>
                </div>
            );
        default:
            return <p>Bilinmeyen kontrol tipi: {type}</p>;
    }
};

export const SettingsPanel = ({ selectedModule, settings, onSettingsChange, onGenerateAi, onGenerateAlgorithmic, isLoading }) => {
    if (!selectedModule) {
        return (
            <aside style={styles.settingsPanel} className="no-print">
                <div style={{...styles.placeholder, minHeight: 'auto', textAlign: 'left', padding: '1rem'}}>
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
            <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                <div style={styles.settingsHeader}>
                    <h2 style={styles.settingsTitle}>{selectedModule.name}</h2>
                    <p style={styles.settingsDescription}>{moduleDescription || 'Bu modül için açıklama bulunamadı.'}</p>
                </div>
                
                <div style={styles.settingsContent}>
                {moduleSettingsConfig ? (
                    moduleSettingsConfig.groups.map(group => (
                        <fieldset key={group.title} style={styles.settingsFieldset}>
                            <legend style={styles.settingsLegend}>{group.title}</legend>
                            {group.controls.map(control => renderControl(control, settings, onSettingsChange))}
                        </fieldset>
                    ))
                ) : (
                    <p style={{color: 'var(--light-text-color)', fontSize: '0.9em'}}>Bu modül için yapılandırılabilir ayar bulunmamaktadır.</p>
                )}
                </div>
            </div>
            
            <div style={styles.generationButtons}>
                <button 
                    onClick={() => onGenerateAi(settings)} 
                    disabled={isLoading} 
                    style={styles.generateButton(category?.color)}
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