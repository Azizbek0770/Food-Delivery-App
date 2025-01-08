import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { formatDistance } from 'date-fns';
import { uz } from 'date-fns/locale';

const OrdersList = ({ restaurantId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, preparing, ready, completed

  useEffect(() => {
    fetchOrders();
  }, [restaurantId, filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // API dan buyurtmalarni olish
      const response = await fetch(`/api/restaurants/${restaurantId}/orders?status=${filter}`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchOrders(); // Ro'yxatni yangilash
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white h-24 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Buyurtmalar</h2>
          <div className="flex space-x-2">
            {['all', 'pending', 'preparing', 'ready', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filter === status
                    ? 'bg-primary-100 text-primary-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'Hammasi' :
                 status === 'pending' ? 'Yangi' :
                 status === 'preparing' ? 'Tayyorlanmoqda' :
                 status === 'ready' ? 'Tayyor' : 'Tugatilgan'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="divide-y">
        {orders.map(order => (
          <div key={order.id} className="p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium">Buyurtma #{order.id}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                    {order.status_display}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {formatDistance(new Date(order.created_at), new Date(), {
                    addSuffix: true,
                    locale: uz
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{order.total_amount.toLocaleString()} so'm</p>
                <p className="text-sm text-gray-600">{order.items.length} ta mahsulot</p>
              </div>
            </div>

            {/* Buyurtma tafsilotlari */}
            <div className="mt-4 space-y-2">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.quantity} x {item.product_name}</span>
                  <span className="text-gray-600">
                    {(item.quantity * item.price).toLocaleString()} so'm
                  </span>
                </div>
              ))}
            </div>

            {/* Harakatlar */}
            <div className="mt-4 flex justify-end space-x-2">
              {order.status === 'pending' && (
                <button
                  onClick={() => handleStatusChange(order.id, 'preparing')}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Tayyorlashni boshlash
                </button>
              )}
              {order.status === 'preparing' && (
                <button
                  onClick={() => handleStatusChange(order.id, 'ready')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Tayyor
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersList;