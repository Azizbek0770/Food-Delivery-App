from django.contrib import admin
from .models import Restaurant, Category, Product, WorkingHours, RestaurantReview

@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'is_active', 'rating', 'total_ratings', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'address', 'owner__username']
    readonly_fields = ['rating', 'total_ratings']

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'restaurant', 'is_active', 'order']
    list_filter = ['is_active', 'restaurant']
    search_fields = ['name', 'restaurant__name']
    ordering = ['restaurant', 'order', 'name']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'is_available']
    list_filter = ['is_available', 'category__restaurant', 'is_vegetarian', 'is_spicy']
    search_fields = ['name', 'category__name', 'category__restaurant__name']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(WorkingHours)
class WorkingHoursAdmin(admin.ModelAdmin):
    list_display = ['restaurant', 'day', 'opening_time', 'closing_time', 'is_closed']
    list_filter = ['day', 'is_closed', 'restaurant']
    ordering = ['restaurant', 'day']

@admin.register(RestaurantReview)
class RestaurantReviewAdmin(admin.ModelAdmin):
    list_display = ['restaurant', 'user', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['restaurant__name', 'user__username', 'comment']
    readonly_fields = ['created_at', 'updated_at']
