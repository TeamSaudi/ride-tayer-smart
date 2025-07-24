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
  TrendingUp,
  Bell,
  AlertTriangle,
  Zap
} from "lucide-react";

const Driver = () => {
  const [user, setUser] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Real data from database
  const [driverData, setDriverData] = useState<any>(null);
  const [rideRequests, setRideRequests] = useState<any[]>([]);
  const [aiAlerts, setAiAlerts] = useState<any[]>([]);
  const [driverStats, setDriverStats] = useState({
    totalRides: 142,
    todayRides: 8,
    earnings: 1250.50,
    rating: 4.8,
    status: 'offline'
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
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
          await loadDriverData(session.user.email);
        } else {
          toast({
            title: "Unauthorized Access",
            description: "You don't have permission to access the driver dashboard.",
            variant: "destructive",
          });
          navigate('/');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        toast({
          title: "Error",
          description: "Failed to check authentication status",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const loadDriverData = async (email: string) => {
    try {
      // Load driver info
      const { data: driver, error: driverError } = await supabase
        .from('drivers')
        .select('*')
        .eq('email', email)
        .single();

      if (driverError) {
        console.error('Driver data error:', driverError);
        return;
      }

      setDriverData(driver);
      setDriverStats(prev => ({
        ...prev,
        status: driver.status || 'offline'
      }));

      // Load ride requests
      const { data: requests, error: requestsError } = await supabase
        .from('ride_requests')
        .select('*')
        .in('status', ['pending', 'accepted'])
        .order('requested_at', { ascending: false });

      if (!requestsError) {
        setRideRequests(requests || []);
      }

      // Load AI alerts
      const { data: alerts, error: alertsError } = await supabase
        .from('ai_alerts')
        .select('*')
        .eq('driver_id', driver.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false });

      if (!alertsError) {
        setAiAlerts(alerts || []);
      }
    } catch (error) {
      console.error('Error loading driver data:', error);
    }
  };

  const handleStatusToggle = async () => {
    if (!driverData) return;
    
    const newStatus = driverStats.status === 'online' ? 'offline' : 'online';
    
    try {
      const { error } = await supabase
        .from('drivers')
        .update({ status: newStatus })
        .eq('id', driverData.id);

      if (error) throw error;

      setDriverStats(prev => ({ ...prev, status: newStatus }));
      toast({
        title: "Status Updated",
        description: `You are now ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleAcceptRide = async (rideId: string) => {
    try {
      const { error } = await supabase
        .from('ride_requests')
        .update({ 
          status: 'accepted',
          driver_id: driverData?.id 
        })
        .eq('id', rideId);

      if (error) throw error;

      // Refresh ride requests
      if (user?.email) {
        await loadDriverData(user.email);
      }

      toast({
        title: "Ride Accepted",
        description: "You have accepted the ride request.",
      });
    } catch (error) {
      console.error('Error accepting ride:', error);
      toast({
        title: "Error",
        description: "Failed to accept ride",
        variant: "destructive",
      });
    }
  };

  const handleCompleteRide = async (rideId: string) => {
    try {
      const { error } = await supabase
        .from('ride_requests')
        .update({ status: 'completed' })
        .eq('id', rideId);

      if (error) throw error;

      // Refresh ride requests
      if (user?.email) {
        await loadDriverData(user.email);
      }

      toast({
        title: "Ride Completed",
        description: "Ride has been marked as completed.",
      });
    } catch (error) {
      console.error('Error completing ride:', error);
      toast({
        title: "Error",
        description: "Failed to complete ride",
        variant: "destructive",
      });
    }
  };

  const markAlertAsRead = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('ai_alerts')
        .update({ is_read: true })
        .eq('id', alertId);

      if (error) throw error;

      setAiAlerts(prev => prev.filter(alert => alert.id !== alertId));
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  if (loading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h2 className="text-lg font-semibold">
            {loading ? "Loading..." : "Checking Authorization..."}
          </h2>
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
            <p className="text-muted-foreground">
              Welcome back, {driverData?.name || 'Driver'}!
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={driverStats.status === 'online' ? 'default' : 'secondary'}>
              {driverStats.status === 'online' ? 'Online' : 'Offline'}
            </Badge>
            <Button onClick={handleStatusToggle} variant="outline">
              {driverStats.status === 'online' ? 'Go Offline' : 'Go Online'}
            </Button>
          </div>
        </div>

        {/* AI Alerts */}
        {aiAlerts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5" />
              AI Alerts ({aiAlerts.length})
            </h2>
            <div className="grid gap-4">
              {aiAlerts.map((alert) => (
                <Card key={alert.id} className={`border-l-4 ${
                  alert.priority === 'high' ? 'border-l-destructive' :
                  alert.priority === 'medium' ? 'border-l-warning' : 'border-l-primary'
                }`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {alert.alert_type === 'high_demand' && <TrendingUp className="h-4 w-4 text-primary" />}
                        {alert.alert_type === 'traffic_alert' && <AlertTriangle className="h-4 w-4 text-warning" />}
                        {alert.alert_type === 'surge_pricing' && <Zap className="h-4 w-4 text-primary" />}
                        <CardTitle className="text-base">{alert.title}</CardTitle>
                        <Badge variant={alert.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                          {alert.priority}
                        </Badge>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => markAlertAsRead(alert.id)}
                      >
                        ✕
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                    {alert.location && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {alert.location.address}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

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
            <TabsTrigger value="active-rides">
              Ride Requests ({rideRequests.length})
            </TabsTrigger>
            <TabsTrigger value="ride-history">Ride History</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>

          <TabsContent value="active-rides" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5" />
                  Ride Requests
                </CardTitle>
                <CardDescription>
                  Accept and manage ride requests from passengers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rideRequests.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No pending ride requests at the moment
                    </div>
                  ) : (
                    rideRequests.map((ride) => (
                      <div key={ride.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{ride.passenger_name}</span>
                            <Badge variant={
                              ride.status === 'accepted' ? 'default' : 
                              ride.priority === 'urgent' ? 'destructive' :
                              ride.priority === 'high' ? 'secondary' : 'outline'
                            }>
                              {ride.status === 'pending' ? ride.priority : ride.status}
                            </Badge>
                            {ride.passenger_phone && (
                              <span className="text-xs text-muted-foreground">
                                {ride.passenger_phone}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {ride.pickup_location.address} → {ride.destination.address}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {ride.estimated_duration} min
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
                          {ride.status === 'accepted' && (
                            <Button size="sm" onClick={() => handleCompleteRide(ride.id)}>
                              Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
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
                <div className="text-center py-8 text-muted-foreground">
                  No completed rides yet. Accept some ride requests to build your history!
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