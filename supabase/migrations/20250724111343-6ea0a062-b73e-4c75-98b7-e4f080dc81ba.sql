-- First, delete the existing problematic driver user
DELETE FROM auth.users WHERE email = 'driver@tayer.com';

-- Create the driver user with all required fields properly set
INSERT INTO auth.users (
  id, 
  instance_id, 
  email, 
  encrypted_password, 
  email_confirmed_at,
  confirmed_at,
  confirmation_token, 
  created_at, 
  updated_at, 
  role, 
  aud,
  email_change,
  email_change_token_new,
  email_change_token_current,
  email_change_confirm_status,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  is_sso_user,
  is_anonymous
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'driver@tayer.com',
  crypt('driver@tayer', gen_salt('bf')),
  now(),
  now(),
  '',
  now(),
  now(),
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  0,
  '{}',
  '{"first_name": "Ahmed", "last_name": "Driver"}',
  false,
  false,
  false
);