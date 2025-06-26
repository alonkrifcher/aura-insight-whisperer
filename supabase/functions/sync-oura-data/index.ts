import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get user from auth header
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const ouraToken = Deno.env.get('OURA_ACCESS_TOKEN');
    if (!ouraToken) {
      return new Response(JSON.stringify({ error: 'Oura API token not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch data from Oura API for the last 7 days
    const today = new Date().toISOString().split('T')[0];
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    console.log('Fetching enhanced Oura data from', sevenDaysAgo, 'to', today);

    // Fetch all available endpoints in parallel
    const [
      sleepResponse, 
      activityResponse, 
      readinessResponse,
      heartRateResponse,
      detailedSleepResponse
    ] = await Promise.all([
      fetch(`https://api.ouraring.com/v2/usercollection/daily_sleep?start_date=${sevenDaysAgo}&end_date=${today}`, {
        headers: { 'Authorization': `Bearer ${ouraToken}` }
      }),
      fetch(`https://api.ouraring.com/v2/usercollection/daily_activity?start_date=${sevenDaysAgo}&end_date=${today}`, {
        headers: { 'Authorization': `Bearer ${ouraToken}` }
      }),
      fetch(`https://api.ouraring.com/v2/usercollection/daily_readiness?start_date=${sevenDaysAgo}&end_date=${today}`, {
        headers: { 'Authorization': `Bearer ${ouraToken}` }
      }),
      fetch(`https://api.ouraring.com/v2/usercollection/heartrate?start_datetime=${sevenDaysAgo}T00:00:00&end_datetime=${today}T23:59:59`, {
        headers: { 'Authorization': `Bearer ${ouraToken}` }
      }),
      fetch(`https://api.ouraring.com/v2/usercollection/sleep?start_date=${sevenDaysAgo}&end_date=${today}`, {
        headers: { 'Authorization': `Bearer ${ouraToken}` }
      })
    ]);

    // Check for API errors
    const responses = [sleepResponse, activityResponse, readinessResponse, heartRateResponse, detailedSleepResponse];
    if (responses.some(r => !r.ok)) {
      console.error('Oura API error:', responses.map(r => r.status));
      return new Response(JSON.stringify({ error: 'Failed to fetch from Oura API' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const [sleepData, activityData, readinessData, heartRateData, detailedSleepData] = await Promise.all(
      responses.map(r => r.json())
    );

    console.log('Fetched data counts:', {
      sleep: sleepData.data?.length || 0,
      activity: activityData.data?.length || 0,
      readiness: readinessData.data?.length || 0,
      heartRate: heartRateData.data?.length || 0,
      detailedSleep: detailedSleepData.data?.length || 0
    });

    // Process and merge the data by date
    const mergedData = new Map();

    // Process daily sleep scores (basic metrics)
    sleepData.data?.forEach((sleep: any) => {
      if (!mergedData.has(sleep.day)) {
        mergedData.set(sleep.day, { date: sleep.day, user_id: user.id });
      }
      const dayData = mergedData.get(sleep.day);
      dayData.sleep_score = sleep.score;
      // Contributors are available in daily sleep
      if (sleep.contributors) {
        dayData.sleep_efficiency = sleep.contributors.efficiency;
        dayData.sleep_latency = sleep.contributors.latency;
      }
    });

    // Process detailed sleep data (more comprehensive metrics)
    detailedSleepData.data?.forEach((sleep: any) => {
      const date = sleep.day;
      if (!mergedData.has(date)) {
        mergedData.set(date, { date: date, user_id: user.id });
      }
      const dayData = mergedData.get(date);
      dayData.total_sleep_duration = sleep.total_sleep_duration;
      dayData.deep_sleep_duration = sleep.deep_sleep_duration;
      dayData.rem_sleep_duration = sleep.rem_sleep_duration;
      dayData.light_sleep_duration = sleep.light_sleep_duration;
      dayData.awake_time = sleep.awake_time;
      dayData.sleep_efficiency = sleep.efficiency;
      dayData.sleep_latency = sleep.latency;
      dayData.bedtime_start = sleep.bedtime_start;
      dayData.bedtime_end = sleep.bedtime_end;
      dayData.average_breath = sleep.average_breath;
      dayData.average_heart_rate = sleep.average_heart_rate;
      dayData.average_hrv = sleep.average_hrv;
      dayData.lowest_heart_rate = sleep.lowest_heart_rate;
      dayData.restless_periods = sleep.restless_periods;
      dayData.time_in_bed = sleep.time_in_bed;
    });

    // Process activity data with detailed metrics
    activityData.data?.forEach((activity: any) => {
      if (!mergedData.has(activity.day)) {
        mergedData.set(activity.day, { date: activity.day, user_id: user.id });
      }
      const dayData = mergedData.get(activity.day);
      dayData.activity_score = activity.score;
      dayData.total_calories = activity.total_calories;
      dayData.active_calories = activity.active_calories;
      dayData.steps = activity.steps;
      dayData.equivalent_walking_distance = activity.equivalent_walking_distance;
      dayData.high_activity_time = activity.high_activity_time;
      dayData.medium_activity_time = activity.medium_activity_time;
      dayData.low_activity_time = activity.low_activity_time;
      dayData.non_wear_time = activity.non_wear_time;
      dayData.resting_heart_rate = activity.resting_heart_rate;
    });

    // Process readiness data with contributor details
    readinessData.data?.forEach((readiness: any) => {
      if (!mergedData.has(readiness.day)) {
        mergedData.set(readiness.day, { date: readiness.day, user_id: user.id });
      }
      const dayData = mergedData.get(readiness.day);
      dayData.readiness_score = readiness.score;
      dayData.temperature_deviation = readiness.temperature_deviation;
      dayData.temperature_trend_deviation = readiness.temperature_trend_deviation;
      // Process contributors if available
      if (readiness.contributors) {
        dayData.activity_balance = readiness.contributors.activity_balance;
        dayData.body_temperature_contrib = readiness.contributors.body_temperature;
        dayData.hrv_balance = readiness.contributors.hrv_balance;
        dayData.previous_day_activity = readiness.contributors.previous_day_activity;
        dayData.previous_night = readiness.contributors.previous_night;
        dayData.recovery_index = readiness.contributors.recovery_index;
        dayData.resting_heart_rate_contrib = readiness.contributors.resting_heart_rate;
        dayData.sleep_balance = readiness.contributors.sleep_balance;
      }
    });

    // Process heart rate data (calculate daily averages if needed)
    const dailyHeartRates = new Map();
    heartRateData.data?.forEach((hr: any) => {
      const date = hr.timestamp.split('T')[0];
      if (!dailyHeartRates.has(date)) {
        dailyHeartRates.set(date, []);
      }
      dailyHeartRates.get(date).push(hr.bpm);
    });

    // Calculate daily heart rate averages and add to merged data
    dailyHeartRates.forEach((bpmArray, date) => {
      if (mergedData.has(date) && bpmArray.length > 0) {
        const avgBpm = Math.round(bpmArray.reduce((a, b) => a + b, 0) / bpmArray.length);
        // Only update if we don't already have resting heart rate from activity data
        if (!mergedData.get(date).resting_heart_rate) {
          mergedData.get(date).resting_heart_rate = avgBpm;
        }
      }
    });

    // Insert/update data in database
    const dataToUpsert = Array.from(mergedData.values());
    
    if (dataToUpsert.length > 0) {
      const { error: upsertError } = await supabaseClient
        .from('oura_data')
        .upsert(dataToUpsert, { 
          onConflict: 'user_id,date'
        });

      if (upsertError) {
        console.error('Database error:', upsertError);
        return new Response(JSON.stringify({ error: 'Failed to save data', details: upsertError.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      recordsProcessed: dataToUpsert.length,
      message: `Synced ${dataToUpsert.length} days of enhanced Oura data`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in sync-oura-data function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});