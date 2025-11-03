import React from 'react';
import { styles } from '../styles';
import { MODULE_DATA } from '../data/modules';

export const SavedActivityViewer = ({ activity, onBack, onDelete, onDownload, onShare, isProcessingFile }) => {
    const category = MODULE_DATA[activity.categoryKey];
    
    const handlePrint = () => {
        window.print();
    };

    return (
        <div style={styles.fullPageWrapper}>
            <div style={styles.navigationHeader} className="no-print">
                <button onClick={onBack} style={{...styles.backButton, position: 'relative', left: 0}}>&larr; Kaydedilenlere Dön</button>
                <h2 style={styles.pageTitle}>{activity.module}</h2>
            </div>
            
            <div style={styles.viewerActions} className="no-print">
                <p style={{marginBottom: '1rem'}}><strong style={{color: category.color}}>{category.title}</strong> alanı için kaydedilmiş {activity.content.length} sayfa.</p>
                <button onClick={() => onDelete(activity.id)} style={{...styles.deleteButton, padding: '0.7rem 1.2rem', fontSize: '0.9rem', marginRight: '1rem'}} disabled={isProcessingFile}>🗑️ Sil</button>
                <button onClick={handlePrint} style={styles.actionButton} disabled={isProcessingFile}>🖨️ Yazdır</button>
                <button onClick={() => onDownload(activity.content)} style={styles.actionButton} disabled={isProcessingFile}>
                    {isProcessingFile ? 'İşleniyor...' : '📥 İndir (PDF)'}
                </button>
                <button onClick={() => onShare(activity.content)} style={styles.actionButton} disabled={isProcessingFile}>
                    {isProcessingFile ? '...' : '📤 Paylaş'}
                </button>
            </div>
            
            <div className="printable-area" style={styles.viewerWorksheet}>
                 {activity.content.map((pageHtml, itemIndex) => (
                     <div 
                         key={itemIndex} 
                         className="page-a4"
                         style={{
                             width: '210mm',
                             height: '297mm',
                             backgroundColor: 'white',
                             color: 'black', // Ensure text is black for printing
                             boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                         }}
                         dangerouslySetInnerHTML={{ __html: pageHtml }} 
                     />
                 ))}
            </div>
        </div>
    );
};