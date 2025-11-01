import React from 'react';
import { styles } from '../styles';

export const ModuleSelector = ({ category, onSelectModule, onBack }) => (
    <section>
        <div style={styles.navigationHeader}>
            <button onClick={onBack} style={styles.backButton}>&larr; Geri</button>
            <h2 style={styles.pageTitle}><span style={{color: category.color, marginRight: '10px'}}>{category.icon}</span>{category.title}</h2>
        </div>
        <div style={styles.cardGrid}>
            {category.modules.map(module => (
                <div 
                    key={module} 
                    style={{...styles.card, ...styles.moduleCard}} 
                    onClick={() => onSelectModule(module)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${module} modülünü seç`}
                >
                    <p style={styles.cardTitle}>{module}</p>
                </div>
            ))}
        </div>
    </section>
);
