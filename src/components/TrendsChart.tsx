import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { TrendingUp, Coffee, Wine, Brain, Moon, Activity, Battery, Bug } from "lucide-react";
import { useEnhancedOuraData, useEnhancedLifestyleData } from "@/hooks/useOuraData";
import { useState } from "react";

export const TrendsChart = () => {
  const { data: ouraData, isLoading: ouraLoading } = useEnhancedOuraData();
  const { data: lifestyleData, isLoading: lifestyleLoading } = useEnhancedLifestyleData();
  const [showDebug, setShowDebug] = useState(false);

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
      console.log('Formatting date:', dateString);
      const dateParts = dateString.split('-');
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1; // Month is 0-indexed
      const day = parseInt(dateParts[2]);
      const formattedDate = new Date(year, month, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      console.log('Formatted to:', formattedDate);
      return formattedDate;
    } catch (error) {
      console.error('Date formatting error for:', dateString, error);
      return 'Unknown';
    }
  };

  // Prepare Oura data for charts - reverse to show chronological order
  const ouraChartData = ouraData.slice().reverse().map((item, index) => {
    console.log(`Processing Oura item ${index}:`, item);
    return {
      date: item.date ? formatDate(item.date) : 'Unknown',
      originalDate: item.date,
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
      debugInfo: `ID: ${item.id}, Date: ${item.date}, Sleep: ${item.sleep_score}`
    };
  });

  // Prepare lifestyle data for charts
  const lifestyleChartData = lifestyleData?.slice().reverse().map((item, index) => {
    console.log(`Processing Lifestyle item ${index}:`, item);
    return {
      date: item.date ? formatDate(item.date) : 'Unknown',
      originalDate: item.date,
      caffeineServings: item.caffeine_servings || 0,
      alcoholServings: item.alcohol_servings || 0,
      stressLevel: item.stress_level || 0,
      sleepAidsCount: item.sleep_aids ? item.sleep_aids.length : 0,
      debugInfo: `ID: ${item.id}, Date: ${item.date}, Caffeine: ${item.caffeine_servings}`
    };
  }) || [];

  // Merge Oura and lifestyle data by date
  const combinedData = ouraChartData.map(ouraItem => {
    const lifestyleItem = lifestyleChartData.find(ls => ls.originalDate === ouraItem.originalDate);
    return {
      ...ouraItem,
      caffeineServings: lifestyleItem?.caffeineServings || 0,
      alcoholServings: lifestyleItem?.alcoholServings || 0,
      stressLevel: lifestyleItem?.stressLevel || 0,
      sleepAidsCount: lifestyleItem?.sleepAidsCount || 0,
      lifestyleDebug: lifestyleItem?.debugInfo || 'No lifestyle data'
    };
  });

  console.log('Final combined data:', combinedData);

  return (
    <div className="space-y-6">
      {/* Debug Panel */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-yellow-800">
            <div className="flex items-center gap-2">
              <Bug className="w-5 h-5" />
              Trends Chart Debug Information
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
                <h4 className="font-semibold text-gray-800 mb-2">Raw Data Summary:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Oura Data ({ouraData.length} entries):</strong>
                    <div className="text-xs bg-gray-100 p-2 rounded mt-1 max-h-32 overflow-y-auto">
                      {ouraData.slice(0, 5).map((item, i) => (
                        <div key={i}>
                          {i + 1}. Date: {item.date}, Sleep: {item.sleep_score}, Activity: {item.activity_score}, ID: {item.id}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <strong>Lifestyle Data ({lifestyleData?.length || 0} entries):</strong>
                    <div className="text-xs bg-gray-100 p-2 rounded mt-1 max-h-32 overflow-y-auto">
                      {lifestyleData?.slice(0, 5).map((item, i) => (
                        <div key={i}>
                          {i + 1}. Date: {item.date}, Caffeine: {item.caffeine_servings}, Stress: {item.stress_level}, ID: {item.id}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Processed Chart Data (First 5):</h4>
                <div className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">
                  <pre>{JSON.stringify(ouraChartData.slice(0, 5), null, 2)}</pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Combined Data (First 5):</h4>
                <div className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">
                  <pre>{JSON.stringify(combinedData.slice(0, 5), null, 2)}</pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Date Processing Check:</h4>
                <div className="text-sm space-y-1">
                  <div>Original dates: {ouraData.slice(0, 3).map(d => d.date).join(', ')}</div>
                  <div>After reverse(): {ouraData.slice().reverse().slice(0, 3).map(d => d.date).join(', ')}</div>
                  <div>After formatDate(): {ouraChartData.slice(0, 3).map(d => d.date).join(', ')}</div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Health Scores Trend */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Health Scores Trend ({ouraChartData.length} Days)
          </CardTitle>
          <div className="text-sm text-gray-500">
            Showing data from {ouraChartData[0]?.originalDate} to {ouraChartData[ouraChartData.length - 1]?.originalDate}
          </div>
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
                labelFormatter={(value, payload) => {
                  const dataPoint = payload?.[0]?.payload;
                  return `${value} (${dataPoint?.originalDate})`;
                }}
                formatter={(value, name, props) => {
                  return [value, name, `Debug: ${props.payload?.debugInfo}`];
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

      {/* Data Table for Manual Verification */}
      {showDebug && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Chart Data Table (for verification)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Display Date</th>
                    <th className="text-left p-2">Original Date</th>
                    <th className="text-left p-2">Sleep Score</th>
                    <th className="text-left p-2">Activity Score</th>
                    <th className="text-left p-2">Readiness Score</th>
                    <th className="text-left p-2">Caffeine</th>
                    <th className="text-left p-2">Debug Info</th>
                  </tr>
                </thead>
                <tbody>
                  {combinedData.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{item.date}</td>
                      <td className="p-2">{item.originalDate}</td>
                      <td className="p-2">{item.sleepScore}</td>
                      <td className="p-2">{item.activityScore}</td>
                      <td className="p-2">{item.readinessScore}</td>
                      <td className="p-2">{item.caffeineServings}</td>
                      <td className="p-2 max-w-xs truncate">{item.debugInfo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lifestyle Factors */}
      {lifestyleChartData.length > 0 && (
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
                  labelFormatter={(value, payload) => {
                    const dataPoint = payload?.[0]?.payload;
                    return `${value} (${dataPoint?.originalDate})`;
                  }}
                />
                <Bar yAxisId="servings" dataKey="caffeineServings" fill="#f59e0b" name="Caffeine Servings" />
                <Bar yAxisId="servings" dataKey="alcoholServings" fill="#dc2626" name="Alcohol Servings" />
                <Line yAxisId="stress" type="monotone" dataKey="stressLevel" stroke="#8b5cf6" strokeWidth={2} name="Stress Level" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};