from rest_framework import serializers
from .models import UserProgress, Achievement, UserAchievement, Leaderboard
from challenges.serializers import ChallengeListSerializer, UserBasicSerializer

class UserProgressSerializer(serializers.ModelSerializer):
    challenge = ChallengeListSerializer(read_only=True)
    user = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = UserProgress
        fields = [
            'id', 'user', 'challenge', 'status', 'attempts', 
            'completed_at', 'points_earned', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'challenge', 'points_earned']

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['id', 'name', 'description', 'icon', 'points', 'created_at']

class UserAchievementSerializer(serializers.ModelSerializer):
    achievement = AchievementSerializer(read_only=True)
    user = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = UserAchievement
        fields = ['id', 'user', 'achievement', 'earned_at']

class LeaderboardSerializer(serializers.ModelSerializer):
    user = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = Leaderboard
        fields = ['id', 'user', 'total_points', 'challenges_completed', 'rank', 'updated_at'] 