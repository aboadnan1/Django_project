# projects/views.py
from rest_framework import generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q
from .models import Project
from .serializers import ProjectSerializer, ProjectProfileSerializer

class ProjectListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Project.objects.all()
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Project.objects.filter(user=self.request.user)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def search_projects(request):
    date = request.query_params.get('date', None)
    if date:
        projects = Project.objects.filter(
            Q(start_time__date=date) | Q(end_time__date=date)
        )
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)
    return Response([])

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_projects_view(request):
   
   
    user_projects = Project.objects.filter(user=request.user).order_by('-created_at')
    serializer = ProjectProfileSerializer(user_projects, many=True)
    return Response({
        'count': user_projects.count(),
        'projects': serializer.data
    })