
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Lightbulb, TrendingUp, AlertCircle, CheckCircle, Coffee, Wine, Smartphone, Moon } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useEnhancedOuraData, useEnhancedLifestyleData } from "@/hooks/useOuraData";

export const AIInsights = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { data: ouraData } = useEnhancedOuraData();
  const { data: lifestyleData } = useEnhancedLifestyleData();

  // Calculate insights based on actual data
  const generateInsights = () => {
    if (!ouraData || !lifestyleData) return [];

    const insights = [];
    const recentOura = ouraData.slice(0, 7);
    const recentLifestyle = lifestyleData.slice(0, 7);

    // Sleep consistency analysis
    const sleepScores = recentOura.map(d => d.sleep_score).filter(s => s !== null);
    if (sleepScores.length > 0) {
      const avgSleepScore = sleepScores.reduce((a, b) => a + b, 0) / sleepScores.length;
      const sleepVariation = Math.max(...sleepScores) - Math.min(...sleepScores);
      
      if (avgSleepScore >= 85) {
        insights.push({
          type: "positive",
          icon: CheckCircle,
          title: "Excellent Sleep Performance",
          description: `Your average sleep score of ${Math.round(avgSleepScore)} over the past week shows you're getting quality rest consistently.`,
          priority: "low"
        });
      } else if (sleepVariation > 20) {
        insights.push({
          type: "warning",
          icon: AlertCircle,
          title: "Inconsistent Sleep Quality",
          description: `Your sleep scores vary by ${sleepVariation} points. Try maintaining a consistent bedtime routine for better sleep stability.`,
          priority: "medium"
        });
      }
    }

    // Caffeine impact analysis
    const caffeineData = recentLifestyle.map(d => ({
      caffeine: d.caffeine_servings || 0,
      sleepScore: recentOura.find(o => o.date === d.date)?.sleep_score || 0
    })).filter(d => d.sleepScore > 0);

    if (caffeineData.length >= 3) {
      const highCaffeineDays = caffeineData.filter(d => d.caffeine >= 3);
      const lowCaffeineDays = caffeineData.filter(d => d.caffeine <= 1);
      
      if (highCaffeineDays.length > 0 && lowCaffeineDays.length > 0) {
        const highCaffeineAvgSleep = highCaffeineDays.reduce((a, b) => a + b.sleepScore, 0) / highCaffeineDays.length;
        const lowCaffeineAvgSleep = lowCaffeineDays.reduce((a, b) => a + b.sleepScore, 0) / lowCaffeineDays.length;
        
        if (lowCaffeineAvgSleep - highCaffeineAvgSleep > 5) {
          insights.push({
            type: "warning",
            icon: AlertCircle,
            title: "Caffeine May Be Affecting Sleep",
            description: `Your sleep scores are ${Math.round(lowCaffeineAvgSleep - highCaffeineAvgSleep)} points higher on low-caffeine days. Consider reducing afternoon caffeine intake.`,
            priority: "medium"
          });
        }
      }
    }

    // Alcohol impact analysis
    const alcoholData = recentLifestyle.map(d => ({
      alcohol: d.alcohol_servings || 0,
      sleepScore: recentOura.find(o => o.date === d.date)?.sleep_score || 0,
      sleepEfficiency: recentOura.find(o => o.date === d.date)?.sleep_efficiency || 0
    })).filter(d => d.sleepScore > 0);

    if (alcoholData.some(d => d.alcohol > 0)) {
      const alcoholDays = alcoholData.filter(d => d.alcohol > 0);
      const noAlcoholDays = alcoholData.filter(d => d.alcohol === 0);
      
      if (alcoholDays.length > 0 && noAlcoholDays.length > 0) {
        const alcoholAvgEfficiency = alcoholDays.reduce((a, b) => a + b.sleepEfficiency, 0) / alcoholDays.length;
        const noAlcoholAvgEfficiency = noAlcoholDays.reduce((a, b) => a + b.sleepEfficiency, 0) / noAlcoholDays.length;
        
        if (noAlcoholAvgEfficiency - alcoholAvgEfficiency > 5) {
          insights.push({
            type: "warning",
            icon: AlertCircle,
            title: "Alcohol Impacting Sleep Quality",
            description: `Your sleep efficiency is ${Math.round(noAlcoholAvgEfficiency - alcoholAvgEfficiency)}% better on alcohol-free nights. Consider limiting evening alcohol consumption.`,
            priority: "medium"
          });
        }
      }
    }

    // Stress level analysis
    const stressLevels = recentLifestyle.map(d => d.stress_level).filter(s => s !== null);
    if (stressLevels.length > 0) {
      const avgStress = stressLevels.reduce((a, b) => a + b, 0) / stressLevels.length;
      
      if (avgStress >= 7) {
        insights.push({
          type: "warning",
          icon: AlertCircle,
          title: "Elevated Stress Levels",
          description: `Your average stress level of ${avgStress.toFixed(1)}/10 is high. Consider stress management techniques like meditation or exercise.`,
          priority: "high"
        });
      } else if (avgStress <= 3) {
        insights.push({
          type: "positive",
          icon: CheckCircle,
          title: "Well-Managed Stress Levels",
          description: `Your average stress level of ${avgStress.toFixed(1)}/10 shows excellent stress management. Keep up the good work!`,
          priority: "low"
        });
      }
    }

    // Screen time analysis
    const screenTimeData = recentLifestyle.filter(d => d.screentime_end).map(d => {
      const screenEndTime = d.screentime_end;
      const bedtime = recentOura.find(o => o.date === d.date)?.bedtime_start;
      const sleepScore = recentOura.find(o => o.date === d.date)?.sleep_score || 0;
      
      return { screenEndTime, bedtime, sleepScore };
    }).filter(d => d.sleepScore > 0);

    if (screenTimeData.length >= 2) {
      const avgSleepScore = screenTimeData.reduce((a, b) => a + b.sleepScore, 0) / screenTimeData.length;
      
      insights.push({
        type: "suggestion",
        icon: Lightbulb,
        title: "Screen Time Management",
        description: `You're tracking screen end times. Consider ending screen use 2+ hours before bed for optimal sleep quality.`,
        priority: "medium"
      });
    }

    // Sleep aids analysis
    const sleepAidsData = recentLifestyle.filter(d => d.sleep_aids && d.sleep_aids.length > 0);
    if (sleepAidsData.length > 0) {
      insights.push({
        type: "suggestion",
        icon: Lightbulb,
        title: "Sleep Aid Usage Patterns",
        description: `You've used sleep aids on ${sleepAidsData.length} days recently. Consider tracking if they correlate with better sleep scores.`,
        priority: "low"
      });
    }

    return insights.length > 0 ? insights : [
      {
        type: "suggestion",
        icon: Lightbulb,
        title: "Start Tracking More Data",
        description: "Add more lifestyle data points to get personalized insights about what affects your sleep and recovery.",
        priority: "low"
      }
    ];
  };

  const handleGenerateInsights = async () => {
    setIsGenerating(true);
    // Simulate AI analysis
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "AI Analysis Complete!",
        description: "Your personalized insights have been updated based on your recent data.",
      });
    }, 2000);
  };

  const insights = generateInsights();

  const recommendations = [
    {
      category: "Sleep Optimization",
      suggestions: [
        "Maintain consistent bedtime within 30 minutes each night",
        "Limit caffeine intake after 2 PM for better sleep quality", 
        "Create a 2-hour wind-down routine before bed",
        "Track your optimal sleep duration (usually 7-9 hours)"
      ]
    },
    {
      category: "Lifestyle Balance",
      suggestions: [
        "Monitor alcohol's impact on sleep efficiency",
        "Practice stress management when levels exceed 6/10",
        "End screen time 2+ hours before bedtime",
        "Note how different foods affect your sleep timing"
      ]
    },
    {
      category: "Recovery Enhancement", 
      suggestions: [
        "Use sleep aids mindfully and track effectiveness",
        "Pay attention to temperature and HRV patterns",
        "Balance high and low activity days based on readiness",
        "Consider meditation on high-stress days"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* AI Analysis Header */}
      <Card className="bg-gradient-to-r from-purple-100 to-blue-100 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
              <Brain className="w-6 h-6 text-purple-600" />
              AI Health Analysis
            </div>
            <Button 
              onClick={handleGenerateInsights}
              disabled={isGenerating}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isGenerating ? "Analyzing..." : "Refresh Analysis"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            Based on your recent Oura data and lifestyle tracking, here are personalized insights and recommendations.
          </p>
          {ouraData && lifestyleData && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/60 p-3 rounded-lg text-center">
                <div className="text-sm text-gray-600">Days Analyzed</div>
                <div className="text-lg font-bold text-purple-600">{Math.min(ouraData.length, 7)}</div>
              </div>
              <div className="bg-white/60 p-3 rounded-lg text-center">
                <div className="text-sm text-gray-600">Lifestyle Entries</div>
                <div className="text-lg font-bold text-blue-600">{lifestyleData.length}</div>
              </div>
              <div className="bg-white/60 p-3 rounded-lg text-center">
                <div className="text-sm text-gray-600">Insights Found</div>
                <div className="text-lg font-bold text-green-600">{insights.length}</div>
              </div>
              <div className="bg-white/60 p-3 rounded-lg text-center">
                <div className="text-sm text-gray-600">Data Quality</div>
                <div className="text-lg font-bold text-orange-600">
                  {lifestyleData.length >= 5 ? "Good" : "Growing"}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Key Insights */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Personalized Insights
        </h2>
        
        {insights.map((insight, index) => {
          const IconComponent = insight.icon;
          const priorityColors = {
            low: "bg-green-100 text-green-800",
            medium: "bg-yellow-100 text-yellow-800", 
            high: "bg-red-100 text-red-800"
          };

          return (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <IconComponent className={`w-6 h-6 mt-1 ${
                    insight.type === 'positive' ? 'text-green-600' : 
                    insight.type === 'warning' ? 'text-yellow-600' : 
                    'text-blue-600'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">{insight.title}</h3>
                      <Badge className={priorityColors[insight.priority]}>
                        {insight.priority} priority
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm">{insight.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Evidence-Based Recommendations
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((rec, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  {rec.category === "Sleep Optimization" && <Moon className="w-4 h-4 text-blue-600" />}
                  {rec.category === "Lifestyle Balance" && <Coffee className="w-4 h-4 text-amber-600" />}
                  {rec.category === "Recovery Enhancement" && <Brain className="w-4 h-4 text-purple-600" />}
                  {rec.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {rec.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Data Correlation Preview */}
      {ouraData && lifestyleData && lifestyleData.length >= 3 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Quick Correlation Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-amber-50 rounded-lg">
                <Coffee className="w-5 h-5 text-amber-600 mx-auto mb-2" />
                <div className="text-xs text-gray-600">Avg Caffeine</div>
                <div className="text-lg font-bold text-amber-600">
                  {(lifestyleData.reduce((sum, d) => sum + (d.caffeine_servings || 0), 0) / lifestyleData.length).toFixed(1)}
                </div>
              </div>
              
              <div className="p-3 bg-red-50 rounded-lg">
                <Wine className="w-5 h-5 text-red-600 mx-auto mb-2" />
                <div className="text-xs text-gray-600">Avg Alcohol</div>
                <div className="text-lg font-bold text-red-600">
                  {(lifestyleData.reduce((sum, d) => sum + (d.alcohol_servings || 0), 0) / lifestyleData.length).toFixed(1)}
                </div>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-lg">
                <Brain className="w-5 h-5 text-purple-600 mx-auto mb-2" />
                <div className="text-xs text-gray-600">Avg Stress</div>
                <div className="text-lg font-bold text-purple-600">
                  {(lifestyleData.filter(d => d.stress_level).reduce((sum, d) => sum + (d.stress_level || 0), 0) / 
                    lifestyleData.filter(d => d.stress_level).length || 0).toFixed(1)}/10
                </div>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg">
                <Moon className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                <div className="text-xs text-gray-600">Avg Sleep Score</div>
                <div className="text-lg font-bold text-blue-600">
                  {Math.round(ouraData.filter(d => d.sleep_score).reduce((sum, d) => sum + (d.sleep_score || 0), 0) / 
                    ouraData.filter(d => d.sleep_score).length || 0)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
