# accounts/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('profile/', views.profile_view, name='profile'),
    path('profile/change-password/', views.change_password_view, name='change-password'),
    path('delete-account/', views.delete_account_view, name='delete-account'),
]