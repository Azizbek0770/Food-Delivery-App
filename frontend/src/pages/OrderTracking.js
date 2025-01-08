import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useOrder } from '../contexts/OrderContext';
import OrderTrackingComponent from '../components/orders/OrderTracking';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { toast } from 'react-hot-toast';

const OrderTracking = () => {
  const { id } = useParams();
  const { trackOrder } = useOrder();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await trackOrder(id);
        setOrder(data);
      } catch (error) {
        toast.error('Buyurtmani yuklashda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, trackOrder]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Buyurtma topilmadi</h2>
        <p className="text-gray-600">
          Ushbu ID ga ega buyurtma mavjud emas
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="border-b pb-4 mb-6">
          <h2 className="text-2xl font-bold">Buyurtma #{order.id}</h2>
          <p className="text-gray-600 mt-1">
            Buyurtma vaqti: {new Date(order.created_at).toLocaleString()}
          </p>
        </div>

        <OrderTrackingComponent orderId={id} />

        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Buyurtma tafsilotlari</h3>
          
          <div className="space-y-4">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-gray-600 ml-2">x{item.quantity}</span>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Yetkazib berish</span>
              <span>$5.00</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Jami</span>
              <span>${(order.total_amount).toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-medium mb-2">Yetkazib berish manzili:</h4>
            <p className="text-gray-600">{order.delivery_address}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking; 