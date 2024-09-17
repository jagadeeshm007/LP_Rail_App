import axios from "axios";

export default async function sendPushNotification(expoPushToken: string, title: string,statement: string, data: any) {
  try {
    const body = statement || "You have a new notification";
    const message = {
      to: expoPushToken,
      title: title,
      body: body ,
      data: data,
    };

    const response = await axios.post("https://exp.host/--/api/v2/push/send", message, {
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
    });

    // console.log("Notification sent successfully", response);
    console.log("Notification sent successfully");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error sending notification:", error.message);
    } else {
      console.error("Error sending notification:", error);
    }
  }
}