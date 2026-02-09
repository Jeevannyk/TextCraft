"""
Views for the typingtest app.

index          — renders the typing test page
get_paragraph  — AJAX endpoint returning a random paragraph (JSON)
submit_result  — AJAX POST endpoint saving a test result to DB
history        — renders a table of past results
"""

import json
import random

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST, require_GET

from .models import TypingTestResult
from .paragraphs import PARAGRAPHS


# ────────────────────────────────────────────────────────────
# Home page — typing test
# ────────────────────────────────────────────────────────────
def index(request):
    """Render the main typing test page."""
    return render(request, 'typingtest/index.html')


# ────────────────────────────────────────────────────────────
# Get a random paragraph (AJAX)
# ────────────────────────────────────────────────────────────
@require_GET
def get_paragraph(request):
    """Return a random paragraph for the requested difficulty as JSON."""
    difficulty = request.GET.get('difficulty', 'easy')
    pool = PARAGRAPHS.get(difficulty, PARAGRAPHS['easy'])
    paragraph = random.choice(pool)
    return JsonResponse({'paragraph': paragraph})


# ────────────────────────────────────────────────────────────
# Save test result (AJAX POST)
# ────────────────────────────────────────────────────────────
@require_POST
def submit_result(request):
    """Save the completed test result to the database."""
    try:
        difficulty    = request.POST.get('difficulty', 'easy')
        duration      = int(request.POST.get('duration', 60))
        wpm           = float(request.POST.get('wpm', 0))
        accuracy      = float(request.POST.get('accuracy', 0))
        total_chars   = int(request.POST.get('total_chars', 0))
        correct_chars = int(request.POST.get('correct_chars', 0))

        TypingTestResult.objects.create(
            difficulty=difficulty,
            duration=duration,
            wpm=wpm,
            accuracy=accuracy,
            total_chars=total_chars,
            correct_chars=correct_chars,
        )
        return JsonResponse({'status': 'ok'})
    except (ValueError, TypeError) as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)


# ────────────────────────────────────────────────────────────
# History page
# ────────────────────────────────────────────────────────────
def history(request):
    """Show all past typing test results, newest first."""
    results = TypingTestResult.objects.all()   # already ordered by -created_at
    return render(request, 'typingtest/history.html', {'results': results})
