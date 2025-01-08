from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse
from .models import Order
from users.models import User
from restaurants.models import Restaurant

class OrderTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.restaurant = Restaurant.objects.create(
            owner=User.objects.create_user(
                username='restaurant_owner',
                password='testpass123',
                role='restaurant'
            ),
            name='Test Restaurant'
        )
        self.client.force_authenticate(user=self.user)

    def test_create_order(self):
        data = {
            'restaurant': self.restaurant.id,
            'items': [
                {
                    'menu_item': 1,
                    'quantity': 2
                }
            ],
            'delivery_address': 'Test Address'
        }
        response = self.client.post(reverse('order-list'), data)
        self.assertEqual(response.status_code, 201)