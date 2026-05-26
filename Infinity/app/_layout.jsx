import { Stack } from 'expo-router'
import { useAnimatedStyle } from 'react-native-reanimated';
import Toast, { BaseToast } from 'react-native-toast-message';

export default function RootLayout() {


  const toastConfig = {
    waiting: (props) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: 'aliceblue', backgroundColor: '#1a0a0d',top : 1000,position : "absolute"}}
        text1Style={{ color: 'white', fontWeight: '700' }}
        text1NumberOfLines={1}
        text2NumberOfLines={2}
      />
    ),
    success: (props) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: '#69ff74', backgroundColor: '#0a1a0d' }}
        text1Style={{ color: 'white', fontWeight: '700' }}
        text2Style={{ color: '#aaa' }}
      />
    ),
    error: (props) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: '#69ff74', backgroundColor: '#0a1a0d' }}
        text1Style={{ color: 'white', fontWeight: '700' }}
        text2Style={{ color: '#aaa' }}
      />
    ),
  };

  return (
    <>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" options={{href : null , headerShown : false}}/>
          <Stack.Screen name="index" options={{href : null , headerShown : false}} />
        </Stack>
        <Toast config={toastConfig} />  
    </>
  )
}