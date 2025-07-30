export interface PostLoginRequest {
  email: string;
  password: string;
}

export interface PostLoginResponse {
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
  endedAt: string | null;
}
