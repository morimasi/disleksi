import React, { useState } from 'react';
import { styles } from '../styles';
import { WorkspaceToolbar } from './WorkspaceToolbar';

export const Workspace = ({ 
    selectedModule, 
    isLoading, 
    isProcessingFile,
    error, 
    activityContent, 
    onSave,
    onDownload,
    onShare,
    appearanceSettings,
    onAppearanceChange,
    onContentChange
}) => {
    
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const handlePrint = () => {
        window.print();
    };
    
    if (!selectedModule) {
        return (
            <div style={styles.placeholder}>
                Çalışma sayfası oluşturmak için bir modül seçin.
            </div>
        );
    }
    
    const isContentAvailable = activityContent && activityContent.length > 0;

    return (
        <div style={styles.workspace}>
            <WorkspaceToolbar 
                onSave={onSave} 
                onPrint={handlePrint} 
                onDownload={() => onDownload(activityContent)}
                onShare={() => onShare(activityContent)}
                isContentAvailable={isContentAvailable}
                isProcessingFile={isProcessingFile}
                settings={appearanceSettings}
                onSettingsChange={onAppearanceChange}
            />
            <div className="printable-area" style={styles.worksheetContainer}>
                {isLoading && (
                    <div style={styles.loaderContainer}>
                         <div style={styles.animatedLoader}>
                            <span style={{...styles.loaderIcon, animationDelay: '0s'}}>⚙️</span>
                            <span style={{...styles.loaderIcon, animationDelay: '0.2s'}}>💡</span>
                            <span style={{...styles.loaderIcon, animationDelay: '0.4s'}}>✨</span>
                        </div>
                        <p>Çalışma sayfanız hazırlanıyor...</p>
                    </div>
                )}
                
                {error && <p style={styles.error}>{error}</p>}

                {!isLoading && isContentAvailable && activityContent.map((pageHtml, pageIndex) => (
                    <div 
                       key={pageIndex} 
                       className="page-a4"
                       style={{
                         width: '210mm',
                         minHeight: '297mm',
                         height: '297mm',
                         backgroundColor: 'white',
                         color: 'black', // Ensure text is black for printability regardless of theme
                         boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                         padding: `${appearanceSettings.padding}px`,
                         transform: `scale(${appearanceSettings.scale / 100})`,
                         transformOrigin: 'top center',
                         fontSize: `${appearanceSettings.fontSize}px`,
                         transition: 'transform 0.2s ease, outline 0.2s ease',
                         overflow: 'hidden',
                         outline: editingIndex === pageIndex ? `2px solid ${'var(--primary-color)'}` : 'none',
                         outlineOffset: '2px',
                       }}
                       contentEditable={!isLoading}
                       suppressContentEditableWarning={true}
                       onFocus={() => setEditingIndex(pageIndex)}
                       onBlur={() => setEditingIndex(null)}
                       onInput={(e: React.FormEvent<HTMLDivElement>) => {
                           onContentChange(e.currentTarget.innerHTML, pageIndex);
                       }}
                       dangerouslySetInnerHTML={{ __html: pageHtml }} 
                    />
                ))}

                {!isLoading && !error && !isContentAvailable && (
                    <div style={styles.placeholder}>
                        Çalışma sayfası içeriği burada görünecek.
                    </div>
                )}
            </div>
        </div>
    );
};