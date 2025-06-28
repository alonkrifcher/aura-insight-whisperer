import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  ComposedChart,
  Area,
  AreaChart
} from "recharts";
import { TrendingUp, Coffee, Wine, Brain, Moon, Activity, Battery } from "lucide-react";
import { useEnhancedOuraData, useEnhancedLifestyleData } from "@/hooks/useOuraData";

export const TrendsChart = () => {
  const { data: ouraData, isLoading: ouraLoading } = useEnhancedOuraData();
  const { data: lifestyleData, isLoading: lifestyleLoading } = useEnhancedLifestyleData();

  if (ouraLoading || lifestyleLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!ouraData || ouraData.length === 0) {
    return (
      <div className="text-center py-8">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-600 mb-2">No data available for trends</h3>
            <p className="text-gray-500">Sync your Oura data to see trends and charts here.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Helper function to format dates consistently
  const formatDate = (dateString: string) => {
    try {
      const dateParts = dateString.split('-');
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1; // Month is 0-indexed
      const day = parseInt(dateParts[2]);
      return new Date(year, month, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return 'Unknown';
    }
  };

  // Prepare Oura data for charts - reverse to show chronological order
  const ouraChartData = ouraData.slice().reverse().map(item => ({
    date: item.date ? formatDate(item.date) : 'Unknown',
    sleepScore: item.sleep_score || 0,
    activityScore: item.activity_score || 0,
    readinessScore: item.readiness_score || 0,
    sleepEfficiency: item.sleep_efficiency || 0,
    totalSleepHours: item.total_sleep_duration ? (item.total_sleep_duration / 3600) : 0,
    deepSleepHours: item.deep_sleep_duration ? (item.deep_sleep_duration / 3600) : 0,
    remSleepHours: item.rem_sleep_duration ? (item.rem_sleep_duration / 3600) : 0,
    steps: item.steps || 0,
    restingHR: item.resting_heart_rate || 0,
    hrv: item.average_hrv || 0,
    tempDeviation: item.temperature_deviation || 0,
  }));

  // Prepare lifestyle data for charts
  const lifestyleChartData = lifestyleData?.slice().reverse().map(item => ({
    date: item.date ? formatDate(item.date) : 'Unknown',
    caffeineServings: item.caffeine_servings || 0,
    alcoholServings: item.alcohol_servings || 0,
    stressLevel: item.stress_level || 0,
    sleepAidsCount: item.sleep_aids ? item.sleep_aids.length : 0,
  })) || [];

  // Merge Oura and lifestyle data by date
  const combinedData = ouraChartData.map(ouraItem => {
    const lifestyleItem = lifestyleChartData.find(ls => ls.date === ouraItem.date);
    return {
      ...ouraItem,
      caffeineServings: lifestyleItem?.caffeineServings || 0,
      alcoholServings: lifestyleItem?.alcoholServings || 0,
      stressLevel: lifestyleItem?.stressLevel || 0,
      sleepAidsCount: lifestyleItem?.sleepAidsCount || 0,
    };
  });

  return (
    <div className="space-y-6">
      {/* Health Scores Trend */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Health Scores Trend ({ouraChartData.length} Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ouraChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="date" 
                stroke="#666"
                fontSize={12}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                }}
              />
              <Line 
                type="monotone" 
                dataKey="sleepScore" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                name="Sleep Score"
              />
              <Line 
                type="monotone" 
                dataKey="activityScore" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                name="Activity Score"
              />
              <Line 
                type="monotone" 
                dataKey="readinessScore" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                name="Readiness Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Sleep Details */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Moon className="w-5 h-5 text-blue-600" />
            Sleep Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={ouraChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="date" stroke="#666" fontSize={12} />
              <YAxis yAxisId="hours" stroke="#666" fontSize={12} />
              <YAxis yAxisId="efficiency" orientation="right" stroke="#666" fontSize={12} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                }}
              />
              <Bar yAxisId="hours" dataKey="deepSleepHours" stackId="sleep" fill="#312e81" name="Deep Sleep (h)" />
              <Bar yAxisId="hours" dataKey="remSleepHours" stackId="sleep" fill="#7c3aed" name="REM Sleep (h)" />
              <Line yAxisId="efficiency" type="monotone" dataKey="sleepEfficiency" stroke="#f59e0b" strokeWidth={2} name="Efficiency %" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Lifestyle Factors */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Coffee className="w-5 h-5 text-amber-600" />
            Lifestyle Factors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="date" stroke="#666" fontSize={12} />
              <YAxis yAxisId="servings" stroke="#666" fontSize={12} />
              <YAxis yAxisId="stress" orientation="right" stroke="#666" fontSize={12} domain={[1, 10]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                }}
              />
              <Bar yAxisId="servings" dataKey="caffeineServings" fill="#f59e0b" name="Caffeine Servings" />
              <Bar yAxisId="servings" dataKey="alcoholServings" fill="#dc2626" name="Alcohol Servings" />
              <Line yAxisId="stress" type="monotone" dataKey="stressLevel" stroke="#8b5cf6" strokeWidth={2} name="Stress Level" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Biometric Trends */}
      {ouraChartData.some(d => d.restingHR > 0 || d.hrv > 0) && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <Activity className="w-5 h-5 text-red-600" />
              Biometric Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={ouraChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="date" stroke="#666" fontSize={12} />
                <YAxis yAxisId="hr" stroke="#666" fontSize={12} />
                <YAxis yAxisId="hrv" orientation="right" stroke="#666" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                  }}
                />
                <Line yAxisId="hr" type="monotone" dataKey="restingHR" stroke="#dc2626" strokeWidth={2} name="Resting HR" />
                <Line yAxisId="hrv" type="monotone" dataKey="hrv" stroke="#059669" strokeWidth={2} name="HRV (ms)" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Correlation Analysis */}
      {combinedData.length > 5 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <Brain className="w-5 h-5 text-purple-600" />
              Sleep vs Lifestyle Correlation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="date" stroke="#666" fontSize={12} />
                <YAxis yAxisId="score" stroke="#666" fontSize={12} domain={[0, 100]} />
                <YAxis yAxisId="lifestyle" orientation="right" stroke="#666" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                  }}
                />
                <Area yAxisId="score" type="monotone" dataKey="sleepScore" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} name="Sleep Score" />
                <Bar yAxisId="lifestyle" dataKey="caffeineServings" fill="#f59e0b" name="Caffeine" opacity={0.7} />
                <Bar yAxisId="lifestyle" dataKey="alcoholServings" fill="#dc2626" name="Alcohol" opacity={0.7} />
                <Line yAxisId="lifestyle" type="monotone" dataKey="stressLevel" stroke="#8b5cf6" strokeWidth={2} name="Stress Level" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};