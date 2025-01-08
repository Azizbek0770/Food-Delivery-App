import React from 'react';
import { Route } from 'react-router-dom';
import RestaurantDashboard from '../pages/restaurant/Dashboard';
import Menu from '../pages/restaurant/Menu';
import Orders from '../pages/restaurant/Orders';
import Profile from '../pages/restaurant/Profile';
import Analytics from '../pages/restaurant/Analytics';

const RestaurantRoutes = (
  <>
    <Route index element={<RestaurantDashboard />} />
    <Route path="menu" element={<Menu />} />
    <Route path="orders" element={<Orders />} />
    <Route path="profile" element={<Profile />} />
    <Route path="analytics" element={<Analytics />} />
  </>
);

export default RestaurantRoutes;