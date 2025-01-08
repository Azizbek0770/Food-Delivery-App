import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import CustomerDashboard from './pages/Dashboard/CustomerDashboard';
import DriverDashboard from './pages/Dashboard/DriverDashboard';
import RestaurantDashboard from './pages/Dashboard/RestaurantDashboard';
import OrderTracking from './pages/OrderTracking';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, role }) => {
  const { user } = useSelector((state) => state.auth);
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard/customer"
        element={
          <PrivateRoute role="customer">
            <CustomerDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/driver"
        element={
          <PrivateRoute role="driver">
            <DriverDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/restaurant"
        element={
          <PrivateRoute role="restaurant">
            <RestaurantDashboard />
          </PrivateRoute>
        }
      />
      <Route path="/orders/track/:orderId" element={<OrderTracking />} />
    </Routes>
  </Router>
);

export default AppRoutes;
