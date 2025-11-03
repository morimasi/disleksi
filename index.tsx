import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
@keyframes bounce {
    0%, 80%, 100% { 
        transform: scale(0.8);
        opacity: 0;
    }
    40% { 
        transform: scale(1.0); 
        opacity: 1;
    }
}
button:disabled { opacity: 0.6; cursor: not-allowed; }
button[title]:disabled:hover { position: relative; }
button[title]:disabled:hover::after {
    content: attr(title);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 0.8rem;
    white-space: nowrap;
    z-index: 10;
    margin-bottom: 5px;
}
.savedItem:hover { background-color: #f8f9fa; }

/* Drag and Drop Styles */
.dragging {
    opacity: 0.4;
}
.drag-over {
    outline: 2px dashed var(--primary-color);
    outline-offset: -2px;
    background-color: rgba(52, 152, 219, 0.1);
}
`;
document.head.appendChild(styleSheet);


const root = createRoot(document.getElementById('root'));
root.render(<App />);