const defaultOptions = {
    letterDetective: { pair: 'b-d', gridSize: 5, density: 0.4 },
    rhyming: { setIndex: 0, difficulty: 'easy' },
};


const _generateLetterGridActivity = (options = defaultOptions.letterDetective) => {
    const pairs = { 
        'b-d': ['b', 'd'], 'p-q': ['p', 'q'], 'm-n': ['m', 'n'], 's-z': ['s', 'z'], 'f-t': ['f', 't'],
        'i-ı': ['i', 'ı'], 'o-ö': ['o', 'ö'], 'u-ü': ['u', 'ü']
    };
    const [target, distractor] = pairs[options.pair] || pairs['b-d'];
    const gridSize = options.gridSize || 5;
    const density = Math.min(options.density || 0.4, 1.0);
    let grid = '';
    
    for (let i = 0; i < gridSize * gridSize; i++) {
        const letter = Math.random() < density ? target : distractor;
        grid += `<div style="font-size: 1.5em; font-weight: 600; color: var(--text-color); display: flex; align-items: center; justify-content: center; user-select: none;">${letter}</div>`;
    }

    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; background-color: var(--card-bg-color); height: 100%;">
            <p style="text-align: center; margin-bottom: 10px; font-size: 0.9em;">Tüm '<strong style="color: var(--primary-color);">${target}</strong>' harflerini daire içine al.</p>
            <div style="display: grid; grid-template-columns: repeat(${gridSize}, 1fr); gap: 5px; aspect-ratio: 1/1; background-color: var(--background-color); padding: 5px; border-radius: 5px;">
                ${grid}
            </div>
        </div>`,
        layoutHint: { min: 4, max: 8 }
    };
};

const _generateWordHuntActivity = (options = defaultOptions.letterDetective) => {
    const wordSets = [
        { target: 'bal', distractors: ['dal', 'bol', 'bel', 'sal'] }, { target: 'taş', distractors: ['kaş', 'yaş', 'tas', 'tav'] },
        { target: 'kar', distractors: ['kır', 'kür', 'kor', 'kral'] }, { target: 'yol', distractors: ['kol', 'yel', 'yıl', 'sol'] },
        { target: 'pil', distractors: ['fil', 'dil', 'pul', 'pim'] }, { target: 'yaz', distractors: ['kaz', 'yüz', 'yoz', 'saz'] },
        { target: 'ben', distractors: ['sen', 'bin', 'ban', 'ten'] }, { target: 'doksan', distractors: ['seksen', 'toksan', 'dokan', 'dokun'] }
    ];
    const selected = wordSets[Math.floor(Math.random() * wordSets.length)];
    const words = [
        selected.target, selected.target, selected.target,
        ...selected.distractors
    ].sort(() => Math.random() - 0.5);

    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; background-color: var(--card-bg-color); height: 100%;">
            <p style="text-align: center; margin-bottom: 10px; font-size: 0.9em;">Tüm '<strong style="color: var(--primary-color);">${selected.target}</strong>' kelimelerini bul ve işaretle.</p>
            <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; align-items: center; background-color: var(--background-color); padding: 10px; border-radius: 5px;">
                ${words.map(w => `<span style="background: var(--card-bg-color); border: 1px solid var(--border-color); padding: 3px 8px; border-radius: 4px; font-size: 1.1em;">${w}</span>`).join('')}
            </div>
        </div>`,
        layoutHint: { min: 3, max: 6 }
    }
};

export const generateLetterDetectiveActivity = (options = defaultOptions.letterDetective) => {
    const subGenerators = [_generateLetterGridActivity, _generateWordHuntActivity];
    const selectedGenerator = subGenerators[Math.floor(Math.random() * subGenerators.length)];
    return selectedGenerator(options);
};

const getRhymingSet = () => {
     const sets = [
        { rhyming: ['el', 'tel'], nonRhyming: { easy: 'göz', hard: 'sel' }, icon: '✋' }, { rhyming: ['taş', 'kaş'], nonRhyming: { easy: 'el', hard: 'yaş' }, icon: '🪨' },
        { rhyming: ['yüz', 'güz'], nonRhyming: { easy: 'at', hard: 'düz' }, icon: '😊' }, { rhyming: ['kale', 'lale'], nonRhyming: { easy: 'top', hard: 'jale' }, icon: '🏰' },
        { rhyming: ['para', 'yara'], nonRhyming: { easy: 'kutu', hard: 'sıra' }, icon: '💰' }, { rhyming: ['kutu', 'mutu'], nonRhyming: { easy: 'yol', hard: 'kuru' }, icon: '📦' },
        { rhyming: ['kapı', 'yapı'], nonRhyming: { easy: 'cam', hard: 'tapı' }, icon: '🚪' }, { rhyming: ['okul', 'yokul'], nonRhyming: { easy: 'sıra', hard: 'kul' }, icon: '🏫' },
        { rhyming: ['yatak', 'batak'], nonRhyming: { easy: 'yorgan', hard: 'çatak' }, icon: '🛏️' }, { rhyming: ['çilek', 'elek'], nonRhyming: { easy: 'kiraz', hard: 'dilek' }, icon: '🍓' },
        { rhyming: ['süt', 'küt'], nonRhyming: { easy: 'peynir', hard: 'büt' }, icon: '🥛' },
        { rhyming: ['masa', 'kasa'], nonRhyming: { easy: 'tabak', hard: 'tasa' }, icon: '🏽' },
        { rhyming: ['gemi', 'yemi'], nonRhyming: { easy: 'liman', hard: 'gemi' }, icon: '🚢' },
        { rhyming: ['ayna', 'kayna'], nonRhyming: { easy: 'tarak', hard: 'aynı' }, icon: '🪞' },
        { rhyming: ['kalem', 'elem'], nonRhyming: { easy: 'defter', hard: 'kelam' }, icon: '✏️' },
        { rhyming: ['çanta', 'kanta'], nonRhyming: { easy: 'okul', hard: 'şantaj' }, icon: '🎒' },
    ];
    return sets[Math.floor(Math.random() * sets.length)];
};

const _generateTextBasedRhymingActivity = (options = defaultOptions.rhyming) => {
    const selected = getRhymingSet();
    const targetWord = selected.rhyming[0];
    const shuffledOptions = [
        selected.rhyming[1], 
        selected.nonRhyming[options.difficulty || 'easy'], 
        ['yaz', 'kış', 'at', 'ev', 'su', 'yol'][Math.floor(Math.random() * 6)]
    ].sort(() => Math.random() - 0.5);
    
    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); text-align: center;">
            <p style="font-size: 0.9em; margin-bottom: 10px;">Hangisi <strong style="color:var(--primary-color)">${targetWord}</strong> ile kafiyeli?</p>
            <div style="display: flex; flex-direction: column; gap: 5px;">
                ${shuffledOptions.map(opt => `<div style="border: 2px solid var(--border-color); border-radius: 5px; padding: 8px; font-size: 1.1em; cursor: pointer;">${opt}</div>`).join('')}
            </div>
        </div>`,
        layoutHint: { min: 4, max: 6 }
    };
};

const _generatePictureBasedRhymingActivity = (options = defaultOptions.rhyming) => {
    const selected = getRhymingSet();
    const shuffledOptions = [
        selected.rhyming[1],
        selected.nonRhyming[options.difficulty || 'easy'],
        ['kedi', 'top', 'su', 'gül', 'mum'][Math.floor(Math.random()*5)]
    ].sort(() => Math.random() - 0.5);

    return {
         html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); text-align: center;">
            <p style="font-size: 0.9em; margin-bottom: 5px;">Resimle kafiyeli olan kelimeyi bul.</p>
            <div style="font-size: 3em; margin-bottom: 5px;">${selected.icon}</div>
            <div style="display: flex; flex-direction: column; gap: 5px;">
                ${shuffledOptions.map(opt => `<div style="border: 2px solid var(--border-color); border-radius: 5px; padding: 8px; font-size: 1.1em; cursor: pointer;">${opt}</div>`).join('')}
            </div>
        </div>`,
        layoutHint: { min: 4, max: 6 }
    }
};

export const generateRhymingActivity = (options = defaultOptions.rhyming) => {
    const subGenerators = [_generateTextBasedRhymingActivity, _generatePictureBasedRhymingActivity];
    const selectedGenerator = subGenerators[Math.floor(Math.random() * subGenerators.length)];
    return selectedGenerator(options);
};

export const generateReadingAloudActivity = (options = { difficulty: 'easy' }) => {
    const sentences = {
        easy: [ "Ali topu at.", "Ela lale al.", "O kedi süt içti.", "Kırmızı araba hızlı.", "Güneş sarıdır.", "Bak bu bir fil.", "Ayşe ip atla.", "Uçak uçuyor.", "Bu bir köpek.", "Baba eve geldi.", "Anne yemek yaptı." ],
        medium: [ "Ayşe okuluna yürüyor.", "Küçük köpek bahçede oynuyor.", "Annem lezzetli bir kek yaptı.", "Bugün hava çok güzel.", "Balıklar denizde yüzer.", "Dedem bana masal anlattı.", "Kardeşim parkta kaydıraktan kayıyor.", "Babam gazete okuyor." ],
        hard: [ "Bir berber bir berbere gel berberim demiş.", "Şu köşe yaz köşesi, şu köşe kış köşesi.", "Paşa tasıyla beş tas has hoşaf.", "Dal sarkar kartal kalkar, kartal kalkar dal sarkar.", "Piknikte puf puf puflayan puf börekleri yedik.", "Çatalca'da topal çoban çatal yapıp çatal satar." ]
    };
    const selectedSet = sentences[options.difficulty] || sentences.easy;
    const sentence = selectedSet[Math.floor(Math.random() * selectedSet.length)];
    return {
        html: `<div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); text-align: center; display: flex; align-items: center; justify-content: center; height: 100%; font-size: 1.1em; line-height: 1.6;">${sentence}</div>`,
        layoutHint: { min: 4, max: 8 }
    };
};

export const generateMeaningExplorerActivity = (options = { difficulty: 'easy' }) => {
    const texts = {
        easy: [
            { text: "Küçük kedi Minnoş, bahçede oynuyordu. Bir kelebek gördü ve peşinden koştu. Kelebek uçtu ve bir çiçeğe kondu.", question: "Minnoş bahçede neyin peşinden koştu?", options: ["Bir kuşun", "Bir kelebeğin", "Bir topun"] },
            { text: "Ali, pazara gitti. Annesi için iki kilo elma ve bir kilo portakal aldı. Sonra eve döndü.", question: "Ali pazardan ne almadı?", options: ["Elma", "Portakal", "Armut"] },
            { text: "Zeynep sabah uyandı. Elini yüzünü yıkadı ve kahvaltı yaptı. Sonra okul servisine bindi.", question: "Zeynep okula ne ile gitti?", options: ["Yürüyerek", "Arabayla", "Servisle"] }
        ],
        hard: [
            { text: "Ali, kütüphaneye gitti. Araştırma yapmak için bir kitap arıyordu. Raflara baktı ve uzay hakkında ilginç bir kitap buldu. Kitabı alıp masaya oturdu.", question: "Ali kitabı nerede buldu?", options: ["Parkta", "Okulda", "Kütüphanede"] },
            { text: "Zeynep, resim yapmayı çok seviyor. Kırmızı, mavi ve sarı boyalarını çıkardı. Büyük bir kağıda gökkuşağı çizmeye başladı. Çünkü yağmurdan sonra gökkuşağını görmeyi çok seviyordu.", question: "Zeynep neden gökkuşağı çiziyor?", options: ["Öğretmeni istediği için", "Gökkuşağını sevdiği için", "Canı sıkıldığı için"] },
            { text: "Ahmet ve babası balık tutmaya gitti. Oltalarını göle attılar ve beklemeye başladılar. Bir süre sonra Ahmet'in oltasına büyük bir balık takıldı. Babasının yardımıyla balığı sudan çıkardılar.", question: "Ahmet'e balığı tutarken kim yardım etti?", options: ["Annesi", "Babası", "Arkadaşı"] }
        ]
    };
    const selectedSet = texts[options.difficulty] || texts.easy;
    const item = selectedSet[Math.floor(Math.random() * selectedSet.length)];
    const shuffledOptions = [...item.options].sort(() => Math.random() - 0.5);

    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); text-align: left; height: 100%; display: flex; flex-direction: column; justify-content: space-around;">
            <p style="font-size: 0.9em; line-height: 1.6; margin-bottom: 10px;">${item.text}</p>
            <p style="font-size: 0.9em; font-weight: 600; margin-bottom: 10px;">${item.question}</p>
            <div style="display: flex; flex-direction: column; gap: 5px;">
                 ${shuffledOptions.map(opt => `<div style="border: 2px solid var(--border-color); border-radius: 5px; padding: 8px; font-size: 0.9em; cursor: pointer;">( ) ${opt}</div>`).join('')}
            </div>
        </div>`,
        layoutHint: { min: 1, max: 3 }
    };
};

export const generateWordExplorerActivity = (options = { difficulty: 'easy' }) => {
    const wordList = {
        easy: [
            { word: 'neşeli', correct: 'mutlu, sevinçli', incorrect: ['üzgün', 'kızgın'] }, { word: 'büyük', correct: 'iri, kocaman', incorrect: ['küçük', 'kısa'] },
            { word: 'hızlı', correct: 'süratli', incorrect: ['yavaş', 'durgun'] }, { word: 'ıslak', correct: 'yaş', incorrect: ['kuru', 'sıcak'] },
            { word: 'güzel', correct: 'hoş, alımlı', incorrect: ['çirkin', 'kötü'] }
        ],
        hard: [
            { word: 'muazzam', correct: 'çok büyük, görkemli', incorrect: ['sıradan', 'basit'] }, { word: 'gayret', correct: 'çaba', incorrect: ['tembellik', 'isteksizlik'] },
            { word: 'öykü', correct: 'hikaye', incorrect: ['şiir', 'roman'] }, { word: 'sual', correct: 'soru', incorrect: ['cevap', 'yanıt'] },
            { word: 'faydalı', correct: 'yararlı', incorrect: ['zararlı', 'gereksiz'] }
        ]
    };
    const selectedSet = wordList[options.difficulty] || wordList.easy;
    const item = selectedSet[Math.floor(Math.random() * selectedSet.length)];
    const definitions = [item.correct, ...item.incorrect].sort(() => Math.random() - 0.5);
    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); text-align: center;">
            <p style="font-size: 0.9em; margin-bottom: 10px;"><strong style="color:var(--primary-color)">${item.word}</strong> kelimesinin anlamı nedir?</p>
            <div style="display: flex; flex-direction: column; gap: 5px;">
                ${definitions.map(opt => `<div style="border: 2px solid var(--border-color); border-radius: 5px; padding: 8px; font-size: 1em; cursor: pointer;">${opt}</div>`).join('')}
            </div>
        </div>`,
        layoutHint: { min: 2, max: 4 }
    };
};

export const generateVisualMasterActivity = (options = { length: 3 }) => {
    const shapes = ['🔴', '🔷', '⭐', '💚', '🌙', '🔶', '💜'];
    let sequence = '';
    for (let i = 0; i < options.length; i++) {
        sequence += shapes[Math.floor(Math.random() * shapes.length)];
    }
    const boxes = Array(options.length).fill('<div style="width: 40px; height: 40px; border: 2px dashed var(--light-text-color); border-radius: 5px;"></div>').join('');
    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); text-align: center;">
            <p style="font-size: 0.9em; margin-bottom: 10px;">Sırayı aklında tut ve çiz.</p>
            <div style="display: flex; justify-content: center; align-items: center; gap: 10px; font-size: 2em; margin-bottom: 15px; padding: 10px; background-color: var(--background-color); border-radius: 5px;">
                ${sequence.split('').map(s => `<span>${s}</span>`).join('')}
            </div>
            <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
                ${boxes}
            </div>
        </div>`,
        layoutHint: { min: 3, max: 6 }
    };
};

export const generateWordHunterActivity = (options = { syllable: 'el' }) => {
    const wordList = {
        'el': { targets: ['elma', 'kel', 'gelin', 'sel', 'yelken'], distractors: ['top', 'kedi', 'ata', 'yol'] },
        'ka': { targets: ['kale', 'kasa', 'yaka', 'kalem', 'kapı'], distractors: ['sel', 'pil', 'kir', 'göl'] },
        'ba': { targets: ['baba', 'balık', 'bardak', 'baca', 'bavul'], distractors: ['kuzu', 'yün', 'tüy', 'süt'] },
    };
    const selectedSet = wordList[options.syllable] || wordList['el'];
    const words = [...selectedSet.targets, ...selectedSet.distractors].sort(() => Math.random() - 0.5).slice(0, 6);
    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); text-align: center;">
            <p style="font-size: 0.9em; margin-bottom: 10px;">İçinde '<strong style="color:var(--primary-color)">${options.syllable}</strong>' hecesi olan kelimeleri bul.</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; text-align: center;">
                ${words.map(w => `<div style="border: 2px solid var(--border-color); border-radius: 5px; padding: 8px; font-size: 1.1em;">${w}</div>`).join('')}
            </div>
        </div>`,
        layoutHint: { min: 3, max: 6 }
    };
};

export const generateSpellingChampionActivity = (options = { word: 'tren' }) => {
    const wordList = {
        'tren': { correct: 'tren', incorrect: 'tiren', icon: '🚂' },
        'yanlış': { correct: 'yanlış', incorrect: 'yanlız', icon: '❌' },
        'herkes': { correct: 'herkes', incorrect: 'herkez', icon: '👥' },
        'kral': { correct: 'kral', incorrect: 'kıral', icon: '👑' },
        'spor': { correct: 'spor', incorrect: 'sipor', icon: '⚽' },
        'çünkü': { correct: 'çünkü', incorrect: 'çünki', icon: '🤔' }
    };
    const selected = wordList[options.word] || wordList['tren'];
    const spellings = [selected.correct, selected.incorrect].sort(() => Math.random() - 0.5);
    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); text-align: center;">
            <p style="font-size: 0.9em; margin-bottom: 10px;">Doğru yazılışı hangisi?</p>
            <div style="font-size: 2em; margin-bottom: 10px;">${selected.icon}</div>
            <div style="display: flex; justify-content: center; gap: 10px;">
                ${spellings.map(s => `<div style="border: 2px solid var(--border-color); border-radius: 5px; padding: 5px 15px; font-size: 1.2em; cursor: pointer;">${s}</div>`).join('')}
            </div>
        </div>`,
        layoutHint: { min: 4, max: 8 }
    };
};

export const generateMemoryPlayerActivity = (options = { itemCount: 3 }) => {
    const items = ['🍎', '🍌', '🥝', '🍓', '🍇', '🍊', '🍍', '🍉'];
    const shuffledItems = items.sort(() => Math.random() - 0.5);
    const sequence = shuffledItems.slice(0, options.itemCount);
    const missingIndex = Math.floor(Math.random() * options.itemCount);
    
    const secondSequence = sequence.map((item, index) => 
        index === missingIndex ? '<div style="width: 30px; height: 30px; border: 2px solid var(--light-text-color); border-radius: 5px;"></div>' : `<span>${item}</span>`
    );

    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); text-align: center;">
            <p style="font-size: 0.9em; margin-bottom: 10px;">Eksik olanı çiz.</p>
            <div style="display: flex; justify-content: center; align-items: center; gap: 10px; font-size: 2em; margin-bottom: 15px; padding: 10px; background-color: var(--background-color); border-radius: 5px;">
                ${sequence.join(' ')}
            </div>
            <div style="display: flex; justify-content: center; align-items: center; gap: 10px; font-size: 2em;">
                ${secondSequence.join(' ')}
            </div>
        </div>`,
        layoutHint: { min: 3, max: 6 }
    };
};

const _generateFillInTheBlankActivity = (options = { difficulty: 'easy' }) => {
    const wordList = [
        { word: 'kedi', icon: '🐈', easy: 'ke_i', hard: 'k_d_' }, { word: 'elma', icon: '🍎', easy: 'el_a', hard: '_lm_' },
        { word: 'top', icon: '⚽', easy: 't_p', hard: 't_p' }, { word: 'ev', icon: '🏠', easy: '_v', hard: '_v' },
        { word: 'gemi', icon: '⚓', easy: 'ge_i', hard: 'g_m_' }, { word: 'yılan', icon: '🐍', easy: 'yı_an', hard: 'y_l_n' }
    ];
    const item = wordList[Math.floor(Math.random() * wordList.length)];
    const puzzle = item[options.difficulty];
    
    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); text-align: center;">
            <p style="font-size: 0.9em; font-weight: 500; color: var(--primary-color); margin-bottom: 10px;">Eksik harfi tamamla.</p>
            <div style="font-size: 2.5em; margin-bottom: 10px;">${item.icon}</div>
            <div style="letter-spacing: 8px; font-size: 1.5em; font-weight: 600; font-family: 'Courier New', monospace;">${puzzle}</div>
        </div>`,
        layoutHint: { min: 4, max: 8 }
    };
};

const _generateJoinSyllablesActivity = (options = {}) => {
     const wordList = [
        { word: 'kitap', syllables: ['ki', 'tap'] }, { word: 'kalem', syllables: ['ka', 'lem'] },
        { word: 'araba', syllables: ['a', 'ra', 'ba'] }, { word: 'kelebek', syllables: ['ke', 'le', 'bek'] },
        { word: 'domates', syllables: ['do', 'ma', 'tes'] }, { word: 'bilgisayar', syllables: ['bil', 'gi', 'sa', 'yar'] }
    ];
    const item = wordList[Math.floor(Math.random() * wordList.length)];

    return {
        html: `
        <div style="border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; background-color: var(--card-bg-color); text-align: center;">
            <p style="font-size: 0.9em; font-weight: 500; color: var(--primary-color); margin-bottom: 10px;">Heceleri birleştirip kelimeyi yaz.</p>
            <div style="display: flex; gap: 10px; justify-content: center; padding: 10px; background-color: var(--background-color); border-radius: 5px; margin-bottom: 15px; font-size: 1.2em;">
                ${item.syllables.join(' - ')}
            </div>
            <div style="width: 80%; margin: 0 auto; border-bottom: 2px solid var(--text-color); min-height: 24px;"></div>
        </div>`,
        layoutHint: { min: 3, max: 6 }
    }
};

export const generateAuditoryWritingActivity = (options = { difficulty: 'easy' }) => {
    const subGenerators = [_generateFillInTheBlankActivity, _generateJoinSyllablesActivity];
    const selectedGenerator = subGenerators[Math.floor(Math.random() * subGenerators.length)];
    return selectedGenerator(options);
};