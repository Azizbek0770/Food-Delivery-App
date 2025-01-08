import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders, updateOrderStatus } from '../../features/orderSlice';

const DriverDashboard = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
  };

  return (
    <div>
      <h1>Driver Dashboard</h1>
      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              <p>Order #{order.id}</p>
              <p>Restaurant: {order.restaurant.name}</p>
              <p>Customer: {order.customer.username}</p>
              <p>Status: {order.status}</p>
              <button onClick={() => handleStatusChange(order.id, 'out_for_delivery')}>
                Mark as Out for Delivery
              </button>
              <button onClick={() => handleStatusChange(order.id, 'delivered')}>
                Mark as Delivered
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DriverDashboard;