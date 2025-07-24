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
    name: "Taxi",
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
  },
  { id: "5", type: "Bus", name: "Giza Bus #101", location: "Giza Square", distance: "1.2 km", rating: 4.0, price: "7 EGP", availability: "available", estimatedTime: "10 min", coordinates: [31.2001, 30.0131] },
  { id: "6", type: "Metro", name: "Alexandria Metro Line 2", location: "Smouha Station", distance: "2.5 km", rating: 4.3, price: "6 EGP", availability: "limited", estimatedTime: "15 min", coordinates: [29.9092, 31.2156] },
  { id: "7", type: "Taxi", name: "Taxi", location: "Central Cairo", distance: "0.8 km", rating: 4.1, price: "30-45 EGP", availability: "available", estimatedTime: "5 min", coordinates: [31.2357, 30.0444] },
  { id: "8", type: "Microbus", name: "Route 5", location: "Downtown", distance: "1.0 km", rating: 3.9, price: "9 EGP", availability: "available", estimatedTime: "12 min", coordinates: [31.2400, 30.0500] },
  { id: "9", type: "Bus", name: "Cairo Bus #200", location: "Nasr City", distance: "3.0 km", rating: 4.2, price: "8 EGP", availability: "available", estimatedTime: "20 min", coordinates: [31.3300, 30.0500] },
  { id: "10", type: "Metro", name: "Metro Line 3", location: "Heliopolis Station", distance: "4.0 km", rating: 4.4, price: "7 EGP", availability: "available", estimatedTime: "25 min", coordinates: [31.3500, 30.0800] },
  { id: "11", type: "Taxi", name: "Taxi", location: "Maadi", distance: "5.0 km", rating: 4.0, price: "40-60 EGP", availability: "limited", estimatedTime: "30 min", coordinates: [31.2500, 29.9700] },
  { id: "12", type: "Microbus", name: "Route 10", location: "Dokki", distance: "2.0 km", rating: 3.7, price: "8 EGP", availability: "available", estimatedTime: "15 min", coordinates: [31.2100, 30.0400] },
  { id: "13", type: "Bus", name: "Alexandria Bus #50", location: "Stanley", distance: "1.5 km", rating: 4.1, price: "7 EGP", availability: "available", estimatedTime: "10 min", coordinates: [29.9000, 31.2100] },
  { id: "14", type: "Metro", name: "Metro Line 1", location: "Sadat Station", distance: "0.5 km", rating: 4.5, price: "5 EGP", availability: "available", estimatedTime: "3 min", coordinates: [31.2335, 30.0442] },
  { id: "15", type: "Taxi", name: "Taxi", location: "Zamalek", distance: "1.0 km", rating: 4.2, price: "35-50 EGP", availability: "available", estimatedTime: "8 min", coordinates: [31.2200, 30.0600] },
  { id: "16", type: "Microbus", name: "Route 15", location: "Heliopolis", distance: "3.5 km", rating: 3.8, price: "9 EGP", availability: "available", estimatedTime: "20 min", coordinates: [31.3500, 30.0800] },
  { id: "17", type: "Bus", name: "Giza Bus #102", location: "Giza Square", distance: "1.2 km", rating: 4.0, price: "7 EGP", availability: "available", estimatedTime: "10 min", coordinates: [31.2001, 30.0131] },
  { id: "18", type: "Metro", name: "Alexandria Metro Line 3", location: "Smouha Station", distance: "2.5 km", rating: 4.3, price: "6 EGP", availability: "limited", estimatedTime: "15 min", coordinates: [29.9092, 31.2156] },
  { id: "19", type: "Taxi", name: "Taxi", location: "Central Cairo", distance: "0.8 km", rating: 4.1, price: "30-45 EGP", availability: "available", estimatedTime: "5 min", coordinates: [31.2357, 30.0444] },
  { id: "20", type: "Microbus", name: "Route 20", location: "Downtown", distance: "1.0 km", rating: 3.9, price: "9 EGP", availability: "available", estimatedTime: "12 min", coordinates: [31.2400, 30.0500] },
  { id: "21", type: "Bus", name: "Cairo Bus #201", location: "Nasr City", distance: "3.0 km", rating: 4.2, price: "8 EGP", availability: "available", estimatedTime: "20 min", coordinates: [31.3300, 30.0500] },
  { id: "22", type: "Metro", name: "Metro Line 4", location: "Heliopolis Station", distance: "4.0 km", rating: 4.4, price: "7 EGP", availability: "available", estimatedTime: "25 min", coordinates: [31.3500, 30.0800] },
  { id: "23", type: "Taxi", name: "Taxi", location: "Maadi", distance: "5.0 km", rating: 4.0, price: "40-60 EGP", availability: "limited", estimatedTime: "30 min", coordinates: [31.2500, 29.9700] },
  { id: "24", type: "Microbus", name: "Route 25", location: "Dokki", distance: "2.0 km", rating: 3.7, price: "8 EGP", availability: "available", estimatedTime: "15 min", coordinates: [31.2100, 30.0400] },
  { id: "25", type: "Bus", name: "Alexandria Bus #51", location: "Stanley", distance: "1.5 km", rating: 4.1, price: "7 EGP", availability: "available", estimatedTime: "10 min", coordinates: [29.9000, 31.2100] },
  { id: "26", type: "Metro", name: "Metro Line 2", location: "Sadat Station", distance: "0.5 km", rating: 4.5, price: "5 EGP", availability: "available", estimatedTime: "3 min", coordinates: [31.2335, 30.0442] },
  { id: "27", type: "Taxi", name: "Taxi", location: "Zamalek", distance: "1.0 km", rating: 4.2, price: "35-50 EGP", availability: "available", estimatedTime: "8 min", coordinates: [31.2200, 30.0600] },
  { id: "28", type: "Microbus", name: "Route 30", location: "Heliopolis", distance: "3.5 km", rating: 3.8, price: "9 EGP", availability: "available", estimatedTime: "20 min", coordinates: [31.3500, 30.0800] },
  { id: "29", type: "Bus", name: "Upper Egypt Bus", location: "Aswan", distance: "15.0 km", rating: 4.1, price: "12 EGP", availability: "available", estimatedTime: "45 min", coordinates: [32.8998, 24.0889] },
  { id: "30", type: "Bus", name: "Luxor Transit", location: "Luxor Temple", distance: "12.0 km", rating: 4.3, price: "10 EGP", availability: "available", estimatedTime: "35 min", coordinates: [32.6396, 25.6872] },
  { id: "31", type: "Taxi", name: "Taxi", location: "Port Said", distance: "8.0 km", rating: 4.0, price: "25-40 EGP", availability: "available", estimatedTime: "20 min", coordinates: [32.3018, 31.2653] },
  { id: "32", type: "Bus", name: "Sharm Bus Line", location: "Sharm El Sheikh", distance: "20.0 km", rating: 4.2, price: "15 EGP", availability: "limited", estimatedTime: "60 min", coordinates: [34.3302, 27.9158] },
  { id: "33", type: "Metro", name: "Suez Metro", location: "Suez Central", distance: "6.0 km", rating: 4.4, price: "8 EGP", availability: "available", estimatedTime: "18 min", coordinates: [32.5498, 29.9668] },
  { id: "34", type: "Microbus", name: "Delta Route", location: "Mansoura", distance: "4.5 km", rating: 3.9, price: "7 EGP", availability: "available", estimatedTime: "15 min", coordinates: [31.0409, 31.3785] },
  { id: "35", type: "Bus", name: "Red Sea Express", location: "Hurghada", distance: "18.0 km", rating: 4.1, price: "18 EGP", availability: "available", estimatedTime: "50 min", coordinates: [33.8116, 27.2574] },
  { id: "36", type: "Taxi", name: "Taxi", location: "Tanta", distance: "3.2 km", rating: 4.0, price: "20-35 EGP", availability: "available", estimatedTime: "12 min", coordinates: [31.0004, 30.7865] },
  { id: "37", type: "Bus", name: "Sinai Transport", location: "Dahab", distance: "25.0 km", rating: 3.8, price: "20 EGP", availability: "limited", estimatedTime: "75 min", coordinates: [34.5197, 28.5069] },
  { id: "38", type: "Microbus", name: "Canal Route", location: "Ismailia", distance: "5.5 km", rating: 4.0, price: "9 EGP", availability: "available", estimatedTime: "18 min", coordinates: [32.2735, 30.5965] }
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