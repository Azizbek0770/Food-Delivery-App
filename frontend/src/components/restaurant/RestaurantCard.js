import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/solid';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link to={`/restaurants/${restaurant.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900">{restaurant.name}</h3>
          
          <div className="mt-2 flex items-center">
            <StarIcon className="h-5 w-5 text-yellow-400" />
            <span className="ml-1 text-gray-600">{restaurant.rating}</span>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-600">{restaurant.delivery_time} min</span>
          </div>
          
          <div className="mt-2 text-sm text-gray-500">
            <p>{restaurant.description}</p>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <span className="text-gray-600">
              Min. buyurtma: {restaurant.minimum_order} so'm
            </span>
            <span className="text-gray-600">
              Yetkazib berish: {restaurant.delivery_fee} so'm
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;