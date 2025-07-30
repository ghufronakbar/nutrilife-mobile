import { BaseResponse } from '@/models/api';
import { api } from './api';
import { PostImageResponse } from '@/models/image';

export const imageService = {
  upload: async (formData: FormData) =>
    await api.post<BaseResponse<PostImageResponse>>('/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};
