
-- Fix the foreign key relationships and constraints for both tables

-- First, let's fix the lifestyle_data table user_id default value and add foreign key
ALTER TABLE public.lifestyle_data ALTER COLUMN user_id DROP DEFAULT;
ALTER TABLE public.lifestyle_data ADD CONSTRAINT lifestyle_data_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add foreign key constraint to oura_data table
ALTER TABLE public.oura_data ADD CONSTRAINT oura_data_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add unique constraints to both tables to support upsert operations
ALTER TABLE public.oura_data ADD CONSTRAINT oura_data_user_date_unique UNIQUE (user_id, date);
ALTER TABLE public.lifestyle_data ADD CONSTRAINT lifestyle_data_user_date_unique UNIQUE (user_id, date);
