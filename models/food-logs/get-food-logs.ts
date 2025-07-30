export interface GetFoodLogsResponse {
  date: string;
  foods: Food[];
}

export interface Food {
  id: string;
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  size: number;
  portions: number;
  userPreferencesId: string;
  createdAt: string;
  updatedAt: string;
}
