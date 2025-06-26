
// Enhanced useOuraData.ts
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface EnhancedOuraDataPoint {
  id: string;
  date: string;
  sleep_score: number | null;
  activity_score: number | null;
  readiness_score: number | null;
  user_id: string;
  created_at: string | null;
  // Enhanced sleep metrics from detailed sleep endpoint
  total_sleep_duration: number | null; // seconds
  deep_sleep_duration: number | null; // seconds
  rem_sleep_duration: number | null; // seconds
  light_sleep_duration: number | null; // seconds
  awake_time: number | null; // seconds
  sleep_efficiency: number | null; // percentage (0-100)
  sleep_latency: number | null; // seconds
  bedtime_start: string | null; // ISO timestamp
  bedtime_end: string | null; // ISO timestamp
  average_breath: number | null;
  average_heart_rate: number | null;
  average_hrv: number | null;
  lowest_heart_rate: number | null;
  restless_periods: number | null;
  time_in_bed: number | null; // seconds
  // Enhanced activity metrics
  total_calories: number | null;
  active_calories: number | null;
  steps: number | null;
  equivalent_walking_distance: number | null; // meters
  high_activity_time: number | null; // seconds
  medium_activity_time: number | null; // seconds
  low_activity_time: number | null; // seconds
  non_wear_time: number | null; // seconds
  resting_heart_rate: number | null;
  // Enhanced readiness metrics
  temperature_deviation: number | null; // celsius
  temperature_trend_deviation: number | null;
  activity_balance: number | null; // contributor score 0-100
  body_temperature_contrib: number | null; // contributor score 0-100
  hrv_balance: number | null; // contributor score 0-100
  previous_day_activity: number | null; // contributor score 0-100
  previous_night: number | null; // contributor score 0-100
  recovery_index: number | null; // contributor score 0-100
  resting_heart_rate_contrib: number | null; // contributor score 0-100
  sleep_balance: number | null; // contributor score 0-100
}

export const useEnhancedOuraData = () => {
  return useQuery({
    queryKey: ['enhanced-oura-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('oura_data')
        .select('*')
        .order('date', { ascending: false })
        .limit(30); // Get more data for better analysis

      if (error) {
        console.error('Error fetching enhanced Oura data:', error);
        throw error;
      }

      return data as EnhancedOuraDataPoint[];
    },
  });
};

// Enhanced useLifestyleData.ts
export interface EnhancedLifestyleDataPoint {
  id: string;
  date: string | null;
  caffeine_servings: number | null;
  alcohol_servings: number | null;
  last_alcoholic_drink: string | null; // TIME format (HH:MM)
  screentime_end: string | null; // TIME format (HH:MM)
  last_food: string | null; // TIME format (HH:MM)
  sleep_aids: string[] | null; // Array of sleep aids
  stress_level: number | null; // 1-10 scale
  user_id: string;
}

export const useEnhancedLifestyleData = () => {
  return useQuery({
    queryKey: ['enhanced-lifestyle-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lifestyle_data')
        .select('*')
        .order('date', { ascending: false })
        .limit(30);

      if (error) {
        console.error('Error fetching enhanced lifestyle data:', error);
        throw error;
      }

      return data as EnhancedLifestyleDataPoint[];
    },
  });
};

// Helper hook for adding lifestyle data
export const useAddLifestyleData = () => {
  return async (data: Omit<EnhancedLifestyleDataPoint, 'id'>) => {
    const { data: result, error } = await supabase
      .from('lifestyle_data')
      .upsert([data], { onConflict: 'user_id,date' })
      .select();

    if (error) {
      throw error;
    }

    return result;
  };
};
