import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface TransportOption {
  id: string;
  type: string;
  name: string;
  location: string;
  distance: string;
  rating: number;
  price: string;
  availability: "available" | "limited" | "unavailable";
  estimatedTime: string;
  coordinates: [number, number]; // [lng, lat]
}

interface TransportMapProps {
  transportOptions: TransportOption[];
  selectedTransport: string | null;
  onTransportSelect: (transportId: string) => void;
}

// Fix leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom icons for different transport types and availability
const createCustomIcon = (type: string, availability: string, isSelected: boolean) => {
  const getTypeEmoji = (type: string) => {
    const icons: { [key: string]: string } = {
      "Bus": "🚌",
      "Metro": "🚇",
      "Taxi": "🚕",
      "Microbus": "🚐"
    };
    return icons[type] || "🚗";
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return '#22c55e';
      case 'limited': return '#eab308';
      case 'unavailable': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const iconHtml = `
    <div style="
      width: 32px;
      height: 32px;
      background-color: ${getAvailabilityColor(availability)};
      border: ${isSelected ? '3px solid #3b82f6' : '2px solid white'};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
      transition: all 0.2s;
    ">
      ${getTypeEmoji(type)}
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-div-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

const TransportMap: React.FC<TransportMapProps> = ({
  transportOptions,
  selectedTransport,
  onTransportSelect
}) => {
  // Egypt center coordinates (Cairo)
  const egyptCenter: [number, number] = [30.0444, 31.2357]; // [lat, lng]
  
  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-elegant">
      <MapContainer
        center={egyptCenter}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {transportOptions.map((option) => (
          <Marker
            key={option.id}
            position={[option.coordinates[1], option.coordinates[0]]} // [lat, lng]
            icon={createCustomIcon(option.type, option.availability, selectedTransport === option.id)}
            eventHandlers={{
              click: () => onTransportSelect(option.id),
            }}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-bold text-lg mb-1">{option.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{option.location}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><strong>Distance:</strong> {option.distance}</div>
                  <div><strong>Time:</strong> {option.estimatedTime}</div>
                  <div><strong>Price:</strong> {option.price}</div>
                  <div><strong>Rating:</strong> ⭐ {option.rating}</div>
                </div>
                <div className={`mt-2 px-2 py-1 rounded text-white text-xs ${
                  option.availability === 'available' ? 'bg-green-500' :
                  option.availability === 'limited' ? 'bg-yellow-500' : 'bg-red-500'
                }`}>
                  {option.availability.toUpperCase()}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <h3 className="font-semibold text-sm mb-2 text-foreground">Transport Status</h3>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-muted-foreground">Limited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-muted-foreground">Unavailable</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportMap;