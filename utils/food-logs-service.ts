import { BaseResponse } from '@/models/api';
import { api } from './api';
import { GetFoodLogsResponse } from '@/models/food-logs/get-food-logs';
import {
  PostFoodLogsRequest,
  PostFoodLogsResponse,
} from '@/models/food-logs/post-food-logs';
import { DeleteFoodLogsResponse } from '@/models/food-logs/delete-food-logs';

export const foodLogsService = {
  get: async () => await api.get<BaseResponse<GetFoodLogsResponse[]>>('/food'),

  create: async (data: PostFoodLogsRequest) =>
    await api.post<BaseResponse<PostFoodLogsResponse>>('/food', data),

  delete: async (id: string) =>
    await api.delete<BaseResponse<DeleteFoodLogsResponse>>(`/food/${id}`),
};
