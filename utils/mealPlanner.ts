import { foodDatabase } from '@/data/foodDatabase';

interface User {
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
  goal: string;
}

interface Meal {
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
}

interface MealPlan {
  Breakfast: Meal[];
  Lunch: Meal[];
  Dinner: Meal[];
  Snack: Meal[];
}

export function getMealSuggestions(user: User): MealPlan {
  const targetCaloriesPerMeal = {
    Breakfast: Math.round(user.dailyCalories * 0.25),
    Lunch: Math.round(user.dailyCalories * 0.35),
    Dinner: Math.round(user.dailyCalories * 0.35),
    Snack: Math.round(user.dailyCalories * 0.05),
  };

  const mealSuggestions: MealPlan = {
    Breakfast: [
      {
        name: 'Protein Power Bowl',
        description: 'Greek yogurt with berries and almonds',
        calories: targetCaloriesPerMeal.Breakfast,
        protein: Math.round(user.dailyProtein * 0.25),
        carbs: Math.round(user.dailyCarbs * 0.25),
        fat: Math.round(user.dailyFat * 0.25),
        ingredients: ['Greek Yogurt', 'Blueberries', 'Almonds', 'Honey'],
      },
      {
        name: 'Muscle-Building Omelet',
        description: 'Three-egg omelet with spinach and cheese',
        calories: targetCaloriesPerMeal.Breakfast,
        protein: Math.round(user.dailyProtein * 0.25),
        carbs: Math.round(user.dailyCarbs * 0.25),
        fat: Math.round(user.dailyFat * 0.25),
        ingredients: ['Eggs', 'Spinach', 'Cheese', 'Bell Peppers'],
      },
      {
        name: 'Energy Oatmeal',
        description: 'Oatmeal with banana and peanut butter',
        calories: targetCaloriesPerMeal.Breakfast,
        protein: Math.round(user.dailyProtein * 0.25),
        carbs: Math.round(user.dailyCarbs * 0.25),
        fat: Math.round(user.dailyFat * 0.25),
        ingredients: ['Oatmeal', 'Banana', 'Peanut Butter', 'Chia Seeds'],
      },
    ],
    Lunch: [
      {
        name: 'Grilled Chicken Salad',
        description: 'Mixed greens with grilled chicken and avocado',
        calories: targetCaloriesPerMeal.Lunch,
        protein: Math.round(user.dailyProtein * 0.35),
        carbs: Math.round(user.dailyCarbs * 0.35),
        fat: Math.round(user.dailyFat * 0.35),
        ingredients: ['Chicken Breast', 'Mixed Greens', 'Avocado', 'Olive Oil'],
      },
      {
        name: 'Quinoa Power Bowl',
        description: 'Quinoa with roasted vegetables and salmon',
        calories: targetCaloriesPerMeal.Lunch,
        protein: Math.round(user.dailyProtein * 0.35),
        carbs: Math.round(user.dailyCarbs * 0.35),
        fat: Math.round(user.dailyFat * 0.35),
        ingredients: ['Quinoa', 'Salmon Fillet', 'Broccoli', 'Bell Peppers'],
      },
      {
        name: 'Mediterranean Wrap',
        description: 'Whole wheat wrap with hummus and vegetables',
        calories: targetCaloriesPerMeal.Lunch,
        protein: Math.round(user.dailyProtein * 0.35),
        carbs: Math.round(user.dailyCarbs * 0.35),
        fat: Math.round(user.dailyFat * 0.35),
        ingredients: ['Whole Wheat Bread', 'Chicken Breast', 'Spinach', 'Carrots'],
      },
    ],
    Dinner: [
      {
        name: 'Lean Beef & Sweet Potato',
        description: 'Grilled lean beef with roasted sweet potato',
        calories: targetCaloriesPerMeal.Dinner,
        protein: Math.round(user.dailyProtein * 0.35),
        carbs: Math.round(user.dailyCarbs * 0.35),
        fat: Math.round(user.dailyFat * 0.35),
        ingredients: ['Lean Ground Beef', 'Sweet Potato', 'Broccoli', 'Olive Oil'],
      },
      {
        name: 'Salmon & Brown Rice',
        description: 'Baked salmon with brown rice and vegetables',
        calories: targetCaloriesPerMeal.Dinner,
        protein: Math.round(user.dailyProtein * 0.35),
        carbs: Math.round(user.dailyCarbs * 0.35),
        fat: Math.round(user.dailyFat * 0.35),
        ingredients: ['Salmon Fillet', 'Brown Rice', 'Spinach', 'Carrots'],
      },
      {
        name: 'Chicken Stir-Fry',
        description: 'Chicken breast with mixed vegetables and quinoa',
        calories: targetCaloriesPerMeal.Dinner,
        protein: Math.round(user.dailyProtein * 0.35),
        carbs: Math.round(user.dailyCarbs * 0.35),
        fat: Math.round(user.dailyFat * 0.35),
        ingredients: ['Chicken Breast', 'Quinoa', 'Bell Peppers', 'Broccoli'],
      },
    ],
    Snack: [
      {
        name: 'Apple & Almond Butter',
        description: 'Sliced apple with natural almond butter',
        calories: targetCaloriesPerMeal.Snack * 2,
        protein: Math.round(user.dailyProtein * 0.05),
        carbs: Math.round(user.dailyCarbs * 0.05),
        fat: Math.round(user.dailyFat * 0.05),
        ingredients: ['Apple', 'Almonds'],
      },
      {
        name: 'Greek Yogurt Bowl',
        description: 'Greek yogurt with mixed berries',
        calories: targetCaloriesPerMeal.Snack * 2,
        protein: Math.round(user.dailyProtein * 0.05),
        carbs: Math.round(user.dailyCarbs * 0.05),
        fat: Math.round(user.dailyFat * 0.05),
        ingredients: ['Greek Yogurt', 'Strawberries', 'Blueberries'],
      },
      {
        name: 'Trail Mix',
        description: 'Mixed nuts with a few dried fruits',
        calories: targetCaloriesPerMeal.Snack * 2,
        protein: Math.round(user.dailyProtein * 0.05),
        carbs: Math.round(user.dailyCarbs * 0.05),
        fat: Math.round(user.dailyFat * 0.05),
        ingredients: ['Almonds', 'Walnuts'],
      },
    ],
  };

  return mealSuggestions;
}

export function generateWeeklyMealPlan(user: User): { [day: string]: MealPlan } {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const weeklyPlan: { [day: string]: MealPlan } = {};

  days.forEach(day => {
    weeklyPlan[day] = getMealSuggestions(user);
  });

  return weeklyPlan;
}