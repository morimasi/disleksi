const defaultOptions = {
    fineMotor: { pathComplexity: 'medium', theme: 'animals' },
    letterFormation: { letter: 'a', case: 'lowercase', style: 'dotted' },
};

const _generatePathTracingActivity = (options = defaultOptions.fineMotor) => {
    const paths = {
        simple: "M 10 40 Q 150 40, 290 40",
        medium: "M 10 40 Q 75 0, 150 40 T 290 40",
        complex: "M 10 50 C 40 10, 80 80, 150 30 S 220 -20, 290 50",
        zigzag: "M 10 40 L 60 10 L 110 40 L 160 10 L 210 40 L 260 10 L 290 40",
        loop: "M 10 30 C 10 50, 70 50, 70 30 S 130 10, 130 30 S 190 50, 190 30 S 250 10, 250 30 S 290 50, 290 30"
    };
    
    const themes = {
        animals: { start: '🐌', end: '🥬', title: 'Salyangozu Marula Ulaştır' },
        vehicles: { start: '🚗', end: '🏠', title: 'Arabayı Eve Götür' },
        nature: { start: '🦋', end: '🌸', title: 'Kelebeği Çiçeğe Kondur' },
        space: { start: '🚀', end: '🪐', title: 'Roketi Gezegene Uçur' },
        sports: { start: '⚽', end: '🥅', title: 'Topu Kaleye Götür' },
    };
    
    const pathKeys = Object.keys(paths);
    const selectedPathKey = options.pathComplexity === 'random' ? pathKeys[Math.floor(Math.random() * pathKeys.length)] : (options.pathComplexity || 'medium');
    const selectedPath = paths[selectedPathKey] || paths.medium;

    const themeKeys = Object.keys(themes);
    const selectedThemeKey = options.theme === 'random' ? themeKeys[Math.floor(Math.random() * themeKeys.length)] : (options.theme || 'animals');
    const selectedTheme = themes[selectedThemeKey] || themes.animals;
    
    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; background-color: var(--card-bg-color); text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: center;">
            <p style="font-size: 0.9em; font-weight: 500; color: var(--secondary-color); margin-bottom: 10px;">${selectedTheme.title}</p>
            <svg width="100%" height="60" viewBox="0 0 300 60">
                <path d="${selectedPath}" stroke="var(--light-text-color)" stroke-width="3" fill="none" stroke-dasharray="6,6" stroke-linecap="round" />
                 <text x="0" y="45" font-size="20">${selectedTheme.start}</text>
                 <text x="290" y="45" font-size="20">${selectedTheme.end}</text>
            </svg>
        </div>`,
        layoutHint: { min: 3, max: 6 }
    };
};

const _generateConnectTheDotsActivity = (options = defaultOptions.fineMotor) => {
    const shapes = [
        { title: "Evi oluşturmak için noktaları birleştir.", points: "50,10 90,50 70,50 70,90 30,90 30,50 10,50 50,10" },
        { title: "Yıldızı oluşturmak için noktaları birleştir.", points: "50,10 60,40 90,40 65,60 75,90 50,75 25,90 35,60 10,40 40,40 50,10" },
        { title: "Balığı oluşturmak için noktaları birleştir.", points: "10,50 30,30 70,40 90,50 70,60 30,70 10,50" },
        { title: "Tekneyi oluşturmak için noktaları birleştir.", points: "10,70 90,70 70,50 30,50 10,70 50,50 50,20" }
    ];
    const selectedShape = shapes[Math.floor(Math.random() * shapes.length)];
    const pointsArray = selectedShape.points.split(' ').map(p => p.split(',').map(Number));

    let dotsSvg = '';
    pointsArray.forEach((p, i) => {
        dotsSvg += `<g><circle cx="${p[0]}" cy="${p[1]}" r="3" fill="var(--text-color)" /><text x="${p[0]}" y="${p[1] - 5}" text-anchor="middle" font-size="10" fill="var(--text-color)">${i+1}</text></g>`;
    });

    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; background-color: var(--card-bg-color); text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: center;">
            <p style="font-size: 0.9em; font-weight: 500; color: var(--secondary-color); margin-bottom: 10px;">${selectedShape.title}</p>
            <svg width="100%" height="100" viewBox="0 0 100 100">
                ${dotsSvg}
            </svg>
        </div>`,
        layoutHint: { min: 2, max: 4 }
    }
};

export const generateFineMotorActivity = (options = defaultOptions.fineMotor) => {
    const subGenerators = [_generatePathTracingActivity, _generateConnectTheDotsActivity];
    const selectedGenerator = subGenerators[Math.floor(Math.random() * subGenerators.length)];
    return selectedGenerator(options);
};

const _generateTraceLetterActivity = (options = defaultOptions.letterFormation) => {
    const letters = ['a', 'b', 'c', 'd', 'e', 'k', 'l', 'm', 's', 't', 'u', 'y'];
    let letter = options.letter && letters.includes(options.letter.toLowerCase()) ? options.letter : letters[Math.floor(Math.random() * letters.length)];
    if(options.case === 'uppercase') letter = letter.toUpperCase();
    
    let content = '';
    switch(options.style) {
        case 'dotted':
            content = `<p style="font-size: 4em; font-family: 'Comic Sans MS', cursive, sans-serif; color: var(--light-text-color); margin: 0; line-height:1; border-bottom: 2px dashed var(--light-text-color);">${letter}</p>`;
            break;
        case 'arrows':
            content = `<p style="font-size: 4em; font-family: 'Comic Sans MS', cursive, sans-serif; color: var(--light-text-color); margin: 0; line-height:1; border-bottom: 2px solid var(--light-text-color); position:relative;">${letter}<span style="position: absolute; top: -10px; left: 5px; color: var(--primary-color); font-size: 0.5em;">↓</span></p>`;
            break;
        case 'simple': default:
             content = `<div style="width: 100%; height: 4em; border-bottom: 2px solid var(--light-text-color);"></div>`;
    }

    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; background-color: var(--card-bg-color); text-align: center; height: 100%;">
           <p style="font-size: 0.9em; margin-bottom: 5px;">'${letter}' harfini yaz.</p>
           ${content}
        </div>`,
        layoutHint: { min: 8, max: 15 }
    };
};

const _generateFindCorrectLetterActivity = (options = defaultOptions.letterFormation) => {
    const letters = ['a', 'b', 'c', 'd', 'e', 'k', 'l', 'm', 's', 't', 'u', 'y'];
    let letter = options.letter && letters.includes(options.letter.toLowerCase()) ? options.letter : letters[Math.floor(Math.random() * letters.length)];
    if(options.case === 'uppercase') letter = letter.toUpperCase();

    const correct = `<span style="font-family: 'Comic Sans MS', cursive, sans-serif;">${letter}</span>`;
    const incorrects = [
        `<span style="transform: scaleX(-1); display: inline-block; font-family: 'Comic Sans MS', cursive, sans-serif;">${letter}</span>`,
        `<span style="text-decoration: line-through; color: var(--light-text-color); font-family: 'Comic Sans MS', cursive, sans-serif;">${letter}</span>`,
        `<span style="transform: rotate(15deg); display: inline-block; font-family: 'Comic Sans MS', cursive, sans-serif;">${letter}</span>`
    ];
    const letterOptions = [correct, ...incorrects].sort(() => Math.random() - 0.5);

    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; background-color: var(--card-bg-color); text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: center;">
            <p style="font-size: 0.9em; font-weight: 500; color: var(--secondary-color); margin-bottom: 10px;">Doğru yazılmış olan '${letter}' harfini daire içine al.</p>
            <div style="display: flex; justify-content: space-around; align-items: center; font-size: 3em;">
                ${letterOptions.join('')}
            </div>
        </div>`,
        layoutHint: { min: 2, max: 4 }
    }
};

const _generateTraceWordActivity = (options = defaultOptions.letterFormation) => {
    const letters = ['a', 'b', 'c', 'd', 'e', 'k', 'l', 'm', 's', 't', 'u', 'y'];
    let letter = options.letter && letters.includes(options.letter.toLowerCase()) ? options.letter : letters[Math.floor(Math.random() * letters.length)];
    const wordList = {
        'a': ['ata', 'araba', 'aslan'], 'b': ['bal', 'baba', 'bebek'], 'c': ['cam', 'ceviz'], 'd': ['dede', 'dere'], 'e': ['elma', 'etek', 'ev'], 'k': ['kek', 'kedi', 'kale'], 'l': ['lale', 'limon'], 'm': ['mama', 'masa'], 's': ['sal', 'saat'], 't': ['top', 'tren'], 'u': ['uçak', 'uzun'], 'y': ['yol', 'yoyo']
    };
    const wordsForLetter = wordList[letter.toLowerCase()] || ['yazı'];
    const word = wordsForLetter[Math.floor(Math.random() * wordsForLetter.length)];
    return {
         html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; background-color: var(--card-bg-color); text-align: center; height: 100%;">
           <p style="font-size: 0.9em; margin-bottom: 5px;">Kelimenin üzerinden git.</p>
           <p style="font-size: 2.5em; font-family: 'Comic Sans MS', cursive, sans-serif; color: var(--light-text-color); margin: 0; line-height:1; border-bottom: 2px dashed var(--light-text-color);">${word}</p>
        </div>`,
        layoutHint: { min: 4, max: 8 }
    }
};

export const generateLetterFormationActivity = (options = defaultOptions.letterFormation) => {
    const subGenerators = [_generateTraceLetterActivity, _generateFindCorrectLetterActivity, _generateTraceWordActivity];
    const selectedGenerator = subGenerators[Math.floor(Math.random() * subGenerators.length)];
    return selectedGenerator(options);
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
                { svg: '<rect x="20" y="60" width="60" height="30" fill="var(--light-text-color)" /><rect x="25" y="10" width="10" height="50" fill="var(--primary-color)" /><circle cx="50" cy="75" r="10" fill="var(--primary-color)" />', label: 'Fırçaya macun sık' },
                { svg: '<circle cx="30" cy="30" r="10" fill="transparent" stroke="var(--text-color)" /><circle cx="70" cy="30" r="10" fill="transparent" stroke="var(--text-color)"/><path d="M 20,50 Q 50,70 80,50" fill="none" stroke="var(--text-color)" />', label: 'Dişleri fırçala' },
                { svg: '<path d="M20,80 C40,40 60,40 80,80" fill="var(--primary-color)" /><path d="M30,70 C40,50 60,50 70,70" fill="var(--primary-color)" />', label: 'Ağzı çalkala' }
            ]
        },
        {
            title: 'Çiçek ekme adımlarını sırala.',
            steps: [
                { svg: '<path d="M10,90 L90,90 L80,50 L20,50 Z" fill="#8b4513" /><rect x="25" y="40" width="50" height="10" fill="#a0522d" />', label: 'Saksıya toprak koy' },
                { svg: '<circle cx="50" cy="30" r="10" fill="#d2691e" /><path d="M10,90 L90,90 L80,50 L20,50 Z" fill="#8b4513" /><rect x="25" y="40" width="50" height="10" fill="#a0522d" />', label: 'Tohumu ek' },
                { svg: '<path d="M20,80 C30,60 10,40 25,20" stroke="var(--primary-color)" stroke-width="4" fill="none" /><path d="M10,90 L90,90 L80,50 L20,50 Z" fill="#8b4513" /><rect x="25" y="40" width="50" height="10" fill="#a0522d" />', label: 'Su ver' }
            ]
        },
        {
            title: 'Giyinme adımlarını sırala.',
            steps: [
                { svg: '<path d="M20,90 L30,40 L70,40 L80,90 Z" fill="#eee" />', label: 'Tişört' },
                { svg: '<path d="M20,90 L25,20 L45,20 L40,90 Z" fill="var(--primary-color)" /><path d="M60,90 L55,20 L75,20 L80,90 Z" fill="var(--primary-color)" />', label: 'Pantolon' },
                { svg: '<path d="M20,90 C20,70 50,70 50,90 Z" fill="var(--text-color)" /><path d="M55,90 C55,70 85,70 85,90 Z" fill="var(--text-color)" />', label: 'Ayakkabı' }
            ]
        }
    ];
    
    const selectedScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    const shuffled = [...selectedScenario.steps].sort(() => Math.random() - 0.5);
    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); text-align: center;">
            <p style="font-size: 0.9em; margin-bottom: 10px;">${selectedScenario.title} (1, 2, 3)</p>
            <div style="display: flex; justify-content: space-around; align-items: flex-end; gap: 10px;">
                ${shuffled.map(step => `
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 5px;">
                        <div style="width: 60px; height: 60px; border: 1px solid var(--border-color); border-radius: 5px; display:flex; align-items:center; justify-content:center; background: var(--background-color);">
                          <svg width="50" height="50" viewBox="0 0 100 100">${step.svg}</svg>
                        </div>
                        <div style="width: 30px; height: 30px; border: 2px solid var(--light-text-color); border-radius: 5px;"></div>
                    </div>
                `).join('')}
            </div>
        </div>`,
        layoutHint: { min: 1, max: 2 }
    };
};

const _generateUnscrambleWordsActivity = (options = {}) => {
    const sentences = [
        ['kedi', 'süt', 'içti'], ['Ali', 'top', 'oynadı'], ['güneş', 'parlıyor', 'gökyüzünde'],
        ['kuşlar', 'ağaca', 'kondu'], ['balık', 'suda', 'yüzer'], ['annem', 'yemek', 'yaptı'],
        ['ben', 'okula', 'gidiyorum'], ['kırmızı', 'araba', 'hızlıdır'], ['kardeşim', 'parkta', 'oynuyor']
    ];
    const selected = sentences[Math.floor(Math.random() * sentences.length)];
    const shuffled = [...selected].sort(() => Math.random() - 0.5);
    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); text-align: center;">
            <p style="font-size: 0.9em; margin-bottom: 10px;">Kelimeleri sıralayarak anlamlı bir cümle kur.</p>
            <div style="display: flex; gap: 10px; justify-content: center; padding: 10px; background-color: var(--background-color); border-radius: 5px; margin-bottom: 15px;">
                ${shuffled.map(word => `<span style="border: 1px solid var(--border-color); padding: 5px 10px; border-radius: 5px; background: var(--card-bg-color);">${word}</span>`).join('')}
            </div>
            <div style="width: 100%; border-bottom: 2px solid var(--text-color); min-height: 24px;"></div>
        </div>`,
        layoutHint: { min: 3, max: 5 }
    };
};

const _generateCompleteSentenceActivity = (options = {}) => {
    const sentenceStarts = [
        'Köpek bahçede ', 'Annem pazardan ', 'Yarın okula ', 'Kırmızı araba çok ',
        'En sevdiğim renk ', 'Hava yağmurlu olduğu için ', 'Karnım acıktı, bu yüzden '
    ];
    const selected = sentenceStarts[Math.floor(Math.random() * sentenceStarts.length)];
    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); text-align: center;">
            <p style="font-size: 0.9em; margin-bottom: 10px;">Cümlenin sonunu anlamlı bir şekilde tamamla.</p>
            <div style="font-size: 1.2em; background-color: var(--background-color); padding: 15px; border-radius: 5px;">
                <span>${selected}</span><span style="display: inline-block; width: 60%; border-bottom: 2px solid var(--text-color); min-height: 24px; vertical-align: bottom;"></span>
            </div>
        </div>`,
        layoutHint: { min: 2, max: 4 }
    };
};

export const generateSentenceBuildingActivity = (options = {}) => {
    const subGenerators = [_generateUnscrambleWordsActivity, _generateCompleteSentenceActivity];
    const selectedGenerator = subGenerators[Math.floor(Math.random() * subGenerators.length)];
    return selectedGenerator(options);
};


const _generateAddPunctuationActivity = (options = {}) => {
    const sentences = [
        { text: "Bugün hava çok güzel", punctuation: "." }, { text: "Okula gittin mi", punctuation: "?" },
        { text: "Köpeğin adı ne", punctuation: "?" }, { text: "Annem eve geldi", punctuation: "." },
        { text: "Bu ne renk", punctuation: "?" }, { text: "Yarın bayram", punctuation: "." }
    ];
    const selected = sentences[Math.floor(Math.random() * sentences.length)];
    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); text-align: center;">
             <p style="font-size: 0.9em; margin-bottom: 10px;">Cümlenin sonuna uygun işareti koy. (. / ?)</p>
             <div style="display: flex; align-items: center; justify-content: center; gap: 5px; font-size: 1.2em; background-color: var(--background-color); padding: 15px; border-radius: 5px;">
                <span>${selected.text}</span>
                <div style="width: 25px; height: 25px; border: 2px solid var(--light-text-color); border-radius: 5px;"></div>
             </div>
        </div>`,
        layoutHint: { min: 2, max: 4 }
    };
};

const _generateFixSentenceActivity = (options = {}) => {
    const sentences = [
        { text: "kedi süt içti", correct: "Kedi süt içti." }, { text: "yarın okul var mı", correct: "Yarın okul var mı?" },
        { text: "ali parka gitti", correct: "Ali parka gitti." }, { text: "ankara türkiyenin başkenti mi", correct: "Ankara Türkiye'nin başkenti mi?" },
        { text: "o bir kuş", correct: "O bir kuş." }, { text: "adın ne", correct: "Adın ne?" }
    ];
    const selected = sentences[Math.floor(Math.random() * sentences.length)];
     return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); text-align: center;">
             <p style="font-size: 0.9em; margin-bottom: 10px;">Cümleyi düzeltip yeniden yaz.</p>
             <p style="font-size: 1.2em; background-color: var(--background-color); padding: 10px; border-radius: 5px; margin-bottom: 15px; color: var(--light-text-color);">${selected.text}</p>
             <div style="width: 100%; border-bottom: 2px solid var(--text-color); min-height: 24px;"></div>
        </div>`,
        layoutHint: { min: 2, max: 4 }
    };
};

export const generatePunctuationActivity = (options = {}) => {
    const subGenerators = [_generateAddPunctuationActivity, _generateFixSentenceActivity];
    const selectedGenerator = subGenerators[Math.floor(Math.random() * subGenerators.length)];
    return selectedGenerator(options);
};

export const generateCreativeWritingActivity = (options = {}) => {
    const prompts = [
        { title: 'Bu resim hakkında kısa bir hikaye yaz.', svg: '<path d="M50,95 C20,95 20,70 20,70 L20,40 C20,10 50,10 50,10 C80,10 80,40 80,40 L80,70 C80,70 80,95 50,95 Z" fill="#a0522d" /><circle cx="65" cy="55" r="5" fill="var(--secondary-color)" />' },
        { title: 'Bu uzay gemisi nereye gidiyor? Anlat.', svg: '<polygon points="50,10 70,50 60,50 60,80 40,80 40,50 30,50" fill="var(--light-text-color)" /><polygon points="50,70 60,90 40,90" fill="var(--secondary-color)" />' },
        { title: 'Sihirli ağacın içinde ne var? Hayal et ve yaz.', svg: '<path d="M60,90 C40,90 30,70 40,50 S60,20 70,30 S90,50 80,70 S80,90 60,90" fill="var(--secondary-color)" /><rect x="25" y="70" width="30" height="20" fill="#8b4513" />' },
        { title: 'Bu gizemli kutunun içinde ne olabilir? Yaz.', svg: '<rect x="20" y="30" width="60" height="40" fill="var(--primary-color)" /><text x="50" y="60" font-size="30" text-anchor="middle" fill="white">?</text>' },
        { title: 'Uçan balon seni nereye götürürdü? Anlat.', svg: '<circle cx="50" cy="40" r="30" fill="var(--secondary-color)" /><path d="M50,70 L50,90 L40,90 L60,90 Z" fill="#a0522d" />' },
    ];
    const selected = prompts[Math.floor(Math.random() * prompts.length)];
    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); text-align: center; height: 100%; display: flex; flex-direction: column;">
            <p style="font-size: 0.9em; font-weight: 500; margin-bottom: 10px;">${selected.title}</p>
            <div style="flex-shrink: 0; margin-bottom: 10px;">
                <svg width="80" height="80" viewBox="0 0 100 100">${selected.svg}</svg>
            </div>
            <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 12px; background-image: linear-gradient(to bottom, var(--light-text-color) 1px, transparent 1px); background-size: 100% 24px; padding-top: 10px;">
                
            </div>
        </div>`,
        layoutHint: { min: 1, max: 2 }
    };
};

export const generateLegibleWritingActivity = (options = {}) => {
    const sentences = ["kedi süt içti", "ali top oynadı", "güneş parlıyor", "kuşlar uçuyor"];
    const sentence = sentences[Math.floor(Math.random() * sentences.length)];
    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); text-align: center;">
            <p style="font-size: 0.9em; margin-bottom: 10px;">Kelimeler arasında boşluk bırakarak cümleyi yeniden yaz.</p>
            <p style="font-size: 1.2em; background-color: var(--background-color); padding: 10px; border-radius: 5px; margin-bottom: 15px; color: var(--text-color); font-family: 'Courier New', monospace;">${sentence.replace(/ /g, '')}</p>
            <div style="width: 100%; border-bottom: 2px solid var(--text-color); min-height: 24px;"></div>
        </div>`,
        layoutHint: { min: 2, max: 4 }
    };
};

export const generateWritingSpeedActivity = (options = {}) => {
    const letters = ['a', 'e', 'l', 't', 'k'];
    const letter = letters[Math.floor(Math.random() * letters.length)];
    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); text-align: center;">
            <p style="font-size: 0.9em; margin-bottom: 10px;">Mümkün olduğunca çok '<strong style="color:var(--primary-color)">${letter}</strong>' harfi yaz.</p>
            <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px; margin-top: 10px;">
                ${Array(15).fill('<div style="width: 100%; height: 35px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--background-color);"></div>').join('')}
            </div>
        </div>`,
        layoutHint: { min: 2, max: 4 }
    };
};

export const generateWritingPlanningActivity = (options = {}) => {
    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); text-align: center;">
            <p style="font-size: 0.9em; margin-bottom: 10px;">Bir hikaye planla. Önce ne oldu? Sonra ne oldu? En son ne oldu? Çiz veya yaz.</p>
            <div style="display: flex; justify-content: space-between; gap: 10px;">
                <div style="flex:1;">
                    <p style="font-weight: 600;">Önce</p>
                    <div style="height: 80px; border: 2px dashed var(--light-text-color); border-radius: 5px;"></div>
                </div>
                <div style="flex:1;">
                    <p style="font-weight: 600;">Sonra</p>
                    <div style="height: 80px; border: 2px dashed var(--light-text-color); border-radius: 5px;"></div>
                </div>
                <div style="flex:1;">
                    <p style="font-weight: 600;">En Son</p>
                    <div style="height: 80px; border: 2px dashed var(--light-text-color); border-radius: 5px;"></div>
                </div>
            </div>
        </div>`,
        layoutHint: { min: 1, max: 2 }
    };
};

export const generateLetterFormRecognitionActivity = (options) => {
    // Re-use a specific sub-generator from letter formation
    return _generateFindCorrectLetterActivity(options);
};

export const generateCommonStoryAdventureActivity = (options) => {
    // For now, re-use a versatile generator. Can be expanded later.
    return generatePictureSequencingActivity(options);
};
