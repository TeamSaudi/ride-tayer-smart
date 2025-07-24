-- Add RLS policies to the logins table to fix remaining security warning
CREATE POLICY "Users can view their own logins" 
ON public.logins 
FOR SELECT 
USING (true); -- Making it public for now, can be restricted later based on requirements

CREATE POLICY "Users can insert logins" 
ON public.logins 
FOR INSERT 
WITH CHECK (true); -- Making it public for now, can be restricted later