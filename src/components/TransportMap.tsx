import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

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
        return '#22c55e';
      case 'limited':
        return '#eab308';
      case 'unavailable':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    // For demo purposes, show fallback map since no Mapbox token is configured
    if (mapContainer.current) {
      mapContainer.current.innerHTML = `
        <div style="
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #e0f2fe 0%, #e8f5e8 100%);
          position: relative;
          overflow: hidden;
        ">
          <div style="
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
              radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
              linear-gradient(45deg, transparent 30%, rgba(59, 130, 246, 0.05) 70%);
          "></div>
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: #374151;
            font-family: system-ui;
            z-index: 1;
          ">
            <div style="
              background: rgba(255, 255, 255, 0.9);
              padding: 20px;
              border-radius: 12px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              backdrop-filter: blur(10px);
            ">
              <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">🗺️ Egypt Transport Map</h3>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Interactive map showing transport locations</p>
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #9ca3af;">Click transport cards below to view details</p>
            </div>
          </div>
        </div>
      `;

      // Add transport markers as overlays
      transportOptions.forEach((transport, index) => {
        const marker = document.createElement('div');
        marker.style.cssText = `
          position: absolute;
          width: 32px;
          height: 32px;
          background-color: ${getAvailabilityColor(transport.availability)};
          border: 2px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transition: all 0.2s;
          z-index: 10;
          left: ${20 + (index % 5) * 15}%;
          top: ${30 + Math.floor(index / 5) * 20}%;
          ${selectedTransport === transport.id ? 'transform: scale(1.2); box-shadow: 0 0 0 3px #3b82f6;' : ''}
        `;
        
        marker.innerHTML = getTypeEmoji(transport.type);
        marker.title = `${transport.name} - ${transport.location}`;
        
        marker.addEventListener('click', () => {
          onTransportSelect(transport.id);
        });
        
        marker.addEventListener('mouseenter', () => {
          marker.style.transform = selectedTransport === transport.id ? 'scale(1.3)' : 'scale(1.1)';
        });
        
        marker.addEventListener('mouseleave', () => {
          marker.style.transform = selectedTransport === transport.id ? 'scale(1.2)' : 'scale(1)';
        });

        mapContainer.current?.appendChild(marker);
      });
    }

    return () => {
      if (mapContainer.current) {
        mapContainer.current.innerHTML = '';
      }
    };
  }, [transportOptions, selectedTransport, onTransportSelect]);

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-elegant">
      <div ref={mapContainer} className="w-full h-full" />
      
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