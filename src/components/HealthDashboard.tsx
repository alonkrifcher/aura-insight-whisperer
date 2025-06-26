
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Moon, Activity, Heart, Battery } from "lucide-react";
import { mockOuraData } from "@/lib/mockData";

export const HealthDashboard = () => {
  const todayData = mockOuraData[0];

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Sleep Score */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Sleep Score</CardTitle>
          <Moon className="h-5 w-5 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-2 text-gray-800">{todayData.sleepScore}</div>
          <Progress value={todayData.sleepScore} className="h-2 mb-2" />
          <Badge className={`${getScoreBackground(todayData.sleepScore)} ${getScoreColor(todayData.sleepScore)} border-0`}>
            {todayData.sleepScore >= 85 ? "Excellent" : todayData.sleepScore >= 70 ? "Good" : "Needs Work"}
          </Badge>
          <div className="text-xs text-gray-500 mt-2">
            {todayData.sleepDuration} hours sleep
          </div>
        </CardContent>
      </Card>

      {/* Activity Score */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Activity Score</CardTitle>
          <Activity className="h-5 w-5 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-2 text-gray-800">{todayData.activityScore}</div>
          <Progress value={todayData.activityScore} className="h-2 mb-2" />
          <Badge className={`${getScoreBackground(todayData.activityScore)} ${getScoreColor(todayData.activityScore)} border-0`}>
            {todayData.activityScore >= 85 ? "Excellent" : todayData.activityScore >= 70 ? "Good" : "Low"}
          </Badge>
          <div className="text-xs text-gray-500 mt-2">
            {todayData.steps.toLocaleString()} steps
          </div>
        </CardContent>
      </Card>

      {/* Readiness Score */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Readiness</CardTitle>
          <Battery className="h-5 w-5 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-2 text-gray-800">{todayData.readinessScore}</div>
          <Progress value={todayData.readinessScore} className="h-2 mb-2" />
          <Badge className={`${getScoreBackground(todayData.readinessScore)} ${getScoreColor(todayData.readinessScore)} border-0`}>
            {todayData.readinessScore >= 85 ? "Ready" : todayData.readinessScore >= 70 ? "Good" : "Rest"}
          </Badge>
          <div className="text-xs text-gray-500 mt-2">
            HRV: {todayData.hrv}ms
          </div>
        </CardContent>
      </Card>

      {/* Heart Rate */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Resting HR</CardTitle>
          <Heart className="h-5 w-5 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-2 text-gray-800">{todayData.restingHeartRate}</div>
          <div className="text-sm text-gray-500">bpm</div>
          <div className="text-xs text-gray-500 mt-2">
            Body temp: {todayData.bodyTemperature}°C
          </div>
        </CardContent>
      </Card>

      {/* Today's Lifestyle Inputs */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Today's Lifestyle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Caffeine Intake</span>
              <span className="text-lg font-bold text-amber-600">{todayData.caffeineIntake}mg</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Phone Cutoff</span>
              <span className="text-lg font-bold text-blue-600">{todayData.phoneCutoffTime}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Stress Level</span>
              <span className="text-lg font-bold text-green-600">{todayData.stressLevel}/10</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
