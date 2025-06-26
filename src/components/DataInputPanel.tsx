import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Coffee, Save, CalendarIcon, Wine, Smartphone, Utensils, Pill, Brain } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { OuraSync } from "./OuraSync";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

export const DataInputPanel = () => {
  // Form state
  const [caffeineServings, setCaffeineServings] = useState("");
  const [alcoholServings, setAlcoholServings] = useState("");
  const [lastAlcoholicDrink, setLastAlcoholicDrink] = useState("");
  const [screentimeEnd, setScreentimeEnd] = useState("");
  const [lastFood, setLastFood] = useState("");
  const [sleepAids, setSleepAids] = useState<string[]>([]);
  const [stressLevel, setStressLevel] = useState([5]);
  
  // Default to yesterday's date
  const getYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  };
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(getYesterday());
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const sleepAidOptions = [
    { id: "xanax", label: "Xanax" },
    { id: "melatonin", label: "Melatonin" },
    { id: "unisom", label: "Unisom" }
  ];

  const handleSleepAidChange = (aidId: string, checked: boolean) => {
    if (checked) {
      setSleepAids(prev => [...prev, aidId]);
    } else {
      setSleepAids(prev => prev.filter(aid => aid !== aidId));
    }
  };

  const validateTimeFormat = (time: string) => {
    if (!time) return true; // Empty is valid
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save data.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDate) {
      toast({
        title: "Missing Data",
        description: "Please select a date.",
        variant: "destructive",
      });
      return;
    }

    // Validate time inputs
    if (!validateTimeFormat(lastAlcoholicDrink)) {
      toast({
        title: "Invalid Time",
        description: "Please enter last alcoholic drink time in HH:MM format (e.g., 20:30).",
        variant: "destructive",
      });
      return;
    }

    if (!validateTimeFormat(screentimeEnd)) {
      toast({
        title: "Invalid Time",
        description: "Please enter screentime end in HH:MM format (e.g., 22:30).",
        variant: "destructive",
      });
      return;
    }

    if (!validateTimeFormat(lastFood)) {
      toast({
        title: "Invalid Time",
        description: "Please enter last food time in HH:MM format (e.g., 19:45).",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const lifestyleData = {
        user_id: user.id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        caffeine_servings: caffeineServings ? parseInt(caffeineServings) : null,
        alcohol_servings: alcoholServings ? parseInt(alcoholServings) : null,
        last_alcoholic_drink: lastAlcoholicDrink || null,
        screentime_end: screentimeEnd || null,
        last_food: lastFood || null,
        sleep_aids: sleepAids.length > 0 ? sleepAids : null,
        stress_level: stressLevel[0],
      };

      const { error } = await supabase
        .from('lifestyle_data')
        .upsert(lifestyleData, {
          onConflict: 'user_id,date'
        });

      if (error) {
        console.error('Save error:', error);
        toast({
          title: "Save Failed",
          description: "Failed to save your data. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Data Saved!",
        description: "Your lifestyle data has been recorded successfully.",
      });
      
      // Reset form - keep yesterday as default
      setCaffeineServings("");
      setAlcoholServings("");
      setLastAlcoholicDrink("");
      setScreentimeEnd("");
      setLastFood("");
      setSleepAids([]);
      setStressLevel([5]);
      setSelectedDate(getYesterday());
      
      // Refresh the data
      queryClient.invalidateQueries({ queryKey: ['lifestyle-data'] });
      queryClient.invalidateQueries({ queryKey: ['enhanced-lifestyle-data'] });
      
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Save Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Oura Sync Component */}
      <OuraSync />

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <Coffee className="w-5 h-5 text-amber-600" />
            Enhanced Lifestyle Data Entry
          </CardTitle>
          <p className="text-gray-600">
            Track the lifestyle factors that impact your sleep and recovery
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <p className="text-sm text-gray-500">
              Defaults to yesterday - track the lifestyle factors from the previous day.
            </p>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Caffeine */}
            <div className="space-y-2">
              <Label htmlFor="caffeine" className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-amber-600" />
                Caffeine servings
              </Label>
              <Input
                id="caffeine"
                type="number"
                placeholder="e.g., 3"
                value={caffeineServings}
                onChange={(e) => setCaffeineServings(e.target.value)}
                min="0"
                max="20"
              />
              <p className="text-xs text-gray-500">
                Count cups of coffee, cans of energy drinks, etc.
              </p>
            </div>

            {/* Alcohol */}
            <div className="space-y-2">
              <Label htmlFor="alcohol" className="flex items-center gap-2">
                <Wine className="w-4 h-4 text-red-600" />
                Alcohol servings
              </Label>
              <Input
                id="alcohol"
                type="number"
                placeholder="e.g., 2"
                value={alcoholServings}
                onChange={(e) => setAlcoholServings(e.target.value)}
                min="0"
                max="20"
              />
              <p className="text-xs text-gray-500">
                Standard drinks (12oz beer, 5oz wine, 1.5oz spirits)
              </p>
            </div>

            {/* Last Alcoholic Drink */}
            <div className="space-y-2">
              <Label htmlFor="lastDrink" className="flex items-center gap-2">
                <Wine className="w-4 h-4 text-red-600" />
                Last alcoholic drink
              </Label>
              <Input
                id="lastDrink"
                type="time"
                value={lastAlcoholicDrink}
                onChange={(e) => setLastAlcoholicDrink(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Time of your last alcoholic drink
              </p>
            </div>

            {/* Screentime End */}
            <div className="space-y-2">
              <Label htmlFor="screentime" className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-blue-600" />
                Screentime end
              </Label>
              <Input
                id="screentime"
                type="time"
                value={screentimeEnd}
                onChange={(e) => setScreentimeEnd(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                When did you stop using screens/devices?
              </p>
            </div>

            {/* Last Food */}
            <div className="space-y-2">
              <Label htmlFor="lastFood" className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-green-600" />
                Last food
              </Label>
              <Input
                id="lastFood"
                type="time"
                value={lastFood}
                onChange={(e) => setLastFood(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Time of your last meal/snack
              </p>
            </div>

            {/* Stress Level */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-600" />
                Stress level: {stressLevel[0]}
              </Label>
              <div className="px-2">
                <Slider
                  value={stressLevel}
                  onValueChange={setStressLevel}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 (Very low)</span>
                  <span>10 (Very high)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sleep Aids */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-indigo-600" />
              Sleep aids taken
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sleepAidOptions.map((aid) => (
                <div key={aid.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={aid.id}
                    checked={sleepAids.includes(aid.id)}
                    onCheckedChange={(checked) => 
                      handleSleepAidChange(aid.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={aid.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {aid.label}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              Select all sleep aids you took yesterday
            </p>
          </div>

          {/* Save Button */}
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Save className="w-5 h-5 mr-2" />
            {isSaving ? "Saving..." : "Save Yesterday's Data"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};