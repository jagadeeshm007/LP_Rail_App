import React from "react";
import { View, Button, Alert, Pressable } from "react-native";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { Ionicons } from "@expo/vector-icons";

interface ShareButtonProps {
  viewShotRef: React.RefObject<View>;
}

const ShareButton: React.FC<ShareButtonProps> = ({ viewShotRef }) => {
  const handleShare = async () => {
    if (!viewShotRef.current) return;
    try {
      const uri = await captureRef(viewShotRef, { format: "png", quality: 1 });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert(
          "Sharing not available",
          "Sharing is not available on your platform."
        );
      }
    } catch (error) {
      Alert.alert("Error", "There was an issue sharing the receipt.");
      console.error(error);
    }
  };

  return (
    <Pressable onPress={handleShare}>
      <Ionicons name="share-outline" size={28} color="#fff" />
    </Pressable>
  );
};

export default ShareButton;
