import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import egyptMap from "@/assets/egypt-map.svg";

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
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
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

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const newZoom = Math.max(0.5, Math.min(3, zoom + (e.deltaY > 0 ? -0.1 : 0.1)));
    setZoom(newZoom);
  };

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-elegant bg-muted">
      <div
        className="relative w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
          transformOrigin: 'center center'
        }}
      >
        <img 
          src={egyptMap} 
          alt="Egypt Map" 
          className="w-full h-full object-contain pointer-events-none"
          draggable={false}
        />
        
        {/* Transport pins */}
        {transportOptions.map((transport) => {
          const position = coordinateToPosition(transport.coordinates);
          return (
            <div
              key={transport.id}
              className={`absolute w-8 h-8 rounded-full cursor-pointer flex items-center justify-center text-white text-sm border-2 border-white shadow-lg transition-all duration-200 hover:scale-125 ${
                getAvailabilityColor(transport.availability)
              } ${selectedTransport === transport.id ? 'ring-4 ring-primary scale-125' : ''}`}
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={(e) => {
                e.stopPropagation();
                onTransportSelect(transport.id);
              }}
              title={`${transport.name} - ${transport.location}`}
            >
              {getTypeEmoji(transport.type)}
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => setZoom(Math.min(3, zoom + 0.2))}
          className="w-8 h-8 bg-background/90 backdrop-blur-sm rounded border shadow-lg flex items-center justify-center hover:bg-background text-foreground"
        >
          +
        </button>
        <button
          onClick={() => setZoom(Math.max(0.5, zoom - 0.2))}
          className="w-8 h-8 bg-background/90 backdrop-blur-sm rounded border shadow-lg flex items-center justify-center hover:bg-background text-foreground"
        >
          −
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          className="w-8 h-8 bg-background/90 backdrop-blur-sm rounded border shadow-lg flex items-center justify-center hover:bg-background text-foreground text-xs"
        >
          ⌂
        </button>
      </div>

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <h3 className="font-semibold text-sm mb-2 text-foreground">Transport Locations</h3>
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