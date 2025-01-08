import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, restaurant } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    delivery_address: '',
    phone: user?.phone || '',
    payment_method: 'cash',
    notes: ''
  });

  const [loading, setLoading] = useState(false);

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        restaurant: restaurant.id,
        items: items.map(item => ({
          menu_item: item.id,
          quantity: item.quantity
        })),
        ...formData
      };

      const result = await dispatch(createOrder(orderData)).unwrap();
      dispatch(clearCart());
      navigate(`/orders/${result.id}`);
    } catch (error) {
      console.error('Order creation failed:', error);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Buyurtmani rasmiylashtirish</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yetkazib berish manzili
                </label>
                <textarea
                  name="delivery_address"
                  required
                  value={formData.delivery_address}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-primary-500 focus:border-primary-500"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon raqam
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To'lov usuli
                </label>
                <select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="cash">Naqd pul</option>
                  <option value="card">Karta orqali</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qo'shimcha izohlar
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-primary-500 focus:border-primary-500"
                  rows="3"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:bg-gray-400"
            >
              {loading ? 'Buyurtma qilinmoqda...' : 'Buyurtmani tasdiqlash'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Buyurtma xulosasi</h2>
            
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-gray-600">
                    {item.name} x {item.quantity}
                  </span>
                  <span>{item.price * item.quantity} so'm</span>
                </div>
              ))}
              
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Taomlar narxi:</span>
                  <span>{calculateTotal()} so'm</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-600">Yetkazib berish:</span>
                  <span>{restaurant?.delivery_fee || 0} so'm</span>
                </div>
                <div className="flex justify-between mt-2 font-semibold">
                  <span>Jami:</span>
                  <span>{calculateTotal() + (restaurant?.delivery_fee || 0)} so'm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;