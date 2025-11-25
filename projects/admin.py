# projects/admin.py
from django.contrib import admin
from .models import Project

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'total_target', 'start_time', 'end_time')
    list_filter = ('start_time', 'end_time')
    search_fields = ('title', 'details')
    date_hierarchy = 'created_at'