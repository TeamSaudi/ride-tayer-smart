import React, { useEffect, useState } from 'react';

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

// Dynamically import leaflet components to avoid SSR issues
const DynamicMap = React.lazy(() => import('./LeafletMap'));

const TransportMap: React.FC<TransportMapProps> = (props) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-elegant bg-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <React.Suspense 
      fallback={
        <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-elegant bg-muted flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </div>
      }
    >
      <DynamicMap {...props} />
    </React.Suspense>
  );
};

export default TransportMap;