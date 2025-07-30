export interface GetSuggestedResponse {
  day: number;
  dayName: string;
  types: Type[];
}

export interface Type {
  type: string;
  time: string;
  menus: Menu[];
}

export interface Menu {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}
