"""
URL patterns for the textutils app.

Routes:
    /              → home page with the text form
    /analyze/      → POST endpoint that processes the text
    /history/      → page showing past transformations
"""

from django.urls import path
from . import views

app_name = "textutils"

urlpatterns = [
    path('', views.index, name='index'),
    path('analyze/', views.analyze, name='analyze'),
    path('history/', views.history, name='history'),
    path('api/history/', views.history_api, name='history_api'),
]
