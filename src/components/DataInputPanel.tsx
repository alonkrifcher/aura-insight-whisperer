import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Coffee, Smartphone, Target, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { OuraSync } from "./OuraSync";

export const DataInputPanel = () => {
  const [caffeineIntake, setCaffeineIntake] = useState("");
  const [phoneCutoffTime, setPhoneCutoffTime] = useState("");
  const [stressLevel, setStressLevel] = useState([5]);
  const [sleepGoal, setSleepGoal] = useState("");

  const handleSave = () => {
    // In a real app, this would save to your backend
    toast({
      title: "Data Saved!",
      description: "Your lifestyle data has been recorded successfully.",
    });
    
    // Reset form
    setCaffeineIntake("");
    setPhoneCutoffTime("");
    setStressLevel([5]);
    setSleepGoal("");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Oura Sync Component */}
      <OuraSync />

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <Coffee className="w-5 h-5 text-amber-600" />
            Caffeine Intake
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="caffeine">Total caffeine consumed today (mg)</Label>
            <Input
              id="caffeine"
              type="number"
              placeholder="e.g., 200"
              value={caffeineIntake}
              onChange={(e) => setCaffeineIntake(e.target.value)}
              className="text-lg"
            />
            <p className="text-sm text-gray-500">
              For reference: Coffee (95mg), Tea (25mg), Energy drink (80mg)
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <Smartphone className="w-5 h-5 text-blue-600" />
            Phone Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="phone-cutoff">Time you stopped using your phone</Label>
            <Input
              id="phone-cutoff"
              type="time"
              value={phoneCutoffTime}
              onChange={(e) => setPhoneCutoffTime(e.target.value)}
              className="text-lg"
            />
            <p className="text-sm text-gray-500">
              This helps analyze how screen time affects your sleep quality
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <Target className="w-5 h-5 text-purple-600" />
            Wellness Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Stress Level (1-10)</Label>
              <div className="mt-2 mb-4">
                <Slider
                  value={stressLevel}
                  onValueChange={setStressLevel}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>Very Low</span>
                  <span className="font-medium text-purple-600">{stressLevel[0]}</span>
                  <span>Very High</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sleep-goal">Sleep Goal (hours)</Label>
              <Input
                id="sleep-goal"
                type="number"
                step="0.5"
                placeholder="e.g., 8"
                value={sleepGoal}
                onChange={(e) => setSleepGoal(e.target.value)}
                className="text-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={handleSave} 
        className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <Save className="w-5 h-5 mr-2" />
        Save Today's Data
      </Button>
    </div>
  );
};
