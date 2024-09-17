import { Text, View } from "react-native";
import AnimatedIntro from "@/src/components/AnimatedIntro";
import BottomLoginSheet from "@/src/components/BottomLoginSheet";
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import * as NavigationBar from 'expo-navigation-bar';

NavigationBar.setBackgroundColorAsync("#222");
enableScreens();

export default function Index() {
return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#222",
      }}
    >
      <AnimatedIntro />
      <BottomLoginSheet />
    </View>
  );
}
