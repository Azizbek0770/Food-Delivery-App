import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useOrder } from '../contexts/OrderContext';
import Button from '../components/common/Button';
import InputField from '../components/common/InputField';
import api from '../api/axios';

const Profile = () => {
  const { user, setUser } = useAuth();
  const { orders } = useOrder();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.patch('/auth/profile/', formData);
      setUser(response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Profil</h1>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
          <InputField
            label="Ism"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <InputField
            label="Telefon"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
          >
            Saqlash
          </Button>
        </form>

        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Buyurtmalar tarixi</h2>
          <div className="space-y-4">
            {orders.map(order => (
              <div 
                key={order.id}
                className="border rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium">#{order.id}</span>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`
                    px-2 py-1 rounded-full text-sm
                    ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                    ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {order.status}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-gray-600">
                    Jami: ${order.total_amount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 