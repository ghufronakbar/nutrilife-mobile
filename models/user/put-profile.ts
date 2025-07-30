export interface PutProfileRequest {
  name: string;
  picture: string | null;
  email: string;
}

export interface PutProfileResponse {
  id: string;
  email: string;
  password: string;
  name: string;
  picture: any;
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
}
