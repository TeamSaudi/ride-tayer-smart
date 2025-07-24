import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [31.2357, 30.0444], // Cairo coordinates
        zoom: 13,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      // Add transport markers
      addTransportMarkers();
      
      setShowTokenInput(false);
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  const addTransportMarkers = () => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    transportOptions.forEach((transport) => {
      const el = document.createElement('div');
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.fontSize = '20px';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
      
      // Color based on availability
      switch (transport.availability) {
        case 'available':
          el.style.backgroundColor = '#10b981'; // green
          break;
        case 'limited':
          el.style.backgroundColor = '#f59e0b'; // yellow
          break;
        case 'unavailable':
          el.style.backgroundColor = '#ef4444'; // red
          break;
      }

      // Transport type emoji
      const getTypeEmoji = (type: string) => {
        const icons: { [key: string]: string } = {
          "Bus": "🚌",
          "Metro": "🚇",
          "Taxi": "🚕",
          "Microbus": "🚐"
        };
        return icons[type] || "🚗";
      };

      el.innerHTML = getTypeEmoji(transport.type);

      // Add selection highlight
      if (selectedTransport === transport.id) {
        el.style.border = '4px solid #3b82f6';
        el.style.transform = 'scale(1.1)';
      }

      const marker = new mapboxgl.Marker(el)
        .setLngLat(transport.coordinates)
        .addTo(map.current!);

      // Add click handler
      el.addEventListener('click', () => {
        onTransportSelect(transport.id);
      });

      // Add popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-bold text-sm">${transport.name}</h3>
            <p class="text-xs text-gray-600">${transport.location}</p>
            <p class="text-xs"><strong>Price:</strong> ${transport.price}</p>
            <p class="text-xs"><strong>Time:</strong> ${transport.estimatedTime}</p>
            <p class="text-xs"><strong>Rating:</strong> ⭐ ${transport.rating}</p>
          </div>
        `);

      marker.setPopup(popup);
      markersRef.current.push(marker);
    });
  };

  useEffect(() => {
    if (map.current && mapboxToken) {
      addTransportMarkers();
    }
  }, [transportOptions, selectedTransport]);

  useEffect(() => {
    return () => {
      markersRef.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, []);

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      initializeMap();
    }
  };

  if (showTokenInput) {
    return (
      <Card className="w-full h-96 flex items-center justify-center">
        <CardContent className="text-center space-y-4">
          <h3 className="text-lg font-semibold">Enter Mapbox Token</h3>
          <p className="text-sm text-muted-foreground">
            Please enter your Mapbox public token to view the transport map.
            Get yours at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>
          </p>
          <div className="flex gap-2 max-w-md">
            <Input
              type="password"
              placeholder="pk.your-mapbox-token..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleTokenSubmit()}
            />
            <Button onClick={handleTokenSubmit}>
              Load Map
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-elegant">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <h3 className="font-semibold text-sm mb-2">Transport Locations</h3>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Limited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Unavailable</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportMap;