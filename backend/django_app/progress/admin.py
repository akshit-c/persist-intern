from django.contrib import admin
from .models import UserProgress, Achievement, UserAchievement, Leaderboard

@admin.register(UserProgress)
class UserProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'challenge', 'status', 'attempts', 'points_earned', 'completed_at')
    list_filter = ('status',)
    search_fields = ('user__username', 'challenge__title')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ('name', 'points', 'created_at')
    search_fields = ('name', 'description')

@admin.register(UserAchievement)
class UserAchievementAdmin(admin.ModelAdmin):
    list_display = ('user', 'achievement', 'earned_at')
    search_fields = ('user__username', 'achievement__name')

@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ('user', 'total_points', 'challenges_completed', 'rank', 'updated_at')
    search_fields = ('user__username',)
    readonly_fields = ('updated_at',)
