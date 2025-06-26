import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coffee, Save, CalendarIcon } from "lucide-react";
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
  const [caffeineServings, setCaffeineServings] = useState("");
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

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save data.",
        variant: "destructive",
      });
      return;
    }

    if (!caffeineServings || !selectedDate) {
      toast({
        title: "Missing Data",
        description: "Please fill in all fields before saving.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('lifestyle_data')
        .upsert({
          user_id: user.id,
          date: format(selectedDate, 'yyyy-MM-dd'),
          caffeine_servings: parseInt(caffeineServings),
        }, {
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
      setSelectedDate(getYesterday());
      
      // Refresh the data
      queryClient.invalidateQueries({ queryKey: ['lifestyle-data'] });
      
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
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Oura Sync Component */}
      <OuraSync />

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <Coffee className="w-5 h-5 text-amber-600" />
            Lifestyle Data Entry
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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

          <div className="space-y-2">
            <Label htmlFor="caffeine">Caffeine servings consumed</Label>
            <Input
              id="caffeine"
              type="number"
              placeholder="e.g., 3"
              value={caffeineServings}
              onChange={(e) => setCaffeineServings(e.target.value)}
              className="text-lg"
            />
            <p className="text-sm text-gray-500">
              Count cups of coffee, cans of energy drinks, etc.
            </p>
          </div>

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
