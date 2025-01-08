import React, { useState } from 'react';
import GeneralSettings from '../../components/admin/settings/GeneralSettings';
import DeliverySettings from '../../components/admin/settings/DeliverySettings';
import PaymentSettings from '../../components/admin/settings/PaymentSettings';
import NotificationSettings from '../../components/admin/settings/NotificationSettings';
import SecuritySettings from '../../components/admin/settings/SecuritySettings';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'Umumiy', icon: 'settings' },
    { id: 'delivery', label: 'Yetkazib berish', icon: 'local_shipping' },
    { id: 'payment', label: "To'lov", icon: 'payments' },
    { id: 'notification', label: 'Bildirishnomalar', icon: 'notifications' },
    { id: 'security', label: 'Xavfsizlik', icon: 'security' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />;
      case 'delivery':
        return <DeliverySettings />;
      case 'payment':
        return <PaymentSettings />;
      case 'notification':
        return <NotificationSettings />;
      case 'security':
        return <SecuritySettings />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Tizim sozlamalari</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        {/* Tabs */}
        <div className="border-b">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="material-icons text-base mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;