import React from 'react';
import { styles } from '../styles';

const ControlSlider = ({ label, icon, value, unit, min, max, step, onChange, settings, settingKey }) => (
    <div style={styles.toolbarControlGroup}>
        <label htmlFor={settingKey} style={styles.toolbarLabel}>
            <span>{icon} {label}</span>
            <span>{value}{unit}</span>
        </label>
        <input
            id={settingKey}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={e => onChange(prev => ({ ...prev, [settingKey]: parseFloat(e.target.value) }))}
            style={styles.toolbarSlider}
        />
    </div>
);

export const WorkspaceToolbar = ({ onSave, onPrint, onDownload, onShare, isContentAvailable, isProcessingFile, settings, onSettingsChange }) => {
    const layoutOptions = [
        { key: 'auto', icon: '🌊', label: 'Otomatik Akış' },
        { key: 'columns-2', icon: '🗧', label: '2 Sütun' },
        { key: 'columns-3', icon: '🗫', label: '3 Sütun' },
        { key: 'grid', icon: '▦', label: 'Dinamik Izgara' },
    ];

    const processingText = 'İşleniyor...';

    return (
        <div style={styles.workspaceToolbar} className="no-print">
            <ControlSlider
                label="Kenar Boşluğu"
                icon="📏"
                value={settings.padding}
                unit="px"
                min={10} max={50} step={1}
                onChange={onSettingsChange}
                settings={settings}
                settingKey="padding"
            />
            <ControlSlider
                label="Önizleme Büyütme"
                icon="🔍"
                value={settings.scale}
                unit="%"
                min={50} max={150} step={1}
                onChange={onSettingsChange}
                settings={settings}
                settingKey="scale"
            />
            <ControlSlider
                label="Öğe Aralığı"
                icon="↔️"
                value={settings.itemSpacing}
                unit="px"
                min={5} max={40} step={1}
                onChange={onSettingsChange}
                settings={settings}
                settingKey="itemSpacing"
            />
            <ControlSlider
                label="Yazı Tipi Boyutu"
                icon="🇦"
                value={settings.fontSize}
                unit="px"
                min={12} max={24} step={1}
                onChange={onSettingsChange}
                settings={settings}
                settingKey="fontSize"
            />

            <div style={styles.toolbarControlGroup}>
                <label style={styles.toolbarLabel}><span>🎨 Sayfa Yerleşimi</span></label>
                <div style={styles.toolbarButtonGroup}>
                    {layoutOptions.map((opt, index) => (
                        <button
                            key={opt.key}
                            title={opt.label}
                            onClick={() => onSettingsChange(prev => ({ ...prev, layout: opt.key }))}
                            style={{
                                ...styles.toolbarButton,
                                ...(settings.layout === opt.key ? styles.toolbarButtonActive : {}),
                                ...(index === layoutOptions.length - 1 ? { borderRight: 'none' } : {})
                            }}
                        >
                            {opt.icon}
                        </button>
                    ))}
                </div>
            </div>

            <div style={styles.toolbarActions}>
                <button 
                    onClick={onSave} 
                    style={styles.actionButton}
                    disabled={!isContentAvailable || isProcessingFile}
                >
                    💾 Kaydet
                </button>
                <button 
                    onClick={onPrint} 
                    style={styles.actionButton}
                    disabled={!isContentAvailable || isProcessingFile}
                >
                    🖨️ Yazdır
                </button>
                <button 
                    onClick={onDownload} 
                    style={styles.actionButton}
                    disabled={!isContentAvailable || isProcessingFile}
                >
                    {isProcessingFile ? processingText : '📥 İndir'}
                </button>
                <button 
                    onClick={onShare} 
                    style={styles.actionButton}
                    disabled={!isContentAvailable || isProcessingFile || !navigator.share}
                    title={!navigator.share ? 'Tarayıcınız bu özelliği desteklemiyor' : 'Etkinliği paylaş'}
                >
                     {isProcessingFile ? '...' : '📤 Paylaş'}
                </button>
            </div>
        </div>
    );
};