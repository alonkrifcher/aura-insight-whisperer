import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Moon, 
  Activity, 
  Battery, 
  Coffee, 
  Wine, 
  Smartphone, 
  Utensils, 
  Pill, 
  Brain,
  Clock,
  Thermometer,
  Heart,
  Bug
} from "lucide-react";
import { useEnhancedOuraData, useEnhancedLifestyleData } from "@/hooks/useOuraData";
import { useState } from "react";

export const HealthDashboard = () => {
  const { data: ouraData, isLoading: ouraLoading } = useEnhancedOuraData();
  const { data: lifestyleData, isLoading: lifestyleLoading } = useEnhancedLifestyleData();
  const [showDebug, setShowDebug] = useState(false);

  const todayData = ouraData?.[0];
  const todayLifestyle = lifestyleData?.[0];

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 85) return "bg-green-100";
    if (score >= 70) return "bg-yellow-100";
    return "bg-red-100";
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "Not recorded";
    return timeString;
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "N/A";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (ouraLoading || lifestyleLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Debug Panel */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-yellow-800">
            <div className="flex items-center gap-2">
              <Bug className="w-5 h-5" />
              Debug Information
            </div>
            <Button 
              onClick={() => setShowDebug(!showDebug)}
              variant="outline"
              size="sm"
            >
              {showDebug ? "Hide" : "Show"} Debug
            </Button>
          </CardTitle>
        </CardHeader>
        {showDebug && (
          <CardContent className="bg-white rounded-lg">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Raw Oura Data (First 3 entries):</h4>
                <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">
                  {JSON.stringify(ouraData?.slice(0, 3), null, 2)}
                </pre>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Raw Lifestyle Data (First 3 entries):</h4>
                <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">
                  {JSON.stringify(lifestyleData?.slice(0, 3), null, 2)}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Today's Data Processing:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Today's Oura (todayData):</strong>
                    <pre className="text-xs bg-gray-100 p-2 rounded mt-1">
                      {JSON.stringify(todayData, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <strong>Today's Lifestyle (todayLifestyle):</strong>
                    <pre className="text-xs bg-gray-100 p-2 rounded mt-1">
                      {JSON.stringify(todayLifestyle, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Data Array Info:</h4>
                <div className="text-sm space-y-1">
                  <div>Oura Data Length: {ouraData?.length || 0}</div>
                  <div>Lifestyle Data Length: {lifestyleData?.length || 0}</div>
                  <div>Oura Data Order: {ouraData?.slice(0, 5).map(d => `${d.date}: Sleep ${d.sleep_score}`).join(', ')}</div>
                  <div>Lifestyle Data Order: {lifestyleData?.slice(0, 5).map(d => `${d.date}: Caffeine ${d.caffeine_servings}`).join(', ')}</div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Data Availability Check */}
      {!todayData && (
        <div className="text-center py-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Oura data available</h3>
              <p className="text-gray-500">Sync your Oura data to see your health metrics here.</p>
              <div className="mt-4 text-sm text-gray-400">
                <div>Available Oura entries: {ouraData?.length || 0}</div>
                <div>Available Lifestyle entries: {lifestyleData?.length || 0}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Health Scores - Only show if we have data */}
      {todayData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sleep Score */}
            {todayData.sleep_score && (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Sleep Score - {todayData.date}
                  </CardTitle>
                  <Moon className="h-5 w-5 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2 text-gray-800">{todayData.sleep_score}</div>
                  <Progress value={todayData.sleep_score} className="h-2 mb-2" />
                  <Badge className={`${getScoreBackground(todayData.sleep_score)} ${getScoreColor(todayData.sleep_score)} border-0`}>
                    {todayData.sleep_score >= 85 ? "Excellent" : todayData.sleep_score >= 70 ? "Good" : "Needs Work"}
                  </Badge>
                  {todayData.total_sleep_duration && (
                    <div className="text-xs text-gray-500 mt-2">
                      Duration: {formatDuration(todayData.total_sleep_duration)}
                    </div>
                  )}
                  <div className="text-xs text-gray-400 mt-1">
                    Raw: {todayData.sleep_score} | Date: {todayData.date} | ID: {todayData.id}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Activity Score */}
            {todayData.activity_score && (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Activity Score - {todayData.date}
                  </CardTitle>
                  <Activity className="h-5 w-5 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2 text-gray-800">{todayData.activity_score}</div>
                  <Progress value={todayData.activity_score} className="h-2 mb-2" />
                  <Badge className={`${getScoreBackground(todayData.activity_score)} ${getScoreColor(todayData.activity_score)} border-0`}>
                    {todayData.activity_score >= 85 ? "Excellent" : todayData.activity_score >= 70 ? "Good" : "Low"}
                  </Badge>
                  {todayData.steps && (
                    <div className="text-xs text-gray-500 mt-2">
                      Steps: {todayData.steps.toLocaleString()}
                    </div>
                  )}
                  <div className="text-xs text-gray-400 mt-1">
                    Raw: {todayData.activity_score} | Date: {todayData.date} | ID: {todayData.id}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Readiness Score */}
            {todayData.readiness_score && (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Readiness - {todayData.date}
                  </CardTitle>
                  <Battery className="h-5 w-5 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2 text-gray-800">{todayData.readiness_score}</div>
                  <Progress value={todayData.readiness_score} className="h-2 mb-2" />
                  <Badge className={`${getScoreBackground(todayData.readiness_score)} ${getScoreColor(todayData.readiness_score)} border-0`}>
                    {todayData.readiness_score >= 85 ? "Ready" : todayData.readiness_score >= 70 ? "Good" : "Rest"}
                  </Badge>
                  {todayData.resting_heart_rate && (
                    <div className="text-xs text-gray-500 mt-2">
                      RHR: {todayData.resting_heart_rate} bpm
                    </div>
                  )}
                  <div className="text-xs text-gray-400 mt-1">
                    Raw: {todayData.readiness_score} | Date: {todayData.date} | ID: {todayData.id}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Today's Lifestyle Data */}
          {todayLifestyle && (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Lifestyle Data - {todayLifestyle.date}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {/* Caffeine */}
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Coffee className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-medium text-gray-700">Caffeine</span>
                    </div>
                    <span className="text-lg font-bold text-amber-600">
                      {todayLifestyle.caffeine_servings || 0}
                    </span>
                  </div>

                  {/* Show all lifestyle fields for debugging */}
                  <div className="col-span-full">
                    <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded">
                      <strong>Lifestyle Debug:</strong> ID: {todayLifestyle.id} | Date: {todayLifestyle.date} | 
                      Caffeine: {todayLifestyle.caffeine_servings} | Alcohol: {todayLifestyle.alcohol_servings} | 
                      Stress: {todayLifestyle.stress_level}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};