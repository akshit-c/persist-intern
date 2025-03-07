from django.urls import path
from .views import (
    UserProgressListView,
    UserProgressDetailView,
    LeaderboardView,
    AchievementListView,
)

urlpatterns = [
    path('', UserProgressListView.as_view(), name='progress-list'),
    path('<int:challenge_id>/', UserProgressDetailView.as_view(), name='progress-detail'),
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    path('achievements/', AchievementListView.as_view(), name='achievement-list'),
] 