import LoadingScreen from '@/components/LoadingScreen';
import { tokenContext } from '@/utils/token-context';
import { router } from 'expo-router';
import { useEffect } from 'react';

const IndexScreen = () => {
  useEffect(() => {
    check();
  }, []);

  const check = async () => {
    const token = await tokenContext.isExist();
    if (token) {
      router.replace('/(tabs)');
    } else {
      router.replace('/onboarding/welcome');
    }
  };
  return <LoadingScreen />;
};

export default IndexScreen;
