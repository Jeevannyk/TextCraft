"""
Views for the textutils app.

index   — renders the home page with the text form
analyze — POST endpoint: processes text, saves to DB, shows result
history — shows a table of all past transformations
"""

from django.http import HttpResponse
from django.shortcuts import render

from .models import TextHistory


# --------------- Home page ------------------------------------------------
def index(request):
    """Render the main form page."""
    return render(request, 'textutils/home.html')


# --------------- Analyze text (POST) --------------------------------------
def analyze(request):
    """
    Read the textarea + checkboxes from the form, apply the selected
    operations in order, save the result to the database, and render
    the result page.
    """
    inputtext = request.POST.get('text', '')
    removepunctuations_option = request.POST.get('removepunctuations', 'off')
    capitalize_option = request.POST.get('capitalize', 'off')
    spaceremover_option = request.POST.get('spaceremover', 'off')

    # If nothing is selected, let the user know
    if (
        removepunctuations_option != 'on'
        and capitalize_option != 'on'
        and spaceremover_option != 'on'
    ):
        return HttpResponse("You have not selected any operations !!")

    original = inputtext          # keep a copy for the DB
    analyzed = inputtext
    tasks = []

    # 1. Remove punctuations
    if removepunctuations_option == 'on':
        punctuations = '''!@$%^&*()_+-=[];:><"',.?/#'''
        analyzed = ''.join(ch for ch in analyzed if ch not in punctuations)
        tasks.append('Removed Punctuations')

    # 2. Capitalize
    if capitalize_option == 'on':
        analyzed = analyzed.upper()
        tasks.append('Capitalized')

    # 3. Remove extra spaces
    if spaceremover_option == 'on':
        temp = []
        for i, ch in enumerate(analyzed):
            if ch == ' ' and i + 1 < len(analyzed) and analyzed[i + 1] == ' ':
                continue
            temp.append(ch)
        analyzed = ''.join(temp)
        tasks.append('Removed Extra Spaces')

    task_label = ', '.join(tasks)

    # Save to database using Django ORM
    TextHistory.objects.create(
        original_text=original,
        processed_text=analyzed,
        selected_options=task_label,
    )

    context = {
        'task': task_label,
        'original_text': original,
        'analyzed_text': analyzed,
    }
    return render(request, 'textutils/analyzed.html', context)


# --------------- History page ---------------------------------------------
def history(request):
    """Show all past text transformations, newest first."""
    records = TextHistory.objects.all()          # ordered by -created_at (model Meta)
    return render(request, 'textutils/history.html', {'history': records})


# --------------- History API (JSON) ---------------------------------------
from django.http import JsonResponse

def history_api(request):
    """Return history data as JSON for AJAX requests."""
    records = TextHistory.objects.all()[:50]  # Limit to 50 most recent
    data = [
        {
            'id': record.id,
            'original_text': record.original_text,
            'processed_text': record.processed_text,
            'selected_options': record.selected_options,
            'created_at': record.created_at.strftime('%b %d, %Y %H:%M'),
        }
        for record in records
    ]
    return JsonResponse({'history': data})
