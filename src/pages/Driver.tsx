import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Car, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Star,
  Navigation,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from "lucide-react";

const Driver = () => {
  const [user, setUser] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock driver data
  const [driverStats] = useState({
    totalRides: 142,
    todayRides: 8,
    earnings: 1250.50,
    rating: 4.8,
    status: 'active'
  });

  const [activeRides] = useState([
    {
      id: 1,
      passenger: "Ahmed Hassan",
      from: "Maadi",
      to: "New Cairo",
      fare: 45.00,
      status: "ongoing",
      estimatedTime: "25 min"
    },
    {
      id: 2,
      passenger: "Sara Mohamed",
      from: "Zamalek",
      to: "6th October",
      fare: 80.00,
      status: "pending",
      estimatedTime: "45 min"
    }
  ]);

  const [recentRides] = useState([
    {
      id: 1,
      passenger: "Omar Ali",
      from: "Downtown",
      to: "Heliopolis",
      fare: 35.00,
      rating: 5,
      date: "2024-01-20",
      time: "14:30"
    },
    {
      id: 2,
      passenger: "Fatma Khaled",
      from: "Nasr City",
      to: "Maadi",
      fare: 50.00,
      rating: 4,
      date: "2024-01-20",
      time: "13:15"
    },
    {
      id: 3,
      passenger: "Mohamed Saeed",
      from: "Giza",
      to: "Downtown",
      fare: 40.00,
      rating: 5,
      date: "2024-01-20",
      time: "12:00"
    }
  ]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Access Denied",
          description: "Please login to access the driver dashboard.",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      setUser(session.user);
      
      // Check if user is authorized driver
      if (session.user.email === 'driver@tayer.com') {
        setIsAuthorized(true);
      } else {
        toast({
          title: "Unauthorized Access",
          description: "You don't have permission to access the driver dashboard.",
          variant: "destructive",
        });
        navigate('/');
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const handleStatusToggle = () => {
    toast({
      title: "Status Updated",
      description: driverStats.status === 'active' ? "You are now offline" : "You are now online",
    });
  };

  const handleAcceptRide = (rideId: number) => {
    toast({
      title: "Ride Accepted",
      description: "You have accepted the ride request.",
    });
  };

  const handleCompleteRide = (rideId: number) => {
    toast({
      title: "Ride Completed",
      description: "Ride has been marked as completed.",
    });
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h2 className="text-lg font-semibold">Checking Authorization...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Driver Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Driver!</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={driverStats.status === 'active' ? 'default' : 'secondary'}>
              {driverStats.status === 'active' ? 'Online' : 'Offline'}
            </Badge>
            <Button onClick={handleStatusToggle} variant="outline">
              {driverStats.status === 'active' ? 'Go Offline' : 'Go Online'}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rides</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{driverStats.totalRides}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Rides</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{driverStats.todayRides}</div>
              <p className="text-xs text-muted-foreground">+2 from yesterday</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">EGP {driverStats.earnings}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{driverStats.rating}</div>
              <p className="text-xs text-muted-foreground">★★★★★</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="active-rides" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active-rides">Active Rides</TabsTrigger>
            <TabsTrigger value="ride-history">Ride History</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>

          <TabsContent value="active-rides" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5" />
                  Active Rides
                </CardTitle>
                <CardDescription>
                  Manage your current and pending ride requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeRides.map((ride) => (
                    <div key={ride.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{ride.passenger}</span>
                          <Badge variant={ride.status === 'ongoing' ? 'default' : 'secondary'}>
                            {ride.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {ride.from} → {ride.to}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {ride.estimatedTime}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            EGP {ride.fare}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {ride.status === 'pending' && (
                          <Button size="sm" onClick={() => handleAcceptRide(ride.id)}>
                            Accept
                          </Button>
                        )}
                        {ride.status === 'ongoing' && (
                          <Button size="sm" onClick={() => handleCompleteRide(ride.id)}>
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ride-history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Rides
                </CardTitle>
                <CardDescription>
                  Your completed rides history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentRides.map((ride) => (
                    <div key={ride.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{ride.passenger}</span>
                          <Badge variant="outline">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {ride.from} → {ride.to}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {ride.date} at {ride.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            EGP {ride.fare}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            {ride.rating}/5
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Earnings Overview
                </CardTitle>
                <CardDescription>
                  Track your earnings and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">EGP 450</div>
                    <div className="text-sm text-muted-foreground">Today</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">EGP 3,150</div>
                    <div className="text-sm text-muted-foreground">This Week</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">EGP 12,500</div>
                    <div className="text-sm text-muted-foreground">This Month</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Driver;