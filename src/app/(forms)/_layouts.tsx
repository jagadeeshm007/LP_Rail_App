import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/src/providers/AuthProvider';
export default function AuthLayout() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="Formpage" options={{ headerShown: false }}/>
      <Stack.Screen name="Paymentdetails" options={{ headerShown: false }}/>
      <Stack.Screen name="Generals" options={{ headerShown: false }}/>
    </Stack>
);
}
