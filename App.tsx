




import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { MODULE_DATA } from './data/modules';
import { ALGORITHMIC_GENERATORS } from './services/generators';
import { ALGORITHMIC_SETTINGS } from './services/settings';
import { generateAiPrompt } from './services/aiPromptGenerator';
import { styles } from './styles';
import { THEMES } from './data/themes';

import { TopNavBar } from './components/TopNavBar';
import { SettingsPanel } from './components/SettingsPanel';
import { Workspace } from './components/Workspace';
import { SavedActivitiesList } from './components/SavedActivitiesList';
import { SavedActivityViewer } from './components/SavedActivityViewer';
import { FeedbackForm } from './components/FeedbackForm';

export const App = () => {
    const [selectedModule, setSelectedModule] = useState(null);
    const [moduleSettings, setModuleSettings] = useState<Record<string, any>>({});
    const [activityContent, setActivityContent] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessingFile, setIsProcessingFile] = useState(false);
    const [error, setError] = useState('');
    const [currentView, setCurrentView] = useState('workspace'); // workspace, saved, feedback
    const [viewingSavedActivity, setViewingSavedActivity] = useState(null);
    const [appearanceSettings, setAppearanceSettings] = useState({
        padding: 25,      // px
        scale: 100,       // %
        itemSpacing: 15,  // px
        fontSize: 16,     // px
        layout: 'auto',   // 'auto', 'columns-2', 'columns-3', 'grid'
    });
     const [themeKey, setThemeKey] = useState(() => {
        return localStorage.getItem('öğrenmeKöprüsü-tema') || 'light_default';
    });


    const [savedActivities, setSavedActivities] = useState(() => {
        try {
            const saved = localStorage.getItem('öğrenmeKöprüsü-etkinlikler');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            // Fix: Handle unknown error type in catch block
            console.error("Kaydedilmiş etkinlikler yüklenemedi:", String(error));
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('öğrenmeKöprüsü-etkinlikler', JSON.stringify(savedActivities));
        } catch (error) {
            // Fix: Handle unknown error type in catch block
            console.error("Etkinlikler kaydedilemedi:", String(error));
        }
    }, [savedActivities]);
    
    useEffect(() => {
        const theme = THEMES[themeKey];
        if (theme) {
            localStorage.setItem('öğrenmeKöprüsü-tema', themeKey);
            for (const [key, value] of Object.entries(theme.colors)) {
                document.documentElement.style.setProperty(key, value);
            }
        }
    }, [themeKey]);
    
    const handleThemeChange = (key) => {
        setThemeKey(key);
    };

    const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY }), []);

    const handleModuleSelect = (module) => {
        if (selectedModule?.id === module.id) return;
        
        setSelectedModule(module);
        setError('');
        setActivityContent([]);
        setViewingSavedActivity(null);

        const newSettings = ALGORITHMIC_SETTINGS[module.id]?.defaultSettings || {};
        setModuleSettings(newSettings);
        
        if(currentView !== 'workspace') {
            setCurrentView('workspace');
        }
    };
    
    const handleGenerateAlgorithmic = useCallback(() => {
        if (!selectedModule) return;
    
        // 1. Find the generator for the specific selected module
        const specificGenerator = ALGORITHMIC_GENERATORS[selectedModule.id];
    
        if (!specificGenerator || typeof specificGenerator !== 'function') {
            setError('Bu modül için algoritmik üretici bulunamadı.');
            setActivityContent([]);
            return;
        }
    
        // Still need category for the title
        const categoryKey = Object.keys(MODULE_DATA).find(key => 
            MODULE_DATA[key].modules.some(m => m.id === selectedModule.id)
        );
        if (!categoryKey) {
            setError('Modül kategorisi bulunamadı.');
            return;
        }
    
        try {
            const totalItemCount = moduleSettings.problemCount || 12; // Default to 12 activities
            
            // 3. Generate a list of activities using only the specific generator
            const activitiesHtmlList = [];
            for (let i = 0; i < totalItemCount; i++) {
                // Generate content with current settings
                const generatedItem = specificGenerator(moduleSettings);
                if (generatedItem && generatedItem.html) {
                    activitiesHtmlList.push(generatedItem.html);
                }
            }
            
            // 4. Paginate and apply layout
            const activitiesPerPage = 6; // A reasonable estimate for an A4 page
            const totalPages = Math.ceil(activitiesHtmlList.length / activitiesPerPage);
            const pages = [];
            const { layout, itemSpacing } = appearanceSettings;
            
            let gridStyle = '';
            switch(layout) {
                case 'columns-2':
                    gridStyle = `display: grid; grid-template-columns: 1fr 1fr; gap: ${itemSpacing}px;`;
                    break;
                case 'columns-3':
                    gridStyle = `display: grid; grid-template-columns: 1fr 1fr 1fr; gap: ${itemSpacing}px;`;
                    break;
                case 'grid':
                    gridStyle = `display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: ${itemSpacing}px;`;
                    break;
                case 'auto':
                default:
                    gridStyle = `display: flex; flex-wrap: wrap; gap: ${itemSpacing}px;`;
            }
    
            for (let i = 0; i < totalPages; i++) {
                const startIndex = i * activitiesPerPage;
                const endIndex = startIndex + activitiesPerPage;
                const pageActivities = activitiesHtmlList.slice(startIndex, endIndex);
    
                const pageHtml = `
                <div style="font-family: 'Poppins', sans-serif; height: 100%; display: flex; flex-direction: column;">
                    <h2 style="text-align: center; color: ${MODULE_DATA[categoryKey]?.color || '#333'}; margin-bottom: 20px; flex-shrink: 0;">${selectedModule.name} Alıştırmaları ${totalPages > 1 ? `(${i + 1}/${totalPages})` : ''}</h2>
                    <div style="${gridStyle} flex-grow: 1;">
                        ${pageActivities.join('')}
                    </div>
                </div>`;
                pages.push(pageHtml);
            }
    
            setActivityContent(pages);
            setError('');
        } catch (e) {
            // Fix: Handle unknown error type in catch block
            console.error(String(e));
            setError('Algoritmik etkinlik oluşturulurken bir hata oluştu.');
            setActivityContent([]);
        }
    }, [selectedModule, moduleSettings, appearanceSettings]);
    
    const handleActivityContentChange = (newHtml: string, index: number) => {
        setActivityContent(currentContent => {
            const updatedContent = [...currentContent];
            if (updatedContent[index] !== newHtml) {
                updatedContent[index] = newHtml;
                return updatedContent;
            }
            return currentContent;
        });
    };

    const generateAiActivity = async (settings) => {
        if (!selectedModule) return;
        setIsLoading(true);
        setError('');
        setActivityContent([]);
        
        const cappedSettings = { ...settings };
        if (typeof cappedSettings.density === 'number' && cappedSettings.density > 1.0) {
            cappedSettings.density = 1.0;
        }

        const prompt = generateAiPrompt(selectedModule, cappedSettings, appearanceSettings);

        try {
            const stream = await ai.models.generateContentStream({
                model: 'gemini-2.5-pro',
                contents: prompt,
            });

            let fullText = '';
            for await (const chunk of stream) {
                fullText += chunk.text;
                setActivityContent(fullText.split('<!-- PAGE_BREAK -->'));
            }
        } catch (e) {
            // Fix: Handle unknown error type in catch block
            console.error(String(e));
            setError('Yapay zeka ile etkinlik oluşturulurken bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSaveActivity = () => {
        if (activityContent.length === 0 || !selectedModule) return;
        
        const categoryKey = Object.keys(MODULE_DATA).find(key => 
            MODULE_DATA[key].modules.some(m => m.id === selectedModule.id)
        );

        if (!categoryKey) {
            alert("Etkinlik kategorisi bulunamadığı için kaydedilemedi.");
            return;
        }

        const newActivity = {
            id: Date.now(),
            categoryKey: categoryKey,
            module: selectedModule.name,
            content: activityContent,
        };
        setSavedActivities(prev => [newActivity, ...prev]);
        alert(`${activityContent.length} sayfa kaydedildi!`);
    };
    
    const handleDeleteActivity = (id) => {
        if (!confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) return;
        setSavedActivities(prev => prev.filter(activity => activity.id !== id));
        if (viewingSavedActivity && viewingSavedActivity.id === id) {
            setViewingSavedActivity(null);
            setCurrentView('saved'); 
        }
    };
    
    const generatePdfBlob = async (contentToProcess) => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const a4Width = 210;
        const a4Height = 297;

        for (let i = 0; i < contentToProcess.length; i++) {
            const pageHtml = contentToProcess[i];
            const tempContainer = document.createElement('div');
            
            Object.assign(tempContainer.style, {
                position: 'absolute',
                left: '-9999px',
                top: '0',
                width: `${a4Width}mm`,
                height: `${a4Height}mm`,
                backgroundColor: 'white',
                color: 'black',
                padding: `${appearanceSettings.padding}px`,
                fontSize: `${appearanceSettings.fontSize}px`,
            });
            
            tempContainer.innerHTML = pageHtml;
            document.body.appendChild(tempContainer);

            const canvas = await html2canvas(tempContainer, {
                scale: 2,
                useCORS: true,
                width: tempContainer.offsetWidth,
                height: tempContainer.offsetHeight,
            });
            
            document.body.removeChild(tempContainer);
            
            const imgData = canvas.toDataURL('image/png');
            if (i > 0) {
                pdf.addPage();
            }
            pdf.addImage(imgData, 'PNG', 0, 0, a4Width, a4Height);
        }
        return pdf;
    };

    const handleDownloadPdf = async (contentToDownload) => {
        if (!contentToDownload || contentToDownload.length === 0) return;
        setIsProcessingFile(true);
        try {
            const pdf = await generatePdfBlob(contentToDownload);
            pdf.save('ogrenme-koprusu-etkinlik.pdf');
        } catch(e) {
            // Fix: Handle unknown error type in catch block
            console.error("PDF oluşturulurken hata:", String(e));
            setError("PDF oluşturulurken bir hata oluştu.");
        } finally {
            setIsProcessingFile(false);
        }
    };

    const handleShare = async (contentToShare) => {
        if (!contentToShare || contentToShare.length === 0) return;

        if (!navigator.share) {
            alert('Tarayıcınız paylaşma özelliğini desteklemiyor.');
            return;
        }
        
        setIsProcessingFile(true);
        try {
            const pdf = await generatePdfBlob(contentToShare);
            const pdfBlob = pdf.output('blob');
            const file = new File([pdfBlob], 'etkinlik.pdf', { type: 'application/pdf' });
            
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'Öğrenme Köprüsü Etkinliği',
                    text: 'Öğrenme Köprüsü ile oluşturulan bir etkinlik.',
                    files: [file],
                });
            } else {
                 alert('Bu dosya paylaşılamıyor.');
            }
        } catch (e) {
            // Fix: Handle unknown error type and check for AbortError safely
            if (e instanceof Error && e.name === 'AbortError') {
                // This is expected when user cancels the share dialog, so we do nothing.
            } else {
                console.error("Paylaşım sırasında hata:", String(e));
                setError("Etkinlik paylaşılırken bir hata oluştu.");
            }
        } finally {
             setIsProcessingFile(false);
        }
    };


    const renderMainContent = () => {
        switch (currentView) {
            case 'saved':
                if (viewingSavedActivity) {
                    return <SavedActivityViewer 
                        activity={viewingSavedActivity}
                        onBack={() => setViewingSavedActivity(null)}
                        onDelete={handleDeleteActivity}
                        onDownload={handleDownloadPdf}
                        onShare={handleShare}
                        isProcessingFile={isProcessingFile}
                    />;
                }
                return <SavedActivitiesList 
                    activities={savedActivities}
                    onView={(activity) => {
                        setViewingSavedActivity(activity);
                    }}
                    onDelete={handleDeleteActivity}
                />;
            case 'feedback':
                return <FeedbackForm onClose={() => setCurrentView('workspace')} />;
            case 'workspace':
            default:
                return <Workspace
                    selectedModule={selectedModule}
                    isLoading={isLoading}
                    isProcessingFile={isProcessingFile}
                    error={error}
                    activityContent={activityContent}
                    onSave={handleSaveActivity}
                    onDownload={handleDownloadPdf}
                    onShare={handleShare}
                    appearanceSettings={appearanceSettings}
                    onAppearanceChange={setAppearanceSettings}
                    onContentChange={handleActivityContentChange}
                 />;
        }
    };
    
    return (
        <div style={styles.appContainer}>
            <TopNavBar 
                onModuleSelect={handleModuleSelect}
                onShowSaved={() => {
                    setCurrentView('saved');
                    setViewingSavedActivity(null);
                    setSelectedModule(null);
                }}
                onShowFeedback={() => setCurrentView('feedback')}
                savedCount={savedActivities.length}
                selectedModuleId={selectedModule?.id}
                onThemeChange={handleThemeChange}
                activeThemeKey={themeKey}
            />
            <div style={styles.appLayout}>
                <SettingsPanel
                    selectedModule={selectedModule}
                    settings={moduleSettings}
                    onSettingsChange={setModuleSettings}
                    onGenerateAi={generateAiActivity}
                    onGenerateAlgorithmic={handleGenerateAlgorithmic}
                    isLoading={isLoading}
                />
                <main style={styles.mainContentArea}>
                   {renderMainContent()}
                </main>
            </div>
        </div>
    );
};