import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/src/providers/AuthProvider';
import { Ionicons } from "@expo/vector-icons";
import { router} from "expo-router";
import { TouchableOpacity } from "react-native";
export default function AuthLayout() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="login"
        options={{
          presentation: 'modal',
          title: '',
          headerStyle: {
            backgroundColor: '#121212', // Set the background color of the header to black
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.replace("/(auth)")}>
              <Ionicons name="close-outline" size={28} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
);
}
