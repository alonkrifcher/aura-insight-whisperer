import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, CheckCircle, AlertCircle, Calendar, CalendarDays } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const OuraSync = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncType, setSyncType] = useState<'quick' | 'full' | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSync = async (days: number, type: 'quick' | 'full') => {
    setIsSyncing(true);
    setSyncType(type);
    setSyncStatus('idle');

    try {
      const { data, error } = await supabase.functions.invoke('sync-oura-data', {
        body: { days: days }
      });

      if (error) {
        console.error('Sync error:', error);
        setSyncStatus('error');
        toast({
          title: "Sync Failed",
          description: `Failed to sync ${type === 'quick' ? 'recent' : 'full'} Oura data. Please try again.`,
          variant: "destructive",
        });
        return;
      }

      console.log('Sync response:', data);
      setSyncStatus('success');
      setLastSync(new Date().toLocaleString());
      
      toast({
        title: "Sync Complete!",
        description: data?.message || `Your ${type === 'quick' ? 'recent' : 'full'} Oura data has been updated successfully.`,
      });

    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('error');
      toast({
        title: "Sync Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
      setSyncType(null);
    }
  };

  const handleQuickSync = () => handleSync(2, 'quick');
  const handleFullSync = () => handleSync(7, 'full');

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
            Oura Ring Data Sync
          </div>
          <Badge variant={syncStatus === 'success' ? 'default' : syncStatus === 'error' ? 'destructive' : 'secondary'}>
            {syncStatus === 'success' && <CheckCircle className="w-3 h-3 mr-1" />}
            {syncStatus === 'error' && <AlertCircle className="w-3 h-3 mr-1" />}
            {syncStatus === 'success' ? 'Connected' : syncStatus === 'error' ? 'Error' : 'Ready'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Sync your sleep, activity, and readiness data from your Oura Ring. Choose quick sync for recent updates or full sync for comprehensive data.
        </p>
        
        {lastSync && (
          <p className="text-xs text-gray-500">
            Last synced: {lastSync}
          </p>
        )}

        {/* Sync Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Quick Sync - 2 Days */}
          <div className="space-y-2">
            <Button 
              onClick={handleQuickSync}
              disabled={isSyncing}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              {isSyncing && syncType === 'quick' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  Quick Sync
                </>
              )}
            </Button>
            <div className="text-xs text-gray-500 text-center">
              <div className="font-medium">Today + Yesterday</div>
              <div>Fewer API calls, faster sync</div>
            </div>
          </div>

          {/* Full Sync - 7 Days */}
          <div className="space-y-2">
            <Button 
              onClick={handleFullSync}
              disabled={isSyncing}
              variant="outline"
              className="w-full border-purple-200 hover:bg-purple-50"
            >
              {isSyncing && syncType === 'full' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Full Sync
                </>
              )}
            </Button>
            <div className="text-xs text-gray-500 text-center">
              <div className="font-medium">Last 7 Days</div>
              <div>Complete data refresh</div>
            </div>
          </div>
        </div>

        {/* Sync Information */}
        <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
            <div>
              <div className="font-medium mb-1">Sync Options:</div>
              <div className="space-y-1">
                <div><strong>Quick Sync:</strong> Updates today and yesterday's data. Perfect for daily check-ins.</div>
                <div><strong>Full Sync:</strong> Refreshes the last 7 days. Use when you need to backfill missing data.</div>
              </div>
            </div>
          </div>
        </div>

        {/* API Usage Indicator */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
          <span>API Impact:</span>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Quick: ~3-4 calls
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Full: ~8-12 calls
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};