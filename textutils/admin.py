"""
Register TextHistory so it shows up in the Django admin panel.
"""

from django.contrib import admin
from .models import TextHistory


@admin.register(TextHistory)
class TextHistoryAdmin(admin.ModelAdmin):
    list_display = ('selected_options', 'created_at')
    readonly_fields = ('original_text', 'processed_text', 'selected_options', 'created_at')
    list_filter = ('created_at',)
