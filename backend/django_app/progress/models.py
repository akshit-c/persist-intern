from django.db import models
from django.contrib.auth.models import User
from challenges.models import Challenge

class UserProgress(models.Model):
    STATUS_CHOICES = [
        ('started', 'Started'),
        ('submitted', 'Submitted'),
        ('completed', 'Completed')
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='progress')
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE, related_name='user_progress')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='started')
    attempts = models.IntegerField(default=0)
    completed_at = models.DateTimeField(null=True, blank=True)
    points_earned = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['user', 'challenge']
        verbose_name_plural = "User Progress"
    
    def __str__(self):
        return f"{self.user.username}'s progress on {self.challenge.title}"

class Achievement(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=50, blank=True)  # For storing icon class or name
    points = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class UserAchievement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='achievements')
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE, related_name='users')
    earned_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'achievement']
    
    def __str__(self):
        return f"{self.user.username} earned {self.achievement.name}"

class Leaderboard(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='leaderboard')
    total_points = models.IntegerField(default=0)
    challenges_completed = models.IntegerField(default=0)
    rank = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username}'s leaderboard entry"
    
    class Meta:
        ordering = ['-total_points']
