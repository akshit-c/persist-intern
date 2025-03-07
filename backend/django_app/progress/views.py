from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.response import Response
from django.db.models import Sum, Count
from .models import UserProgress, Achievement, UserAchievement, Leaderboard
from .serializers import (
    UserProgressSerializer,
    AchievementSerializer,
    UserAchievementSerializer,
    LeaderboardSerializer
)

# Create your views here.

class UserProgressListView(generics.ListAPIView):
    serializer_class = UserProgressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserProgress.objects.filter(user=self.request.user).order_by('-updated_at')

class UserProgressDetailView(generics.RetrieveAPIView):
    serializer_class = UserProgressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        challenge_id = self.kwargs.get('challenge_id')
        return UserProgress.objects.get(user=self.request.user, challenge_id=challenge_id)

class LeaderboardView(generics.ListAPIView):
    serializer_class = LeaderboardSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Leaderboard.objects.all().order_by('-total_points')[:100]  # Top 100 users
    
    def list(self, request, *args, **kwargs):
        # Update leaderboard data before returning
        self.update_leaderboard()
        return super().list(request, *args, **kwargs)
    
    def update_leaderboard(self):
        # Get all users with completed challenges
        progress_data = UserProgress.objects.filter(
            status='completed'
        ).values('user').annotate(
            total_points=Sum('points_earned'),
            challenges_completed=Count('challenge')
        ).order_by('-total_points')
        
        # Update or create leaderboard entries
        rank = 1
        for data in progress_data:
            Leaderboard.objects.update_or_create(
                user_id=data['user'],
                defaults={
                    'total_points': data['total_points'],
                    'challenges_completed': data['challenges_completed'],
                    'rank': rank
                }
            )
            rank += 1

class AchievementListView(generics.ListAPIView):
    serializer_class = UserAchievementSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserAchievement.objects.filter(user=self.request.user).order_by('-earned_at')
