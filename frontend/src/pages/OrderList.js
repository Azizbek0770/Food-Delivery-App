import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrders } from '../store/slices/orderSlice';
import OrderCard from '../components/orders/OrderCard';

const OrderList = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(state => state.order);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  if (loading) return <div>Yuklanmoqda...</div>;
  if (error) return <div>Xatolik yuz berdi: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mening buyurtmalarim</h1>
      
      {orders.length === 0 ? (
        <div className="text-center text-gray-600">
          Sizda hali buyurtmalar yo'q
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;