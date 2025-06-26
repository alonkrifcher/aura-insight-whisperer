
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface OuraDataPoint {
  id: string;
  date: string;
  sleep_score: number | null;
  activity_score: number | null;
  readiness_score: number | null;
  user_id: string;
  created_at: string | null;
}

export const useOuraData = () => {
  return useQuery({
    queryKey: ['oura-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('oura_data')
        .select('*')
        .order('date', { ascending: false })
        .limit(7);

      if (error) {
        console.error('Error fetching Oura data:', error);
        throw error;
      }

      return data as OuraDataPoint[];
    },
  });
};
