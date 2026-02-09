"""
URL patterns for the typingtest app.

Routes:
    /typing/              → difficulty selection + test page
    /typing/submit/       → POST endpoint to save results
    /typing/history/      → page showing past test results
    /typing/paragraph/    → AJAX endpoint returning a random paragraph
"""

from django.urls import path
from . import views

app_name = "typingtest"

urlpatterns = [
    path('', views.index, name='index'),
    path('submit/', views.submit_result, name='submit'),
    path('history/', views.history, name='history'),
    path('paragraph/', views.get_paragraph, name='paragraph'),
]
