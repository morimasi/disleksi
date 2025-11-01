import React from 'react';
import { styles } from '../styles';

export const AppearanceSettings = ({ options, setOptions }) => (
    <div style={styles.appearanceContainer}>
        <div style={styles.settingItem}>
            <label style={styles.settingLabel}>Önizleme Sütun Sayısı: {options.columns}</label>
            <div style={styles.buttonGroup}>
                {[1, 2, 3].map(col => (
                    <button 
                        key={col}
                        onClick={() => setOptions(prev => ({...prev, columns: col}))}
                        style={options.columns === col ? styles.buttonGroupActive : styles.buttonGroupButton}
                    >{col}</button>
                ))}
            </div>
        </div>
        <div style={styles.settingItem}>
            <label htmlFor="fontSize" style={styles.settingLabel}>Yazı Tipi Boyutu: {options.fontSize}px</label>
            <input 
                type="range" id="fontSize" min="12" max="24" step="1" 
                value={options.fontSize} 
                onChange={e => setOptions(prev => ({...prev, fontSize: parseInt(e.target.value)}))}
                style={styles.slider}
            />
        </div>
    </div>
);