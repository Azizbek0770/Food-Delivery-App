import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateProductAvailability } from '../../../store/slices/restaurantSlice';

const MenuManager = ({ popularProducts, restaurantId }) => {
  const dispatch = useDispatch();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleAvailabilityToggle = async (productId, currentStatus) => {
    try {
      await dispatch(updateProductAvailability({
        restaurantId,
        productId,
        isAvailable: !currentStatus
      })).unwrap();
    } catch (error) {
      console.error('Failed to update product availability:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Menu boshqaruvi</h2>
      </div>

      {/* Mashhur mahsulotlar */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-600 mb-4">
          Eng ko'p buyurtma qilingan mahsulotlar
        </h3>
        <div className="space-y-4">
          {popularProducts.map(product => (
            <div
              key={product.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-sm text-gray-600">{product.category_name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <p className="font-medium">{product.price.toLocaleString()} so'm</p>
                <button
                  onClick={() => handleAvailabilityToggle(product.id, product.is_available)}
                  className={`p-2 rounded-full ${
                    product.is_available
                      ? 'bg-green-100 text-green-600 hover:bg-green-200'
                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                  }`}
                >
                  <span className="material-icons text-xl">
                    {product.is_available ? 'check_circle' : 'cancel'}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tezkor amallar */}
      <div className="p-4 border-t">
        <h3 className="text-sm font-medium text-gray-600 mb-4">Tezkor amallar</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => {/* Menu tahrirlash */}}
            className="flex items-center justify-center space-x-2 p-3 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100"
          >
            <span className="material-icons">menu_book</span>
            <span>Menu tahrirlash</span>
          </button>
          <button
            onClick={() => {/* Kategoriya qo'shish */}}
            className="flex items-center justify-center space-x-2 p-3 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100"
          >
            <span className="material-icons">add_circle</span>
            <span>Yangi kategoriya</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuManager;