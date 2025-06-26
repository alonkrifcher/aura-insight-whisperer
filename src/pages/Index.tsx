
import { useState } from "react";
import { HealthDashboard } from "@/components/HealthDashboard";
import { DataInputPanel } from "@/components/DataInputPanel";
import { TrendsChart } from "@/components/TrendsChart";
import { AIInsights } from "@/components/AIInsights";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Activity, BarChart3, Brain, Plus, LogOut, User } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4 py-6">
          <header className="text-center mb-8">
            <div className="flex items-center justify-between mb-4">
              <div></div>
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  Oura Health Optimizer
                </h1>
                <p className="text-gray-600">
                  Track, analyze, and optimize your wellness journey
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user?.email}</span>
                </div>
                <Button 
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </header>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6 bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="dashboard" className="flex items-center gap-2 text-sm">
                <Activity className="w-4 h-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="input" className="flex items-center gap-2 text-sm">
                <Plus className="w-4 h-4" />
                Add Data
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-2 text-sm">
                <BarChart3 className="w-4 h-4" />
                Trends
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2 text-sm">
                <Brain className="w-4 h-4" />
                AI Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <HealthDashboard />
            </TabsContent>

            <TabsContent value="input" className="space-y-6">
              <DataInputPanel />
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <TrendsChart />
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <AIInsights />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Index;
