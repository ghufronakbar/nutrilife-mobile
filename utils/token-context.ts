import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACCESS_TOKEN_KEY } from './api';

export const tokenContext = {
  save: async (token: string): Promise<void> => {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  isExist: async (): Promise<boolean> => {
    const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    return !!token;
  },

  remove: async (): Promise<void> => {
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
  },
};
