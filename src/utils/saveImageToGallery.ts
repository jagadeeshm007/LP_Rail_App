import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Alert } from "react-native";

const saveImageToGallery = async (uri: string) => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied!",
        "You need to give storage permission to download the image"
      );
      return;
    }
    const fileName = uri.split("/").pop();
    const downloadDest = `${FileSystem.documentDirectory}${fileName}`;
    const downloadResult = await FileSystem.downloadAsync(uri, downloadDest);
    if (downloadResult.status === 200) {
      await MediaLibrary.createAssetAsync(downloadResult.uri);
      Alert.alert("Success", "Image saved to gallery");
    } else {
      Alert.alert("Error", "Failed to save image");
    }
  } catch (error) {
    console.error(error);
    Alert.alert("Error", "An error occurred while saving the image");
  }
};

export default saveImageToGallery;
