const defaultOptions = {
    arithmeticFluency: { operation: '+', range: 20, visualAids: false, problemCount: 12 },
    numberSense: { maxNumber: 10, objectType: 'stars', arrangement: 'grid', problemCount: 12 },
    problemSolving: { operation: '+', range: 20, theme: 'fruits', problemCount: 6 },
    numberGrouping: { maxItems: 25, problemCount: 6 },
    mathLanguage: { activityType: 'match', problemCount: 6 },
};

// Helper to generate visual aids (on-off blocks)
const generateVisualAid = (number: number) => {
    const tens = Math.floor(number / 10);
    const ones = number % 10;
    let html = '<div style="display: flex; flex-wrap: wrap; gap: 2px; align-items: center; justify-content: center; min-height: 50px;">';
    for (let i = 0; i < tens; i++) {
        html += '<div style="width: 10px; height: 50px; background-color: var(--primary-color); border: 1px solid var(--text-color);"></div>';
    }
    const onesContainer = '<div style="display: flex; flex-wrap: wrap; gap: 2px; width: 60px;">'
    let onesHtml = '';
    for (let i = 0; i < ones; i++) {
        onesHtml += '<div style="width: 10px; height: 10px; background-color: var(--secondary-color); border: 1px solid var(--text-color);"></div>';
    }
    html += onesContainer + onesHtml + '</div>';
    html += '</div>';
    return html;
};

const _generateStandardArithmeticActivity = (options = defaultOptions.arithmeticFluency) => {
    const { operation, range, visualAids } = options;
    let num1, num2;
    
    if (operation === '+') {
        num1 = Math.floor(Math.random() * range) + 1;
        num2 = Math.floor(Math.random() * range) + 1;
    } else { // '-'
        num1 = Math.floor(Math.random() * (range/2)) + Math.floor(range / 2);
        num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
    }
    
    const problemHtml = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 5px;">
            <div style="font-family: 'Courier New', monospace; font-size: 1.5em; text-align: right;">
                <div>${num1}</div>
                <div>${operation} ${num2}</div>
                <hr style="margin: 2px 0; border-color: var(--text-color);"/>
            </div>
            <div style="width: 50px; height: 30px; border: 2px solid var(--light-text-color); border-radius: 5px;"></div>
        </div>`;

    const visualAidHtml = visualAids ? `
        <div style="display: flex; justify-content: space-around; margin-top: 10px; gap: 5px;">
            ${generateVisualAid(num1)}
            ${generateVisualAid(num2)}
        </div>
    ` : '';

    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); height: 100%; display: flex; flex-direction: column; justify-content: center;">
            ${problemHtml}
            ${visualAidHtml}
        </div>`,
        layoutHint: { min: 6, max: 12 }
    };
};

export const generateArithmeticFluencyActivity = (options = defaultOptions.arithmeticFluency) => {
    // Dispatcher to add variety
    const subGenerators = [_generateStandardArithmeticActivity];
    const selectedGenerator = subGenerators[Math.floor(Math.random() * subGenerators.length)];
    return selectedGenerator(options);
};


const _generateCountObjectsActivity = (options = defaultOptions.numberSense) => {
    const { maxNumber, objectType } = options;
    const icons = {
        stars: '⭐', apples: '🍎', balloons: '🎈', circles: '🔵', suns: '☀️', moons: '🌙'
    };
    const icon = icons[objectType] || '⭐';
    const count = Math.floor(Math.random() * maxNumber) + 1;
    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); text-align: center;">
            <p style="font-size: 0.9em; margin-bottom: 10px;">Kaç tane var? Say ve yaz.</p>
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 5px; font-size: 1.5em; background-color: var(--background-color); padding: 10px; border-radius: 5px; min-height: 50px;">
                ${Array(count).fill(icon).join('')}
            </div>
            <div style="width: 50px; height: 40px; border: 2px solid var(--light-text-color); border-radius: 5px; margin: 10px auto 0;"></div>
        </div>`,
        layoutHint: { min: 4, max: 8 }
    };
};

const _generateCircleNumberActivity = (options = defaultOptions.numberSense) => {
    const { maxNumber, objectType } = options;
    const icons = {
        stars: '⭐', apples: '🍎', balloons: '🎈', circles: '🔵', suns: '☀️', moons: '🌙'
    };
    const icon = icons[objectType] || '⭐';
    const totalCount = Math.floor(Math.random() * 5) + maxNumber; // Always more than requested
    const targetCount = Math.floor(Math.random() * (maxNumber - 2)) + 2;
    return {
         html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); text-align: center;">
            <p style="font-size: 0.9em; margin-bottom: 10px;"><strong style="color: var(--primary-color); font-size: 1.2em;">${targetCount}</strong> tane nesneyi daire içine al.</p>
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 5px; font-size: 1.5em; background-color: var(--background-color); padding: 10px; border-radius: 5px; min-height: 50px;">
                ${Array(totalCount).fill(icon).join('')}
            </div>
        </div>`,
        layoutHint: { min: 2, max: 4 }
    };
};

export const generateNumberSenseActivity = (options = defaultOptions.numberSense) => {
    const subGenerators = [_generateCountObjectsActivity, _generateCircleNumberActivity];
    const selectedGenerator = subGenerators[Math.floor(Math.random() * subGenerators.length)];
    return selectedGenerator(options);
};

export const generateProblemSolvingActivity = (options = defaultOptions.problemSolving) => {
    const { operation, range, theme } = options;
    let num1, num2;
    if (operation === '+') {
        num1 = Math.floor(Math.random() * (range / 2)) + 1;
        num2 = Math.floor(Math.random() * (range / 2)) + 1;
    } else {
        num1 = Math.floor(Math.random() * (range / 2)) + Math.floor(range / 2);
        num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
    }

    const themes = {
        fruits: { person: 'Ayşe', item: 'elma', verb: 'daha aldı', verb_neg: 'yedi' },
        toys: { person: 'Ali', item: 'oyuncak araba', verb: 'daha hediye aldı', verb_neg: 'kaybetti' },
        animals: { person: 'Zeynep', item: 'kedi', verb: 'daha gördü', verb_neg: 'kaçtı' },
        sweets: { person: 'Mehmet', item: 'kurabiye', verb: 'daha pişirdi', verb_neg: 'yedi' },
        market: { person: 'Annem', item: 'yumurta', verb: 'pazardan aldı', verb_neg: 'kırdı' },
        party: { person: 'Partide', item: 'balon', verb: 'şişirildi', verb_neg: 'patladı' },
        class: { person: 'Sınıfta', item: 'öğrenci', verb: 'daha geldi', verb_neg: 'eve gitti' }
    };
    const selectedThemeKey = theme === 'random' ? Object.keys(themes)[Math.floor(Math.random() * Object.keys(themes).length)] : theme;
    const selectedTheme = themes[selectedThemeKey] || themes.fruits;
    
    let story;
    if(operation === '+') {
        story = `${selectedTheme.person} ${num1} tane ${selectedTheme.item} vardı. ${num2} tane ${selectedTheme.verb}. Şimdi kaç tane ${selectedTheme.item} var?`;
    } else {
        story = `${selectedTheme.person} ${num1} tane ${selectedTheme.item} vardı. ${num2} tanesi ${selectedTheme.verb_neg}. Geriye kaç tane ${selectedTheme.item} kaldı?`;
    }

    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); text-align: left; height: 100%; display: flex; flex-direction: column;">
            <p style="font-size: 1em; line-height: 1.6; margin-bottom: 10px; flex-grow: 1;">${story}</p>
            <div style="text-align: center;">
                <span style="font-size: 1.2em;">Cevap: </span>
                <div style="display: inline-block; width: 60px; height: 35px; border: 2px solid var(--light-text-color); border-radius: 5px;"></div>
            </div>
        </div>`,
        layoutHint: { min: 2, max: 4 }
    };
};

export const generateNumberGroupingActivity = (options = defaultOptions.numberGrouping) => {
    const { maxItems } = options;
    const count = Math.floor(Math.random() * (maxItems - 11)) + 11;
    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); text-align: center;">
            <p style="font-size: 0.9em; margin-bottom: 10px;">${count} sayısını onluk ve birliklere ayır.</p>
            <div style="display: flex; justify-content: space-around; align-items: center; margin-top: 20px;">
                <div>
                    <p>Onluk</p>
                    <div style="width: 50px; height: 40px; border: 2px solid var(--light-text-color); border-radius: 5px;"></div>
                </div>
                <div>
                    <p>Birlik</p>
                    <div style="width: 50px; height: 40px; border: 2px solid var(--light-text-color); border-radius: 5px;"></div>
                </div>
            </div>
        </div>`,
        layoutHint: { min: 2, max: 4 }
    };
};

const _generateMatchSymbolsActivity = (options = defaultOptions.mathLanguage) => {
    const symbols: Record<string, string> = { '+': 'Toplama', '-': 'Çıkarma', '=': 'Eşittir', '>': 'Büyüktür', '<': 'Küçüktür', '≠': 'Eşit Değildir' };
    const symbolKeys = Object.keys(symbols);
    const symbol = symbolKeys[Math.floor(Math.random() * symbolKeys.length)];
    const name = symbols[symbol];
    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
            <p style="font-size: 0.9em; margin-bottom: 10px;">Sembol ile ismini eşleştir.</p>
            <div style="display: flex; align-items: center; justify-content: space-around; width: 100%;">
                <div style="font-size: 3em; font-weight: bold;">${symbol}</div>
                <div style="font-size: 1.5em;">${name}</div>
            </div>
        </div>`,
        layoutHint: { min: 4, max: 8 }
    };
};

const _generateFillOperatorActivity = (options = defaultOptions.mathLanguage) => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    let leftSide = `<span>${num1}</span>`;
    let rightSide = `<span>${num2}</span>`;

    // Add more complexity randomly
    if(Math.random() < 0.3) {
        const num3 = Math.floor(Math.random() * 5) + 1;
        leftSide = `<span>${num1} + ${num3}</span>`;
    }

    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center;">
             <p style="font-size: 0.9em; margin-bottom: 10px;">Boşluğa uygun işareti koy. (+, -, >, <, =)</p>
             <div style="display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 1.5em;">
                ${leftSide}
                <div style="width: 30px; height: 30px; border: 2px solid var(--light-text-color); border-radius: 5px;"></div>
                ${rightSide}
             </div>
        </div>`,
        layoutHint: { min: 4, max: 8 }
    }
};

export const generateMathLanguageActivity = (options = defaultOptions.mathLanguage) => {
    const subGenerators = [_generateMatchSymbolsActivity, _generateFillOperatorActivity];
    const selectedGenerator = subGenerators[Math.floor(Math.random() * subGenerators.length)];
    return selectedGenerator(options);
};

const _generateTellTimeActivity = (options = {}) => {
    const hour = Math.floor(Math.random() * 12) + 1;
    const minute = Math.random() < 0.5 ? 0 : 30;
    const hourAngle = (hour % 12 + minute / 60) * 30;
    const minuteAngle = minute * 6;

    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); text-align: center;">
            <p style="font-size: 0.9em; margin-bottom: 10px;">Saat kaç? Yaz.</p>
            <svg viewBox="0 0 100 100" style="width: 100px; height: 100px; margin: 0 auto;">
                <circle cx="50" cy="50" r="48" fill="var(--card-bg-color)" stroke="var(--text-color)" stroke-width="2"/>
                <line x1="50" y1="50" x2="${50 + 30 * Math.sin(Math.PI * hourAngle / 180)}" y2="${50 - 30 * Math.cos(Math.PI * hourAngle / 180)}" stroke="var(--text-color)" stroke-width="3" stroke-linecap="round"/>
                <line x1="50" y1="50" x2="${50 + 40 * Math.sin(Math.PI * minuteAngle / 180)}" y2="${50 - 40 * Math.cos(Math.PI * minuteAngle / 180)}" stroke="var(--text-color)" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <div style="width: 80px; height: 30px; border: 2px solid var(--light-text-color); border-radius: 5px; margin: 10px auto 0; font-size: 1.2em; letter-spacing: 2px;"></div>
        </div>`,
        layoutHint: { min: 2, max: 4 }
    };
};
const _generateIdentifyShapeActivity = (options = {}) => {
    const shapes = [
        { name: 'Daire', svg: '<circle cx="50" cy="50" r="40" fill="var(--primary-color)" />' },
        { name: 'Kare', svg: '<rect x="10" y="10" width="80" height="80" fill="var(--secondary-color)" />' },
        { name: 'Üçgen', svg: '<polygon points="50,10 90,90 10,90" fill="var(--primary-color)" />' },
        { name: 'Dikdörtgen', svg: '<rect x="10" y="25" width="80" height="50" fill="var(--secondary-color)" />' },
    ];
    const selectedShape = shapes[Math.floor(Math.random() * shapes.length)];
    const optionsShuffled = shapes.map(s => s.name).sort(() => Math.random() - 0.5);
    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); text-align: center;">
            <p style="font-size: 0.9em; margin-bottom: 10px;">Bu şeklin adı ne?</p>
            <svg viewBox="0 0 100 100" style="width: 80px; height: 80px; margin: 0 auto 10px;">${selectedShape.svg}</svg>
            <div style="display: flex; flex-direction: column; gap: 5px;">
                ${optionsShuffled.map(opt => `<div style="border: 2px solid var(--border-color); border-radius: 5px; padding: 8px; font-size: 1em; cursor: pointer;">${opt}</div>`).join('')}
            </div>
        </div>`,
        layoutHint: { min: 2, max: 4 }
    };
};
export const generateTimeMeasurementGeometryActivity = (options) => {
    const subGenerators = [_generateTellTimeActivity, _generateIdentifyShapeActivity];
    return subGenerators[Math.floor(Math.random() * subGenerators.length)](options);
};

const _generatePatternCompletionActivity = (options) => {
    const patterns = [
        ['🔴', '🔷', '🔴', '🔷'],
        ['⭐', '⭐', '🌙', '⭐', '⭐', '🌙'],
        ['💚', '💛', '🧡', '💚', '💛', '🧡'],
    ];
    const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
    const patternToShow = selectedPattern.slice(0, -1);
    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); text-align: center;">
            <p style="font-size: 0.9em; margin-bottom: 10px;">Sıradaki şekli çiz.</p>
            <div style="display: flex; justify-content: center; align-items: center; gap: 10px; font-size: 2em; margin-bottom: 15px;">
                ${patternToShow.map(p => `<span>${p}</span>`).join('')}
                <div style="width: 40px; height: 40px; border: 2px dashed var(--light-text-color); border-radius: 5px;"></div>
            </div>
        </div>`,
        layoutHint: { min: 3, max: 6 }
    };
};
export const generateSpatialReasoningActivity = (options) => {
    const subGenerators = [_generatePatternCompletionActivity];
    return subGenerators[Math.floor(Math.random() * subGenerators.length)](options);
};

const _generateEstimateDotsActivity = (options) => {
    const count = Math.floor(Math.random() * 40) + 10;
    const answer = Math.round(count / 10) * 10;
    let dots = '';
    for (let i = 0; i < count; i++) {
        dots += `<circle cx="${Math.random() * 180 + 10}" cy="${Math.random() * 80 + 10}" r="3" fill="var(--text-color)" />`;
    }
    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); text-align: center;">
            <p style="font-size: 0.9em; margin-bottom: 10px;">Yaklaşık kaç tane var?</p>
            <svg viewBox="0 0 200 100" style="background-color: var(--background-color); border-radius: 5px;">${dots}</svg>
            <div style="display: flex; justify-content: center; gap: 10px; margin-top: 10px;">
                <div style="border: 2px solid var(--border-color); padding: 5px 10px; border-radius: 5px;">${answer - 10}</div>
                <div style="border: 2px solid var(--border-color); padding: 5px 10px; border-radius: 5px;">${answer}</div>
                <div style="border: 2px solid var(--border-color); padding: 5px 10px; border-radius: 5px;">${answer + 10}</div>
            </div>
        </div>`,
        layoutHint: { min: 2, max: 4 }
    };
};
export const generateEstimationSkillsActivity = (options) => {
    const subGenerators = [_generateEstimateDotsActivity];
    return subGenerators[Math.floor(Math.random() * subGenerators.length)](options);
};

const _generateVisualFractionActivity = (options) => {
    const fractions = [
        { name: '1/2', parts: 2, shaded: 1 },
        { name: '1/3', parts: 3, shaded: 1 },
        { name: '1/4', parts: 4, shaded: 1 },
        { name: '2/3', parts: 3, shaded: 2 },
    ];
    const selected = fractions[Math.floor(Math.random() * fractions.length)];
    let shapeSvg = '';
    if (selected.parts === 2) { // Rectangle
        shapeSvg = `<rect x="10" y="10" width="80" height="40" fill="var(--primary-color)" /><rect x="10" y="10" width="80" height="80" fill="transparent" stroke="var(--text-color)" stroke-width="2"/>`;
    } else { // Circle
        for (let i = 0; i < selected.parts; i++) {
            const angle1 = (i / selected.parts) * 360;
            const angle2 = ((i + 1) / selected.parts) * 360;
            const a1Rad = angle1 * Math.PI / 180;
            const a2Rad = angle2 * Math.PI / 180;
            shapeSvg += `<path d="M 50 50 L ${50 + 45 * Math.cos(a1Rad)} ${50 + 45 * Math.sin(a1Rad)} A 45 45 0 0 1 ${50 + 45 * Math.cos(a2Rad)} ${50 + 45 * Math.sin(a2Rad)} Z" fill="${i < selected.shaded ? 'var(--primary-color)' : 'transparent'}" stroke="var(--text-color)" stroke-width="2"/>`;
        }
    }
    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); text-align: center;">
            <p style="font-size: 0.9em; margin-bottom: 10px;">Şeklin hangi kesri boyalı?</p>
            <svg viewBox="0 0 100 100" style="width: 80px; height: 80px; margin: 0 auto 10px;">${shapeSvg}</svg>
            <div style="width: 60px; height: 35px; border: 2px solid var(--light-text-color); border-radius: 5px; margin: 0 auto;"></div>
        </div>`,
        layoutHint: { min: 2, max: 4 }
    };
};
export const generateFractionsDecimalsActivity = (options) => {
    const subGenerators = [_generateVisualFractionActivity];
    return subGenerators[Math.floor(Math.random() * subGenerators.length)](options);
};

const _generateTenFrameActivity = (options) => {
    const number = Math.floor(Math.random() * 10) + 1;
    let dots = '';
    for (let i = 0; i < number; i++) {
        const x = 10 + (i % 5) * 18;
        const y = 25 + Math.floor(i / 5) * 30;
        dots += `<circle cx="${x}" cy="${y}" r="7" fill="var(--primary-color)" />`;
    }
    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); text-align: center;">
            <p style="font-size: 0.9em; margin-bottom: 10px;">Bu onluk çerçeve hangi sayıyı gösteriyor?</p>
            <svg viewBox="0 0 100 70" style="width: 120px; height: 70px; margin: 0 auto 10px; border: 2px solid var(--text-color); border-radius: 5px;">
                <path d="M10,35 L90,35 M50,5 L50,65 M32,5 L32,65 M68,5 L68,65 M14,5 L14,65 M86,5 L86,65" stroke="var(--text-color)" stroke-width="1"/>
                ${dots}
            </svg>
            <div style="width: 50px; height: 40px; border: 2px solid var(--light-text-color); border-radius: 5px; margin: 0 auto;"></div>
        </div>`,
        layoutHint: { min: 2, max: 4 }
    };
};
export const generateVisualRepresentationActivity = (options) => {
    const subGenerators = [_generateTenFrameActivity];
    return subGenerators[Math.floor(Math.random() * subGenerators.length)](options);
};

const _generateObjectAdditionActivity = (options) => {
    const num1 = Math.floor(Math.random() * 5) + 1;
    const num2 = Math.floor(Math.random() * 5) + 1;
    const icons = ['🍎', '⚽️', '⭐', '🎈'];
    const icon = icons[Math.floor(Math.random() * icons.length)];
    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); text-align: center;">
            <p style="font-size: 0.9em; margin-bottom: 10px;">İşlemin sonucunu bul.</p>
            <div style="display: flex; justify-content: center; align-items: center; gap: 10px; font-size: 2em; background-color: var(--background-color); padding: 10px; border-radius: 5px;">
                <span>${Array(num1).fill(icon).join('')}</span>
                <span style="color: var(--primary-color); font-weight: bold;">+</span>
                <span>${Array(num2).fill(icon).join('')}</span>
                <span style="color: var(--primary-color); font-weight: bold;">=</span>
                <div style="width: 50px; height: 40px; border: 2px solid var(--light-text-color); border-radius: 5px;"></div>
            </div>
        </div>`,
        layoutHint: { min: 3, max: 6 }
    };
};
export const generateVisualArithmeticActivity = (options) => {
    const subGenerators = [_generateObjectAdditionActivity];
    return subGenerators[Math.floor(Math.random() * subGenerators.length)](options);
};
