// src/components/AdminActions.tsx
import React from "react";
import { View, Button, StyleSheet, Alert } from "react-native";
import { ActivityIndicator, Button as PaperButton } from "react-native-paper";
import { useData } from "@/src/providers/DataProvider";
import { roles, status as Status, TransactionData } from "@/assets/Types";
import * as ImagePicker from "expo-image-picker";
import uploadToCloudinary from "../utils/uploadToCloudinary";
import { Notify } from "../app/(transaction)/helper/Notification";

interface BillsProps {
  status: string;
  handleStateChange: (newStatus: string) => void;
  sender: string;
  id: string;
  transactionData: TransactionData
}

const BillsButtons: React.FC<BillsProps> = ({
  status,
  handleStateChange,
  sender,
  id,
  transactionData
}) => {
  const { userProfile, postDocumentwithDoc ,fetchDocument} = useData();

  const [selectedImages, setSelectedImages] = React.useState<string[]>([]);
  const [waiting, setWaiting] = React.useState(false);

  const handleRecipts = async (newStatus: string[]) => {
    setWaiting(true);
    if (!id) return;
    console.log("Recipts updated to", newStatus);
    try {
      await postDocumentwithDoc("transactions", id, {
        Recipts: newStatus,
      });
      console.log("Recipts updated to", newStatus);
    } catch (error) {
      console.error("Error updating Recipts:", error);
    }
    // Notify({
    //   transactionData: transactionData,
    //   statement: "Transaction "+ newStatus,
    //   sendTo: [transactionData.senderId, transactionData.AccountantId,transactionData.receiverId],
    //   fetchDocument: fetchDocument,
    // });
    setWaiting(false);

  };

  const ImagePickerHandler = async () => {
    setWaiting(true);
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
      }
    } catch (error) {
      console.error("Image picking/uploading failed:", error);
      Alert.alert(
        "Error",
        "An error occurred while picking or uploading the images."
      );
    } finally {
      setSelectedImages((prevImages) => {
        handleRecipts(prevImages);
        return prevImages;
      });
      // try {
      //   await postDocumentwithDoc("transactions", id, {
      //     status: Status.phase3,
      //   });
      // }
      // catch (e) {
      //   console.log("error updating status", e);
      // }
      handleStateChange(Status.phase4);
      Alert.alert("Success", "successfully Updated the payment");
      setWaiting(false);
    }
  };

  const askForPermission = () => {
    Alert.alert("Upload Receipt", "", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Upload Receipt",
        onPress: () => ImagePickerHandler(),
        // handleStateChange(Status.phase3)
      },
    ]);
  };

  if (waiting) {
    return (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  if (status === Status.phase3 || status === Status.qualityfail) {
    return (
      <View style={styles.actionContainer}>
        {userProfile?.email === sender && (<PaperButton
          mode="contained"
          onPress={() => askForPermission()}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Upload Receipt
        </PaperButton>)}
        {userProfile?.role === roles.roles_3 &&
          status === Status.qualityfail && (
            <PaperButton
              mode="contained"
              onPress={() => handleStateChange(Status.Suspend)}
              style={[styles.button]}
              labelStyle={styles.buttonLabel}
            >
              Suspend
            </PaperButton>
          )}
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  actionContainer: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: 'center',
    width: "100%",
    borderRadius: 10,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  button: {
    backgroundColor: "#192A56",
    flex: 1,
    paddingHorizontal: 5,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 16,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 100,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: "100%",
    borderRadius: 10,
  },
});

export default BillsButtons;
