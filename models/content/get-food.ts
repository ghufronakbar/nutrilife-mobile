export interface GetFoodResponse {
  foods: AppFood[];
  menus: AppFood[];
}

export interface AppFood {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  type: 'food' | 'menu';
}
