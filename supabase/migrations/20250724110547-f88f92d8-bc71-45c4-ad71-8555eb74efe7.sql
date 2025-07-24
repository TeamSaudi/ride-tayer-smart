-- Add RLS policies for the Logins table (with correct case)
ALTER TABLE public."Logins" ENABLE ROW LEVEL SECURITY;

-- Allow users to insert login records (if needed for tracking)
CREATE POLICY "Users can insert login records" ON public."Logins"
  FOR INSERT WITH CHECK (true);

-- Allow users to view login records
CREATE POLICY "Users can view login records" ON public."Logins" 
  FOR SELECT USING (true);