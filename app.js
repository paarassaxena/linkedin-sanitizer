
// DOM Elements
const moodCards = document.querySelectorAll('.mood-card');
const feedInput = document.getElementById('feed-input');
const analyzeBtn = document.getElementById('analyze-btn');
const clearBtn = document.getElementById('clear-btn');
const backBtn = document.getElementById('back-btn');
const inputSection = document.getElementById('input-section');
const processingSection = document.getElementById('processing-section');
const resultsSection = document.getElementById('results-section');
const feedContainer = document.getElementById('feed-container');
const hiddenCountSpan = document.getElementById('hidden-count');

// State
let state = {
    mood: 'chill', // default
    rawText: ''
};

// Heuristics Configuration
const FILTER_RULES = {
    chill: {
        keywords: [
            'hiring', 'hiring freeze', 'layoff', 'layoffs', 'open to work',
            'looking for a job', 'market is tough', 'rejection', 'interview',
            'application', 'salary', 'resume', 'recruiters', 'ats', 'unemployed'
        ],
        description: "Contains career stress triggers"
    },
    focus: {
        keywords: [
            "agree?", "thoughts?", "humbled to announce", "thrilled to announce",
            "excited to share", "check out my", "link in bio", "buy my", 
            "masterclass", "webinar", "course"
        ],
        description: "Likely engagement bait or self-promotion"
    },
    validation: { 
        // In validation mode, we hide negatives but keep success stories? 
        // Or maybe just hide the "tough market" stuff.
        // Let's hide negativity.
        keywords: [
            'hard', 'tough', 'struggle', 'fail', 'failure', 'rejected', 
            'ghosted', 'difficult', 'impossible', 'sad', 'depressed', 
            'give up', 'quitting'
        ],
        description: "Contains negative sentiment"
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
});

moodCards.forEach(card => {
    card.addEventListener('click', () => {
        // Update UI
        moodCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        
        // Update State
        state.mood = card.dataset.mood;
        console.log(`Mood switched to: ${state.mood}`);
    });
});

clearBtn.addEventListener('click', () => {
    feedInput.value = '';
    feedInput.focus();
});

analyzeBtn.addEventListener('click', () => {
    const text = feedInput.value.trim();
    if (!text) {
        alert('Please paste some content first!');
        return;
    }
    
    state.rawText = text;
    startProcessing();
});

backBtn.addEventListener('click', () => {
    switchView('input');
});

// Logic
function startProcessing() {
    switchView('processing');
    
    // Simulate analyzing time (random 1-2.5s)
    const delay = Math.floor(Math.random() * 1500) + 1000;
    
    setTimeout(() => {
        processFeed();
        switchView('results');
    }, delay);
}

function processFeed() {
    feedContainer.innerHTML = '';
    
    // Naive splitting: LinkedIn posts often separated by multiple newlines
    // or we just treat paragraphs as posts if there's no clear delimiter.
    // Let's try splitting by double newline first.
    const chunks = state.rawText.split(/\n\s*\n/);
    
    let hiddenCount = 0;
    
    chunks.forEach((chunk, index) => {
        if (!chunk.trim()) return;
        
        const isToxic = checkToxic(chunk, state.mood);
        const postElement = createPostElement(chunk, isToxic);
        
        if (isToxic) hiddenCount++;
        feedContainer.appendChild(postElement);
    });
    
    hiddenCountSpan.textContent = `${hiddenCount} hidden`;
}

function checkToxic(text, mood) {
    const rules = FILTER_RULES[mood];
    if (!rules) return false;
    
    const lowerText = text.toLowerCase();
    
    // Check main rules for current mood
    const hitMain = rules.keywords.some(keyword => lowerText.includes(keyword));
    if (hitMain) return rules.description;
    
    // If 'chill' mode, we might want to also include 'focus' rules (hiding influencers too)
    // to make it SUPER chill.
    if (mood === 'chill') {
        const focusRules = FILTER_RULES['focus'];
        if (focusRules.keywords.some(kw => lowerText.includes(kw))) {
            return focusRules.description;
        }
    }
    
    return false;
}

function createPostElement(text, toxicReason) {
    const div = document.createElement('div');
    div.className = 'post-card';
    
    if (toxicReason) {
        div.classList.add('filtered');
        div.innerHTML = `
            <div class="filtered-icon">
                <i data-lucide="shield-alert"></i>
            </div>
            <p class="filtered-reason">Hidden: ${toxicReason}</p>
            <button class="reveal-btn">Show anyway</button>
            <div class="post-content hidden" style="display:none; margin-top: 1rem;">${escapeHtml(text)}</div>
        `;
        
        // Handle reveal
        const btn = div.querySelector('.reveal-btn');
        const content = div.querySelector('.post-content');
        btn.addEventListener('click', () => {
            if (content.style.display === 'none') {
                content.style.display = 'block';
                btn.textContent = 'Hide again';
                div.classList.remove('filtered'); // Optional: remove styling or keep it to show it was warned
            } else {
                content.style.display = 'none';
                btn.textContent = 'Show anyway';
                div.classList.add('filtered');
            }
        });
        
    } else {
        div.innerHTML = `<div class="post-content">${escapeHtml(text)}</div>`;
    }
    
    // Re-render icons for new elements
    setTimeout(() => lucide.createIcons(), 0);
    
    return div;
}

function switchView(viewName) {
    [inputSection, processingSection, resultsSection].forEach(el => el.classList.add('hidden'));
    
    if (viewName === 'input') {
        inputSection.classList.remove('hidden');
        // blobbing animation adjustment?
    } else if (viewName === 'processing') {
        processingSection.classList.remove('hidden');
    } else if (viewName === 'results') {
        resultsSection.classList.remove('hidden');
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML.replace(/\n/g, '<br>');
}
