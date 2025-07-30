import { BaseResponse } from '@/models/api';
import { api } from './api';
import { GetProgressResponse } from '@/models/track/get-progress';
import { GetAchievementResponse } from '@/models/track/get-achievement';

export const trackService = {
  progress: async () =>
    await api.get<BaseResponse<GetProgressResponse>>('/track/progress'),

  achievements: async () =>
    await api.get<BaseResponse<GetAchievementResponse[]>>('/track/achievement'),
};
