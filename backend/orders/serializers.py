from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_name = serializers.CharField(source='menu_item.name', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = '__all__'
        read_only_fields = ('order',)

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ('user', 'total_amount', 'delivery_fee')

    def create(self, validated_data):
        items_data = self.context.get('items', [])
        order = Order.objects.create(**validated_data)
        
        total = 0
        for item_data in items_data:
            menu_item = item_data['menu_item']
            quantity = item_data['quantity']
            price = menu_item.price * quantity
            total += price
            
            OrderItem.objects.create(
                order=order,
                menu_item=menu_item,
                quantity=quantity,
                price=price,
                notes=item_data.get('notes', '')
            )
        
        order.total_amount = total + order.delivery_fee
        order.save()
        return order