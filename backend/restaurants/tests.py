from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse
from .models import Restaurant
from users.models import User

class RestaurantTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123',
            role='restaurant'
        )
        self.client.force_authenticate(user=self.user)
        
        self.restaurant = Restaurant.objects.create(
            owner=self.user,
            name='Test Restaurant',
            description='Test Description',
            address='Test Address',
            phone='1234567890'
        )

    def test_create_restaurant(self):
        data = {
            'name': 'New Restaurant',
            'description': 'New Description',
            'address': 'New Address',
            'phone': '0987654321'
        }
        response = self.client.post(reverse('restaurant-list'), data)
        self.assertEqual(response.status_code, 201)

    def test_get_restaurant_list(self):
        response = self.client.get(reverse('restaurant-list'))
        self.assertEqual(response.status_code, 200)