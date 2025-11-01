import React from 'react';
import { styles } from '../styles';
import { MODULE_DATA } from '../data/modules';

export const CategorySelector = ({ onSelectCategory }) => (
    <section>
        <h2 style={styles.pageTitle}>Bir alan seçin</h2>
        <div style={styles.cardGrid}>
            {Object.entries(MODULE_DATA).map(([key, { title, icon, color }]) => (
                <div 
                    key={key} 
                    className="categoryCard"
                    style={{...styles.card, borderTop: `5px solid ${color}`}} 
                    onClick={() => onSelectCategory(key)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${title} kategorisini seç`}
                >
                    <span className="category-icon" style={styles.cardIcon}>{icon}</span>
                    <h3 style={styles.cardTitle}>{title}</h3>
                </div>
            ))}
        </div>
    </section>
);
