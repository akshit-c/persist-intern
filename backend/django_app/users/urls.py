from django.urls import path
from .views import (
    UserRegistrationView,
    UserLoginView,
    UserProfileView,
    UserListView,
)

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('list/', UserListView.as_view(), name='user-list'),
] 