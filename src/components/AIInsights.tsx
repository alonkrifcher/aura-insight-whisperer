
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Lightbulb, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export const AIInsights = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateInsights = async () => {
    setIsGenerating(true);
    // Simulate AI analysis
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "AI Analysis Complete!",
        description: "Your personalized insights have been updated.",
      });
    }, 2000);
  };

  const insights = [
    {
      type: "positive",
      icon: CheckCircle,
      title: "Excellent Sleep Consistency",
      description: "Your sleep schedule has been consistent for the past week, with bedtime varying by only 30 minutes. This stability is contributing to your high sleep scores.",
      priority: "low"
    },
    {
      type: "warning",
      icon: AlertCircle,
      title: "Caffeine Impact on Sleep",
      description: "Analysis shows caffeine intake above 200mg correlates with 15% lower sleep scores. Consider reducing afternoon caffeine or cutting off earlier.",
      priority: "medium"
    },
    {
      type: "suggestion",
      icon: Lightbulb,
      title: "Optimize Phone Cutoff Time",
      description: "Your best sleep scores occur when you stop using your phone 2+ hours before bed. Your current average is 1.2 hours - try extending this.",
      priority: "high"
    }
  ];

  const recommendations = [
    {
      category: "Sleep Optimization",
      suggestions: [
        "Maintain current bedtime routine (9:30-10:00 PM)",
        "Reduce evening caffeine intake by 50mg",
        "Implement 2-hour phone-free buffer before sleep"
      ]
    },
    {
      category: "Activity Enhancement",
      suggestions: [
        "Add 10-minute morning walk to boost readiness score",
        "Schedule activity breaks during low-energy periods (2-4 PM)",
        "Aim for 8,500+ steps on rest days"
      ]
    },
    {
      category: "Recovery Focus",
      suggestions: [
        "Practice deep breathing when stress level > 6",
        "Consider meditation on high-stress days",
        "Plan active recovery on low readiness days"
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
            Based on your last 7 days of data, here are personalized insights and recommendations to optimize your health and wellness.
          </p>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Key Insights
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
          Personalized Recommendations
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((rec, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
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
    </div>
  );
};
