export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      lifestyle_data: {
        Row: {
          alcohol_servings: number | null
          caffeine_servings: number | null
          date: string | null
          id: string
          last_alcoholic_drink: string | null
          last_food: string | null
          screentime_end: string | null
          sleep_aids: string[] | null
          stress_level: number | null
          user_id: string
        }
        Insert: {
          alcohol_servings?: number | null
          caffeine_servings?: number | null
          date?: string | null
          id?: string
          last_alcoholic_drink?: string | null
          last_food?: string | null
          screentime_end?: string | null
          sleep_aids?: string[] | null
          stress_level?: number | null
          user_id: string
        }
        Update: {
          alcohol_servings?: number | null
          caffeine_servings?: number | null
          date?: string | null
          id?: string
          last_alcoholic_drink?: string | null
          last_food?: string | null
          screentime_end?: string | null
          sleep_aids?: string[] | null
          stress_level?: number | null
          user_id?: string
        }
        Relationships: []
      }
      oura_data: {
        Row: {
          active_calories: number | null
          activity_balance: number | null
          activity_score: number | null
          average_breath: number | null
          average_heart_rate: number | null
          average_hrv: number | null
          awake_time: number | null
          bedtime_end: string | null
          bedtime_start: string | null
          body_temperature_contrib: number | null
          created_at: string | null
          date: string | null
          deep_sleep_duration: number | null
          equivalent_walking_distance: number | null
          high_activity_time: number | null
          hrv_balance: number | null
          id: string
          light_sleep_duration: number | null
          low_activity_time: number | null
          lowest_heart_rate: number | null
          medium_activity_time: number | null
          non_wear_time: number | null
          previous_day_activity: number | null
          previous_night: number | null
          readiness_score: number | null
          recovery_index: number | null
          rem_sleep_duration: number | null
          resting_heart_rate: number | null
          resting_heart_rate_contrib: number | null
          restless_periods: number | null
          sleep_balance: number | null
          sleep_efficiency: number | null
          sleep_latency: number | null
          sleep_score: number | null
          steps: number | null
          temperature_deviation: number | null
          temperature_trend_deviation: number | null
          time_in_bed: number | null
          total_calories: number | null
          total_sleep_duration: number | null
          user_id: string
        }
        Insert: {
          active_calories?: number | null
          activity_balance?: number | null
          activity_score?: number | null
          average_breath?: number | null
          average_heart_rate?: number | null
          average_hrv?: number | null
          awake_time?: number | null
          bedtime_end?: string | null
          bedtime_start?: string | null
          body_temperature_contrib?: number | null
          created_at?: string | null
          date?: string | null
          deep_sleep_duration?: number | null
          equivalent_walking_distance?: number | null
          high_activity_time?: number | null
          hrv_balance?: number | null
          id?: string
          light_sleep_duration?: number | null
          low_activity_time?: number | null
          lowest_heart_rate?: number | null
          medium_activity_time?: number | null
          non_wear_time?: number | null
          previous_day_activity?: number | null
          previous_night?: number | null
          readiness_score?: number | null
          recovery_index?: number | null
          rem_sleep_duration?: number | null
          resting_heart_rate?: number | null
          resting_heart_rate_contrib?: number | null
          restless_periods?: number | null
          sleep_balance?: number | null
          sleep_efficiency?: number | null
          sleep_latency?: number | null
          sleep_score?: number | null
          steps?: number | null
          temperature_deviation?: number | null
          temperature_trend_deviation?: number | null
          time_in_bed?: number | null
          total_calories?: number | null
          total_sleep_duration?: number | null
          user_id: string
        }
        Update: {
          active_calories?: number | null
          activity_balance?: number | null
          activity_score?: number | null
          average_breath?: number | null
          average_heart_rate?: number | null
          average_hrv?: number | null
          awake_time?: number | null
          bedtime_end?: string | null
          bedtime_start?: string | null
          body_temperature_contrib?: number | null
          created_at?: string | null
          date?: string | null
          deep_sleep_duration?: number | null
          equivalent_walking_distance?: number | null
          high_activity_time?: number | null
          hrv_balance?: number | null
          id?: string
          light_sleep_duration?: number | null
          low_activity_time?: number | null
          lowest_heart_rate?: number | null
          medium_activity_time?: number | null
          non_wear_time?: number | null
          previous_day_activity?: number | null
          previous_night?: number | null
          readiness_score?: number | null
          recovery_index?: number | null
          rem_sleep_duration?: number | null
          resting_heart_rate?: number | null
          resting_heart_rate_contrib?: number | null
          restless_periods?: number | null
          sleep_balance?: number | null
          sleep_efficiency?: number | null
          sleep_latency?: number | null
          sleep_score?: number | null
          steps?: number | null
          temperature_deviation?: number | null
          temperature_trend_deviation?: number | null
          time_in_bed?: number | null
          total_calories?: number | null
          total_sleep_duration?: number | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
