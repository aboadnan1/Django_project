# projects/models.py
from django.db import models
from accounts.models import User

class Project(models.Model):
    title = models.CharField(max_length=200)
    details = models.TextField()
    total_target = models.DecimalField(max_digits=10, decimal_places=2)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-created_at']