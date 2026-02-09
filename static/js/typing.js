/* ============================================================
   Typing Speed Test — Main JavaScript
   ============================================================
   Handles:
     • Difficulty & duration selection
     • Fetching paragraphs (AJAX)
     • Countdown timer (starts on first keystroke)
     • Real-time WPM, accuracy, character highlighting
     • Auto-submit when timer ends
     • Saving results via POST
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── DOM References ───────────────────────────────────────
    const paragraphDisplay = document.getElementById('paragraphDisplay');
    const typingInput      = document.getElementById('typingInput');
    const timerDisplay     = document.getElementById('timerDisplay');
    const timerBar         = document.getElementById('timerBar');
    const wpmStat          = document.getElementById('wpmStat');
    const accuracyStat     = document.getElementById('accuracyStat');
    const errorStat        = document.getElementById('errorStat');
    const charsStat        = document.getElementById('charsStat');
    const startHint        = document.getElementById('startHint');
    const newTestBtn       = document.getElementById('newTestBtn');
    const resultOverlay    = document.getElementById('resultOverlay');

    // Result popup elements
    const resultWpm      = document.getElementById('resultWpm');
    const resultAccuracy = document.getElementById('resultAccuracy');
    const resultChars    = document.getElementById('resultChars');
    const resultErrors   = document.getElementById('resultErrors');
    const resultGrade    = document.getElementById('resultGrade');
    const resultCloseBtn = document.getElementById('resultCloseBtn');

    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    const durationBtns   = document.querySelectorAll('.duration-btn');

    // ─── State ────────────────────────────────────────────────
    let difficulty     = 'easy';
    let duration       = 60;
    let paragraphText  = '';
    let timeLeft       = 60;
    let timerInterval  = null;
    let testStarted    = false;
    let testFinished   = false;
    let correctChars   = 0;
    let totalTyped     = 0;
    let errorCount     = 0;

    // CSRF token (from cookie)
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return '';
    }
    const csrfToken = getCookie('csrftoken');

    // ─── Difficulty Selection ─────────────────────────────────
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (testStarted && !testFinished) return;  // don't switch mid-test
            difficultyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            difficulty = btn.dataset.difficulty;
            loadParagraph();
        });
    });

    // ─── Duration Selection ───────────────────────────────────
    durationBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (testStarted && !testFinished) return;
            durationBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            duration = parseInt(btn.dataset.duration, 10);
            timeLeft = duration;
            timerDisplay.textContent = timeLeft;
            timerBar.style.width = '100%';
            timerBar.classList.remove('warning');
        });
    });

    // ─── Load Paragraph (AJAX) ────────────────────────────────
    function loadParagraph() {
        const url = `/typing/paragraph/?difficulty=${difficulty}`;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                paragraphText = data.paragraph;
                renderParagraph();
                resetTest();
            })
            .catch(err => {
                console.error('Failed to load paragraph:', err);
                paragraphDisplay.textContent = 'Failed to load paragraph. Please refresh.';
            });
    }

    // ─── Render Paragraph Characters ──────────────────────────
    function renderParagraph() {
        paragraphDisplay.innerHTML = '';
        paragraphText.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.classList.add('char');
            span.textContent = char;
            if (i === 0) span.classList.add('current');
            paragraphDisplay.appendChild(span);
        });
    }

    // ─── Reset Test State ─────────────────────────────────────
    function resetTest() {
        clearInterval(timerInterval);
        testStarted  = false;
        testFinished = false;
        correctChars = 0;
        totalTyped   = 0;
        errorCount   = 0;
        timeLeft     = duration;

        typingInput.value    = '';
        typingInput.disabled = false;
        typingInput.focus();

        timerDisplay.textContent = timeLeft;
        timerBar.style.width = '100%';
        timerBar.classList.remove('warning');

        wpmStat.textContent      = '0';
        accuracyStat.textContent = '100';
        errorStat.textContent    = '0';
        charsStat.textContent    = '0';

        startHint.classList.remove('hidden');
        resultOverlay.classList.remove('show');
    }

    // ─── Typing Input Handler ─────────────────────────────────
    typingInput.addEventListener('input', () => {
        if (testFinished) return;

        // Start timer on first keystroke
        if (!testStarted) {
            testStarted = true;
            startHint.classList.add('hidden');
            startTimer();
        }

        const typed = typingInput.value;
        const chars = paragraphDisplay.querySelectorAll('.char');

        correctChars = 0;
        errorCount   = 0;
        totalTyped   = typed.length;

        // Highlight each character
        chars.forEach((span, i) => {
            span.classList.remove('correct', 'incorrect', 'current');
            if (i < typed.length) {
                if (typed[i] === paragraphText[i]) {
                    span.classList.add('correct');
                    correctChars++;
                } else {
                    span.classList.add('incorrect');
                    errorCount++;
                }
            } else if (i === typed.length) {
                span.classList.add('current');
            }
        });

        // Update live stats
        updateStats();

        // Check if user typed entire paragraph
        if (typed.length >= paragraphText.length) {
            endTest();
        }
    });

    // Prevent pasting
    typingInput.addEventListener('paste', e => e.preventDefault());

    // ─── Timer ────────────────────────────────────────────────
    function startTimer() {
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;

            const pct = (timeLeft / duration) * 100;
            timerBar.style.width = pct + '%';

            if (pct <= 25) {
                timerBar.classList.add('warning');
            }

            if (timeLeft <= 0) {
                endTest();
            }
        }, 1000);
    }

    // ─── Calculate & Update Stats ─────────────────────────────
    function updateStats() {
        const elapsed = duration - timeLeft;
        const minutes = elapsed / 60;
        const wordsTyped = correctChars / 5;   // standard: 1 word = 5 chars
        const wpm = minutes > 0 ? Math.round(wordsTyped / minutes) : 0;
        const accuracy = totalTyped > 0
            ? Math.round((correctChars / totalTyped) * 100)
            : 100;

        wpmStat.textContent      = wpm;
        accuracyStat.textContent = accuracy;
        errorStat.textContent    = errorCount;
        charsStat.textContent    = totalTyped;
    }

    // ─── End Test ─────────────────────────────────────────────
    function endTest() {
        if (testFinished) return;
        testFinished = true;
        clearInterval(timerInterval);
        typingInput.disabled = true;

        // Final stats
        const elapsed  = duration - timeLeft || 1;  // avoid /0
        const minutes  = elapsed / 60;
        const words    = correctChars / 5;
        const wpm      = Math.round(words / minutes);
        const accuracy = totalTyped > 0
            ? parseFloat(((correctChars / totalTyped) * 100).toFixed(1))
            : 0;

        // Show result overlay
        resultWpm.textContent      = wpm;
        resultAccuracy.textContent = accuracy + '%';
        resultChars.textContent    = totalTyped;
        resultErrors.textContent   = errorCount;

        // Grade
        let gradeText = '', gradeClass = '';
        if (wpm >= 60 && accuracy >= 95) {
            gradeText = 'Excellent!'; gradeClass = 'grade-excellent';
        } else if (wpm >= 40 && accuracy >= 85) {
            gradeText = 'Good Job!'; gradeClass = 'grade-good';
        } else if (wpm >= 20) {
            gradeText = 'Average'; gradeClass = 'grade-average';
        } else {
            gradeText = 'Keep Practicing!'; gradeClass = 'grade-practice';
        }
        resultGrade.textContent = gradeText;
        resultGrade.className   = 'result-grade ' + gradeClass;

        resultOverlay.classList.add('show');

        // Save to database
        saveResult(wpm, accuracy, totalTyped, correctChars);
    }

    // ─── Save Result (AJAX POST) ──────────────────────────────
    function saveResult(wpm, accuracy, totalChars, correctCharsCount) {
        const body = new URLSearchParams({
            difficulty: difficulty,
            duration: duration,
            wpm: wpm,
            accuracy: accuracy,
            total_chars: totalChars,
            correct_chars: correctCharsCount,
        });

        fetch('/typing/submit/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': csrfToken,
            },
            body: body.toString(),
        })
        .then(res => res.json())
        .then(data => {
            if (data.status !== 'ok') {
                console.error('Save failed:', data.message);
            }
        })
        .catch(err => console.error('Save error:', err));
    }

    // ─── New Test / Close Result ──────────────────────────────
    newTestBtn.addEventListener('click', () => {
        loadParagraph();
    });

    resultCloseBtn.addEventListener('click', () => {
        resultOverlay.classList.remove('show');
    });

    // Close overlay on backdrop click
    resultOverlay.addEventListener('click', (e) => {
        if (e.target === resultOverlay) {
            resultOverlay.classList.remove('show');
        }
    });

    // ─── Initial Load ─────────────────────────────────────────
    loadParagraph();
});
