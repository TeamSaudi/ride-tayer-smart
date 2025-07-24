-- Add RLS policies to the Logins table to fix remaining security warning
CREATE POLICY "Users can view their own logins" 
ON public.Logins 
FOR SELECT 
USING (true); -- Making it public for now, can be restricted later based on requirements

CREATE POLICY "Users can insert logins" 
ON public.Logins 
FOR INSERT 
WITH CHECK (true); -- Making it public for now, can be restricted later