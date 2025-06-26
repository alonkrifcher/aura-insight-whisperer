
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Moon, Activity, Battery, Coffee } from "lucide-react";
import { useOuraData } from "@/hooks/useOuraData";
import { useLifestyleData } from "@/hooks/useLifestyleData";

export const HealthDashboard = () => {
  const { data: ouraData, isLoading: ouraLoading } = useOuraData();
  const { data: lifestyleData, isLoading: lifestyleLoading } = useLifestyleData();

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

  if (ouraLoading || lifestyleLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
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
            <div className="text-xs text-gray-500 mt-2">
              {todayData.date}
            </div>
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
            <div className="text-xs text-gray-500 mt-2">
              {todayData.date}
            </div>
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
            <div className="text-xs text-gray-500 mt-2">
              {todayData.date}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Today's Lifestyle Inputs */}
      {todayLifestyle && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Today's Lifestyle Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Coffee className="w-4 h-4" />
                  Caffeine Servings
                </span>
                <span className="text-lg font-bold text-amber-600">
                  {todayLifestyle.caffeine_servings || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Date</span>
                <span className="text-lg font-bold text-blue-600">
                  {todayLifestyle.date || 'Today'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
