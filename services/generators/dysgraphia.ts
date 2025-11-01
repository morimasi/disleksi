const defaultOptions = {
    fineMotor: { pathComplexity: 'medium', theme: 'animals' },
    letterFormation: { letter: 'a', case: 'lowercase', style: 'dotted' },
};

export const generateFineMotorActivity = (options = defaultOptions.fineMotor) => {
    const activityType = Math.random();

    if (activityType < 0.6) { // Path Tracing
        const paths = {
            simple: "M 10 40 Q 150 40, 290 40",
            medium: "M 10 40 Q 75 0, 150 40 T 290 40",
            complex: "M 10 50 C 40 10, 80 80, 150 30 S 220 -20, 290 50"
        };
        
        const themes = {
            animals: { start: '🐌', end: '🥬', title: 'Salyangozu Marula Ulaştır' },
            vehicles: { start: '🚗', end: '🏠', title: 'Arabayı Eve Götür' },
            nature: { start: '🦋', end: '🌸', title: 'Kelebeği Çiçeğe Kondur' },
            space: { start: '🚀', end: '🪐', title: 'Roketi Gezegene Uçur' },
        };
        
        const selectedPath = paths[options.pathComplexity] || paths.medium;
        const selectedTheme = themes[options.theme] || themes.animals;
        
        return {
            html: `
            <div style="border: 1px solid #e0e0e0; border-radius: 10px; padding: 10px; background-color: #fdfdfd; text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: center;">
                <p style="font-size: 0.9em; font-weight: 500; color: #27ae60; margin-bottom: 10px;">${selectedTheme.title}</p>
                <svg width="100%" height="60" viewBox="0 0 300 60">
                    <path d="${selectedPath}" stroke="#bdc3c7" stroke-width="3" fill="none" stroke-dasharray="6,6" stroke-linecap="round" />
                     <text x="0" y="45" font-size="20">${selectedTheme.start}</text>
                     <text x="290" y="45" font-size="20">${selectedTheme.end}</text>
                </svg>
            </div>`,
            layoutHint: { min: 3, max: 6 }
        };
    } else { // Connect the Dots
        const shapes = [
            { title: "Evi oluşturmak için noktaları birleştir.", points: "50,10 90,50 70,50 70,90 30,90 30,50 10,50 50,10" },
            { title: "Yıldızı oluşturmak için noktaları birleştir.", points: "50,10 60,40 90,40 65,60 75,90 50,75 25,90 35,60 10,40 40,40 50,10" }
        ];
        const selectedShape = shapes[Math.floor(Math.random() * shapes.length)];
        // FIX: Convert string coordinates to numbers for arithmetic operations.
        const pointsArray = selectedShape.points.split(' ').map(p => p.split(',').map(Number));

        let dotsSvg = '';
        pointsArray.forEach((p, i) => {
            dotsSvg += `<g><circle cx="${p[0]}" cy="${p[1]}" r="3" fill="black" /><text x="${p[0]}" y="${p[1] - 5}" text-anchor="middle" font-size="10">${i+1}</text></g>`;
        });

        return {
            html: `
            <div style="border: 1px solid #e0e0e0; border-radius: 10px; padding: 10px; background-color: #fdfdfd; text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: center;">
                <p style="font-size: 0.9em; font-weight: 500; color: #27ae60; margin-bottom: 10px;">${selectedShape.title}</p>
                <svg width="100%" height="100" viewBox="0 0 100 100">
                    ${dotsSvg}
                </svg>
            </div>`,
            layoutHint: { min: 2, max: 4 }
        }
    }
};

export const generateLetterFormationActivity = (options = defaultOptions.letterFormation) => {
    const activityType = Math.random();

    const letters = ['a', 'b', 'c', 'd', 'e', 'k', 'l', 'm', 's', 't', 'u', 'y'];
    let letter = options.letter && letters.includes(options.letter.toLowerCase()) ? options.letter : letters[0];
    if(options.case === 'uppercase') {
        letter = letter.toUpperCase();
    }

    if (activityType < 0.6) { // Standard formation practice
        let content = '';
        switch(options.style) {
            case 'dotted':
                content = `<p style="font-size: 4em; font-family: 'Comic Sans MS', cursive, sans-serif; color: #ccc; margin: 0; line-height:1; border-bottom: 2px dashed #bdc3c7;">${letter}</p>`;
                break;
            case 'arrows':
                // Simple arrow simulation
                content = `<p style="font-size: 4em; font-family: 'Comic Sans MS', cursive, sans-serif; color: #7f8c8d; margin: 0; line-height:1; border-bottom: 2px solid #bdc3c7; position:relative;">${letter}<span style="position: absolute; top: -10px; left: 5px; color: #e74c3c; font-size: 0.5em;">↓</span></p>`;
                break;
            case 'simple':
            default:
                 content = `<div style="width: 100%; height: 4em; border-bottom: 2px solid #bdc3c7;"></div>`;
        }

        return {
            html: `
            <div style="border: 1px solid #e0e0e0; border-radius: 10px; padding: 10px; background-color: #fdfdfd; text-align: center; height: 100%;">
               ${content}
            </div>`,
            layoutHint: { min: 8, max: 15 }
        };
    } else { // Find the correct letter
        const correct = `<span style="font-family: 'Comic Sans MS', cursive, sans-serif;">${letter}</span>`;
        const incorrects = [
            `<span style="transform: scaleX(-1); display: inline-block; font-family: 'Comic Sans MS', cursive, sans-serif;">${letter}</span>`, // Flipped
            `<span style="text-decoration: line-through; color: #bdc3c7; font-family: 'Comic Sans MS', cursive, sans-serif;">${letter}</span>`, // Incomplete (simulated)
            `<span style="transform: rotate(15deg); display: inline-block; font-family: 'Comic Sans MS', cursive, sans-serif;">${letter}</span>` // Tilted
        ];
        const options = [correct, ...incorrects].sort(() => Math.random() - 0.5);

        return {
            html: `
            <div style="border: 1px solid #e0e0e0; border-radius: 10px; padding: 10px; background-color: #fdfdfd; text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: center;">
                <p style="font-size: 0.9em; font-weight: 500; color: #27ae60; margin-bottom: 10px;">Doğru yazılmış olan '${letter}' harfini daire içine al.</p>
                <div style="display: flex; justify-content: space-around; align-items: center; font-size: 3em;">
                    ${options.join('')}
                </div>
            </div>`,
            layoutHint: { min: 2, max: 4 }
        }
    }
};

export const generatePictureSequencingActivity = (options = {}) => {
    const scenarios = [
        {
            title: 'Sandviç yapma adımlarını sırala.',
            steps: [
                { svg: '<rect x="5" y="40" width="90" height="50" fill="#f5deb3" /><rect x="5" y="10" width="90" height="20" fill="#f5deb3" />', label: 'Ekmek' },
                { svg: '<rect x="5" y="40" width="90" height="50" fill="#f5deb3" /><rect x="15" y="50" width="70" height="30" fill="#8b4513" />', label: 'Çikolata Sür' },
                { svg: '<rect x="5" y="40" width="90" height="50" fill="#f5deb3" /><rect x="15" y="50" width="70" height="30" fill="#8b4513" /><rect x="5" y="10" width="90" height="20" fill="#f5deb3" />', label: 'Kapat' }
            ]
        },
        {
            title: 'Diş fırçalama adımlarını sırala.',
            steps: [
                { svg: '<rect x="20" y="60" width="60" height="30" fill="#e0e0e0" /><rect x="25" y="10" width="10" height="50" fill="#3498db" /><circle cx="50" cy="75" r="10" fill="#3498db" />', label: 'Fırçaya macun sık' },
                { svg: '<circle cx="30" cy="30" r="10" fill="white" stroke="black" /><circle cx="70" cy="30" r="10" fill="white" stroke="black"/><path d="M 20,50 Q 50,70 80,50" fill="none" stroke="black" />', label: 'Dişleri fırçala' },
                { svg: '<path d="M20,80 C40,40 60,40 80,80" fill="#3498db" /><path d="M30,70 C40,50 60,50 70,70" fill="#3498db" />', label: 'Ağzı çalkala' }
            ]
        },
        {
            title: 'Çiçek ekme adımlarını sırala.',
            steps: [
                { svg: '<path d="M10,90 L90,90 L80,50 L20,50 Z" fill="#8b4513" /><rect x="25" y="40" width="50" height="10" fill="#a0522d" />', label: 'Saksıya toprak koy' },
                { svg: '<circle cx="50" cy="30" r="10" fill="#d2691e" /><path d="M10,90 L90,90 L80,50 L20,50 Z" fill="#8b4513" /><rect x="25" y="40" width="50" height="10" fill="#a0522d" />', label: 'Tohumu ek' },
                { svg: '<path d="M20,80 C30,60 10,40 25,20" stroke="#3498db" stroke-width="4" fill="none" /><path d="M10,90 L90,90 L80,50 L20,50 Z" fill="#8b4513" /><rect x="25" y="40" width="50" height="10" fill="#a0522d" />', label: 'Su ver' }
            ]
        }
    ];
    
    const selectedScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    const shuffled = [...selectedScenario.steps].sort(() => Math.random() - 0.5);
    return {
        html: `
        <div style="border: 1px solid #e0e0e0; border-radius: 10px; padding: 15px; background-color: #fdfdfd; text-align: center;">
            <p style="font-size: 0.9em; margin-bottom: 10px;">${selectedScenario.title} (1, 2, 3)</p>
            <div style="display: flex; justify-content: space-around; align-items: flex-end; gap: 10px;">
                ${shuffled.map(step => `
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 5px;">
                        <div style="width: 60px; height: 60px; border: 1px solid #ccc; border-radius: 5px; display:flex; align-items:center; justify-content:center; background: #fafafa;">
                          <svg width="50" height="50" viewBox="0 0 100 100">${step.svg}</svg>
                        </div>
                        <div style="width: 30px; height: 30px; border: 2px solid #95a5a6; border-radius: 5px;"></div>
                    </div>
                `).join('')}
            </div>
        </div>`,
        layoutHint: { min: 1, max: 2 }
    };
};

export const generateSentenceBuildingActivity = (options = {}) => {
    const activityType = Math.random();

    if (activityType < 0.6) { // Unscramble words
        const sentences = [
            ['kedi', 'süt', 'içti'],
            ['Ali', 'top', 'oynadı'],
            ['güneş', 'parlıyor', 'gökyüzünde']
        ];
        const selected = sentences[Math.floor(Math.random() * sentences.length)];
        const shuffled = [...selected].sort(() => Math.random() - 0.5);
        return {
            html: `
            <div style="border: 1px solid #e0e0e0; border-radius: 10px; padding: 15px; background-color: #fdfdfd; text-align: center;">
                <p style="font-size: 0.9em; margin-bottom: 10px;">Kelimeleri sıralayarak anlamlı bir cümle kur.</p>
                <div style="display: flex; gap: 10px; justify-content: center; padding: 10px; background-color: #f8f9fa; border-radius: 5px; margin-bottom: 15px;">
                    ${shuffled.map(word => `<span style="border: 1px solid #ccc; padding: 5px 10px; border-radius: 5px; background: white;">${word}</span>`).join('')}
                </div>
                <div style="width: 100%; border-bottom: 2px solid #34495e; min-height: 24px;"></div>
            </div>`,
            layoutHint: { min: 3, max: 5 }
        };
    } else { // Complete the sentence
        const sentenceStarts = [
            'Köpek bahçede ',
            'Annem pazardan ',
            'Yarın okula ',
            'Kırmızı araba çok ',
        ];
        const selected = sentenceStarts[Math.floor(Math.random() * sentenceStarts.length)];
        return {
            html: `
            <div style="border: 1px solid #e0e0e0; border-radius: 10px; padding: 15px; background-color: #fdfdfd; text-align: center;">
                <p style="font-size: 0.9em; margin-bottom: 10px;">Cümlenin sonunu anlamlı bir şekilde tamamla.</p>
                <div style="font-size: 1.2em; background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
                    <span>${selected}</span><span style="display: inline-block; width: 60%; border-bottom: 2px solid #34495e; min-height: 24px; vertical-align: bottom;"></span>
                </div>
            </div>`,
            layoutHint: { min: 2, max: 4 }
        };
    }
};

export const generatePunctuationActivity = (options = {}) => {
    const activityType = Math.random();
    
    if (activityType < 0.6) { // Type 1: Add punctuation mark
        const sentences = [
            { text: "Bugün hava çok güzel", punctuation: "." },
            { text: "Okula gittin mi", punctuation: "?" },
            { text: "Köpeğin adı ne", punctuation: "?" },
            { text: "Annem eve geldi", punctuation: "." },
        ];
        const selected = sentences[Math.floor(Math.random() * sentences.length)];
        return {
            html: `
            <div style="border: 1px solid #e0e0e0; border-radius: 10px; padding: 15px; background-color: #fdfdfd; text-align: center;">
                 <p style="font-size: 0.9em; margin-bottom: 10px;">Cümlenin sonuna uygun işareti koy. (. / ?)</p>
                 <div style="display: flex; align-items: center; justify-content: center; gap: 5px; font-size: 1.2em; background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
                    <span>${selected.text}</span>
                    <div style="width: 25px; height: 25px; border: 2px solid #95a5a6; border-radius: 5px;"></div>
                 </div>
            </div>`,
            layoutHint: { min: 2, max: 4 }
        };
    } else { // Type 2: Capitalize first letter and add punctuation
         const sentences = [
            { text: "kedi süt içti", correct: "Kedi süt içti." },
            { text: "yarın okul var mı", correct: "Yarın okul var mı?" },
            { text: "ali parka gitti", correct: "Ali parka gitti." },
            { text: "ankara türkiyenin başkenti mi", correct: "Ankara Türkiye'nin başkenti mi?" },
        ];
        const selected = sentences[Math.floor(Math.random() * sentences.length)];
         return {
            html: `
            <div style="border: 1px solid #e0e0e0; border-radius: 10px; padding: 15px; background-color: #fdfdfd; text-align: center;">
                 <p style="font-size: 0.9em; margin-bottom: 10px;">Cümleyi düzeltip yeniden yaz.</p>
                 <p style="font-size: 1.2em; background-color: #f8f9fa; padding: 10px; border-radius: 5px; margin-bottom: 15px; color: #7f8c8d;">${selected.text}</p>
                 <div style="width: 100%; border-bottom: 2px solid #34495e; min-height: 24px;"></div>
            </div>`,
            layoutHint: { min: 2, max: 4 }
        };
    }
};

export const generateCreativeWritingActivity = (options = {}) => {
    const prompts = [
        {
            title: 'Bu resim hakkında kısa bir hikaye yaz.',
            svg: '<path d="M50,95 C20,95 20,70 20,70 L20,40 C20,10 50,10 50,10 C80,10 80,40 80,40 L80,70 C80,70 80,95 50,95 Z" fill="#a0522d" /><circle cx="65" cy="55" r="5" fill="#f1c40f" />' // Door
        },
        {
            title: 'Bu uzay gemisi nereye gidiyor? Anlat.',
            svg: '<polygon points="50,10 70,50 60,50 60,80 40,80 40,50 30,50" fill="#7f8c8d" /><polygon points="50,70 60,90 40,90" fill="#f39c12" />' // Rocket
        },
        {
            title: 'Sihirli ağacın içinde ne var? Hayal et ve yaz.',
            svg: '<path d="M60,90 C40,90 30,70 40,50 S60,20 70,30 S90,50 80,70 S80,90 60,90" fill="#27ae60" /><rect x="25" y="70" width="30" height="20" fill="#8b4513" />' // Tree
        }
    ];
    const selected = prompts[Math.floor(Math.random() * prompts.length)];
    return {
        html: `
        <div style="border: 1px solid #e0e0e0; border-radius: 10px; padding: 15px; background-color: #fdfdfd; text-align: center; height: 100%; display: flex; flex-direction: column;">
            <p style="font-size: 0.9em; font-weight: 500; margin-bottom: 10px;">${selected.title}</p>
            <div style="flex-shrink: 0; margin-bottom: 10px;">
                <svg width="80" height="80" viewBox="0 0 100 100">${selected.svg}</svg>
            </div>
            <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 12px; background-image: linear-gradient(to bottom, #95a5a6 1px, transparent 1px); background-size: 100% 24px; padding-top: 10px;">
                
            </div>
        </div>`,
        layoutHint: { min: 1, max: 2 }
    };
};