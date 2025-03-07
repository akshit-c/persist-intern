from rest_framework import serializers
from .models import Category, Challenge, Submission
from django.contrib.auth.models import User

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'icon', 'created_at']

class ChallengeListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    
    class Meta:
        model = Challenge
        fields = ['id', 'title', 'description', 'difficulty', 'points', 'category', 'created_at']

class ChallengeDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    
    class Meta:
        model = Challenge
        fields = [
            'id', 'title', 'description', 'difficulty', 'points', 
            'category', 'content', 'code_template', 'is_active', 
            'created_at', 'updated_at'
        ]
        # Exclude solution field to prevent cheating

class UserBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']

class SubmissionSerializer(serializers.ModelSerializer):
    user = UserBasicSerializer(read_only=True)
    challenge = ChallengeListSerializer(read_only=True)
    
    class Meta:
        model = Submission
        fields = ['id', 'user', 'challenge', 'content', 'status', 'feedback', 'submitted_at']
        read_only_fields = ['status', 'feedback']
    
    def create(self, validated_data):
        user = self.context['request'].user
        challenge_id = self.context['view'].kwargs.get('challenge_id')
        challenge = Challenge.objects.get(id=challenge_id)
        
        submission = Submission.objects.create(
            user=user,
            challenge=challenge,
            content=validated_data['content']
        )
        
        return submission 