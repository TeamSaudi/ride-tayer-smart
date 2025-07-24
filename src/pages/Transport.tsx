import { useState } from "react";
import { Search, MapPin, Clock, Star, Navigation, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import TransportMap from "@/components/TransportMap";
import ReportMissingTransportDialog from "@/components/ReportMissingTransportDialog";

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
  // Cairo Metro Stations
  {
    id: "1",
    type: "Metro",
    name: "Sadat Metro Station",
    location: "Tahrir Square, Cairo",
    distance: "0.2 km",
    rating: 4.5,
    price: "5 EGP",
    availability: "available",
    estimatedTime: "2 min",
    coordinates: [31.2335, 30.0442] // Real Sadat Metro coordinates
  },
  {
    id: "2", 
    type: "Metro",
    name: "Nasser Metro Station",
    location: "Ramses Square, Cairo",
    distance: "1.8 km",
    rating: 4.3,
    price: "5 EGP", 
    availability: "available",
    estimatedTime: "8 min",
    coordinates: [31.2461, 30.0618] // Real Nasser Metro coordinates
  },
  {
    id: "3",
    type: "Metro", 
    name: "Opera Metro Station",
    location: "Opera House, Cairo",
    distance: "1.2 km",
    rating: 4.4,
    price: "5 EGP",
    availability: "limited",
    estimatedTime: "6 min", 
    coordinates: [31.2249, 30.0420] // Real Opera Metro coordinates
  },
  
  // Cairo Bus Stations
  {
    id: "4",
    type: "Bus",
    name: "Ramses Bus Terminal",
    location: "Ramses Square, Cairo", 
    distance: "1.9 km",
    rating: 4.1,
    price: "8-15 EGP",
    availability: "available",
    estimatedTime: "10 min",
    coordinates: [31.2461, 30.0618] // Real Ramses coordinates
  },
  {
    id: "5",
    type: "Bus",
    name: "Giza Bus Station", 
    location: "Giza Pyramids Area",
    distance: "15 km",
    rating: 4.0,
    price: "10-20 EGP",
    availability: "available", 
    estimatedTime: "35 min",
    coordinates: [31.1342, 29.9765] // Real Giza coordinates near Pyramids
  },
  {
    id: "6",
    type: "Bus",
    name: "Abbasiya Bus Terminal",
    location: "Abbasiya, Cairo",
    distance: "5.2 km", 
    rating: 3.9,
    price: "8-12 EGP",
    availability: "available",
    estimatedTime: "18 min",
    coordinates: [31.2835, 30.0711] // Real Abbasiya coordinates
  },

  // Microbuses
  {
    id: "7",
    type: "Microbus",
    name: "Downtown Microbus Hub",
    location: "Abdul Moneim Riad",
    distance: "0.8 km",
    rating: 3.8,
    price: "3-8 EGP", 
    availability: "available",
    estimatedTime: "5 min",
    coordinates: [31.2340, 30.0460] // Real Abdul Moneim Riad coordinates
  },
  {
    id: "8", 
    type: "Microbus",
    name: "Dokki Microbus Station",
    location: "Dokki Square",
    distance: "4.1 km",
    rating: 3.7, 
    price: "5-10 EGP",
    availability: "limited",
    estimatedTime: "15 min",
    coordinates: [31.2090, 30.0380] // Real Dokki coordinates
  },

  // Taxis
  {
    id: "9",
    type: "Taxi", 
    name: "Tahrir Taxi Stand",
    location: "Tahrir Square",
    distance: "0.1 km",
    rating: 4.2,
    price: "20-40 EGP",
    availability: "available",
    estimatedTime: "1 min",
    coordinates: [31.2357, 30.0444] // Real Tahrir Square coordinates
  },
  {
    id: "10",
    type: "Taxi",
    name: "Zamalek Taxi Hub", 
    location: "Zamalek District",
    distance: "2.3 km",
    rating: 4.3,
    price: "25-45 EGP",
    availability: "available", 
    estimatedTime: "8 min",
    coordinates: [31.2200, 30.0600] // Real Zamalek coordinates
  },

  // Alexandria Transport
  {
    id: "11",
    type: "Metro",
    name: "Alexandria Metro - Raml Station",
    location: "Raml Station, Alexandria",
    distance: "220 km",
    rating: 4.2,
    price: "15 EGP",
    availability: "available",
    estimatedTime: "3 hours",
    coordinates: [29.9092, 31.2000] // Real Alexandria Raml Station
  },
  {
    id: "12", 
    type: "Bus",
    name: "Alexandria Bus Terminal",
    location: "Moharam Bek, Alexandria",
    distance: "218 km",
    rating: 4.0,
    price: "25-50 EGP", 
    availability: "available",
    estimatedTime: "3.5 hours",
    coordinates: [29.9097, 31.1975] // Real Alexandria Bus Terminal
  },

  // Luxor Transport  
  {
    id: "13",
    type: "Bus",
    name: "Luxor Bus Station",
    location: "Luxor City Center", 
    distance: "670 km",
    rating: 4.1,
    price: "80-150 EGP",
    availability: "limited",
    estimatedTime: "8 hours",
    coordinates: [32.6396, 25.6872] // Real Luxor coordinates
  },

  // Aswan Transport
  {
    id: "14",
    type: "Bus", 
    name: "Aswan Bus Terminal",
    location: "Aswan Railway Station Area",
    distance: "880 km",
    rating: 4.0,
    price: "100-200 EGP",
    availability: "available",
    estimatedTime: "12 hours", 
    coordinates: [32.8998, 24.0889] // Real Aswan coordinates
  },

  // Red Sea Coast
  {
    id: "15",
    type: "Bus",
    name: "Hurghada Bus Station",
    location: "Hurghada City Center",
    distance: "450 km", 
    rating: 3.9,
    price: "60-120 EGP",
    availability: "available",
    estimatedTime: "5 hours",
    coordinates: [33.8116, 27.2574] // Real Hurghada coordinates
  },
  {
    id: "16",
    type: "Bus",
    name: "Sharm El Sheikh Transport Hub",
    location: "Sharm El Sheikh",
    distance: "500 km",
    rating: 4.0, 
    price: "70-140 EGP",
    availability: "limited",
    estimatedTime: "6 hours",
    coordinates: [34.3302, 27.9158] // Real Sharm El Sheikh coordinates
  }
];

const Transport = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedTransport, setSelectedTransport] = useState<string | null>(null);
  const [transportOptions] = useState(mockTransportOptions);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const { toast } = useToast();

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

  const handleSelectRoute = (transportName: string) => {
    toast({
      title: "Route Selected",
      description: `Route has been selected for ${transportName}`,
    });
  };

  const handleReportSubmit = (data: { transportType: string; location: string; description: string }) => {
    console.log('Report submitted:', data);
    toast({
      title: "Report Submitted",
      description: "Thank you for your feedback! We'll review your report shortly.",
    });
    setShowReportDialog(false);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
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
                    onClick={() => handleSelectRoute(option.name)}
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
              <Button variant="secondary" size="lg" onClick={() => setShowReportDialog(true)}>
                Report Missing Transport
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <ReportMissingTransportDialog
        isOpen={showReportDialog}
        onClose={() => setShowReportDialog(false)}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
};

export default Transport;