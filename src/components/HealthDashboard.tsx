
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
  Heart
} from "lucide-react";
import { useEnhancedOuraData } from "@/hooks/useOuraData";
import { useEnhancedLifestyleData } from "@/hooks/useOuraData";

export const HealthDashboard = () => {
  const { data: ouraData, isLoading: ouraLoading } = useEnhancedOuraData();
  const { data: lifestyleData, isLoading: lifestyleLoading } = useEnhancedLifestyleData();

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

  if (!todayData) {
    return (
      <div className="text-center py-8">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-600 mb-2">No Oura data available</h3>
            <p className="text-gray-500">Sync your Oura data to see your health metrics here.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Main Health Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sleep Score */}
        {todayData.sleep_score && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Sleep Score</CardTitle>
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
            </CardContent>
          </Card>
        )}

        {/* Activity Score */}
        {todayData.activity_score && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Activity Score</CardTitle>
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
            </CardContent>
          </Card>
        )}

        {/* Readiness Score */}
        {todayData.readiness_score && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Readiness</CardTitle>
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
            </CardContent>
          </Card>
        )}
      </div>

      {/* Enhanced Sleep Metrics */}
      {(todayData.sleep_efficiency || todayData.deep_sleep_duration || todayData.rem_sleep_duration) && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Moon className="w-5 h-5 text-blue-600" />
              Detailed Sleep Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {todayData.sleep_efficiency && (
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700">Efficiency</div>
                  <div className="text-xl font-bold text-blue-600">{todayData.sleep_efficiency}%</div>
                </div>
              )}
              {todayData.deep_sleep_duration && (
                <div className="text-center p-3 bg-indigo-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700">Deep Sleep</div>
                  <div className="text-xl font-bold text-indigo-600">{formatDuration(todayData.deep_sleep_duration)}</div>
                </div>
              )}
              {todayData.rem_sleep_duration && (
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700">REM Sleep</div>
                  <div className="text-xl font-bold text-purple-600">{formatDuration(todayData.rem_sleep_duration)}</div>
                </div>
              )}
              {todayData.light_sleep_duration && (
                <div className="text-center p-3 bg-cyan-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700">Light Sleep</div>
                  <div className="text-xl font-bold text-cyan-600">{formatDuration(todayData.light_sleep_duration)}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lifestyle Data */}
      {todayLifestyle && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Yesterday's Lifestyle Data</CardTitle>
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

              {/* Alcohol */}
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Wine className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-gray-700">Alcohol</span>
                </div>
                <span className="text-lg font-bold text-red-600">
                  {todayLifestyle.alcohol_servings || 0}
                </span>
              </div>

              {/* Last Alcoholic Drink */}
              {todayLifestyle.last_alcoholic_drink && (
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-gray-700">Last Drink</span>
                  </div>
                  <span className="text-sm font-bold text-red-600">
                    {formatTime(todayLifestyle.last_alcoholic_drink)}
                  </span>
                </div>
              )}

              {/* Screentime End */}
              {todayLifestyle.screentime_end && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Screen End</span>
                  </div>
                  <span className="text-sm font-bold text-blue-600">
                    {formatTime(todayLifestyle.screentime_end)}
                  </span>
                </div>
              )}

              {/* Last Food */}
              {todayLifestyle.last_food && (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Last Food</span>
                  </div>
                  <span className="text-sm font-bold text-green-600">
                    {formatTime(todayLifestyle.last_food)}
                  </span>
                </div>
              )}

              {/* Stress Level */}
              {todayLifestyle.stress_level && (
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">Stress</span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">
                    {todayLifestyle.stress_level}/10
                  </span>
                </div>
              )}

              {/* Sleep Aids */}
              {todayLifestyle.sleep_aids && todayLifestyle.sleep_aids.length > 0 && (
                <div className="col-span-2 md:col-span-1 p-3 bg-indigo-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Pill className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-medium text-gray-700">Sleep Aids</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {todayLifestyle.sleep_aids.map((aid, index) => (
                      <Badge key={index} className="bg-indigo-100 text-indigo-800 text-xs">
                        {aid}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Biometric Data */}
      {(todayData.average_heart_rate || todayData.average_hrv || todayData.temperature_deviation) && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-600" />
              Biometric Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {todayData.average_heart_rate && (
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700">Avg HR</div>
                  <div className="text-xl font-bold text-red-600">{Math.round(todayData.average_heart_rate)} bpm</div>
                </div>
              )}
              {todayData.average_hrv && (
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700">HRV</div>
                  <div className="text-xl font-bold text-green-600">{todayData.average_hrv} ms</div>
                </div>
              )}
              {todayData.temperature_deviation && (
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 flex items-center justify-center gap-1">
                    <Thermometer className="w-3 h-3" />
                    Temp Deviation
                  </div>
                  <div className="text-xl font-bold text-orange-600">
                    {todayData.temperature_deviation > 0 ? '+' : ''}{todayData.temperature_deviation}°C
                  </div>
                </div>
              )}
              {todayData.total_calories && (
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700">Calories</div>
                  <div className="text-xl font-bold text-yellow-600">{todayData.total_calories}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
