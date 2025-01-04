from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from .models import CustomUser
from .serializers import UserSerializer

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        user = CustomUser.objects.create_user(
            username=data['username'],
            password=data['password'],
            email=data['email'],
            role=data['role']
        )
        token = Token.objects.create(user=user)
        return Response({'token': token.key})

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        user = authenticate(username=data['username'], password=data['password'])
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})
        return Response({'error': 'Invalid credentials'}, status=400)
