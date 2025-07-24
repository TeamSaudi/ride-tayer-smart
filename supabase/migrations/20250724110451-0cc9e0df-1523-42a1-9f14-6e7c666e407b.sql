-- Create the driver user in auth.users table
INSERT INTO auth.users (
  id, 
  instance_id, 
  email, 
  encrypted_password, 
  email_confirmed_at, 
  confirmation_token, 
  created_at, 
  updated_at, 
  role, 
  aud
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'driver@tayer.com',
  crypt('driver@tayer', gen_salt('bf')),
  now(),
  '',
  now(),
  now(),
  'authenticated',
  'authenticated'
);