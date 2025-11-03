import React, { useState, useEffect, useRef } from 'react';
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
    const pagesContainerRef = useRef<HTMLDivElement>(null);

    // Effect for Drag-and-Drop functionality
    useEffect(() => {
        const container = pagesContainerRef.current;
        if (!container) return;
        
        const controllers: AbortController[] = [];

        if (appearanceSettings.layout === 'grid') {
            const pages = container.querySelectorAll('.page-a4');
            pages.forEach((page, pageIndex) => {
                // Fix: Changed generic type usage to a type assertion to resolve TypeScript error.
                const activityContainer = page.querySelector('[style*="display: grid"], [style*="display: flex"]') as HTMLElement;
                if (!activityContainer) return;

                const items = Array.from(activityContainer.children) as HTMLElement[];
                items.forEach(item => {
                    item.draggable = true;
                    item.style.cursor = 'move';
                });

                let draggedItem: HTMLElement | null = null;
                let dragOverItem: HTMLElement | null = null;

                const controller = new AbortController();
                controllers.push(controller);
                
                const cleanupDragState = () => {
                    if (draggedItem) draggedItem.classList.remove('dragging');
                    if (dragOverItem) dragOverItem.classList.remove('drag-over');
                    draggedItem = null;
                    dragOverItem = null;
                }

                activityContainer.addEventListener('dragstart', (e) => {
                    const target = (e.target as HTMLElement).closest<HTMLElement>('[draggable="true"]');
                    if (target) {
                        draggedItem = target;
                        setTimeout(() => { // timeout to allow DOM to update
                           if(draggedItem) draggedItem.classList.add('dragging');
                        }, 0);
                    }
                }, { signal: controller.signal });

                activityContainer.addEventListener('dragend', cleanupDragState, { signal: controller.signal });

                activityContainer.addEventListener('dragover', (e) => {
                    e.preventDefault();
                }, { signal: controller.signal });

                activityContainer.addEventListener('dragenter', (e) => {
                    const target = (e.target as HTMLElement).closest<HTMLElement>('[draggable="true"]');
                    if (target && target !== draggedItem) {
                        if (dragOverItem) dragOverItem.classList.remove('drag-over');
                        dragOverItem = target;
                        dragOverItem.classList.add('drag-over');
                    }
                }, { signal: controller.signal });


                activityContainer.addEventListener('drop', (e) => {
                    e.preventDefault();
                    const target = (e.target as HTMLElement).closest<HTMLElement>('[draggable="true"]');
                    if (draggedItem && target && target !== draggedItem) {
                        const rect = target.getBoundingClientRect();
                        const offset = e.clientY - rect.top;
                        if (offset > rect.height / 2) {
                            target.after(draggedItem);
                        } else {
                            target.before(draggedItem);
                        }
                        onContentChange((page as HTMLElement).innerHTML, pageIndex);
                    }
                    cleanupDragState();
                }, { signal: controller.signal });
            });
        }

        return () => {
            controllers.forEach(c => c.abort());
        };

    }, [activityContent, appearanceSettings.layout, onContentChange]);

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
            <div ref={pagesContainerRef} className="printable-area" style={styles.worksheetContainer}>
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