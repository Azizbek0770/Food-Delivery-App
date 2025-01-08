import React from 'react';
import { StarIcon } from '@heroicons/react/solid';

const RatingStars = ({ rating, size = 'md' }) => {
  const stars = Array.from({ length: 5 }, (_, index) => {
    const starFill = index < Math.floor(rating) 
      ? 'text-yellow-400' 
      : 'text-gray-300';

    const starSize = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    }[size];

    return (
      <StarIcon 
        key={index} 
        className={`${starFill} ${starSize}`} 
      />
    );
  });

  return (
    <div className="flex">
      {stars}
      <span className="ml-1 text-gray-600">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

export default RatingStars; 