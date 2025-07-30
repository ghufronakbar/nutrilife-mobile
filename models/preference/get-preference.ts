export interface GetPreferenceResponse {
  preference: Preference;
  progress: Progress;
}

export interface Preference {
  bmr: number;
  tdee: number;
  dailyCalories: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
}

export interface Progress {
  calories: Calories;
  protein: Protein;
  carbs: Carbs;
  fat: Fat;
}

export interface Calories {
  current: number;
  need: number;
  percentage: number;
}

export interface Protein {
  current: number;
  need: number;
  percentage: number;
}

export interface Carbs {
  current: number;
  need: number;
  percentage: number;
}

export interface Fat {
  current: number;
  need: number;
  percentage: number;
}
