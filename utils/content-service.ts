import { BaseResponse } from '@/models/api';
import { api } from './api';
import { GetActivityLevelResponse } from '@/models/content/get-activity-level';
import { GetPrimaryGoalResponse } from '@/models/content/get-primary-goal';
import { GetFoodResponse } from '@/models/content/get-food';
import { GetSuggestedResponse } from '@/models/content/get-suggested';

export const contentService = {
  activityLevel: async () =>
    await api.get<BaseResponse<GetActivityLevelResponse[]>>(
      '/content/activity-levels'
    ),

  primaryGoals: async () =>
    await api.get<BaseResponse<GetPrimaryGoalResponse[]>>(
      '/content/primary-goals'
    ),

  foods: async () =>
    await api.get<BaseResponse<GetFoodResponse>>('/content/foods'),

  suggested: async () =>
    await api.get<BaseResponse<GetSuggestedResponse[]>>(
      '/content/suggested-menus'
    ),
};
