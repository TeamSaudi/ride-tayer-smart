-- Insert the driver account into auth.users (this would normally be done through signup)
-- Since we can't directly insert into auth.users, let's create a drivers table to track authorized drivers
CREATE TABLE public.drivers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  license_number TEXT,
  vehicle_info JSONB,
  status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'busy')),
  location JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Drivers can view their own data" 
ON public.drivers 
FOR SELECT 
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Drivers can update their own data" 
ON public.drivers 
FOR UPDATE 
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Insert the test driver
INSERT INTO public.drivers (email, name, phone, license_number, vehicle_info, status, location) 
VALUES (
  'driver@tayer.com',
  'Ahmed El-Driver',
  '+20 123 456 7890',
  'DL123456789',
  '{"make": "Toyota", "model": "Corolla", "year": 2020, "plate": "ABC 123", "color": "White"}',
  'online',
  '{"lat": 30.0444, "lng": 31.2357, "address": "Downtown Cairo"}'
);

-- Create ride requests table
CREATE TABLE public.ride_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  passenger_name TEXT NOT NULL,
  passenger_phone TEXT,
  pickup_location JSONB NOT NULL,
  destination JSONB NOT NULL,
  fare DECIMAL(10,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
  driver_id UUID REFERENCES public.drivers(id),
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  estimated_duration INTEGER, -- in minutes
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent'))
);

-- Enable RLS
ALTER TABLE public.ride_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for ride requests
CREATE POLICY "Drivers can view assigned and pending requests" 
ON public.ride_requests 
FOR SELECT 
USING (
  driver_id IS NULL OR 
  driver_id = (SELECT id FROM public.drivers WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
);

-- Insert sample ride requests
INSERT INTO public.ride_requests (passenger_name, passenger_phone, pickup_location, destination, fare, status, estimated_duration, priority) VALUES
('Sara Ahmed', '+20 111 222 333', '{"lat": 30.0626, "lng": 31.2497, "address": "Zamalek, Cairo"}', '{"lat": 30.0131, "lng": 31.2089, "address": "6th October City"}', 85.50, 'pending', 45, 'high'),
('Mohamed Hassan', '+20 100 555 777', '{"lat": 30.0444, "lng": 31.2357, "address": "Downtown Cairo"}', '{"lat": 30.1219, "lng": 31.2658, "address": "Heliopolis"}', 35.00, 'pending', 25, 'normal'),
('Fatma Ali', '+20 122 888 999', '{"lat": 29.9668, "lng": 31.2582, "address": "Maadi, Cairo"}', '{"lat": 30.0626, "lng": 31.2497, "address": "Zamalek"}', 45.00, 'pending', 30, 'urgent'),
('Omar Khaled', '+20 155 444 666', '{"lat": 30.0131, "lng": 31.2089, "address": "6th October City"}', '{"lat": 30.0444, "lng": 31.2357, "address": "Downtown Cairo"}', 80.00, 'pending', 40, 'normal');

-- Create AI alerts table
CREATE TABLE public.ai_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_id UUID REFERENCES public.drivers(id),
  alert_type TEXT NOT NULL CHECK (alert_type IN ('high_demand', 'traffic_alert', 'weather_warning', 'surge_pricing', 'maintenance_reminder')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  location JSONB,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.ai_alerts ENABLE ROW LEVEL SECURITY;

-- Create policies for AI alerts
CREATE POLICY "Drivers can view their own alerts" 
ON public.ai_alerts 
FOR SELECT 
USING (driver_id = (SELECT id FROM public.drivers WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())));

-- Insert sample AI alerts
INSERT INTO public.ai_alerts (driver_id, alert_type, title, message, location, priority, expires_at) VALUES
(
  (SELECT id FROM public.drivers WHERE email = 'driver@tayer.com'),
  'high_demand',
  'High Demand Area Detected',
  'There is high demand for rides in New Cairo area. Consider heading there for better earnings. Expected wait time: 5-10 minutes.',
  '{"lat": 30.0131, "lng": 31.4914, "address": "New Cairo"}',
  'high',
  now() + interval '2 hours'
),
(
  (SELECT id FROM public.drivers WHERE email = 'driver@tayer.com'),
  'traffic_alert',
  'Traffic Congestion Alert',
  'Heavy traffic reported on Ring Road. Consider alternative routes. Estimated delay: 15-20 minutes.',
  '{"lat": 30.0444, "lng": 31.2357, "address": "Ring Road, Cairo"}',
  'medium',
  now() + interval '1 hour'
),
(
  (SELECT id FROM public.drivers WHERE email = 'driver@tayer.com'),
  'surge_pricing',
  'Surge Pricing Active',
  'Surge pricing (1.5x) is now active in Zamalek area due to high demand. Great opportunity for higher earnings!',
  '{"lat": 30.0626, "lng": 31.2497, "address": "Zamalek, Cairo"}',
  'high',
  now() + interval '30 minutes'
);

-- Create triggers for timestamp updates
CREATE TRIGGER update_drivers_updated_at
BEFORE UPDATE ON public.drivers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();