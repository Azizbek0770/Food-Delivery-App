import React from 'react';
import { useParams } from 'react-router-dom';

const OrderTracking = () => {
  const { orderId } = useParams();

  return <h1>Tracking Order {orderId}</h1>;
};

export default OrderTracking;
