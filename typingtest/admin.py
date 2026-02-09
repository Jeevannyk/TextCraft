"""
Register TypingTestResult in Django admin.
"""

from django.contrib import admin
from .models import TypingTestResult


@admin.register(TypingTestResult)
class TypingTestResultAdmin(admin.ModelAdmin):
    list_display = ('difficulty', 'duration', 'wpm', 'accuracy', 'total_chars', 'created_at')
    list_filter = ('difficulty', 'duration', 'created_at')
    readonly_fields = ('difficulty', 'duration', 'wpm', 'accuracy', 'total_chars', 'correct_chars', 'created_at')
