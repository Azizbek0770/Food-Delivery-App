import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

// Marker ikonkalarini sozlash
const createIcon = (iconUrl) => new L.Icon({
  iconUrl,
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35]
});

const deliveryIcon = createIcon('/icons/delivery-marker.png');
const restaurantIcon = createIcon('/icons/restaurant-marker.png');
const customerIcon = createIcon('/icons/customer-marker.png');

// Xaritani markazlashtirish uchun komponent
function SetViewOnChange({ coordinates }) {
  const map = useMap();
  
  useEffect(() => {
    if (coordinates) {
      map.setView(coordinates, map.getZoom());
    }
  }, [coordinates]);
  
  return null;
}

// Yo'nalish chizish uchun komponent
function RoutingMachine({ delivery, currentLocation }) {
  const map = useMap();
  const routingControl = useRef(null);

  useEffect(() => {
    if (!map || !delivery || !currentLocation) return;

    if (routingControl.current) {
      map.removeControl(routingControl.current);
    }

    const waypoints = [
      L.latLng(currentLocation.latitude, currentLocation.longitude)
    ];

    // Status ga qarab yo'nalishni o'zgartirish
    if (delivery.status === 'assigned' || delivery.status === 'picked_up') {
      waypoints.push(L.latLng(
        delivery.order.restaurant_latitude,
        delivery.order.restaurant_longitude
      ));
    }
    
    if (delivery.status === 'on_way') {
      waypoints.push(L.latLng(
        delivery.order.delivery_latitude,
        delivery.order.delivery_longitude
      ));
    }

    routingControl.current = L.Routing.control({
      waypoints,
      routeWhileDragging: false,
      showAlternatives: false,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{ color: '#6366f1', weight: 4 }]
      },
      createMarker: () => null
    }).addTo(map);

    return () => {
      if (routingControl.current) {
        map.removeControl(routingControl.current);
      }
    };
  }, [map, delivery, currentLocation]);

  return null;
}

const OrderMap = ({ delivery, currentLocation }) => {
  const mapRef = useRef();

  const getBounds = () => {
    if (!delivery || !currentLocation) return null;

    const points = [
      [currentLocation.latitude, currentLocation.longitude],
      [delivery.order.restaurant_latitude, delivery.order.restaurant_longitude],
      [delivery.order.delivery_latitude, delivery.order.delivery_longitude]
    ];

    return L.latLngBounds(points);
  };

  useEffect(() => {
    const bounds = getBounds();
    if (bounds && mapRef.current) {
      mapRef.current.fitBounds(bounds);
    }
  }, [delivery, currentLocation]);

  if (!delivery || !currentLocation) return null;

  return (
    <div className="relative h-[400px] rounded-lg overflow-hidden">
      <MapContainer
        ref={mapRef}
        center={[currentLocation.latitude, currentLocation.longitude]}
        zoom={13}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* Yetkazib beruvchi markeri */}
        <Marker
          position={[currentLocation.latitude, currentLocation.longitude]}
          icon={deliveryIcon}
        >
          <Popup>
            <div className="text-center">
              <h3 className="font-medium">Sizning joylashuvingiz</h3>
              <p className="text-sm text-gray-600">
                {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Restoran markeri */}
        <Marker
          position={[
            delivery.order.restaurant_latitude,
            delivery.order.restaurant_longitude
          ]}
          icon={restaurantIcon}
        >
          <Popup>
            <div>
              <h3 className="font-medium">{delivery.order.restaurant_name}</h3>
              <p className="text-sm text-gray-600">{delivery.order.restaurant_address}</p>
              <p className="text-sm text-gray-600 mt-1">
                Tel: {delivery.order.restaurant_phone}
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Mijoz markeri */}
        <Marker
          position={[
            delivery.order.delivery_latitude,
            delivery.order.delivery_longitude
          ]}
          icon={customerIcon}
        >
          <Popup>
            <div>
              <h3 className="font-medium">{delivery.order.customer_name}</h3>
              <p className="text-sm text-gray-600">{delivery.order.delivery_address}</p>
              <p className="text-sm text-gray-600 mt-1">
                Tel: {delivery.order.customer_phone}
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Yo'nalish chizish */}
        <RoutingMachine delivery={delivery} currentLocation={currentLocation} />
        
        <SetViewOnChange 
          coordinates={[currentLocation.latitude, currentLocation.longitude]} 
        />
      </MapContainer>

      {/* Status indikatori */}
      <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="material-icons text-primary-600">
              {delivery.status === 'assigned' ? 'assignment' :
               delivery.status === 'picked_up' ? 'store' :
               delivery.status === 'on_way' ? 'delivery_dining' :
               'check_circle'}
            </span>
            <span className="font-medium">
              {delivery.status_display}
            </span>
          </div>
          {delivery.duration && (
            <div className="text-sm text-gray-600">
              Davomiyligi: {delivery.duration} daqiqa
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderMap;