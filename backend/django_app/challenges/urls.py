from django.urls import path
from .views import (
    ChallengeListView,
    ChallengeDetailView,
    CategoryListView,
    SubmissionCreateView,
    SubmissionListView,
)

urlpatterns = [
    path('', ChallengeListView.as_view(), name='challenge-list'),
    path('<int:pk>/', ChallengeDetailView.as_view(), name='challenge-detail'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('<int:challenge_id>/submit/', SubmissionCreateView.as_view(), name='submission-create'),
    path('submissions/', SubmissionListView.as_view(), name='submission-list'),
] 