/* ============================================================
   Text-Utilities — Main JavaScript
   ============================================================
   Features:
     • Live character & word counter
     • Disable / enable submit button when textarea is empty
     • Live preview of processed text (client-side approximation)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // --------------- DOM references ---------------------------
    const textarea      = document.getElementById('inputText');
    const charCount     = document.getElementById('charCount');
    const wordCount     = document.getElementById('wordCount');
    const submitBtn     = document.getElementById('submitBtn');
    const livePreview   = document.getElementById('livePreview');

    const chkCapitalize = document.getElementById('switchCapitalize');
    const chkPunct      = document.getElementById('switchPunctuations');
    const chkSpace      = document.getElementById('switchSpaces');

    // Guard: if elements are missing (e.g. on the history page), bail out
    if (!textarea) return;

    // --------------- Helpers ----------------------------------
    function countWords(str) {
        const trimmed = str.trim();
        if (trimmed === '') return 0;
        return trimmed.split(/\s+/).length;
    }

    // --------------- Live counters + button state -------------
    function updateCounters() {
        const text = textarea.value;
        charCount.textContent = text.length;
        wordCount.textContent = countWords(text);

        // disable submit when textarea is empty
        submitBtn.disabled = text.trim().length === 0;
    }

    textarea.addEventListener('input', () => {
        updateCounters();
        updateLivePreview();
    });

    // Initial state
    updateCounters();

    // --------------- Live preview (client-side) ---------------
    function updateLivePreview() {
        let text = textarea.value;

        if (text.trim() === '') {
            livePreview.textContent = 'Start typing to see a live preview…';
            livePreview.style.opacity = '0.5';
            return;
        }

        // Apply operations based on toggle state
        if (chkPunct && chkPunct.checked) {
            const puncts = '!@$%^&*()_+-=[];:><"\',.?/#';
            text = text.split('').filter(c => !puncts.includes(c)).join('');
        }

        if (chkCapitalize && chkCapitalize.checked) {
            text = text.toUpperCase();
        }

        if (chkSpace && chkSpace.checked) {
            text = text.replace(/ {2,}/g, ' ');
        }

        livePreview.textContent = text;
        livePreview.style.opacity = '1';
    }

    // Re-run preview when toggles change
    [chkCapitalize, chkPunct, chkSpace].forEach(el => {
        if (el) el.addEventListener('change', updateLivePreview);
    });

    // Initial preview
    updateLivePreview();
});

/* ============================================================
   History Panel — Smoke Transition
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const historyLink = document.querySelector('a[href*="history"]');
    const mainContent = document.getElementById('mainContent');
    const historyPanel = document.getElementById('historyPanel');
    
    if (!historyLink || !mainContent || !historyPanel) return;

    // State management
    let isTransitioning = false;
    let isHistoryVisible = false;
    let historyDataCache = null;

    // Prevent default navigation, trigger smoke transition
    historyLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (isTransitioning) return;
        
        if (isHistoryVisible) {
            hideHistoryPanel();
        } else {
            showHistoryPanel();
        }
    });

    async function showHistoryPanel() {
        if (isTransitioning || isHistoryVisible) return;
        isTransitioning = true;
        
        // Smoke out main content
        mainContent.classList.add('smoke-out');
        
        // Fetch history data from JSON API (use cache if available)
        if (!historyDataCache) {
            try {
                const response = await fetch('/api/history/');
                const data = await response.json();
                historyDataCache = data.history || [];
            } catch (err) {
                historyDataCache = [];
            }
        }
        
        renderHistoryPanel(historyDataCache);

        // After smoke-out animation, show history panel
        setTimeout(() => {
            mainContent.style.display = 'none';
            mainContent.classList.remove('smoke-out');
            
            historyPanel.classList.add('visible');
            historyPanel.classList.add('smoke-in');
            
            setTimeout(() => {
                historyPanel.classList.remove('smoke-in');
                isTransitioning = false;
                isHistoryVisible = true;
            }, 500);
        }, 500);
    }

    function renderHistoryPanel(items) {
        const container = historyPanel.querySelector('.history-container');
        if (!container) return;

        if (!items || items.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-inbox"></i>
                    <p>No history yet. Go analyze some text!</p>
                </div>
            `;
            return;
        }

        let html = '';
        items.forEach((item, index) => {
            const ops = item.selected_options.split(', ').map(op => 
                `<span class="badge bg-primary me-1">${escapeHtml(op)}</span>`
            ).join('');

            html += `
                <div class="history-card fade-in" style="animation-delay: ${index * 0.08}s">
                    <div class="history-meta">
                        <div class="history-ops">${ops}</div>
                        <span class="history-time"><i class="bi bi-clock me-1"></i>${escapeHtml(item.created_at)}</span>
                    </div>
                    <div class="history-text">
                        <div class="text-block">
                            <div class="text-block-label">Original</div>
                            <div class="text-block-content">${escapeHtml(item.original_text)}</div>
                        </div>
                        <div class="text-block">
                            <div class="text-block-label">Processed</div>
                            <div class="text-block-content">${escapeHtml(item.processed_text)}</div>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Back button handler
    const backBtn = historyPanel.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            hideHistoryPanel();
        });
    }

    function hideHistoryPanel() {
        if (isTransitioning || !isHistoryVisible) return;
        isTransitioning = true;
        
        historyPanel.classList.add('smoke-out');

        setTimeout(() => {
            historyPanel.classList.remove('visible', 'smoke-out');
            
            mainContent.style.display = '';
            mainContent.classList.add('smoke-in');

            setTimeout(() => {
                mainContent.classList.remove('smoke-in');
                isTransitioning = false;
                isHistoryVisible = false;
            }, 500);
        }, 500);
    }
    
    // Refresh history cache when new analysis is done
    window.refreshHistoryCache = () => {
        historyDataCache = null;
    };
});
