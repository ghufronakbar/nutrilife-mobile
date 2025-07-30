export interface GetProfileResponse {
  id: string;
  email: string;
  password: string;
  name: string;
  picture: string | null;
  dateOfBirth: string;
  gender: string;
  userPreferences: UserPreference[];
  accessToken: string;
}

export interface UserPreference {
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
  endedAt: any;
  appActivityLevel: AppActivityLevel;
  appPrimaryGoal: AppPrimaryGoal;
  foodLogs: any[];
}

export interface AppActivityLevel {
  id: string;
  name: string;
  description: string;
  weight: number;
}

export interface AppPrimaryGoal {
  id: string;
  name: string;
  weight: number;
}
