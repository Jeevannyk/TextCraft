"""URL configuration for firstproject."""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('textutils.urls')),        # text-utilities at /
    path('typing/', include('typingtest.urls')), # typing test at /typing/
]
