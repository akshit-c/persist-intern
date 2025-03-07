from django.shortcuts import render
from rest_framework import generics, permissions, filters
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Challenge, Submission
from .serializers import (
    CategorySerializer,
    ChallengeListSerializer,
    ChallengeDetailSerializer,
    SubmissionSerializer
)
from progress.models import UserProgress
from datetime import datetime

# Create your views here.

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

class ChallengeListView(generics.ListAPIView):
    queryset = Challenge.objects.filter(is_active=True)
    serializer_class = ChallengeListSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['difficulty', 'category']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'points']

class ChallengeDetailView(generics.RetrieveAPIView):
    queryset = Challenge.objects.all()
    serializer_class = ChallengeDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        # Check if user has started this challenge
        user_progress, created = UserProgress.objects.get_or_create(
            user=request.user,
            challenge=instance,
            defaults={'status': 'started'}
        )
        
        # If this is a new progress entry, increment attempts
        if created:
            user_progress.attempts += 1
            user_progress.save()
        
        return Response(serializer.data)

class SubmissionCreateView(generics.CreateAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        challenge_id = self.kwargs.get('challenge_id')
        challenge = Challenge.objects.get(id=challenge_id)
        submission = serializer.save(user=self.request.user, challenge=challenge)
        
        # Update user progress
        user_progress, _ = UserProgress.objects.get_or_create(
            user=self.request.user,
            challenge=challenge
        )
        
        user_progress.attempts += 1
        
        if submission.status == 'correct':
            user_progress.status = 'completed'
            user_progress.completed_at = datetime.now()
            user_progress.points_earned = challenge.points
        else:
            user_progress.status = 'submitted'
        
        user_progress.save()
        
        return submission

class SubmissionListView(generics.ListAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Submission.objects.filter(user=self.request.user).order_by('-submitted_at')
