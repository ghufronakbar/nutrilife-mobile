export interface PostRegisterRequest {
  personalInformation: PersonalInformation;
  physicalStats: PhysicalStats;
  lifestyle: Lifestyle;
}

export interface PersonalInformation {
  email: string;
  password: string;
  name: string;
  dateOfBirth: string;
  gender: string;
}

export interface PhysicalStats {
  weight: number;
  height: number;
}

export interface Lifestyle {
  activityLevelId: string;
  primaryGoalId: string;
}

export interface PostRegisterResponse {
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
