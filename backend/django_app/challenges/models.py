from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)  # For storing icon class or name
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Categories"

class Challenge(models.Model):
    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced')
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES)
    points = models.IntegerField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='challenges')
    content = models.TextField()  # Markdown content for the challenge
    code_template = models.TextField(blank=True)  # Initial code template for programming challenges
    solution = models.TextField(blank=True)  # Solution code or answer
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    def validate_submission(self, submission):
        # Challenge-specific validation logic
        # This is a placeholder - actual implementation would depend on challenge type
        return submission.strip() == self.solution.strip()

class Submission(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('correct', 'Correct'),
        ('incorrect', 'Incorrect')
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submissions')
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE, related_name='submissions')
    content = models.TextField()  # The submitted code or answer
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    feedback = models.TextField(blank=True)  # Feedback on the submission
    submitted_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username}'s submission for {self.challenge.title}"
    
    def save(self, *args, **kwargs):
        # Auto-validate submission if status is pending
        if self.status == 'pending':
            if self.challenge.validate_submission(self.content):
                self.status = 'correct'
            else:
                self.status = 'incorrect'
        super().save(*args, **kwargs)
