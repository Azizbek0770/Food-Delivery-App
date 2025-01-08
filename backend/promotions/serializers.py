from rest_framework import serializers
from .models import Promotion, UserPromotion

class PromotionSerializer(serializers.ModelSerializer):
    is_valid = serializers.SerializerMethodField()
    
    class Meta:
        model = Promotion
        fields = '__all__'
    
    def get_is_valid(self, obj):
        user = self.context.get('request').user
        return not UserPromotion.objects.filter(
            user=user, 
            promotion=obj
        ).exists() 