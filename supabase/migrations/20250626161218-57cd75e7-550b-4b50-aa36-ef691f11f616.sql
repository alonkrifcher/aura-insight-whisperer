
-- Enable Row Level Security on both tables
ALTER TABLE public.oura_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lifestyle_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for oura_data table
-- Users can only view their own data
CREATE POLICY "Users can view their own oura data" 
  ON public.oura_data 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can only insert their own data
CREATE POLICY "Users can insert their own oura data" 
  ON public.oura_data 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own data
CREATE POLICY "Users can update their own oura data" 
  ON public.oura_data 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can only delete their own data
CREATE POLICY "Users can delete their own oura data" 
  ON public.oura_data 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for lifestyle_data table
-- Users can only view their own data
CREATE POLICY "Users can view their own lifestyle data" 
  ON public.lifestyle_data 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can only insert their own data
CREATE POLICY "Users can insert their own lifestyle data" 
  ON public.lifestyle_data 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own data
CREATE POLICY "Users can update their own lifestyle data" 
  ON public.lifestyle_data 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can only delete their own data
CREATE POLICY "Users can delete their own lifestyle data" 
  ON public.lifestyle_data 
  FOR DELETE 
  USING (auth.uid() = user_id);
