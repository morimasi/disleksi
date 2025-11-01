const defaultOptions = {
    arithmeticFluency: { operation: '+', range: 20, layout: 'horizontal', problemCount: 12 },
    problemSolving: { operation: '+', range: 20, theme: 'fruits' },
    numberSense: { maxNumber: 10, objectType: 'stars', arrangement: 'grid' }
};

export const generateArithmeticFluencyActivity = (options = defaultOptions.arithmeticFluency) => {
    const activityType = Math.random();

    if (activityType < 0.6) { // Classic vertical/horizontal
        const { operation, range, layout } = options;
        let num1, num2;
        
        if (operation === '+') {
            num1 = Math.floor(Math.random() * range) + 1;
            num2 = Math.floor(Math.random() * range) + 1;
        } else { // '-'
            num1 = Math.floor(Math.random() * (range/2)) + Math.floor(range / 2);
            num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
        }
        
        const horizontalLayout = `${num1} ${operation} ${num2} = ___`;
        const verticalLayout = `<div style="display: inline-block; text-align: right; line-height: 1.3; font-family: 'Courier New', monospace; font-size: 1.3em;"><div>${num1.toString().padStart(2, ' ')}</div><div>${operation} ${num2.toString().padStart(2, ' ')}</div><hr style="margin: 2px 0; border-color: #34495e;"/><div></div></div>`;

        return {
            html: `<div style="font-size: 1.2em; padding: 10px; background-color: #f8f9fa; border-radius: 8px; display: flex; align-items: center; justify-content: center; height: 100%;">${layout === 'vertical' ? verticalLayout : horizontalLayout}</div>`,
            layoutHint: { min: 10, max: 20 }
        };
    } else { // Number Bonds
        const whole = Math.floor(Math.random() * 10) + 5; // 5 to 14
        const part1 = Math.floor(Math.random() * (whole - 2)) + 1; // 1 to whole-2
        const part2 = whole - part1;

        const missingPart = Math.floor(Math.random() * 3); // 0: whole, 1: part1, 2: part2

        const wholeContent = missingPart === 0 ? '' : whole;
        const part1Content = missingPart === 1 ? '' : part1;
        const part2Content = missingPart === 2 ? '' : part2;

        return {
            html: `
            <div style="border: 2px solid #ecf0f1; border-radius: 10px; padding: 15px; background-color: #fdfdfd; text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <p style="font-size: 0.9em; font-weight: 500; color: #e67e22; margin-bottom: 10px;">Eksik sayıyı bul.</p>
                <svg width="120" height="100" viewBox="0 0 120 100">
                    <circle cx="60" cy="25" r="20" fill="#f1c40f" stroke="#e67e22" stroke-width="2"/>
                    <text x="60" y="30" text-anchor="middle" font-size="18" font-weight="bold">${wholeContent}</text>
                    <line x1="60" y1="45" x2="35" y2="65" stroke="#bdc3c7" stroke-width="2" />
                    <line x1="60" y1="45" x2="85" y2="65" stroke="#bdc3c7" stroke-width="2" />
                    <circle cx="35" cy="80" r="20" fill="#a9cce3" stroke="#3498db" stroke-width="2"/>
                    <text x="35" y="85" text-anchor="middle" font-size="18" font-weight="bold">${part1Content}</text>
                    <circle cx="85" cy="80" r="20" fill="#a9cce3" stroke="#3498db" stroke-width="2"/>
                    <text x="85" y="85" text-anchor="middle" font-size="18" font-weight="bold">${part2Content}</text>
                </svg>
            </div>`,
            layoutHint: { min: 4, max: 8 }
        }
    }
};

export const generateNumberSenseActivity = (options = defaultOptions.numberSense) => {
    const activityType = Math.random();

    if (activityType < 0.6) { // Count Objects
        const { maxNumber, objectType, arrangement } = options;
        const num = Math.floor(Math.random() * maxNumber) + 1;
        const itemsMap = { stars: '⭐', apples: '🍎', balloons: '🎈', circles: '🔵' };
        const item = itemsMap[objectType] || '⭐';
        
        let containerStyle = 'display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 5px;';
        if (arrangement === 'grid') {
            containerStyle = `display: grid; grid-template-columns: repeat(auto-fill, minmax(20px, 1fr)); gap: 5px;`;
        } else if (arrangement === 'line') {
            containerStyle = 'display: flex; justify-content: center; gap: 5px;';
        }

        const items = `<div style="${containerStyle} flex-grow: 1; min-height: 50px;">${Array(num).fill(`<span style="font-size: 1.5em;">${item}</span>`).join('')}</div>`;

        return {
            html: `
            <div style="border: 2px solid #ecf0f1; border-radius: 10px; padding: 10px; background-color: #fdfdfd; height: 100%; display: flex; flex-direction: column; justify-content: space-between; align-items: center;">
                <p style="font-size: 0.9em; font-weight: 500; color: #e67e22; margin-bottom: 10px;">Kaç tane var? Say ve yaz.</p>
                ${items}
                <div style="width: 50px; height: 50px; border: 2px solid #95a5a6; margin-top: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.5em; font-weight: 600; border-radius: 8px;"></div>
            </div>`,
            layoutHint: { min: 4, max: 8 }
        };
    } else { // More or Less
        const itemsMap = { stars: '⭐', apples: '🍎', balloons: '🎈', circles: '🔵' };
        const item = itemsMap[options.objectType] || '⭐';
        const num1 = Math.floor(Math.random() * 8) + 1;
        let num2;
        do {
            num2 = Math.floor(Math.random() * 8) + 1;
        } while (num1 === num2);

        const group1 = Array(num1).fill(`<span style="font-size: 1.2em;">${item}</span>`).join('');
        const group2 = Array(num2).fill(`<span style="font-size: 1.2em;">${item}</span>`).join('');

        return {
            html: `
            <div style="border: 2px solid #ecf0f1; border-radius: 10px; padding: 10px; background-color: #fdfdfd; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <p style="font-size: 0.9em; font-weight: 500; color: #e67e22; margin-bottom: 10px;">Daha fazla olanı daire içine al.</p>
                <div style="display: flex; justify-content: space-around; width: 100%; align-items: center;">
                    <div style="border: 2px dashed #bdc3c7; padding: 10px; border-radius: 8px; min-width: 80px; text-align: center;">${group1}</div>
                    <div style="border: 2px dashed #bdc3c7; padding: 10px; border-radius: 8px; min-width: 80px; text-align: center;">${group2}</div>
                </div>
            </div>`,
            layoutHint: { min: 3, max: 6 }
        }
    }
};

export const generateProblemSolvingActivity = (options = defaultOptions.problemSolving) => {
    const { operation, range, theme } = options;

    const problemTemplates = {
        fruits: { items: ['elma 🍎', 'armut 🍐', 'çilek 🍓'] },
        toys: { items: ['top ⚽', 'araba 🚗', 'ayıcık 🧸'] },
        animals: { items: ['kedi 🐈', 'köpek 🐕', 'kuş 🐦'] },
        sweets: { items: ['kurabiye 🍪', 'şeker 🍬', 'çikolata 🍫'] }
    };

    const selectedThemeData = problemTemplates[theme] || problemTemplates.fruits;
    const item = selectedThemeData.items[Math.floor(Math.random() * selectedThemeData.items.length)];
    const names = ['Ayşe', 'Ali', 'Zeynep', 'Ahmet', 'Elif'];
    const name = names[Math.floor(Math.random() * names.length)];

    let num1, num2, question;

    if (operation === '+') {
        num1 = Math.floor(Math.random() * (range / 2)) + 1;
        num2 = Math.floor(Math.random() * (range / 2 - 1)) + 1;
        question = `Bir sepette ${num1} tane ${item} var. Diğer sepette ${num2} tane ${item} var. İki sepette toplam kaç tane ${item} olur?`;
    } else { // '-'
        num1 = Math.floor(Math.random() * (range / 2)) + Math.floor(range / 2) + 1;
        if (num1 <= 1) num1 = 2;
        num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
        question = `${name}'nin ${num1} tane ${item} vardı. ${num2} tanesini arkadaşına verdi. Geriye kaç tane ${item} kaldı?`;
    }

    return {
        html: `
        <div style="border: 2px solid #ecf0f1; border-radius: 10px; padding: 10px; background-color: #fdfdfd; font-size: 0.9em; text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 10px; line-height: 1.5;">
            <p style="font-size: 1.2em; margin: 0;">${question}</p>
            <p style="font-weight: 600; margin-top: 15px;">Cevap: <span style="display: inline-block; width: 50px; border-bottom: 2px solid black; vertical-align: bottom;"></span></p>
        </div>`,
        layoutHint: { min: 2, max: 6 }
    };
};

export const generateNumberGroupingActivity = (options = {}) => {
    const totalItems = Math.floor(Math.random() * 11) + 10; // 10 to 20 items
    const items = Array(totalItems).fill('🍓').map(i => `<span style="user-select: none; font-size: 1.2em; margin: 2px;">${i}</span>`).join('');
    return {
        html: `
        <div style="border: 2px solid #ecf0f1; border-radius: 10px; padding: 15px; background-color: #fdfdfd; text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: center;">
            <p style="font-size: 0.9em; font-weight: 500; color: #e67e22; margin-bottom: 10px;">10'arlı gruplara ayır. Kaç grup var? Kaç tane arttı?</p>
            <div style="line-height: 1.8; letter-spacing: 5px; margin-bottom: 10px; display: flex; flex-wrap: wrap; justify-content: center;">
                ${items}
            </div>
            <div style="font-size: 0.9em; margin-top: auto; font-weight: 500;">
                Onluk: <span style="display: inline-block; width: 30px; border-bottom: 1px solid black;"></span> Birlik: <span style="display: inline-block; width: 30px; border-bottom: 1px solid black;"></span>
            </div>
        </div>`,
        layoutHint: { min: 2, max: 4 }
    };
};

export const generateMathLanguageActivity = (options = {}) => {
    const activityType = Math.random();

    if (activityType < 0.4) { // Type 1: Symbol Matching
        const symbols = [
            { symbol: '+', name: 'Toplama' }, { symbol: '-', name: 'Çıkarma' },
            { symbol: '=', name: 'Eşittir' }, { symbol: '>', name: 'Büyüktür' }
        ];
        const shuffledSymbols = [...symbols].sort(() => Math.random() - 0.5);
        const shuffledNames = [...symbols].sort(() => Math.random() - 0.5);

        return {
            html: `
            <div style="border: 2px solid #ecf0f1; border-radius: 10px; padding: 15px; background-color: #fdfdfd; text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: center;">
                <p style="font-size: 0.9em; font-weight: 500; color: #e67e22; margin-bottom: 15px;">Sembolleri isimleriyle eşleştir.</p>
                <div style="display: flex; justify-content: space-around; align-items: center;">
                    <div style="display: flex; flex-direction: column; gap: 15px; font-size: 2em; font-weight: bold;">
                        ${shuffledSymbols.map(s => `
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <span>${s.symbol}</span> <span style="font-size: 0.5em;">•</span>
                            </div>`).join('')}
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 15px; font-size: 1em; text-align: left;">
                        ${shuffledNames.map(s => `
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <span style="font-size: 1.5em;">•</span> <span>${s.name}</span>
                            </div>`).join('')}
                    </div>
                </div>
            </div>`,
            layoutHint: { min: 1, max: 2 }
        };
    } else if (activityType < 0.8) { // Type 2: Find Missing Operator
        const isAddition = Math.random() < 0.5;
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const result = isAddition ? num1 + num2 : Math.abs(num1 - num2);
        const firstNum = isAddition ? num1 : Math.max(num1, num2);
        const secondNum = isAddition ? num2 : Math.min(num1, num2);

        return {
             html: `
            <div style="border: 2px solid #ecf0f1; border-radius: 10px; padding: 15px; background-color: #fdfdfd; text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: center;">
                <p style="font-size: 0.9em; font-weight: 500; color: #e67e22; margin-bottom: 15px;">Boşluğa + veya - işareti koy.</p>
                <div style="display: flex; justify-content: center; align-items: center; gap: 10px; font-size: 2.5em; font-weight: bold; font-family: 'Courier New', monospace;">
                    <span>${firstNum}</span>
                    <div style="width: 40px; height: 40px; border: 2px solid #95a5a6; border-radius: 5px;"></div>
                    <span>${secondNum}</span>
                    <span>=</span>
                    <span>${result}</span>
                </div>
            </div>`,
            layoutHint: { min: 2, max: 4 }
        }
    } else { // Type 3: Word to operation
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const isAddition = Math.random() < 0.5;
        const term = isAddition ? 'fazlası' : 'eksiği';
        const symbol = isAddition ? '+' : '-';
        
        return {
            html: `
            <div style="border: 2px solid #ecf0f1; border-radius: 10px; padding: 15px; background-color: #fdfdfd; text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: center;">
                <p style="font-size: 0.9em; font-weight: 500; color: #e67e22; margin-bottom: 15px;">İfadeyi matematik işlemi olarak yaz.</p>
                <p style="font-size: 1.2em; background-color: #f8f9fa; padding: 10px; border-radius: 5px; margin-bottom: 15px;">
                    ${num1}'in ${num2} ${term}
                </p>
                <div style="font-size: 1.5em; font-family: 'Courier New', monospace; letter-spacing: 5px;">
                    ___ ${symbol} ___ = ___
                </div>
            </div>`,
            layoutHint: { min: 2, max: 4 }
        };
    }
};

export const generateVisualRepresentationActivity = (options = {}) => {
    const activityType = Math.random();

    if (activityType < 0.33) { // Ten-frame
        const number = Math.floor(Math.random() * 10) + 1;
        let cells = '';
        for (let i = 0; i < 10; i++) {
            cells += `<div style="width: 30px; height: 30px; border: 1px solid black; background-color: ${i < number ? '#e74c3c' : 'white'};"></div>`;
        }
        return {
            html: `
            <div style="border: 2px solid #ecf0f1; border-radius: 10px; padding: 15px; background-color: #fdfdfd; text-align: center;">
                <p style="font-size: 0.9em; font-weight: 500; color: #e67e22; margin-bottom: 10px;">Bu onluk çerçeve hangi sayıyı gösteriyor?</p>
                <div style="display: grid; grid-template-columns: repeat(5, 30px); gap: 2px; justify-content: center; margin-bottom: 10px;">
                    ${cells}
                </div>
                <div style="width: 50px; height: 50px; border: 2px solid #95a5a6; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 1.5em; font-weight: 600; border-radius: 8px;"></div>
            </div>`,
            layoutHint: { min: 2, max: 4 }
        };
    } else if (activityType < 0.66) { // Number line
        const number = Math.floor(Math.random() * 11);
        return {
            html: `
            <div style="border: 2px solid #ecf0f1; border-radius: 10px; padding: 15px; background-color: #fdfdfd; text-align: center;">
                <p style="font-size: 0.9em; font-weight: 500; color: #e67e22; margin-bottom: 15px;">Nokta hangi sayıyı gösteriyor?</p>
                <svg width="100%" height="50" viewBox="0 0 220 50">
                    <line x1="10" y1="25" x2="210" y2="25" stroke="black" stroke-width="2" />
                    ${Array.from({length: 11}, (_, i) => `
                        <line x1="${10 + i * 20}" y1="20" x2="${10 + i * 20}" y2="30" stroke="black" stroke-width="2" />
                        <text x="${8 + i * 20}" y="45" font-size="10">${i}</text>
                    `).join('')}
                    <circle cx="${10 + number * 20}" cy="25" r="5" fill="#e74c3c" />
                </svg>
                 <div style="width: 50px; height: 50px; border: 2px solid #95a5a6; margin: 10px auto 0; display: flex; align-items: center; justify-content: center; font-size: 1.5em; font-weight: 600; border-radius: 8px;"></div>
            </div>`,
             layoutHint: { min: 2, max: 4 }
        };
    } else { // Subitizing (Dice)
        const number = Math.floor(Math.random() * 6) + 1;
        const dotPositions = {
            1: [[50, 50]],
            2: [[30, 30], [70, 70]],
            3: [[30, 30], [50, 50], [70, 70]],
            4: [[30, 30], [70, 30], [30, 70], [70, 70]],
            5: [[30, 30], [70, 30], [50, 50], [30, 70], [70, 70]],
            6: [[30, 30], [70, 30], [30, 50], [70, 50], [30, 70], [70, 70]]
        };
        const dots = dotPositions[number].map(pos => `<circle cx="${pos[0]}" cy="${pos[1]}" r="8" fill="black" />`).join('');

        return {
            html: `
            <div style="border: 2px solid #ecf0f1; border-radius: 10px; padding: 15px; background-color: #fdfdfd; text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <p style="font-size: 0.9em; font-weight: 500; color: #e67e22; margin-bottom: 10px;">Kaç tane nokta var?</p>
                <svg width="80" height="80" viewBox="0 0 100 100">
                    <rect x="10" y="10" width="80" height="80" rx="10" fill="white" stroke="black" stroke-width="2" />
                    ${dots}
                </svg>
                <div style="width: 50px; height: 50px; border: 2px solid #95a5a6; margin-top: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.5em; font-weight: 600; border-radius: 8px;"></div>
            </div>`,
            layoutHint: { min: 3, max: 6 }
        }
    }
};

export const generateTimeMeasurementGeometryActivity = (options = {}) => {
    const activityType = Math.random();

    if (activityType < 0.4) { // Type 1: Set the clock
        const hours = Math.floor(Math.random() * 12) + 1;
        const minutes = Math.random() < 0.5 ? 0 : 30;
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        return {
            html: `
            <div style="border: 2px solid #ecf0f1; border-radius: 10px; padding: 15px; background-color: #fdfdfd; text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <p style="font-size: 0.9em; font-weight: 500; color: #e67e22; margin-bottom: 10px;">Akrep ve yelkovanı çizerek saati ayarla.</p>
                <p style="font-size: 1.5em; font-weight: 600; font-family: 'Courier New', monospace; margin-bottom: 10px;">${timeString}</p>
                <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" stroke="black" stroke-width="2" fill="white" />
                    <circle cx="50" cy="50" r="3" fill="black" />
                    ${Array.from({length: 12}, (_, i) => {
                        const angle = i * 30 * Math.PI / 180;
                        const x = 50 + 38 * Math.sin(angle);
                        const y = 50 - 38 * Math.cos(angle);
                        return `<text x="${x}" y="${y + 4}" text-anchor="middle" font-size="10">${i === 0 ? 12 : i}</text>`;
                    }).join('')}
                </svg>
            </div>`,
            layoutHint: { min: 2, max: 4 }
        };
    } else if (activityType < 0.8) { // Type 2: Measure with a ruler
        const length = Math.floor(Math.random() * 5) + 3; // 3 to 7 cm
        const items = ['🐛', '✏️', '🔑'];
        const item = items[Math.floor(Math.random() * items.length)];
        return {
             html: `
            <div style="border: 2px solid #ecf0f1; border-radius: 10px; padding: 15px; background-color: #fdfdfd; text-align: center;">
                <p style="font-size: 0.9em; font-weight: 500; color: #e67e22; margin-bottom: 10px;">Nesnenin boyu kaç santimetre?</p>
                <div style="font-size: 2.5em; text-align: left; margin-left: 10px;">${item}</div>
                <svg width="100%" height="40" viewBox="0 0 200 40">
                    <rect x="10" y="20" width="${length * 20}" height="1" fill="none" />
                    <line x1="10" y1="10" x2="10" y2="20" stroke="black" />
                    <line x1="${10 + length * 20}" y1="10" x2="${10 + length * 20}" y2="20" stroke="black" />
                    ${Array.from({ length: 9 }, (_, i) => `
                        <line x1="${10 + i * 20}" y1="20" x2="${10 + i * 20}" y2="${i % 5 === 0 ? 30 : 25}" stroke="black" stroke-width="1" />
                        <text x="${8 + i * 20}" y="38" font-size="8">${i}</text>
                    `).join('')}
                    <line x1="10" y1="20" x2="190" y2="20" stroke="black" stroke-width="1" />
                </svg>
                <p style="margin-top: 10px;">Cevap: <span style="display: inline-block; width: 40px; border-bottom: 1px solid black;"></span> cm</p>
            </div>`,
            layoutHint: { min: 2, max: 4 }
        }
    } else { // Type 3: Count shapes
        const shapes = ['▲', '■', '●'];
        const targetShape = shapes[Math.floor(Math.random() * shapes.length)];
        let allShapes = '';
        for (let i = 0; i < 15; i++) {
            allShapes += `<span style="margin: 3px; font-size: 1.2em; color: ${Math.random() > 0.5 ? '#3498db' : '#e74c3c'};">${shapes[Math.floor(Math.random() * shapes.length)]}</span>`;
        }
        return {
             html: `
            <div style="border: 2px solid #ecf0f1; border-radius: 10px; padding: 15px; background-color: #fdfdfd; text-align: center;">
                <p style="font-size: 0.9em; font-weight: 500; color: #e67e22; margin-bottom: 10px;">Resimde kaç tane <strong style="font-size: 1.2em;">${targetShape}</strong> var?</p>
                <div style="line-height: 1.5; border: 1px solid #ddd; border-radius: 5px; padding: 5px; background: #fafafa;">
                    ${allShapes}
                </div>
                 <p style="margin-top: 10px;">Cevap: <span style="display: inline-block; width: 40px; border-bottom: 1px solid black;"></span></p>
            </div>`,
            layoutHint: { min: 2, max: 3 }
        }
    }
};

export const generateSpatialReasoningActivity = (options = {}) => {
    const shapes = [
        { name: 'circle', svg: '<circle cx="20" cy="20" r="15" fill="#3498db" />' },
        { name: 'square', svg: '<rect x="5" y="5" width="30" height="30" fill="#2ecc71" />' },
        { name: 'triangle', svg: '<polygon points="20,5 35,35 5,35" fill="#e74c3c" />' }
    ];
    const shuffledShapes = [...shapes].sort(() => Math.random() - 0.5);
    const pattern = [shuffledShapes[0], shuffledShapes[1]]; // ABAB pattern
    
    let displayHtml = '';
    for(let i = 0; i < 3; i++) {
        displayHtml += `<svg width="40" height="40" viewBox="0 0 40 40">${pattern[i % 2].svg}</svg>`;
    }
    displayHtml += `<div style="width: 40px; height: 40px; border: 2px dashed #95a5a6; display: flex; justify-content: center; align-items: center; font-size: 1.5em; color: #95a5a6;">?</div>`;

    let optionsHtml = shuffledShapes.map(s => `<svg width="40" height="40" viewBox="0 0 40 40">${s.svg}</svg>`).join('');

    return {
        html: `
        <div style="border: 2px solid #ecf0f1; border-radius: 10px; padding: 15px; background-color: #fdfdfd; text-align: center;">
            <p style="font-size: 0.9em; font-weight: 500; color: #e67e22; margin-bottom: 10px;">Sıradaki şekil hangisi olmalı?</p>
            <div style="display: flex; justify-content: center; align-items: center; gap: 5px; margin-bottom: 15px;">
                ${displayHtml}
            </div>
            <div style="display: flex; justify-content: center; align-items: center; gap: 10px; padding-top: 10px; border-top: 1px solid #f0f0f0;">
                ${optionsHtml}
            </div>
        </div>`,
        layoutHint: { min: 2, max: 3 }
    };
};

export const generateEstimationSkillsActivity = (options = {}) => {
    const count = Math.floor(Math.random() * 31) + 15; // 15 to 45
    let dots = '';
    for (let i = 0; i < count; i++) {
        const x = Math.random() * 70 + 15;
        const y = Math.random() * 70 + 25;
        dots += `<circle cx="${x}" cy="${y}" r="3" fill="#3498db" opacity="0.8" />`;
    }

    const estimate = Math.round(count / 10) * 10;
    const optionsArr = [
        `Yaklaşık ${estimate}`,
        `Yaklaşık ${estimate - 10}`,
        `Yaklaşık ${estimate + 10}`
    ].sort(() => Math.random() - 0.5);
    
    return {
        html: `
        <div style="border: 2px solid #ecf0f1; border-radius: 10px; padding: 15px; background-color: #fdfdfd; text-align: center;">
            <p style="font-size: 0.9em; font-weight: 500; color: #e67e22; margin-bottom: 10px;">Kavanozda yaklaşık kaç misket var?</p>
            <svg width="100" height="100" viewBox="0 0 100 100">
                <path d="M20,95 C20,80 10,80 10,60 L10,20 C10,5 20,5 30,5 L70,5 C80,5 90,5 90,20 L90,60 C90,80 80,80 80,95 Z" fill="#e0f7fa" stroke="#b0bec5" stroke-width="2"/>
                ${dots}
                <rect x="25" y="0" width="50" height="8" fill="#78909c" rx="2" />
            </svg>
            <div style="display: flex; flex-direction: column; gap: 5px; margin-top: 10px;">
                ${optionsArr.map(opt => `<div style="border: 2px solid #ecf0f1; border-radius: 5px; padding: 8px; font-size: 0.9em; cursor: pointer;">${opt}</div>`).join('')}
            </div>
        </div>`,
        layoutHint: { min: 2, max: 4 }
    };
};

export const generateFractionsDecimalsActivity = (options = {}) => {
    const activityType = Math.random();
    const fractions = [
        { text: '1/2', parts: 2, shade: 1, shape: 'circle' },
        { text: '1/4', parts: 4, shade: 1, shape: 'circle' },
        { text: '3/4', parts: 4, shade: 3, shape: 'circle' },
        { text: '1/3', parts: 3, shade: 1, shape: 'bar' },
        { text: '2/3', parts: 3, shade: 2, shape: 'bar' },
    ];
    const selected = fractions[Math.floor(Math.random() * fractions.length)];

    if (activityType < 0.5) { // Type 1: Color the fraction
        let shapeSvg = '';
        if (selected.shape === 'circle') {
             shapeSvg = `<circle cx="50" cy="50" r="40" stroke="black" stroke-width="2" fill="white" />`;
             for(let i=0; i < selected.parts; i++) {
                 shapeSvg += `<line x1="50" y1="50" x2="${50 + 40 * Math.cos(i*2*Math.PI/selected.parts)}" y2="${50 + 40 * Math.sin(i*2*Math.PI/selected.parts)}" stroke="black" stroke-width="1" />`;
             }
        } else { // Bar
             shapeSvg = `<rect x="10" y="20" width="80" height="60" stroke="black" stroke-width="2" fill="white" />`;
             for(let i = 1; i < selected.parts; i++) {
                shapeSvg += `<line x1="${10 + i * 80/selected.parts}" y1="20" x2="${10 + i * 80/selected.parts}" y2="80" stroke="black" stroke-width="1" />`;
             }
        }
        return {
            html: `
            <div style="border: 2px solid #ecf0f1; border-radius: 10px; padding: 15px; background-color: #fdfdfd; text-align: center;">
                <p style="font-size: 0.9em; font-weight: 500; color: #e67e22; margin-bottom: 10px;">Şeklin <strong style="font-size: 1.2em;">${selected.text}</strong> kadarını boya.</p>
                <svg width="100" height="100" viewBox="0 0 100 100">
                    ${shapeSvg}
                </svg>
            </div>`,
            layoutHint: { min: 2, max: 4 }
        };
    } else { // Type 2: Identify the fraction
        let shapeSvg = '';
         if (selected.shape === 'circle') {
            const angleSlice = 2 * Math.PI / selected.parts;
            for(let i = 0; i < selected.parts; i++) {
                if (i < selected.shade) {
                    const startAngle = i * angleSlice - Math.PI/2;
                    const endAngle = (i + 1) * angleSlice - Math.PI/2;
                    const x1 = 50 + 40 * Math.cos(startAngle);
                    const y1 = 50 + 40 * Math.sin(startAngle);
                    const x2 = 50 + 40 * Math.cos(endAngle);
                    const y2 = 50 + 40 * Math.sin(endAngle);
                    shapeSvg += `<path d="M50,50 L${x1},${y1} A40,40 0 0,1 ${x2},${y2} Z" fill="#3498db" />`;
                }
            }
            shapeSvg += `<circle cx="50" cy="50" r="40" stroke="black" stroke-width="2" fill="none" />`;
            for(let i=0; i < selected.parts; i++) {
                 shapeSvg += `<line x1="50" y1="50" x2="${50 + 40 * Math.cos(i*2*Math.PI/selected.parts)}" y2="${50 + 40 * Math.sin(i*2*Math.PI/selected.parts)}" stroke="black" stroke-width="1" />`;
            }
        } else { // Bar
            shapeSvg += `<rect x="10" y="20" width="80" height="60" stroke="black" stroke-width="2" fill="none" />`;
            for(let i = 0; i < selected.parts; i++) {
                 shapeSvg += `<rect x="${10 + i * 80/selected.parts}" y="20" width="${80/selected.parts}" height="60" fill="${i < selected.shade ? '#3498db' : 'white'}" stroke="black" stroke-width="1" />`;
            }
        }
        const distractors = fractions.filter(f => f.text !== selected.text);
        const options = [
            selected.text,
            distractors[Math.floor(Math.random() * distractors.length)].text,
            distractors[Math.floor(Math.random() * distractors.length)].text
        ].filter((v, i, a) => a.indexOf(v) === i).slice(0,3).sort(() => Math.random() - 0.5);

         return {
            html: `
            <div style="border: 2px solid #ecf0f1; border-radius: 10px; padding: 15px; background-color: #fdfdfd; text-align: center;">
                <p style="font-size: 0.9em; font-weight: 500; color: #e67e22; margin-bottom: 10px;">Şekil hangi kesri gösteriyor?</p>
                <svg width="100" height="100" viewBox="0 0 100 100">
                    ${shapeSvg}
                </svg>
                 <div style="display: flex; justify-content: space-around; margin-top: 10px;">
                    ${options.map(o => `<div style="border: 1px solid #ccc; border-radius: 5px; padding: 5px 10px; cursor: pointer;">${o}</div>`).join('')}
                </div>
            </div>`,
            layoutHint: { min: 2, max: 4 }
        };
    }
};

export const generateVisualArithmeticActivity = (options = {}) => {
    const operation = Math.random() < 0.5 ? '+' : '-';
    const items = ['🍎', '⚽', '⭐', '🚗'];
    const item = items[Math.floor(Math.random() * items.length)];
    let num1, num2;

    if (operation === '+') {
        num1 = Math.floor(Math.random() * 5) + 1;
        num2 = Math.floor(Math.random() * 5) + 1;
    } else { // '-'
        num1 = Math.floor(Math.random() * 5) + 3; // Ensure num1 is at least 3
        num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
    }

    const group1 = Array(num1).fill(item).join('');
    const group2 = Array(num2).fill(item).join('');
    
    return {
        html: `
        <div style="border: 2px solid #ecf0f1; border-radius: 10px; padding: 15px; background-color: #fdfdfd; text-align: center;">
            <p style="font-size: 0.9em; font-weight: 500; color: #e67e22; margin-bottom: 10px;">İşlemin sonucunu bul.</p>
            <div style="display: flex; justify-content: center; align-items: center; font-size: 1.8em; gap: 10px;">
                <span>${group1}</span>
                <span style="font-weight: bold;">${operation}</span>
                <span>${group2}</span>
                <span>=</span>
                 <div style="width: 40px; height: 40px; border: 2px solid #95a5a6; border-radius: 5px;"></div>
            </div>
        </div>`,
        layoutHint: { min: 3, max: 6 }
    };
};