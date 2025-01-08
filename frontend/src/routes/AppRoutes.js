import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import AuthRoutes from './authRoutes';
import CustomerRoutes from './customerRoutes';
import DriverRoutes from './driverRoutes';
import RestaurantRoutes from './restaurantRoutes';
import AdminRoutes from './adminRoutes';
import HomePage from '../pages/HomePage';
import OrderTracking from '../pages/OrderTracking';

const AppRoutes = () => (
  <Router>
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/orders/track/:orderId" element={<OrderTracking />} />
      
      {/* Auth routes */}
      {AuthRoutes}

      {/* Protected routes */}
      <Route path="/dashboard/customer/*" element={
        <PrivateRoute role="customer">
          {CustomerRoutes}
        </PrivateRoute>
      }/>
      
      <Route path="/dashboard/driver/*" element={
        <PrivateRoute role="driver">
          {DriverRoutes}
        </PrivateRoute>
      }/>
      
      <Route path="/dashboard/restaurant/*" element={
        <PrivateRoute role="restaurant">
          {RestaurantRoutes}
        </PrivateRoute>
      }/>

      <Route path="/admin/*" element={
        <PrivateRoute role="admin">
          {AdminRoutes}
        </PrivateRoute>
      }/>
    </Routes>
  </Router>
);

export default AppRoutes;