import { ActivityIndicator, View } from 'react-native';

const LoadingScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
      }}
    >
      <ActivityIndicator size="large" color={'#22C55E'} />
    </View>
  );
};

export default LoadingScreen;
