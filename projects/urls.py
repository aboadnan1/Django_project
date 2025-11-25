# projects/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.ProjectListCreateView.as_view(), name='project-list-create'),
    path('<int:pk>/', views.ProjectDetailView.as_view(), name='project-detail'),
    path('search/', views.search_projects, name='project-search'),
    path('my-projects/', views.user_projects_view, name='user-projects'),
]