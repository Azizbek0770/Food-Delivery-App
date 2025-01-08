import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateProductAvailability } from '../../../store/slices/restaurantSlice';

const ProductList = ({ products, onEdit, onDelete, categoryId = null }) => {
  const dispatch = useDispatch();
  const [view, setView] = useState('grid'); // 'grid' yoki 'list'
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(product => 
    (categoryId ? product.category === categoryId : true) &&
    (searchQuery ? 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    )
  );

  const handleAvailabilityToggle = async (productId, currentStatus) => {
    try {
      await dispatch(updateProductAvailability({
        productId,
        isAvailable: !currentStatus
      })).unwrap();
    } catch (error) {
      console.error('Failed to update product availability:', error);
    }
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-6 flex items-center justify-between">
        <div className="relative flex-1 max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <span className="material-icons text-gray-400">search</span>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Mahsulotlarni qidirish..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg ${
              view === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="material-icons">grid_view</span>
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-lg ${
              view === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="material-icons">view_list</span>
          </button>
        </div>
      </div>

      {/* Mahsulotlar ro'yxati */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm border overflow-hidden"
            >
              {product.image && (
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {product.category_name}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {product.is_vegetarian && (
                      <span className="material-icons text-green-600" title="Vegetarian">
                        eco
                      </span>
                    )}
                    {product.is_spicy && (
                      <span className="material-icons text-red-600" title="Achchiq">
                        whatshot
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {product.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="font-medium text-lg">
                    {product.price.toLocaleString()} so'm
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAvailabilityToggle(product.id, product.is_available)}
                      className={`p-2 rounded-full ${
                        product.is_available
                          ? 'text-green-600 hover:bg-green-50'
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <span className="material-icons">
                        {product.is_available ? 'check_circle' : 'cancel'}
                      </span>
                    </button>
                    <button
                      onClick={() => onEdit(product)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                    >
                      <span className="material-icons">edit</span>
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    >
                      <span className="material-icons">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm border p-4"
            >
              <div className="flex items-center space-x-4">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-600">
                        {product.category_name}
                      </p>
                    </div>
                    <p className="font-medium">
                      {product.price.toLocaleString()} so'm
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {product.description}
                  </p>
                  <div className="mt-2 flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {product.is_vegetarian && (
                        <span className="material-icons text-green-600" title="Vegetarian">
                          eco
                        </span>
                      )}
                      {product.is_spicy && (
                        <span className="material-icons text-red-600" title="Achchiq">
                          whatshot
                        </span>
                      )}
                    </div>
                    <div className="flex-1"></div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleAvailabilityToggle(product.id, product.is_available)}
                        className={`p-2 rounded-full ${
                          product.is_available
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <span className="material-icons">
                          {product.is_available ? 'check_circle' : 'cancel'}
                        </span>
                      </button>
                      <button
                        onClick={() => onEdit(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                      >
                        <span className="material-icons">edit</span>
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      >
                        <span className="material-icons">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <span className="material-icons text-gray-400 text-5xl">
            restaurant_menu
          </span>
          <p className="mt-2 text-gray-600">
            {searchQuery ? 'Mahsulotlar topilmadi' : 'Mahsulotlar mavjud emas'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductList;