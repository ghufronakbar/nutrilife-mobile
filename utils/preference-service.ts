import { BaseResponse } from '@/models/api';
import { api } from './api';
import { GetPreferenceResponse } from '@/models/preference/get-preference';
import {
  PostPreferenceRequest,
  PostPreferenceResponse,
} from '@/models/preference/post-preference';

export const preferenceService = {
  get: async () =>
    await api.get<BaseResponse<GetPreferenceResponse>>('/preference'),

  create: async (data: PostPreferenceRequest) =>
    await api.post<BaseResponse<PostPreferenceResponse>>('/preference', data),
};
