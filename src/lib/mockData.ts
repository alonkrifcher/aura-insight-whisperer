
export interface OuraData {
  date: string;
  sleepScore: number;
  activityScore: number;
  readinessScore: number;
  sleepDuration: number;
  steps: number;
  hrv: number;
  restingHeartRate: number;
  bodyTemperature: number;
  caffeineIntake: number;
  phoneCutoffTime: string;
  stressLevel: number;
}

export const mockOuraData: OuraData[] = [
  {
    date: "Today",
    sleepScore: 85,
    activityScore: 78,
    readinessScore: 82,
    sleepDuration: 7.5,
    steps: 9234,
    hrv: 45,
    restingHeartRate: 58,
    bodyTemperature: 36.2,
    caffeineIntake: 180,
    phoneCutoffTime: "21:30",
    stressLevel: 4
  },
  {
    date: "Dec 25",
    sleepScore: 92,
    activityScore: 65,
    readinessScore: 88,
    sleepDuration: 8.2,
    steps: 6543,
    hrv: 52,
    restingHeartRate: 55,
    bodyTemperature: 36.1,
    caffeineIntake: 120,
    phoneCutoffTime: "22:00",
    stressLevel: 3
  },
  {
    date: "Dec 24",
    sleepScore: 76,
    activityScore: 84,
    readinessScore: 75,
    sleepDuration: 6.8,
    steps: 12456,
    hrv: 38,
    restingHeartRate: 62,
    bodyTemperature: 36.3,
    caffeineIntake: 280,
    phoneCutoffTime: "23:15",
    stressLevel: 6
  },
  {
    date: "Dec 23",
    sleepScore: 88,
    activityScore: 91,
    readinessScore: 86,
    sleepDuration: 7.9,
    steps: 11234,
    hrv: 48,
    restingHeartRate: 57,
    bodyTemperature: 36.2,
    caffeineIntake: 150,
    phoneCutoffTime: "21:45",
    stressLevel: 3
  },
  {
    date: "Dec 22",
    sleepScore: 82,
    activityScore: 72,
    readinessScore: 79,
    sleepDuration: 7.3,
    steps: 8967,
    hrv: 43,
    restingHeartRate: 59,
    bodyTemperature: 36.1,
    caffeineIntake: 200,
    phoneCutoffTime: "22:30",
    stressLevel: 5
  },
  {
    date: "Dec 21",
    sleepScore: 79,
    activityScore: 88,
    readinessScore: 81,
    sleepDuration: 7.1,
    steps: 10876,
    hrv: 41,
    restingHeartRate: 60,
    bodyTemperature: 36.2,
    caffeineIntake: 240,
    phoneCutoffTime: "23:00",
    stressLevel: 4
  },
  {
    date: "Dec 20",
    sleepScore: 90,
    activityScore: 76,
    readinessScore: 87,
    sleepDuration: 8.1,
    steps: 7654,
    hrv: 49,
    restingHeartRate: 56,
    bodyTemperature: 36.1,
    caffeineIntake: 100,
    phoneCutoffTime: "21:00",
    stressLevel: 2
  }
];
