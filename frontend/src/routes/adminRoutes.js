import React from 'react';
import { Route } from 'react-router-dom';
import AdminDashboard from '../pages/admin/Dashboard';
import Users from '../pages/admin/Users';
import Restaurants from '../pages/admin/Restaurants';
import Orders from '../pages/admin/Orders';
import Settings from '../pages/admin/Settings';
import Statistics from '../pages/admin/Statistics';

const AdminRoutes = (
  <>
    <Route index element={<AdminDashboard />} />
    <Route path="users" element={<Users />} />
    <Route path="restaurants" element={<Restaurants />} />
    <Route path="orders" element={<Orders />} />
    <Route path="settings" element={<Settings />} />
    <Route path="statistics" element={<Statistics />} />
  </>
);

export default AdminRoutes;