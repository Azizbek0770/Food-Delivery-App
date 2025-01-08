import React from 'react';
import { useCart } from '../../contexts/CartContext';
import Button from '../common/Button';

const MenuCard = ({ item }) => {
  const { addItem } = useCart();
  const {
    id,
    name,
    description,
    price,
    image,
    category,
    is_available
  } = item;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative pb-[60%]">
        <img
          src={image}
          alt={name}
          className="absolute w-full h-full object-cover"
        />
        {category && (
          <span className="absolute top-2 left-2 px-2 py-1 bg-primary-500 text-white text-sm rounded-full">
            {category}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">
            ${price.toFixed(2)}
          </span>
          
          <Button
            variant="primary"
            size="sm"
            disabled={!is_available}
            onClick={() => addItem(item)}
          >
            {is_available ? 'Qo\'shish' : 'Mavjud emas'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard; 