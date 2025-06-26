
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface LifestyleDataPoint {
  id: string;
  date: string | null;
  caffeine_servings: number | null;
  user_id: string;
}

export const useLifestyleData = () => {
  return useQuery({
    queryKey: ['lifestyle-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lifestyle_data')
        .select('*')
        .order('date', { ascending: false })
        .limit(7);

      if (error) {
        console.error('Error fetching lifestyle data:', error);
        throw error;
      }

      return data as LifestyleDataPoint[];
    },
  });
};
