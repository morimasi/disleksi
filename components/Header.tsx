import React from 'react';
import { styles } from '../styles';

export const Header = ({ onHomeClick, onShowSavedClick, onShowFeedbackClick, savedCount }) => (
    <header style={styles.header}>
        <div onClick={onHomeClick} style={styles.headerBranding} role="button" tabIndex={0} aria-label="Ana sayfaya dön">
            <h1 style={styles.headerTitle}>Öğrenme Köprüsü</h1>
            <p style={styles.headerSubtitle}>Kişiselleştirilmiş Eğitim Etkinlikleri</p>
        </div>
        <div style={styles.headerNav}>
             <button onClick={onShowFeedbackClick} style={{...styles.navButton, marginRight: '1rem'}}>
                Geri Bildirim
            </button>
            <button onClick={onShowSavedClick} style={styles.navButton} aria-label={`Kaydedilen etkinlikleri göster, ${savedCount} adet`}>
                Kaydedilenler ({savedCount})
            </button>
        </div>
    </header>
);
