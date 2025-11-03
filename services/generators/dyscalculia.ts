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


export const generateArithmeticFluencyActivity = (options = defaultOptions.arithmeticFluency) => {
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

export const generateNumberSenseActivity = (options = defaultOptions.numberSense) => {
    const { maxNumber, objectType } = options;
    const count = Math.floor(Math.random() * maxNumber) + 1;
    const icons = {
        stars: '⭐',
        apples: '🍎',
        balloons: '🎈',
        circles: '🔵'
    };
    const icon = icons[objectType] || '⭐';

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
    };
    const selectedTheme = themes[theme] || themes.fruits;
    
    let story;
    if(operation === '+') {
        story = `${selectedTheme.person}'nin ${num1} tane ${selectedTheme.item}sı vardı. ${num2} tane ${selectedTheme.verb}. Şimdi kaç ${selectedTheme.item}sı var?`;
    } else {
        story = `${selectedTheme.person}'nin ${num1} tane ${selectedTheme.item}sı vardı. ${num2} tanesini ${selectedTheme.verb_neg}. Geriye kaç ${selectedTheme.item}sı kaldı?`;
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

export const generateMathLanguageActivity = (options = defaultOptions.mathLanguage) => {
    const { activityType } = options;
    
    if (activityType === 'match') {
        const symbols: Record<string, string> = { '+': 'Toplama', '-': 'Çıkarma', '=': 'Eşittir', '>': 'Büyüktür', '<': 'Küçüktür' };
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
    } else { // fill-operator or fill-comparison
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        return {
            html: `
            <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center;">
                 <p style="font-size: 0.9em; margin-bottom: 10px;">Boşluğa uygun işareti koy. (+, -, >, <, =)</p>
                 <div style="display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 1.5em;">
                    <span>${num1}</span>
                    <div style="width: 30px; height: 30px; border: 2px solid var(--light-text-color); border-radius: 5px;"></div>
                    <span>${num2}</span>
                 </div>
            </div>`,
            layoutHint: { min: 4, max: 8 }
        }
    }
};

const createPlaceholderGenerator = (name: string) => (options: any) => ({
    html: `<div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); display: flex; align-items: center; justify-content: center; height: 100%; text-align: center;">${name} etkinliği.</div>`,
    layoutHint: { min: 4, max: 8 }
});

export const generateTimeMeasurementGeometryActivity = createPlaceholderGenerator('Zaman/Ölçme/Geometri');
export const generateSpatialReasoningActivity = createPlaceholderGenerator('Uzamsal Akıl Yürütme');
export const generateEstimationSkillsActivity = createPlaceholderGenerator('Tahmin Becerileri');
export const generateFractionsDecimalsActivity = createPlaceholderGenerator('Kesirler/Ondalık');
export const generateVisualRepresentationActivity = createPlaceholderGenerator('Görsel Temsil');
export const generateVisualArithmeticActivity = createPlaceholderGenerator('Görsel Aritmetik');
