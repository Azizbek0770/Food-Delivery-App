import React, { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const createOrder = async (orderData) => {
    setLoading(true);
    try {
      const response = await api.post('/orders/', orderData);
      setActiveOrder(response.data);
      setOrders([response.data, ...orders]);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders/');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackOrder = async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}/track/`);
      setActiveOrder(response.data);
      return response.data;
    } catch (error) {
      console.error('Error tracking order:', error);
    }
  };

  const value = {
    orders,
    activeOrder,
    loading,
    createOrder,
    getOrders,
    trackOrder,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}; 