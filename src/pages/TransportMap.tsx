import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

interface TransportOption {
  id: string;
  name: string;
  coordinates: [number, number]; // [lng, lat]
  type: string;
}

interface TransportMapProps {
  transportOptions: TransportOption[];
  selectedTransport: string | null;
  onTransportSelect: (id: string) => void;
}

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const TransportMap = ({ transportOptions, selectedTransport, onTransportSelect }: TransportMapProps) => {
  return (
    <MapContainer
      center={[26.8206, 30.8025]} // Center of Egypt
      zoom={6}
      style={{ height: "400px", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {transportOptions.map((option) => (
        <Marker
          key={option.id}
          position={[option.coordinates[1], option.coordinates[0]]} // [lat, lng]
          icon={customIcon}
          eventHandlers={{
            click: () => onTransportSelect(option.id),
          }}
        >
          <Popup>
            <strong>{option.name}</strong> <br />
            Type: {option.type}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default TransportMap;
