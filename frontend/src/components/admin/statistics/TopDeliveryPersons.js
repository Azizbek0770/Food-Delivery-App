import React from 'react';
import { formatCurrency } from '../../../utils/format';

const TopDeliveryPersons = ({ deliveryPersons }) => {
  return (
    <div className="space-y-4">
      {deliveryPersons.map((person, index) => (
        <div
          key={person.id}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center font-semibold text-gray-500">
              #{index + 1}
            </div>
            <div className="ml-4 flex items-center">
              {person.avatar ? (
                <img
                  src={person.avatar}
                  alt={person.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="material-icons text-gray-400">person</span>
                </div>
              )}
              <div className="ml-3">
                <p className="font-medium">{person.name}</p>
                <p className="text-sm text-gray-600">{person.phone}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">{person.completed_orders} buyurtma</p>
            <p className="text-sm text-gray-600">
              {formatCurrency(person.total_earnings)} daromad
            </p>
          </div>
        </div>
      ))}

      {deliveryPersons.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          Ma'lumotlar mavjud emas
        </div>
      )}
    </div>
  );
};

export default TopDeliveryPersons;