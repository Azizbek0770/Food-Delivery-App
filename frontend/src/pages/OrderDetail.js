import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails } from '../store/slices/orderSlice';
import WebSocketService from '../services/websocket';

const OrderDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentOrder, loading } = useSelector(state => state.order);

  useEffect(() => {
    dispatch(getOrderDetails(id));

    // WebSocket ulanish
    const ws = new WebSocketService(id, (data) => {
      if (data.type === 'order_status') {
        dispatch(getOrderDetails(id));
      }
    });

    ws.connect();

    return () => {
      ws.disconnect();
    };
  }, [dispatch, id]);

  if (loading || !currentOrder) return <div>Yuklanmoqda...</div>;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">Buyurtma #{currentOrder.id}</h1>
            <p className="text-gray-600 mt-1">
              {new Date(currentOrder.created_at).toLocaleString()}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm ${getStatusColor(currentOrder.status)}`}>
            {currentOrder.status}
          </span>
        </div>

        <div className="border-t border-gray-200 py-4">
          <h2 className="text-lg font-semibold mb-4">Restoran ma'lumotlari</h2>
          <p className="text-gray-700">{currentOrder.restaurant_name}</p>
        </div>

        <div className="border-t border-gray-200 py-4">
          <h2 className="text-lg font-semibold mb-4">Buyurtma tafsilotlari</h2>
          <div className="space-y-4">
            {currentOrder.items.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.menu_item_name}</p>
                  <p className="text-gray-600 text-sm">{item.quantity} x {item.price} so'm</p>
                </div>
                <p className="font-medium">{item.quantity * item.price} so'm</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 py-4">
          <h2 className="text-lg font-semibold mb-4">Yetkazib berish ma'lumotlari</h2>
          <p className="text-gray-700">{currentOrder.delivery_address}</p>
        </div>

        <div className="border-t border-gray-200 py-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Taomlar narxi:</span>
            <span>{currentOrder.subtotal} so'm</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600">Yetkazib berish:</span>
            <span>{currentOrder.delivery_fee} so'm</span>
          </div>
          <div className="flex justify-between items-center mt-4 text-lg font-bold">
            <span>Jami:</span>
            <span>{currentOrder.total_amount} so'm</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;