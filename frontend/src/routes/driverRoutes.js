import React from 'react';
import { Route } from 'react-router-dom';
import DriverDashboard from '../pages/driver/Dashboard';
import ActiveOrders from '../pages/driver/ActiveOrders';
import OrderHistory from '../pages/driver/OrderHistory';
import Profile from '../pages/driver/Profile';
import Earnings from '../pages/driver/Earnings';

const DriverRoutes = (
  <>
    <Route index element={<DriverDashboard />} />
    <Route path="active-orders" element={<ActiveOrders />} />
    <Route path="history" element={<OrderHistory />} />
    <Route path="profile" element={<Profile />} />
    <Route path="earnings" element={<Earnings />} />
  </>
);

export default DriverRoutes;