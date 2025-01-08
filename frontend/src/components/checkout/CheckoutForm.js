import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useOrder } from '../../contexts/OrderContext';
import Button from '../common/Button';
import InputField from '../common/InputField';

const CheckoutForm = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { createOrder } = useOrder();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    notes: '',
    payment_method: 'cash'
  });

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
      const orderData = {
        items: items.map(item => ({
          menu_item: item.id,
          quantity: item.quantity
        })),
        ...formData,
        total_amount: total
      };

      const order = await createOrder(orderData);
      clearCart();
      navigate(`/orders/${order.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InputField
        label="Manzil"
        name="address"
        value={formData.address}
        onChange={handleChange}
        required
      />

      <InputField
        label="Telefon"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        required
      />

      <InputField
        label="Qo'shimcha ma'lumot"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        multiline
        rows={3}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          To'lov usuli
        </label>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="payment_method"
              value="cash"
              checked={formData.payment_method === 'cash'}
              onChange={handleChange}
            />
            <span>Naqd pul</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="payment_method"
              value="card"
              checked={formData.payment_method === 'card'}
              onChange={handleChange}
            />
            <span>Karta orqali</span>
          </label>
        </div>
      </div>

      <div className="pt-4 border-t">
        <div className="flex justify-between text-lg font-semibold">
          <span>Jami:</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-4"
          isLoading={loading}
        >
          Buyurtma berish
        </Button>
      </div>
    </form>
  );
};

export default CheckoutForm; 