"""
TextHistory model — stores every text transformation the user performs.

Fields:
    original_text   – the raw text the user typed in
    processed_text  – the text after applying the selected operations
    selected_options– comma-separated list of operations
    created_at      – auto-set timestamp when the record is saved
"""

from django.db import models


class TextHistory(models.Model):
    original_text = models.TextField(help_text="The original text entered by the user")
    processed_text = models.TextField(help_text="The text after processing")
    selected_options = models.CharField(
        max_length=255,
        help_text="Comma-separated list of operations applied",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Text Histories"

    def __str__(self):
        return f"{self.selected_options} — {self.created_at:%Y-%m-%d %H:%M}"
