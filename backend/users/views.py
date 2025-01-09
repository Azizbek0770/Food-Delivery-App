from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
from django.utils import timezone
import random
from django.contrib.gis.geos import Point
from django.conf import settings
from .models import Address, DriverProfile
from .serializers import (
    UserSerializer,
    UserCreateSerializer,
    UserUpdateSerializer,
    AddressSerializer,
    DriverProfileSerializer,
    ChangePasswordSerializer,
    PhoneVerificationSerializer
)
from .permissions import IsOwnerOrAdmin, IsDriver
from notifications.services import send_sms
from core.pagination import StandardResultsSetPagination

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    pagination_class = StandardResultsSetPagination
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return UserUpdateSerializer
        return UserSerializer

    def get_permissions(self):
        if self.action in ['create', 'verify_phone']:
            return [AllowAny()]
        return super().get_permissions()

    def get_queryset(self):
        if self.request.user.is_staff:
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)

    @action(detail=False, methods=['post'])
    def verify_phone(self, request):
        phone = request.data.get('phone')
        if not phone:
            return Response(
                {'error': 'Phone number is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verification code yaratish
        code = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        
        try:
            user = User.objects.get(phone=phone)
            user.phone_verification_code = code
            user.phone_verification_code_expires = timezone.now() + timezone.timedelta(minutes=10)
            user.save()

            # SMS yuborish
            send_sms(phone, f"Your verification code is: {code}")
            
            return Response({'message': 'Verification code sent'})
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['post'])
    def verify_code(self, request):
        serializer = PhoneVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        code = serializer.validated_data['code']
        user = request.user

        if (user.phone_verification_code == code and 
            user.phone_verification_code_expires > timezone.now()):
            user.is_phone_verified = True
            user.phone_verification_code = None
            user.phone_verification_code_expires = None
            user.save()
            return Response({'message': 'Phone verified successfully'})
        
        return Response(
            {'error': 'Invalid or expired code'},
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=False, methods=['post'])
    def change_password(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        if not user.check_password(serializer.validated_data['old_password']):
            return Response(
                {'error': 'Wrong password'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(serializer.validated_data['new_password'])
        user.save()
        return Response({'message': 'Password changed successfully'})

class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class DriverProfileViewSet(viewsets.ModelViewSet):
    queryset = DriverProfile.objects.all()
    serializer_class = DriverProfileSerializer
    permission_classes = [IsAuthenticated, IsDriver]

    def get_queryset(self):
        if self.request.user.is_staff:
            return DriverProfile.objects.all()
        return DriverProfile.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def toggle_availability(self, request):
        driver = request.user.driverprofile
        driver.is_available = not driver.is_available
        driver.save()
        return Response({
            'is_available': driver.is_available
        })

    @action(detail=False, methods=['post'])
    def update_location(self, request):
        lat = request.data.get('latitude')
        lng = request.data.get('longitude')
        
        if not lat or not lng:
            return Response(
                {'error': 'Latitude and longitude are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        driver = request.user.driverprofile
        driver.current_location = Point(float(lng), float(lat))
        driver.save()
        
        return Response({'message': 'Location updated successfully'})