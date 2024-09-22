// src/components/AdminActions.tsx
import React from "react";
import { View, Button, StyleSheet, Alert } from "react-native";
import { ActivityIndicator, Button as PaperButton } from "react-native-paper";
import { useData } from "@/src/providers/DataProvider";
import { roles, status as Status, TransactionData } from "@/assets/Types";
import * as ImagePicker from "expo-image-picker";
import uploadToCloudinary from "../utils/uploadToCloudinary";
import { Notify } from "../app/(transaction)/helper/Notification";
interface AccountantActionsProps {
  status: string;
  id : string;
  handleStateChange: (newStatus: string) => void;
  transactionData: TransactionData;
}

const AccountantButtons: React.FC<AccountantActionsProps> = ({
  id,
  status,
  handleStateChange,
  transactionData
}) => {
  const { userProfile,postDocumentwithDoc,fetchDocument } = useData();
  if (userProfile?.role !== roles.roles_3) return null;

  const [selectedImages, setSelectedImages] = React.useState<string[]>([]);
  const [waiting, setWaiting] = React.useState(false);

  const handleReturnfiles = async (newStatus: string[]) => {
    setWaiting(true);
    if (!id) return;
    console.log("AccountantUri updated to", newStatus);
    try {
      await postDocumentwithDoc( "transactions",id, {
        AccountantUri: newStatus,
      });
      console.log("AccountantUri updated to", newStatus);
    } catch (error) {
      console.error("Error updating AccountantUri:", error);
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
        handleReturnfiles(prevImages);
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
      handleStateChange(Status.phase3);
      Alert.alert("Success", "successfully Updated the payment");
      setWaiting(false);
    }
  };

  const askForPermission = () => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to accept this payment?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Accept",
          onPress: () => ImagePickerHandler(),
          // handleStateChange(Status.phase3)
        },
      ]
    );
  };

  if (waiting) {
    return (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <View style={styles.actionContainer}>
      {status === Status.phase1 && (
        <View style={styles.buttonContainer}>
          <PaperButton
            mode="contained"
            onPress={() => handleStateChange(Status.phase2)}
            style={[
              styles.button,
              {
                backgroundColor: "#4CAF50",
              },
            ]}
            labelStyle={styles.buttonLabel}
          >
            Upload to Bank
          </PaperButton>
          <PaperButton
            mode="contained"
            onPress={() => handleStateChange(Status.fail)}
            style={[
              styles.button,
              {
                backgroundColor: "#F44336",
              },
            ]}
            labelStyle={styles.buttonLabel}
          >
            Deny
          </PaperButton>
        </View>
      )}

      {status === Status.phase2 && (
        <View style={styles.buttonContainer}>
          <PaperButton
            mode="contained"
            onPress={() => askForPermission()}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Payment Done
          </PaperButton>
        </View>
      )}

      {status === Status.phase4 && (
        <View style={styles.buttonContainer}>
        <PaperButton
          mode="contained"
          onPress={() => handleStateChange(Status.final)}
          style={[
            styles.button,
            {
              backgroundColor: "#4CAF50",
            },
          ]}
          labelStyle={styles.buttonLabel}
        >
          Accept
        </PaperButton>
        <PaperButton
          mode="contained"
          onPress={() => handleStateChange(Status.qualityfail)}
          style={[
            styles.button,
            {
              backgroundColor: "#F44336",
            },
          ]}
          labelStyle={styles.buttonLabel}
        >
          Deny
        </PaperButton>
      </View>

      )}
    </View>
  );
};

const styles = StyleSheet.create({
  actionContainer: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: "100%",
    borderRadius: 10,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  button: {
    backgroundColor: "#4CAF50",
    flex: 1,
    paddingHorizontal: 5,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  buttonDeny: {
    backgroundColor: "#F44336",
    borderRadius: 10,
  },
  buttonUpdate: {
    marginTop: 10,
    backgroundColor: "#FFC107",
    borderRadius: 10,
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 16,
  },
});

export default AccountantButtons;
