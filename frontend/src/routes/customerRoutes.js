import React from 'react';
import { Route } from 'react-router-dom';
import CustomerDashboard from '../pages/customer/Dashboard';
import OrderHistory from '../pages/customer/OrderHistory';
import Profile from '../pages/customer/Profile';
import Addresses from '../pages/customer/Addresses';
import Favorites from '../pages/customer/Favorites';

const CustomerRoutes = (
  <>
    <Route index element={<CustomerDashboard />} />
    <Route path="orders" element={<OrderHistory />} />
    <Route path="profile" element={<Profile />} />
    <Route path="addresses" element={<Addresses />} />
    <Route path="favorites" element={<Favorites />} />
  </>
);

export default CustomerRoutes;