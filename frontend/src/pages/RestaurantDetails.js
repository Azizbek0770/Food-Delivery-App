import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRestaurantDetails, getRestaurantMenu } from '../store/slices/restaurantSlice';
import { addItem } from '../store/slices/cartSlice';

const RestaurantDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentRestaurant, menu, loading } = useSelector(state => state.restaurant);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    dispatch(getRestaurantDetails(id));
    dispatch(getRestaurantMenu(id));
  }, [dispatch, id]);

  const handleAddToCart = (item) => {
    dispatch(addItem({ item, restaurantId: id }));
  };

  if (loading || !currentRestaurant) return <div>Yuklanmoqda...</div>;

  const filteredMenu = selectedCategory === 'all' 
    ? menu 
    : menu.filter(item => item.category === selectedCategory);

  const categories = ['all', ...new Set(menu.map(item => item.category))];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Restaurant Info */}
      <div className="mb-8">
        <div className="relative h-64 rounded-lg overflow-hidden">
          <img
            src={currentRestaurant.image}
            alt={currentRestaurant.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="mt-4">
          <h1 className="text-3xl font-bold">{currentRestaurant.name}</h1>
          <p className="text-gray-600 mt-2">{currentRestaurant.description}</p>
          <div className="flex items-center mt-2 space-x-4">
            <span className="text-gray-600">
              ⭐ {currentRestaurant.rating} ({currentRestaurant.total_ratings} baho)
            </span>
            <span className="text-gray-600">
              🕒 {currentRestaurant.delivery_time} daqiqa
            </span>
            <span className="text-gray-600">
              💰 Minimal buyurtma: {currentRestaurant.minimum_order} so'm
            </span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6 flex space-x-4 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category === 'all' ? 'Barcha taomlar' : category}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMenu.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-gray-600 text-sm mt-1">{item.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold">{item.price} so'm</span>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                >
                  Savatga qo'shish
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantDetail;