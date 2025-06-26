
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const OuraSync = () => {
  const [issyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus('idle');

    try {
      const { data, error } = await supabase.functions.invoke('sync-oura-data');

      if (error) {
        console.error('Sync error:', error);
        setSyncStatus('error');
        toast({
          title: "Sync Failed",
          description: "Failed to sync with Oura API. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('Sync response:', data);
      setSyncStatus('success');
      setLastSync(new Date().toLocaleString());
      
      toast({
        title: "Sync Complete!",
        description: data.message || "Your Oura data has been updated successfully.",
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
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
            Oura Ring Data
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
          Sync your sleep, activity, and readiness data from your Oura Ring.
        </p>
        
        {lastSync && (
          <p className="text-xs text-gray-500">
            Last synced: {lastSync}
          </p>
        )}

        <Button 
          onClick={handleSync} 
          disabled={issyncing}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {issyncing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync Oura Data
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
