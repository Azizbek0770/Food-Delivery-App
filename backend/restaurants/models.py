from django.db import models
from users.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class Restaurant(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='restaurants')
    name = models.CharField(max_length=255)
    description = models.TextField()
    address = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    image = models.ImageField(upload_to='restaurants/', null=True, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    is_active = models.BooleanField(default=True)
    delivery_radius = models.FloatField(help_text="Delivery radius in kilometers")
    minimum_order = models.DecimalField(max_digits=10, decimal_places=2)
    average_delivery_time = models.IntegerField(help_text="Average delivery time in minutes")
    rating = models.FloatField(
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        default=0
    )
    total_ratings = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Category(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'name']
        verbose_name_plural = 'categories'

    def __str__(self):
        return f"{self.restaurant.name} - {self.name}"

class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='products/')
    is_available = models.BooleanField(default=True)
    preparation_time = models.IntegerField(help_text="Preparation time in minutes")
    calories = models.IntegerField(null=True, blank=True)
    is_vegetarian = models.BooleanField(default=False)
    is_spicy = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.category.restaurant.name} - {self.name}"

class WorkingHours(models.Model):
    DAYS_OF_WEEK = (
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    )

    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='working_hours')
    day = models.IntegerField(choices=DAYS_OF_WEEK)
    opening_time = models.TimeField()
    closing_time = models.TimeField()
    is_closed = models.BooleanField(default=False)

    class Meta:
        ordering = ['day', 'opening_time']
        unique_together = ['restaurant', 'day']

    def __str__(self):
        return f"{self.restaurant.name} - {self.get_day_display()}"

class RestaurantReview(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['restaurant', 'user']
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        # Yangi review qo'shilganda restaurant ratingini yangilash
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        if is_new:
            self.restaurant.total_ratings += 1
        
        # O'rtacha ratingni qayta hisoblash
        avg_rating = RestaurantReview.objects.filter(
            restaurant=self.restaurant
        ).aggregate(models.Avg('rating'))['rating__avg']
        
        self.restaurant.rating = round(avg_rating, 1)
        self.restaurant.save() 