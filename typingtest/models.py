"""
TypingTestResult model — stores every completed typing test.

Fields:
    difficulty      – easy / medium / hard
    duration        – test duration in seconds (30 / 60 / 120)
    wpm             – words per minute achieved
    accuracy        – accuracy percentage
    total_chars     – total characters typed
    correct_chars   – correctly typed characters
    created_at      – auto-set timestamp
"""

from django.db import models


class TypingTestResult(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]

    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES)
    duration = models.IntegerField(help_text="Test duration in seconds")
    wpm = models.FloatField(help_text="Words per minute")
    accuracy = models.FloatField(help_text="Accuracy percentage")
    total_chars = models.IntegerField(default=0, help_text="Total characters typed")
    correct_chars = models.IntegerField(default=0, help_text="Correctly typed characters")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Typing Test Results"

    def __str__(self):
        return f"{self.difficulty.title()} | {self.wpm:.0f} WPM | {self.accuracy:.1f}% — {self.created_at:%Y-%m-%d %H:%M}"
