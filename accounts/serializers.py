
# accounts/serializers.py

from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True)
    firstName = serializers.CharField(source='first_name', write_only=True)  
    lastName = serializers.CharField(source='last_name', write_only=True)   
    
    class Meta:
        model = User
        fields = ('id', 'firstName', 'lastName', 'email', 'mobile', 'password', 'confirm_password')
    
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match"})
        return data
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        
        user = User.objects.create(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            mobile=validated_data['mobile']
        )
        user.set_password(password)
        user.save()
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        if email and password:
            user = authenticate(username=email, password=password)
            if user:
                if user.is_active:
                    data['user'] = user
                else:
                    raise serializers.ValidationError("User account is disabled.")
            else:
                raise serializers.ValidationError("Unable to log in with provided credentials.")
        else:
            raise serializers.ValidationError("Must include 'email' and 'password'.")
        
        return data

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'mobile')
    
    def validate_mobile(self, value):
        import re
        if value and not re.match(r'^01[0125][0-9]{8}$', value):
            raise serializers.ValidationError("Invalid Egyptian mobile number")
        return value

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email', 'mobile', 'date_joined')
        read_only_fields = ('id', 'email', 'date_joined')