import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OrderMap from '../components/delivery/OrderMap';
import OrderDetails from '../components/delivery/OrderDetails';
import DeliveryStatistics from '../components/delivery/DeliveryStatistics';
import DeliveryProfile from '../components/delivery/DeliveryProfile';
import WebSocketService from '../services/websocket';
import { 
  getActiveDeliveries, 
  updateDeliveryStatus, 
  updateLocation,
  updateDeliveryInList,
  removeDeliveryFromList 
} from '../store/slices/deliverySlice';

const DeliveryDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { activeDeliveries, loading } = useSelector(state => state.delivery);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [location, setLocation] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    // Faol buyurtmalarni yuklash
    dispatch(getActiveDeliveries());

    // WebSocket ulanish
    const ws = new WebSocketService('delivery', handleWebSocketMessage);
    ws.connect();

    // Geolokatsiyani kuzatish
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        handleLocationUpdate,
        handleLocationError,
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
      setWatchId(id);
    }

    return () => {
      ws.disconnect();
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [dispatch]);

  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'delivery_update':
        const updatedDelivery = data.delivery;
        dispatch(updateDeliveryInList(updatedDelivery));
        if (selectedDelivery?.id === updatedDelivery.id) {
          setSelectedDelivery(updatedDelivery);
        }
        break;
      
      case 'new_delivery':
        dispatch(getActiveDeliveries());
        break;
      
      case 'delivery_cancelled':
        dispatch(removeDeliveryFromList(data.delivery_id));
        if (selectedDelivery?.id === data.delivery_id) {
          setSelectedDelivery(null);
        }
        break;
      
      default:
        console.log('Unknown message type:', data.type);
    }
  };

  const handleLocationUpdate = async (position) => {
    const newLocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };
    setLocation(newLocation);
    dispatch(updateLocation(newLocation));
  };

  const handleLocationError = (error) => {
    console.error('Geolocation error:', error);
  };

  const handleStatusUpdate = async (deliveryId, status) => {
    try {
      await dispatch(updateDeliveryStatus({ deliveryId, status })).unwrap();
      dispatch(getActiveDeliveries());
    } catch (error) {
      console.error('Failed to update delivery status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Yetkazib beruvchi paneli</h1>
          <button
            onClick={() => setShowStats(!showStats)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            {showStats ? 'Buyurtmalar' : 'Statistika'}
          </button>
        </div>

        {/* Profile */}
        <div className="mb-8">
          <DeliveryProfile />
        </div>

        {showStats ? (
          <DeliveryStatistics />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Faol buyurtmalar ro'yxati */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-xl font-semibold mb-4">Faol buyurtmalar</h2>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-white h-32 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {activeDeliveries.map(delivery => (
                    <div
                      key={delivery.id}
                      onClick={() => setSelectedDelivery(delivery)}
                      className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all ${
                        selectedDelivery?.id === delivery.id ? 'ring-2 ring-primary-500' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">Buyurtma #{delivery.order.id}</h3>
                          <p className="text-gray-600 text-sm mt-1">
                            {new Date(delivery.created_at).toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          delivery.status === 'on_way' ? 'bg-yellow-100 text-yellow-800' : 
                          delivery.status === 'picked_up' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {delivery.status_display}
                        </span>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 flex items-center">
                          <span className="material-icons text-gray-400 mr-1 text-base">
                            store
                          </span>
                          {delivery.order.restaurant_name}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <span className="material-icons text-gray-400 mr-1 text-base">
                            location_on
                          </span>
                          {delivery.order.delivery_address}
                        </p>
                      </div>
                    </div>
                  ))}

                  {activeDeliveries.length === 0 && (
                    <div className="text-center text-gray-600 py-8">
                      Hozircha faol buyurtmalar yo'q
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Xarita va buyurtma tafsilotlari */}
            <div className="lg:col-span-2">
              {selectedDelivery ? (
                <>
                  <div className="mb-6">
                    <OrderMap
                      delivery={selectedDelivery}
                      currentLocation={location}
                    />
                  </div>
                  <OrderDetails
                    delivery={selectedDelivery}
                    onStatusUpdate={handleStatusUpdate}
                  />
                </>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <span className="material-icons text-gray-400 text-6xl">
                    delivery_dining
                  </span>
                  <p className="text-gray-600 mt-4">
                    Tafsilotlarni ko'rish uchun buyurtmani tanlang
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryDashboard;