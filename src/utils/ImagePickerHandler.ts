import * as ImagePicker from "expo-image-picker";
import uploadToCloudinary from "./uploadToCloudinary";
import { Alert } from "react-native";
import { updateDoc, doc } from "@react-native-firebase/firestore";
import { getFirestore } from "@react-native-firebase/firestore";

const ImagePickerHandler = async (setSelectedImages: (images: string[]) => void, handleReturnfiles: (newStatus: string[]) => void, handleUpdateStatus: (newStatus: string) => void) => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      const uris = result.assets.map((asset) => asset.uri);
      const uploadedLinks = await Promise.all(
        uris.map(async (uri) => {
          const cloudinaryUrl = await uploadToCloudinary(uri);
          return cloudinaryUrl;
        })
      );
      setSelectedImages(uploadedLinks);
      console.log("Uploaded Image URLs:", uploadedLinks);
      handleReturnfiles(uploadedLinks);
      Alert.alert("Success", "Successfully updated the payment");
      handleUpdateStatus("Completed");
    }
  } catch (error) {
    console.error("Image picking/uploading failed:", error);
    Alert.alert(
      "Error",
      "An error occurred while picking or uploading the images."
    );
  }
};

export default ImagePickerHandler;

