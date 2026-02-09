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
