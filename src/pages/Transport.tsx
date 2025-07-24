import { useState } from "react";
import { Search, MapPin, Clock, Star, Navigation, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import TransportMap from "@/components/TransportMap";

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

const mockTransportOptions: TransportOption[] = [
  {
    id: "1",
    type: "Bus",
    name: "Cairo Transport Bus #142",
    location: "Tahrir Square",
    distance: "0.3 km",
    rating: 4.2,
    price: "8 EGP",
    availability: "available",
    estimatedTime: "5 min",
    coordinates: [31.2357, 30.0444] // Tahrir Square
  },
  {
    id: "2",
    type: "Metro",
    name: "Cairo Metro Line 1",
    location: "Sadat Station",
    distance: "0.5 km",
    rating: 4.5,
    price: "5 EGP",
    availability: "available",
    estimatedTime: "3 min",
    coordinates: [31.2335, 30.0442] // Sadat Metro Station
  },
  {
    id: "3",
    type: "Taxi",
    name: "Uber/Careem",
    location: "Current Location",
    distance: "0.1 km",
    rating: 4.3,
    price: "35-50 EGP",
    availability: "limited",
    estimatedTime: "2 min",
    coordinates: [31.2370, 30.0450] // Near current location
  },
  {
    id: "4",
    type: "Microbus",
    name: "Downtown Route",
    location: "Abdul Moneim Riad",
    distance: "0.7 km",
    rating: 3.8,
    price: "10 EGP",
    availability: "available",
    estimatedTime: "8 min",
    coordinates: [31.2340, 30.0460] // Abdul Moneim Riad
  }
];

const Transport = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedTransport, setSelectedTransport] = useState<string | null>(null);
  const [transportOptions] = useState(mockTransportOptions);

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available": return "bg-success text-success-foreground";
      case "limited": return "bg-warning text-warning-foreground";
      case "unavailable": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      "Bus": "🚌",
      "Metro": "🚇",
      "Taxi": "🚕",
      "Microbus": "🚐"
    };
    return icons[type] || "🚗";
  };

  const filteredOptions = transportOptions.filter(option => 
    selectedType === "all" || option.type.toLowerCase() === selectedType.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Find Your Perfect <span className="bg-gradient-primary bg-clip-text text-transparent">Transport</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover nearby transportation options with real-time availability and community ratings
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 shadow-elegant">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Enter your destination..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="pl-12 h-12"
                />
              </div>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-48 h-12">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Transport Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="bus">Bus</SelectItem>
                  <SelectItem value="metro">Metro</SelectItem>
                  <SelectItem value="taxi">Taxi</SelectItem>
                  <SelectItem value="microbus">Microbus</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="hero" size="lg" className="h-12">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Location */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Navigation className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Current Location</p>
                <p className="text-sm text-muted-foreground">Downtown Cairo, Tahrir Square Area</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                Update Location
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transport Map */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Transport Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TransportMap
              transportOptions={filteredOptions}
              selectedTransport={selectedTransport}
              onTransportSelect={setSelectedTransport}
            />
          </CardContent>
        </Card>

        {/* Transportation Options */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredOptions.map((option) => (
            <Card 
              key={option.id} 
              className={`hover:shadow-elegant transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                selectedTransport === option.id ? 'ring-2 ring-primary shadow-glow' : ''
              }`}
              onClick={() => setSelectedTransport(option.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getTypeIcon(option.type)}</span>
                    <div>
                      <CardTitle className="text-lg">{option.name}</CardTitle>
                      <CardDescription className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{option.location}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getAvailabilityColor(option.availability)}>
                    {option.availability}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Navigation className="h-4 w-4 text-muted-foreground" />
                    <span>{option.distance}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{option.estimatedTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-warning fill-current" />
                    <span>{option.rating}</span>
                  </div>
                  <div className="font-medium text-primary">
                    {option.price}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="flex-1"
                    disabled={option.availability === "unavailable"}
                  >
                    Select Route
                  </Button>
                  <Button variant="outline" size="sm">
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="text-center py-16">
          <Card className="inline-block bg-gradient-hero text-white shadow-glow">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-2">Not finding what you need?</h3>
              <p className="mb-4 opacity-90">Help us improve by reporting missing transportation options in your area</p>
              <Button variant="secondary" size="lg">
                Report Missing Transport
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Transport;