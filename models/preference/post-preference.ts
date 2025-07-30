export interface PostPreferenceRequest {
  weight: number;
  height: number;
  activityLevelId: string;
  primaryGoalId: string;
}

export interface PostPreferenceResponse {
  id: string;
  userId: string;
  bmr: number;
  tdee: number;
  dailyCalories: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
  weight: number;
  height: number;
  appPrimaryGoalId: string;
  appActivityLevelId: string;
  startedAt: string;
  endedAt: string | null;
}
