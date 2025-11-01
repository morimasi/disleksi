import React, { useState } from 'react';
import { styles } from '../styles';
import { ALGORITHMIC_GENERATORS } from '../services/generators';
import { MODULE_DESCRIPTIONS } from '../data/modules';
import { AppearanceSettings } from './AppearanceSettings';

export const ActivityGenerator = ({ category, module, onGenerateAi, onGenerateAlgorithmic, onBack, onPrint, onSave, isLoading, content, error }) => {
    const hasAlgorithm = !!ALGORITHMIC_GENERATORS[module];
    const moduleDescription = MODULE_DESCRIPTIONS[module] || 'Bu modül için açıklama bulunamadı.';
    const [generationOptions, setGenerationOptions] = useState({
        count: 1,
        columns: 1, // This now means "preview columns for A4 pages"
        fontSize: 16,
    });


    return (
        <section>
            <div style={styles.navigationHeader}>
                <button onClick={onBack} style={styles.backButton}>&larr; Modüllere Dön</button>
                <h2 style={styles.pageTitle}>{module}</h2>
            </div>
            
            <div style={styles.moduleDescriptionContainer}>
                <p style={styles.moduleDescriptionText}>
                    <strong>Amaç:</strong> {moduleDescription}
                </p>
            </div>

            <div style={styles.activityContainer}>
                <div className="activity-controls" style={styles.activityControls}>
                    <p style={styles.activityDescription}>Yeni bir çalışma sayfası oluşturmak için aşağıdaki seçenekleri kullanın.</p>
                    
                    <div style={styles.generationSetup}>
                        <div style={styles.settingItem}>
                            <label htmlFor="activityCount" style={styles.settingLabel}>Sayfa Sayısı:</label>
                            <input 
                                type="number" 
                                id="activityCount"
                                min="1" max="5"
                                value={generationOptions.count}
                                onChange={e => setGenerationOptions(prev => ({...prev, count: parseInt(e.target.value) || 1}))}
                                style={styles.numberInput}
                             />
                        </div>
                        <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                            <button onClick={() => onGenerateAi(generationOptions)} disabled={isLoading} style={styles.generateButton(category.color)}>
                                {isLoading ? 'Hazırlanıyor...' : '🤖 Yapay Zeka ile Üret'}
                            </button>
                            <button 
                                onClick={() => onGenerateAlgorithmic(generationOptions)} 
                                disabled={isLoading || !hasAlgorithm} 
                                style={styles.algorithmicButton}
                                title={hasAlgorithm ? 'Algoritma kullanarak etkinlik üret' : 'Bu modül için algoritmik üretici mevcut değil'}
                            >
                               {isLoading ? 'Hazırlanıyor...' : '⚙️ Algoritma ile Üret'}
                            </button>
                        </div>
                    </div>
                     <hr style={styles.hr}/>
                    <AppearanceSettings options={generationOptions} setOptions={setGenerationOptions} />
                    <hr style={styles.hr}/>

                    {content.length > 0 && 
                        <div style={styles.postGenerationControls}>
                            <button onClick={onSave} style={styles.saveButton}>💾 Kaydet</button>
                            <button onClick={onPrint} style={styles.printButton}>🖨️ Yazdır</button>
                        </div>
                    }
                </div>
                <div 
                    className="printable-area" 
                    style={{
                        ...styles.worksheet, 
                        gridTemplateColumns: `repeat(${generationOptions.columns}, 1fr)`
                    }}
                >
                    {isLoading && (
                        <div style={{...styles.loaderContainer, gridColumn: `1 / -1`}}>
                            <div style={styles.animatedLoader}>
                                <span style={{...styles.loaderIcon, animationDelay: '0s', color: category.color}}>{category.icon}</span>
                                <span style={{...styles.loaderIcon, animationDelay: '0.2s'}}>💡</span>
                                <span style={{...styles.loaderIcon, animationDelay: '0.4s'}}>✨</span>
                            </div>
                            <p style={styles.loaderText}>Sanatçılarımız ve mühendislerimiz<br/>çalışma sayfanızı hazırlıyor...</p>
                        </div>
                    )}
                    {error && <p style={{...styles.error, gridColumn: `1 / -1`}}>{error}</p>}
                    
                    {content.length > 0 && content.map((pageHtml, pageIndex) => (
                         <div 
                            key={pageIndex} 
                            className="page-a4"
                            dangerouslySetInnerHTML={{ __html: pageHtml }} 
                         />
                    ))}

                    {!isLoading && content.length === 0 && <div style={{...styles.placeholder, gridColumn: `1 / -1`}}>Çalışma sayfası içeriği burada görünecek.</div>}
                </div>
            </div>
        </section>
    );
};