import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import egyptMap from "@/assets/egypt-map.png";

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

const TransportMap: React.FC<TransportMapProps> = ({
  transportOptions,
  selectedTransport,
  onTransportSelect
}) => {
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
      case 'available':
        return 'bg-green-500';
      case 'limited':
        return 'bg-yellow-500';
      case 'unavailable':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Convert coordinates to map position (rough approximation for Egypt map)
  const coordinateToPosition = (coordinates: [number, number]) => {
    const [lng, lat] = coordinates;
    // Rough conversion for Egypt map bounds
    // Egypt roughly: lng 25-35, lat 22-32
    const x = ((lng - 25) / 10) * 100; // Convert to percentage
    const y = ((32 - lat) / 10) * 100; // Inverted Y for map
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-elegant">
      <img 
        src={egyptMap} 
        alt="Egypt Map" 
        className="w-full h-full object-cover"
      />
      
      {/* Transport pins */}
      {transportOptions.map((transport) => {
        const position = coordinateToPosition(transport.coordinates);
        return (
          <div
            key={transport.id}
            className={`absolute w-10 h-10 rounded-full cursor-pointer flex items-center justify-center text-white text-lg border-2 border-white shadow-lg transition-all duration-200 hover:scale-110 ${
              getAvailabilityColor(transport.availability)
            } ${selectedTransport === transport.id ? 'ring-4 ring-blue-500 scale-110' : ''}`}
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => onTransportSelect(transport.id)}
            title={`${transport.name} - ${transport.location}`}
          >
            {getTypeEmoji(transport.type)}
          </div>
        );
      })}

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg dark:bg-gray-900/90">
        <h3 className="font-semibold text-sm mb-2 text-gray-900 dark:text-white">Transport Locations</h3>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-700 dark:text-gray-300">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-gray-700 dark:text-gray-300">Limited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-700 dark:text-gray-300">Unavailable</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportMap;