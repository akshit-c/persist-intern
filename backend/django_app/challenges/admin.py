from django.contrib import admin
from .models import Category, Challenge, Submission

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)

@admin.register(Challenge)
class ChallengeAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'difficulty', 'points', 'is_active', 'created_at')
    list_filter = ('difficulty', 'category', 'is_active')
    search_fields = ('title', 'description')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('user', 'challenge', 'status', 'submitted_at')
    list_filter = ('status',)
    search_fields = ('user__username', 'challenge__title')
    readonly_fields = ('submitted_at',)
