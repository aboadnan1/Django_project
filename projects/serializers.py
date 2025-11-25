# projects/serializers.py
from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = Project
        fields = ('id', 'title', 'details', 'total_target', 'start_time', 
                 'end_time', 'created_at', 'user', 'user_name')
        read_only_fields = ('user', 'created_at')
    
    def validate(self, data):
        if data['start_time'] >= data['end_time']:
            raise serializers.ValidationError("End time must be after start time")
        return data

class ProjectProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('id', 'title', 'total_target', 'start_time', 'end_time', 'created_at')    