import { Platform, SafeAreaView, StatusBar } from "react-native";
import { useNotification } from "@/src/providers/NotificationContext";
import { Text, View } from "@/src/components/Themed";
import * as Notifications from "expo-notifications";
import { Button } from "react-native-paper";
import sendPushNotification from '@/src/lib/notifications';
import { useData } from "../providers/DataProvider";
import { useEffect, useState } from "react";

const title = "Hello";
const data: { data: { id: string; status: string } } = { data: { id: "your_notification_id", status: "ok" } };

// Send a test notification
export const sendLocalNotification = async (expoPushToken:any) => {
  if(expoPushToken){
    sendPushNotification(expoPushToken, title, data);
    }

  // await Notifications.scheduleNotificationAsync({
  //   content: {
  //     title: "Test Notification",
  //     body: "This is a local notification test.",
  //     sound: "default",
  //     data: {data: {id: "your_notification_id", status: "ok"}},
  //   },
  //   trigger: {seconds:2}, // Immediate trigger
  // });
  
};


export default function HomeScreen() {
  const { expoPushToken, notification, error } = useNotification();
  const { userProfile, fetchDocument} = useData();
  const [sendToken, setSendToken] = useState();
  useEffect (()=>{
  const send = async () => {
    const data = await fetchDocument("Tokens", userProfile?.mappedAdminId||"");
    setSendToken(data.token);
    console.log("data",data);
  };
  send();
  }
  ,[userProfile]);

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  console.log("data",JSON.stringify(notification, null, 2));

  return (
    <View
      style={{
        flex: 1,
        padding: 10,
        paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 10,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Text >Your push token:</Text>
        <Text>{expoPushToken}</Text>
        <Text >Latest notification:</Text>
        <Text>{notification?.request.content.title}</Text>
        <Text>
          {JSON.stringify(notification?.request.content.data, null, 2)}
        </Text>
        {/* <DOMCoolCode code={JSON.stringify(notification)} /> */}
        <Button onPress={()=>sendLocalNotification(sendToken)}>button</Button>
      </SafeAreaView>
    </View>
  );
}