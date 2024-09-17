import { useAuth } from "@/src/providers/AuthProvider";
import { Redirect, Stack } from "expo-router";
export default function Navigation() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Redirect href="/(auth)" />;
  }
  return (
    <Stack>
      <Stack.Screen name="index"
          options={{
            title: "",
            headerStyle: { backgroundColor: "#222" },
            headerTintColor: "#fff",
          }}
        />
      <Stack.Screen name="EditPage" />
      <Stack.Screen name="Editdevelopment" />
      <Stack.Screen name="EditPayments" />
    </Stack>
    );
}
