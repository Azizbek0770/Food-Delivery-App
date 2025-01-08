from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('customer', 'Customer'),
        ('restaurant', 'Restaurant Owner'),
        ('delivery', 'Delivery Person'),
        ('admin', 'Admin'),
    )
    
    phone = models.CharField(max_length=15, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    
    class Meta:
        ordering = ['-date_joined']

class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    title = models.CharField(max_length=100)
    address = models.TextField()
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    is_default = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-is_default', 'title'] 