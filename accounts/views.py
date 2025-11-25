# # # accounts/views.py

from django.contrib.auth.hashers import check_password
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserSerializer, UserUpdateSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    if request.method == 'GET':
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password_view(request):
    user = request.user
    
    current_password = request.data.get('currentPassword')
    new_password = request.data.get('newPassword')
    confirm_password = request.data.get('confirmPassword')
    
    if not user.check_password(current_password):
        return Response({"error": "Current password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)
    
    if new_password != confirm_password:
        return Response({"error": "New passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)
    
    if len(new_password) < 6:
        return Response({"error": "Password must be at least 6 characters"}, status=status.HTTP_400_BAD_REQUEST)
    
    user.set_password(new_password)
    user.save()
    
    return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_account_view(request):
    user = request.user
    password = request.data.get('password')
    
    if not user.check_password(password):
        return Response({"error": "Incorrect password"}, status=status.HTTP_400_BAD_REQUEST)
    
    user.delete()
    return Response({"message": "Account deleted successfully"}, status=status.HTTP_200_OK)