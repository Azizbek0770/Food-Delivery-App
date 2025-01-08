import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleAvailability } from '../../store/slices/deliverySlice';

const DeliveryProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleAvailability = async () => {
    setIsUpdating(true);
    try {
      await dispatch(toggleAvailability()).unwrap();
    } catch (error) {
      console.error('Failed to toggle availability:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="material-icons text-3xl text-gray-400">
                account_circle
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.full_name}</h2>
              <p className="text-gray-600">{user.phone}</p>
            </div>
          </div>
          <button
            onClick={handleToggleAvailability}
            disabled={isUpdating}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              user.delivery_person?.is_available
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            <span className="material-icons">
              {user.delivery_person?.is_available ? 'check_circle' : 'do_not_disturb'}
            </span>
            <span>
              {user.delivery_person?.is_available ? 'Band emas' : 'Band'}
            </span>
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Transport ma'lumotlari</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600">Transport turi</p>
                <p className="font-medium">{user.delivery_person?.vehicle_type}</p>
              </div>
              <div>
                <p className="text-gray-600">Transport raqami</p>
                <p className="font-medium">{user.delivery_person?.vehicle_number}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Oxirgi joylashuv</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600">Kenglik</p>
                <p className="font-medium">
                  {user.delivery_person?.current_latitude?.toFixed(6) || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Uzunlik</p>
                <p className="font-medium">
                  {user.delivery_person?.current_longitude?.toFixed(6) || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Oxirgi yangilanish</p>
                <p className="font-medium">
                  {user.delivery_person?.last_location_update
                    ? new Date(user.delivery_person.last_location_update).toLocaleString()
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryProfile;