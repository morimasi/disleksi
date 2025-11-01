import { MODULE_DATA } from '../data/modules';

export const generateAiPrompt = (selectedModule, settings, appearanceSettings) => {
    const settingsString = JSON.stringify(settings, null, 2);
    
    const layoutInstructions = {
        'auto': 'Use a flexible flow layout (CSS Flexbox with flex-wrap: wrap).',
        'columns-2': 'Use a 2-column grid layout (CSS Grid with grid-template-columns: 1fr 1fr).',
        'columns-3': 'Use a 3-column grid layout (CSS Grid with grid-template-columns: 1fr 1fr 1fr).',
        'grid': 'Use a dynamic grid layout that adapts to content size (CSS Grid with grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))).'
    };
    const currentLayoutInstruction = layoutInstructions[appearanceSettings.layout] || layoutInstructions['auto'];

    const categoryKey = Object.keys(MODULE_DATA).find(key => 
        MODULE_DATA[key].modules.some(m => m.id === selectedModule.id)
    );

    let categorySpecifics = '';
    switch(categoryKey) {
        case 'dyslexia':
            categorySpecifics = `**Category Focus (Dyslexia):** Prioritize clear, sans-serif fonts, ample letter spacing, and uncluttered design. Activities should concretely target phonological awareness, letter-sound correspondence, and decoding. Avoid visually similar letters close together unless it's a specific discrimination task.`;
            break;
        case 'dyscalculia':
            categorySpecifics = `**Category Focus (Dyscalculia):** Emphasize visual and concrete representations of numbers (e.g., ten-frames, number lines, objects). Use simple language for word problems. Ensure numbers are clear and well-spaced. Activities should focus on number sense, quantity, and basic operations in a tangible way.`;
            break;
        case 'dysgraphia':
            categorySpecifics = `**Category Focus (Dysgraphia):** Provide ample space for writing. Use clear visual guides for letter formation (like dotted lines or starting points). Activities should focus on fine motor control, letter formation, spacing, and organizing thoughts into written language.`;
            break;
    }

    return `
    **Role & Persona:** Act as a PhD-level special education therapist and a professional pedagogical graphic designer. Your output is not just a worksheet; it is a high-quality, expert-crafted learning material. Your work is clean, engaging, pedagogically sound, and COMPLETE.

    **ABSOLUTE RULE: NO EMPTY OR PLACEHOLDER CONTENT.** Every single generated activity must be fully fleshed out, with clear instructions, solvable problems, and engaging content. Never output "Etkinlik" or similar placeholders. The user must receive a finished, usable product. An example of a good, complete sub-activity is: \`<div style="..."><p>Kayıp harfi bul ve yaz.</p><div style="font-size: 2em;">🐈</div><p style="font-size: 1.5em; letter-spacing: 5px;">ke_i</p></div>\`. An example of a BAD, incomplete activity is: \`<div style="..."><p>Etkinlik</p></div>\`. NEVER produce bad activities.

    **Core Mission:** Create a sequence of print-ready, A4-sized worksheet pages in HTML. You will generate a VARIETY of different, COMPLETE sub-activities related to the main module. These activities must flow naturally. If the content exceeds the space on one A4 page, you MUST continue onto a new page, separating pages with the special delimiter: \`<!-- PAGE_BREAK -->\`.

    **Physical Interaction Mandate (CRITICAL):** The child MUST be required to physically interact with the worksheet. Every single sub-activity must involve drawing, writing, circling, connecting, coloring, or cutting. No passive reading.

    **Variety Mandate (CRITICAL):** The sub-activities must be diverse and engaging. DO NOT just repeat the same activity type. For the selected module, generate a rich mix of tasks. For example, combine: 1. A "find and circle" task. 2. A "match the pairs" task with lines. 3. A "trace the path" maze. 4. A "fill in the blank" task. 5. A simple "draw your own" task based on a prompt. The goal is to create a rich, multi-faceted learning experience, like a mini workbook.

    **Category-Specific Instructions (CRITICAL):**
    ${categorySpecifics}

    **Dynamic Layout Mandate (CRITICAL):** Arrange the sub-activities on each page according to the user's selected layout.
    - **User's chosen layout:** ${appearanceSettings.layout}.
    - **Implementation:** ${currentLayoutInstruction}
    - The container for the sub-activities should have a style property like \`display: grid; grid-template-columns: ...; gap: ${appearanceSettings.itemSpacing}px;\`. The gap is crucial.

    **Design & Format Mandates (CRITICAL):**
    1.  **Format:** Output MUST be HTML blocks starting with \`<div ...>\` and ending with \`</div>\`. DO NOT include \`<html>\` or \`<body>\`.
    2.  **Main Page Container:** For EACH page, wrap the entire worksheet in \`<div style="font-family: 'Poppins', sans-serif; height: 100%; display: flex; flex-direction: column;"> ... </div>\`.
    3.  **Activities Container:** Inside the Main Page Container, after any title, place all sub-activities inside a single container div that implements the required layout. E.g., \`<div style="display: grid; grid-template-columns: 1fr 1fr; gap: ${appearanceSettings.itemSpacing}px; flex-grow: 1;"> ... sub-activities go here ... </div>\`.
    4.  **Clarity & Aesthetics:** Use high contrast, large readable fonts, and generous white space. Use inline SVGs for any illustrations to ensure they are crisp and print-ready. The overall design should feel modern, friendly, professional, and COMPLETE.
    5.  **Language:** All text must be in Turkish.
    6.  **Page Separator:** If you create more than one page, you MUST separate them with exactly \`<!-- PAGE_BREAK -->\`.

    **Task:** Generate a brand-new, unique, multi-activity worksheet for the module: "${selectedModule.name}".
    **Specifics for this module:** Incorporate the following user-defined settings into your generation: \`${settingsString}\`. These settings provide specific constraints or content focus (e.g., a letter pair 'b-d', a math operation, a theme). All generated activities must adhere to these specifics and be fully complete.
    `;
};
