import { useState, useEffect } from "react";
import { Brain, TrendingUp, Clock, Users, MapPin, Phone, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";

interface PredictionData {
  area: string;
  hour: string;
  expectedDemand: number;
  busesNeeded: number;
  currentAvailable: number;
  shortage: number;
}

interface DriverContact {
  name: string;
  phone: string;
  area: string;
}

const mockPredictions: PredictionData[] = [
  {
    area: "Cairo",
    hour: "17:00",
    expectedDemand: 432,
    busesNeeded: 9,
    currentAvailable: 6,
    shortage: 3
  },
  {
    area: "Alexandria",
    hour: "19:00", 
    expectedDemand: 487,
    busesNeeded: 10,
    currentAvailable: 7,
    shortage: 3
  },
  {
    area: "Cairo",
    hour: "08:00",
    expectedDemand: 386,
    busesNeeded: 8,
    currentAvailable: 8,
    shortage: 0
  }
];

const mockDriverContacts: DriverContact[] = [
  { name: "محمد حسين", phone: "01123456789", area: "Cairo" },
  { name: "أحمد شريف", phone: "01098765432", area: "Cairo" },
  { name: "مصطفى السيد", phone: "01234567891", area: "Alexandria" },
  { name: "محمود عبدالله", phone: "01022334455", area: "Alexandria" },
  { name: "سعيد محمود", phone: "01111222333", area: "Giza" },
  { name: "هشام علي", phone: "01033445566", area: "Giza" },
  { name: "علي حسن", phone: "01234567890", area: "Cairo" },
  { name: "محمود عبدالعزيز", phone: "01122334455", area: "Alexandria" },
  { name: "أحمد عبد الله", phone: "01055667788", area: "Cairo" },
  { name: "محمد عبد الرحمن", phone: "01223344556", area: "Giza" },
  { name: "خالد مصطفى", phone: "01199887766", area: "Alexandria" },
  { name: "ياسر أحمد", phone: "01011223344", area: "Cairo" },
  { name: "محمود سامي", phone: "01233445566", area: "Giza" },
  { name: "أحمد سعيد", phone: "01122336655", area: "Alexandria" },
  { name: "عمر حسن", phone: "01044556677", area: "Cairo" },
  { name: "سامي عبد الله", phone: "01222334455", area: "Giza" },
  { name: "محمد علي", phone: "01133445566", area: "Alexandria" },
  { name: "أحمد محمود", phone: "01055667788", area: "Cairo" },
  { name: "خالد سامي", phone: "01223344556", area: "Giza" },
  { name: "ياسر سعيد", phone: "01199887766", area: "Alexandria" },
  { name: "محمود عمر", phone: "01011223344", area: "Cairo" },
  { name: "أحمد سامي", phone: "01233445566", area: "Giza" },
  { name: "عمر سعيد", phone: "01122336655", area: "Alexandria" },
  { name: "سامي محمود", phone: "01044556677", area: "Cairo" },
  { name: "محمد سامي", phone: "01222334455", area: "Giza" },
  { name: "أحمد عمر", phone: "01133445566", area: "Alexandria" },
  { name: "خالد سعيد", phone: "01055667788", area: "Cairo" },
  { name: "ياسر محمود", phone: "01223344556", area: "Giza" }
];

const AIInsights = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeAlerts, setActiveAlerts] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Calculate active alerts (areas with shortage)
    const alerts = mockPredictions.filter(pred => pred.shortage > 0).length;
    setActiveAlerts(alerts);
  }, []);

  const getShortageColor = (shortage: number) => {
    if (shortage === 0) return "text-success";
    if (shortage <= 2) return "text-warning";
    return "text-destructive";
  };

  const getShortageLevel = (shortage: number) => {
    if (shortage === 0) return "Sufficient";
    if (shortage <= 2) return "Low Shortage";
    return "High Shortage";
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      <Navbar />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Brain className="h-12 w-12 text-primary animate-pulse-glow" />
            <h1 className="text-4xl font-bold text-foreground">
              AI <span className="bg-gradient-primary bg-clip-text text-transparent">Insights</span>
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Smart predictions for transportation demand and driver allocation powered by machine learning
          </p>
        </div>

        {/* Real-time Status */}
        <Card className="mb-8 shadow-elegant border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Real-time monitoring and predictions</CardDescription>
                </div>
              </div>
              <Badge variant={activeAlerts > 0 ? "destructive" : "default"}>
                {activeAlerts > 0 ? `${activeAlerts} Active Alerts` : "All Systems Normal"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <p className="text-2xl font-bold text-primary">{currentTime.toLocaleTimeString('en-US', { hour12: false })}</p>
                <p className="text-sm text-muted-foreground">Current Time</p>
              </div>
              <div className="text-center p-4 bg-secondary/5 rounded-lg">
                <p className="text-2xl font-bold text-secondary">{mockPredictions.length}</p>
                <p className="text-sm text-muted-foreground">Areas Monitored</p>
              </div>
              <div className="text-center p-4 bg-success/5 rounded-lg">
                <p className="text-2xl font-bold text-success">{mockDriverContacts.length}</p>
                <p className="text-sm text-muted-foreground">Drivers Available</p>
              </div>
              <div className="text-center p-4 bg-warning/5 rounded-lg">
                <p className="text-2xl font-bold text-warning">85%</p>
                <p className="text-sm text-muted-foreground">Prediction Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demand Predictions */}
        <Card className="mb-8 shadow-elegant">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Demand Predictions</CardTitle>
                <CardDescription>Hourly transportation demand forecasts based on AI analysis</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mockPredictions.map((prediction, index) => (
                <div key={index} className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-semibold text-foreground">{prediction.area}</h3>
                        <p className="text-sm text-muted-foreground">Peak time: {prediction.hour}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={prediction.shortage === 0 ? "default" : "destructive"}
                      className={getShortageColor(prediction.shortage)}
                    >
                      {getShortageLevel(prediction.shortage)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Expected Demand</p>
                      <p className="text-lg font-semibold text-foreground">{prediction.expectedDemand} people</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Buses Needed</p>
                      <p className="text-lg font-semibold text-primary">{prediction.busesNeeded}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Currently Available</p>
                      <p className="text-lg font-semibold text-success">{prediction.currentAvailable}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Shortage</p>
                      <p className={`text-lg font-semibold ${getShortageColor(prediction.shortage)}`}>
                        {prediction.shortage}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Capacity Coverage</span>
                      <span>{Math.round((prediction.currentAvailable / prediction.busesNeeded) * 100)}%</span>
                    </div>
                    <Progress 
                      value={(prediction.currentAvailable / prediction.busesNeeded) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  {prediction.shortage > 0 && (
                    <div className="flex items-center space-x-2 p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      <p className="text-sm text-destructive">
                        <strong>Action Required:</strong> Contact additional drivers for {prediction.area} at {prediction.hour}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Driver Contact System */}
        <Card className="mb-8 shadow-elegant">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Phone className="h-6 w-6 text-secondary" />
              <div>
                <CardTitle>Smart Driver Allocation</CardTitle>
                <CardDescription>AI-powered driver contact system for demand peaks</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {mockDriverContacts.map((driver, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{driver.name}</p>
                      <p className="text-sm text-muted-foreground">{driver.area} Area</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono text-muted-foreground">{driver.phone}</span>
                    <Button size="sm" variant="outline">
                      Contact
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gradient-secondary/10 border border-secondary/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Brain className="h-5 w-5 text-secondary" />
                <div>
                  <h4 className="font-medium text-foreground">AI Recommendation</h4>
                  <p className="text-sm text-muted-foreground">
                    Based on current predictions, contact 3 additional drivers for Cairo and Alexandria during peak hours (17:00-19:00)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-16">
          <Card className="inline-block bg-gradient-primary text-white shadow-glow">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-2">Powered by Advanced AI</h3>
              <p className="mb-4 opacity-90">Our machine learning models analyze transportation patterns to optimize your journey</p>
              <Button variant="secondary" size="lg">
                Learn More About Our AI
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;