import {  Stack } from "expo-router";
import AuthProvider from "@/src/providers/AuthProvider";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import DataProvider from "@/src/providers/DataProvider";
import Toast from "react-native-toast-message";
import { NotificationProvider } from "../providers/NotificationContext";
import * as Notifications from 'expo-notifications';
import * as TaskManager from "expo-task-manager";
import messaging from '@react-native-firebase/messaging';
import { StatusBar } from "react-native";

// Set up a background message handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  // Handle the background message here
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

TaskManager.defineTask(
  BACKGROUND_NOTIFICATION_TASK,
  ({ data, error, executionInfo }) => {
    console.log("✅ Received a notification in the background!", {
      data,
      error,
      executionInfo,
    });
    // Do something with the notification data
  }
);

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);



export { ErrorBoundary } from 'expo-router';
export const unstable_settings = { initialRouteName: '/(tabs)' };

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}


const RootLayoutNav = () =>  {
  return (
    <NotificationProvider>
    <AuthProvider>
      <DataProvider>
      <StatusBar barStyle="light-content" backgroundColor="#222" />
      <Stack>
       <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(transaction)" options={{ headerShown: false }} />
      </Stack>
      </DataProvider>
    </AuthProvider>
    </NotificationProvider>
  );
}
