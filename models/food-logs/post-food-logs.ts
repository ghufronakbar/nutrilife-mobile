export interface PostFoodLogsRequest {
  id: string;
  type: "food" | "menu";
  portions: number;
}

export interface PostFoodLogsResponse {
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
