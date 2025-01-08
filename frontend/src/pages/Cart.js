import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeItem, clearCart } from '../store/slices/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, restaurant } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeItem(itemId));
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Savat bo'sh</h2>
          <p className="text-gray-600 mb-4">Sizning savatchangizda hech narsa yo'q</p>
          <button
            onClick={() => navigate('/restaurants')}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
          >
            Restoranlarga qaytish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Savat</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Buyurtma tafsilotlari</h2>
              <button
                onClick={() => dispatch(clearCart())}
                className="text-red-600 hover:text-red-800"
              >
                Savatni tozalash
              </button>
            </div>

            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-600">{item.price} so'm x {item.quantity}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-medium">
                      {item.price * item.quantity} so'm
                    </span>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      O'chirish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Buyurtma xulosasi</h2>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Taomlar narxi:</span>
                <span>{calculateTotal()} so'm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Yetkazib berish:</span>
                <span>{restaurant?.delivery_fee || 0} so'm</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Jami:</span>
                  <span>{calculateTotal() + (restaurant?.delivery_fee || 0)} so'm</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full mt-6 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700"
            >
              Buyurtma berish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;