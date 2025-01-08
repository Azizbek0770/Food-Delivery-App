import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateGeneralSettings } from '../../../store/slices/adminSlice';

const GeneralSettings = () => {
  const dispatch = useDispatch();
  const [settings, setSettings] = useState({
    siteName: 'Food Delivery',
    siteDescription: 'Online ovqat yetkazib berish xizmati',
    logo: null,
    favicon: null,
    primaryColor: '#4F46E5',
    secondaryColor: '#10B981',
    defaultLanguage: 'uz',
    defaultCurrency: 'UZS',
    timeZone: 'Asia/Tashkent',
    orderPrefix: 'ORDER-',
    minimumOrderAmount: 20000,
    maxDeliveryDistance: 10,
    defaultCommissionRate: 10,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setSettings(prev => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateGeneralSettings(settings)).unwrap();
      // Show success message
    } catch (error) {
      // Show error message
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Asosiy ma'lumotlar */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Asosiy ma'lumotlar
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sayt nomi
            </label>
            <input
              type="text"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sayt tavsifi
            </label>
            <input
              type="text"
              name="siteDescription"
              value={settings.siteDescription}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Logotip va favicon */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Logotip va favicon
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logotip
            </label>
            <div className="mt-1 flex items-center">
              {settings.logo ? (
                <img
                  src={URL.createObjectURL(settings.logo)}
                  alt="Logo"
                  className="h-12 w-auto"
                />
              ) : (
                <div className="h-12 w-12 rounded-md bg-gray-200 flex items-center justify-center">
                  <span className="material-icons text-gray-400">image</span>
                </div>
              )}
              <input
                type="file"
                name="logo"
                onChange={handleFileChange}
                accept="image/*"
                className="ml-4"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Favicon
            </label>
            <div className="mt-1 flex items-center">
              {settings.favicon ? (
                <img
                  src={URL.createObjectURL(settings.favicon)}
                  alt="Favicon"
                  className="h-8 w-8"
                />
              ) : (
                <div className="h-8 w-8 rounded-md bg-gray-200 flex items-center justify-center">
                  <span className="material-icons text-gray-400 text-sm">image</span>
                </div>
              )}
              <input
                type="file"
                name="favicon"
                onChange={handleFileChange}
                accept="image/*"
                className="ml-4"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Ranglar */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Ranglar
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Asosiy rang
            </label>
            <input
              type="color"
              name="primaryColor"
              value={settings.primaryColor}
              onChange={handleChange}
              className="w-full h-10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ikkilamchi rang
            </label>
            <input
              type="color"
              name="secondaryColor"
              value={settings.secondaryColor}
              onChange={handleChange}
              className="w-full h-10"
            />
          </div>
        </div>
      </div>

      {/* Til va valyuta */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Til va valyuta
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Asosiy til
            </label>
            <select
              name="defaultLanguage"
              value={settings.defaultLanguage}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="uz">O'zbek</option>
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valyuta
            </label>
            <select
              name="defaultCurrency"
              value={settings.defaultCurrency}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="UZS">UZS (so'm)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vaqt mintaqasi
            </label>
            <select
              name="timeZone"
              value={settings.timeZone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="Asia/Tashkent">Toshkent (UTC+5)</option>
              {/* Boshqa vaqt mintaqalari */}
            </select>
          </div>
        </div>
      </div>

      {/* Buyurtma sozlamalari */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Buyurtma sozlamalari
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buyurtma prefiksi
            </label>
            <input
              type="text"
              name="orderPrefix"
              value={settings.orderPrefix}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimal buyurtma summasi
            </label>
            <input
              type="number"
              name="minimumOrderAmount"
              value={settings.minimumOrderAmount}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maksimal yetkazib berish masofasi (km)
            </label>
            <input
              type="number"
              name="maxDeliveryDistance"
              value={settings.maxDeliveryDistance}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Komissiya */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Komissiya
        </h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Standart komissiya stavkasi (%)
          </label>
          <input
            type="number"
            name="defaultCommissionRate"
            value={settings.defaultCommissionRate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
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

export default GeneralSettings;