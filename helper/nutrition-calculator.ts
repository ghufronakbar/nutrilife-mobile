interface UserData {
  age: number;
  weight: number;
  height: number;
  gender: string;
  activityLevel: string;
  goal: string;
}

interface NutritionGoals {
  bmr: number;
  tdee: number;
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
}

export function calculateNutritionGoals(userData: UserData): NutritionGoals {
  // Calculate BMR using Mifflin-St Jeor Equation
  let bmr: number;
  if (userData.gender === 'Male') {
    bmr = (10 * userData.weight) + (6.25 * userData.height) - (5 * userData.age) + 5;
  } else {
    bmr = (10 * userData.weight) + (6.25 * userData.height) - (5 * userData.age) - 161;
  }

  // Calculate TDEE based on activity level
  const activityMultipliers = {
    'Sedentary': 1.2,
    'Light': 1.375,
    'Moderate': 1.55,
    'Active': 1.725,
    'Very Active': 1.9,
  };

  const tdee = bmr * (activityMultipliers[userData.activityLevel as keyof typeof activityMultipliers] || 1.2);

  // Adjust calories based on goal
  let dailyCalories: number;
  switch (userData.goal) {
    case 'Lose Weight':
      dailyCalories = tdee - 500; // 1 lb per week deficit
      break;
    case 'Gain Weight':
    case 'Build Muscle':
      dailyCalories = tdee + 300; // Moderate surplus
      break;
    case 'Maintain Weight':
    case 'Improve Health':
    default:
      dailyCalories = tdee;
      break;
  }

  // Calculate macronutrient goals
  // Protein: 1.6-2.2g per kg body weight (average 1.8g)
  const dailyProtein = Math.round(userData.weight * 1.8);
  
  // Fat: 25-30% of calories (average 27.5%)
  const dailyFat = Math.round((dailyCalories * 0.275) / 9);
  
  // Carbs: remaining calories
  const dailyCarbs = Math.round((dailyCalories - (dailyProtein * 4) - (dailyFat * 9)) / 4);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    dailyCalories: Math.round(dailyCalories),
    dailyProtein,
    dailyCarbs,
    dailyFat,
  };
}

export function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100;
  return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

export function getHealthyWeightRange(height: number): { min: number; max: number } {
  const heightInMeters = height / 100;
  const minWeight = Math.round(18.5 * heightInMeters * heightInMeters);
  const maxWeight = Math.round(24.9 * heightInMeters * heightInMeters);
  return { min: minWeight, max: maxWeight };
}