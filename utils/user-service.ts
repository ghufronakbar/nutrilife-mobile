import { BaseResponse } from '@/models/api';
import { api } from './api';
import { PostLoginRequest, PostLoginResponse } from '@/models/user/post-login';
import {
  PostRegisterRequest,
  PostRegisterResponse,
} from '@/models/user/post-register';
import { GetProfileResponse } from '@/models/user/get-profile';
import {
  PutProfileRequest,
  PutProfileResponse,
} from '@/models/user/put-profile';

export const userService = {
  login: async (data: PostLoginRequest) =>
    await api.post<BaseResponse<PostLoginResponse>>('/user/login', data),

  register: async (data: PostRegisterRequest) =>
    await api.post<BaseResponse<PostRegisterResponse>>('/user/register', data),

  profile: async () =>
    await api.get<BaseResponse<GetProfileResponse>>('/user/profile'),

  edit: async (data: PutProfileRequest) =>
    await api.put<BaseResponse<PutProfileResponse>>('/user/profile', data),
};
