import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateDeliverySettings } from '../../../store/slices/adminSlice';

const DeliverySettings = () => {
  const dispatch = useDispatch();
  const [settings, setSettings] = useState({
    baseDeliveryFee: 10000,
    perKmFee: 1000,
    minDeliveryTime: 30,
    maxDeliveryTime: 60,
    deliveryRadiusLimit: 10,
    autoAssignOrders: true,
    allowScheduledDelivery: true,
    scheduledDeliveryTimeSlots: [
      { start: '09:00', end: '22:00' }
    ],
    deliveryZones: [
      {
        id: 1,
        name: 'Markaziy zona',
        baseFee: 10000,
        perKmFee: 1000,
        minOrderAmount: 0,
      }
    ],
    deliveryPersonRequirements: {
      minAge: 18,
      requiresVehicle: true,
      requiredDocuments: ['passport', 'driverLicense'],
      workingHours: { start: '09:00', end: '22:00' }
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTimeSlotChange = (index, field, value) => {
    const newTimeSlots = [...settings.scheduledDeliveryTimeSlots];
    newTimeSlots[index] = { ...newTimeSlots[index], [field]: value };
    setSettings(prev => ({
      ...prev,
      scheduledDeliveryTimeSlots: newTimeSlots
    }));
  };

  const addTimeSlot = () => {
    setSettings(prev => ({
      ...prev,
      scheduledDeliveryTimeSlots: [
        ...prev.scheduledDeliveryTimeSlots,
        { start: '09:00', end: '22:00' }
      ]
    }));
  };

  const removeTimeSlot = (index) => {
    setSettings(prev => ({
      ...prev,
      scheduledDeliveryTimeSlots: prev.scheduledDeliveryTimeSlots.filter((_, i) => i !== index)
    }));
  };

  const handleZoneChange = (index, field, value) => {
    const newZones = [...settings.deliveryZones];
    newZones[index] = { ...newZones[index], [field]: value };
    setSettings(prev => ({
      ...prev,
      deliveryZones: newZones
    }));
  };

  const addZone = () => {
    setSettings(prev => ({
      ...prev,
      deliveryZones: [
        ...prev.deliveryZones,
        {
          id: Date.now(),
          name: '',
          baseFee: 10000,
          perKmFee: 1000,
          minOrderAmount: 0
        }
      ]
    }));
  };

  const removeZone = (index) => {
    setSettings(prev => ({
      ...prev,
      deliveryZones: prev.deliveryZones.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateDeliverySettings(settings)).unwrap();
      // Show success message
    } catch (error) {
      // Show error message
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Asosiy yetkazib berish sozlamalari */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Asosiy yetkazib berish sozlamalari
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bazaviy yetkazib berish narxi
            </label>
            <input
              type="number"
              name="baseDeliveryFee"
              value={settings.baseDeliveryFee}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Har kilometr uchun qo'shimcha to'lov
            </label>
            <input
              type="number"
              name="perKmFee"
              value={settings.perKmFee}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimal yetkazib berish vaqti (daqiqa)
            </label>
            <input
              type="number"
              name="minDeliveryTime"
              value={settings.minDeliveryTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maksimal yetkazib berish vaqti (daqiqa)
            </label>
            <input
              type="number"
              name="maxDeliveryTime"
              value={settings.maxDeliveryTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Yetkazib berish zonalari */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Yetkazib berish zonalari
          </h3>
          <button
            type="button"
            onClick={addZone}
            className="px-3 py-1 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Zona qo'shish
          </button>
        </div>
        <div className="space-y-4">
          {settings.deliveryZones.map((zone, index) => (
            <div
              key={zone.id}
              className="p-4 border border-gray-200 rounded-md"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zona nomi
                  </label>
                  <input
                    type="text"
                    value={zone.name}
                    onChange={(e) => handleZoneChange(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bazaviy narx
                  </label>
                  <input
                    type="number"
                    value={zone.baseFee}
                    onChange={(e) => handleZoneChange(index, 'baseFee', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Km narxi
                  </label>
                  <input
                    type="number"
                    value={zone.perKmFee}
                    onChange={(e) => handleZoneChange(index, 'perKmFee', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeZone(index)}
                    className="px-3 py-2 text-sm text-red-600 hover:text-red-700"
                  >
                    O'chirish
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Yetkazib beruvchi talablari */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Yetkazib beruvchi talablari
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimal yosh
            </label>
            <input
              type="number"
              name="minAge"
              value={settings.deliveryPersonRequirements.minAge}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                deliveryPersonRequirements: {
                  ...prev.deliveryPersonRequirements,
                  minAge: e.target.value
                }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transport vositasi talab qilinadi
            </label>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="requiresVehicle"
                  checked={settings.deliveryPersonRequirements.requiresVehicle}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    deliveryPersonRequirements: {
                      ...prev.deliveryPersonRequirements,
                      requiresVehicle: e.target.checked
                    }
                  }))}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2">Ha</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Submit button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Saqlash
        </button>
      </div>
    </form>
  );
};

export default DeliverySettings;