import React, { useEffect, useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Redirect, Tabs } from 'expo-router';
import {Keyboard, Pressable, StatusBar, Text } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Octicons from '@expo/vector-icons/Octicons';
import {Colors} from '@/src/constants/Colors';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useClientOnlyValue } from '@/src/components/useClientOnlyValue';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/src/providers/AuthProvider';
import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  
  const colorScheme = 'light'; // useColorScheme();

  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Redirect href="/(auth)" />;
  }
  
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#222', // Set the background color of the tabs to black
          borderTopWidth: 0, // Remove the top border
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: 'absolute',
          paddingTop: 10,
          display: isKeyboardVisible ? 'none' : 'flex',
        },
        tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'dark'].tabIconDefault,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
    
      }}>
        
      <Tabs.Screen
        name="index"
        options={{
          title: 'LP RAIL PRODUCTS',
          tabBarLabel: '',
          tabBarIcon: ({ color }) => <Octicons name="home" size={24} color={color} />,
          headerStyle: {
            backgroundColor: '#222', // Set the background color of the profile header to black
            elevation: 0, // Remove shadow on Android
            shadowOpacity: 0, // Remove shadow on iOS
    
          },
          headerTintColor: '#fff', // Set the text color of the header to white
        
          // headerShown: false,
          
        }}
      />

      <Tabs.Screen
              name="history"
              options={{
                title: 'History',
                // headerShown: false,
                tabBarLabel: '',
                tabBarIcon: ({ color }) => <MaterialCommunityIcons name="swap-horizontal-circle-outline" size={25} color={color} />,
                headerTintColor: '#fff',
                // headerTitleStyle: { color: '#c0c0c0' },
                headerStyle: {
                  backgroundColor: '#222', // Set the background color of the profile header to black
                  elevation: 0, // Remove shadow on Android
                  shadowOpacity: 0, // Remove shadow on iOS
                },
              }}
            />

      <Tabs.Screen
        name="Profile"
        options={{
          title: '',
          tabBarLabel: '',
          // headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome6 name="circle-user" size={25} color={color} />,
          headerStyle: {
            backgroundColor: '#222', // Set the background color of the profile header to black
            elevation: 0, // Remove shadow on Android
            shadowOpacity: 0, // Remove shadow on iOS
    
          },
          headerTintColor: '#fff', // Set the text color of the header to white
          
        }}
      />
      
    </Tabs>
  );
}
