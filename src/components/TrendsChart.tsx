
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, Coffee } from "lucide-react";
import { useEnhancedOuraData } from "@/hooks/useOuraData";
import { useLifestyleData } from "@/hooks/useLifestyleData";

export const TrendsChart = () => {
  const { data: ouraData, isLoading: ouraLoading } = useEnhancedOuraData();
  const { data: lifestyleData, isLoading: lifestyleLoading } = useLifestyleData();

  if (ouraLoading || lifestyleLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
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

  // Prepare data for charts - reverse to show chronological order
  // Fix date formatting to avoid timezone offset issues
  const chartData = ouraData.slice().reverse().map(item => ({
    date: item.date ? (() => {
      const dateParts = item.date.split('-');
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1; // Month is 0-indexed
      const day = parseInt(dateParts[2]);
      return new Date(year, month, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    })() : 'Unknown',
    sleepScore: item.sleep_score || 0,
    activityScore: item.activity_score || 0,
    readinessScore: item.readiness_score || 0,
  }));

  // Prepare lifestyle data for charts - fix date formatting
  const lifestyleChartData = lifestyleData?.slice().reverse().map(item => ({
    date: item.date ? (() => {
      const dateParts = item.date.split('-');
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1; // Month is 0-indexed
      const day = parseInt(dateParts[2]);
      return new Date(year, month, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    })() : 'Unknown',
    caffeineServings: item.caffeine_servings || 0,
  })) || [];

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Health Scores Trend ({chartData.length} Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="date" 
                stroke="#666"
                fontSize={12}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
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

      {lifestyleChartData.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <Coffee className="w-5 h-5 text-amber-600" />
              Caffeine Servings Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={lifestyleChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="date" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                  }}
                />
                <Bar dataKey="caffeineServings" fill="#f59e0b" name="Caffeine Servings" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
