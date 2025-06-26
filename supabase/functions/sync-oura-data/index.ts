
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

    // Fetch sleep data from Oura API
    const today = new Date().toISOString().split('T')[0];
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    console.log('Fetching Oura data from', sevenDaysAgo, 'to', today);

    const [sleepResponse, activityResponse, readinessResponse] = await Promise.all([
      fetch(`https://api.ouraring.com/v2/usercollection/daily_sleep?start_date=${sevenDaysAgo}&end_date=${today}`, {
        headers: { 'Authorization': `Bearer ${ouraToken}` }
      }),
      fetch(`https://api.ouraring.com/v2/usercollection/daily_activity?start_date=${sevenDaysAgo}&end_date=${today}`, {
        headers: { 'Authorization': `Bearer ${ouraToken}` }
      }),
      fetch(`https://api.ouraring.com/v2/usercollection/daily_readiness?start_date=${sevenDaysAgo}&end_date=${today}`, {
        headers: { 'Authorization': `Bearer ${ouraToken}` }
      })
    ]);

    if (!sleepResponse.ok || !activityResponse.ok || !readinessResponse.ok) {
      console.error('Oura API error:', sleepResponse.status, activityResponse.status, readinessResponse.status);
      return new Response(JSON.stringify({ error: 'Failed to fetch from Oura API' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const sleepData = await sleepResponse.json();
    const activityData = await activityResponse.json();
    const readinessData = await readinessResponse.json();

    console.log('Fetched data counts:', {
      sleep: sleepData.data?.length || 0,
      activity: activityData.data?.length || 0,
      readiness: readinessData.data?.length || 0
    });

    // Process and merge the data by date
    const mergedData = new Map();

    // Process sleep data
    sleepData.data?.forEach((sleep: any) => {
      if (!mergedData.has(sleep.day)) {
        mergedData.set(sleep.day, { date: sleep.day, user_id: user.id });
      }
      mergedData.get(sleep.day).sleep_score = sleep.score;
    });

    // Process activity data
    activityData.data?.forEach((activity: any) => {
      if (!mergedData.has(activity.day)) {
        mergedData.set(activity.day, { date: activity.day, user_id: user.id });
      }
      mergedData.get(activity.day).activity_score = activity.score;
    });

    // Process readiness data
    readinessData.data?.forEach((readiness: any) => {
      if (!mergedData.has(readiness.day)) {
        mergedData.set(readiness.day, { date: readiness.day, user_id: user.id });
      }
      mergedData.get(readiness.day).readiness_score = readiness.score;
    });

    // Insert/update data in database
    const dataToUpsert = Array.from(mergedData.values());
    
    if (dataToUpsert.length > 0) {
      const { error: upsertError } = await supabaseClient
        .from('oura_data')
        .upsert(dataToUpsert, { 
          onConflict: 'user_id,date',
          ignoreDuplicates: false 
        });

      if (upsertError) {
        console.error('Database error:', upsertError);
        return new Response(JSON.stringify({ error: 'Failed to save data' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      recordsProcessed: dataToUpsert.length,
      message: `Synced ${dataToUpsert.length} days of Oura data`
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
