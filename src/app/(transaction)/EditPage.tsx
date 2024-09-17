import React, { useState, useRef, useEffect, memo } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DropDownPicker from "react-native-dropdown-picker";
import LottieView from "lottie-react-native";
import ImagePickerComponent, {
  ImagePickerComponentRef,
} from "@/src/components/ImagePicker";
import { useData } from "../../providers/DataProvider";
import firestore, { doc, getFirestore, updateDoc } from "@react-native-firebase/firestore";
import { Stack, router } from 'expo-router';
import sendPushNotification from "@/src/lib/notifications";
import { TransactionData } from "@/assets/Types";
import { Alert } from 'react-native';
import {useLocalSearchParams } from "expo-router";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
type TransactionDataSnap = Omit<TransactionData, "id">;
const PaymentRequest = () => {
  const { id } = useLocalSearchParams();
  const { userProfile, postDocument, fetchCollection, fetchDocument } =
    useData();
  const [projectCodes, setProjectCodes] = useState<any[]>([]);
  const [amount, setAmount] = useState<string>("");
  const [itemName, setItemName] = useState<string>("");
  const [projectCode, setProjectCode] = useState<string | null>(null);
  const [StatementOptions, setStatementOptions] = useState<any[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [openItem, setOpenItem] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOtherSelected, setIsOtherSelected] = useState<boolean>(false); // Manage "Other" selection
  const [customStatement, setCustomStatement] = useState<string>(""); // Store custom statement
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [transactionData, setTransactionData] =
    useState<TransactionData | null>(null);

  const imagePickerRef = useRef<ImagePickerComponentRef>(null);

  const deleteDocument = async () => {
    try {
      await firestore()
        .collection("transactions") // Replace with your collection name
        .doc(transactionData?.id) // Replace with the document ID
        .delete();

      // The document has been deleted, now navigate to the (tabs) page
      Alert.alert(
        "Deleted successfully",
        "The Request has been deleted successfully",
        [
          {
            text: "OK",
            onPress: () => {
              // Use router.replace here
              console.log("redirecting to tabs page");
              router.replace("/(tabs)");
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error deleting document: ", error);
      Alert.alert("Failed to delete document");
    }
  };

  useEffect(() => {
    if (id) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(id.toString()));
        setTransactionData(decodedData);
        setAmount(decodedData.amount);
        setProjectCode(decodedData.projectId);
        let change:boolean = true;
        StatementOptions.map((statement) => {
          if (statement.value === decodedData.details) {
            setItemName(statement.label);
            change = false;
          }
        });
        if (change) {
          setIsOtherSelected(true);
          setCustomStatement(decodedData.details);
        }
      } catch (error) {
        console.error("Error decoding data:", error);
      }
    }
  }, [id]);

  useEffect(() => {
    if(isOtherSelected){
      setItemName(customStatement);
    }
  }
  ,[isOtherSelected, customStatement]);


  const handleImagesSelected = (selectedImages: string[]) => {
    setImages(selectedImages);
  };

  const handlePickImages = () => {
    imagePickerRef.current?.pickImages();
  };

  const uploadImage = async (image: string): Promise<string | null> => {
    const formData = new FormData();
    const mail = userProfile?.email;

    const props = {
      uri: image,
      type: "image/jpeg",
      name: `upload_${Date.now()}.jpg`,
    };

    formData.append("file", props as unknown as Blob);
    formData.append("public_id", `${mail}/upload_${Date.now()}`);
    formData.append("upload_preset", "Default");
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dxvmt15ez/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        console.log("Response", response);
        throw new Error(`Failed to upload image: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Upload successful:", result.secure_url);
      return result.secure_url;
    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const uploadedImages = await Promise.all(images.map(uploadImage));
    const successfulUploads = uploadedImages.filter((url) => url !== null);
    console.log("Uploaded images:", successfulUploads);
    console.log(successfulUploads.length === uploadedImages.length);
    if (successfulUploads.length !== uploadedImages.length) {
      setLoading(false);
      alert("Failed to upload images. Please try again.");
      return;
    }

    


    const transactionupdatedData: TransactionData = {
      amount:amount,
      details: itemName,
      editedtime: firestore.Timestamp.now(),
      projectId: projectCode!,
      receiverId: transactionData?.receiverId || "",
      rejectedcause: transactionData?.rejectedcause || "NULL",
      senderId: transactionData?.senderId  || "",
      senderName: userProfile?.name || "",
      status: "Pending",
      timestamp : transactionData?.timestamp,
      urilinks: successfulUploads,
      AccountantUri: [],
      id : transactionData?.id || "",
      BankId: transactionData?.BankId || "",
      development: transactionData?.development || "",
      Recipts: transactionData?.Recipts || [],
      AccountantId: transactionData?.AccountantId || "",
      permitteby: transactionData?.permitteby || null,
    };

    try {
       console.log("Transaction Data", transactionupdatedData);
       if(transactionData?.id){
      await updateDoc(
        doc(
          getFirestore(),
          "transactions",
          transactionData.id
        ),{
          amount:amount,
          details: itemName,
          urilinks: successfulUploads,
          editedtime: firestore.Timestamp.now(),
          status: "Pending",
        }
      );
    }
      resetForm();
      Alert.alert("","Payment successfully Updated!",
        [{ text: "OK", onPress: () => router.replace("/(tabs)") }]
      );
      notify(transactionupdatedData);
      
    } catch (error) {
      console.error("Error submitting payment request:", error);
      alert("Failed to submit payment request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const notify = async (transactionData: TransactionData) => {
    console.log("Transaction Data", transactionData);
    if (userProfile?.mappedAdminId) {
      console.log("User Profile", userProfile.mappedAdminId);
      const tokens = await fetchDocument("Tokens", userProfile.mappedAdminId);
      const sessions = tokens.sessions;
      console.log("Tokens", tokens.sessions);
      if (sessions.length > 0) {
        sessions.map((session: string, index: string) => {
          sendPushNotification(session, "Payment Request","New Payment Request" ,transactionData);
          console.log("Notification sent to", session);
        });
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!amount) newErrors.amount = "Amount is required";
    if (!projectCode) newErrors.projectCode = "Project Code is required";
    // if(!itemName) newErrors.itemName = "Statement is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setAmount("");
    setItemName("");
    setProjectCode(null);
    customStatement && setCustomStatement("");
    setImages([]);
    imagePickerRef.current?.clearSelectedImages();
  };

  useEffect(() => {
    const fetchProjectCodes = async () => {
      try {
        const codes = await fetchCollection("projects");
        const transformedCodes = codes.map((code: any) => ({
          label: code.name,
          value: code.id,
        }));
        setProjectCodes(transformedCodes);
      } catch (error) {
        console.error("Error fetching project codes:", error);
      }
    };

    fetchProjectCodes();
  }, []);

  useEffect(() => {
    const fetchStatements = async () => {
      try {
        const codes = await fetchCollection("Statements");
        const transformedCodes = codes.map((code: any) => ({
          label: code.name,
          value: code.id,
        }));
        setStatementOptions(transformedCodes);
      } catch (error) {
        console.error("Error fetching Statements :", error);
      }
    };

    fetchStatements();
  }, []);

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

  return (
    <GestureHandlerRootView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Payment",
          headerStyle: {
            backgroundColor: "#222",
          },
          headerTintColor: "#fff",
        }}
      />

      <View style={styles.container}>
        <LottieView
          source={require("@/assets/animation_files/form.json")}
          autoPlay={false}
          loop={false}
          style={styles.lottie}
        />
        <View style={styles.pickerContainer}>
          <DropDownPicker
            open={open}
            value={projectCode}
            items={projectCodes}
            setOpen={setOpen}
            setValue={setProjectCode}
            placeholder="Project"
            textStyle={{ color: "#fff" }}
            style={[
              styles.dropdown,
              errors.projectCode ? { borderColor: "#E53935" } : null,
              open ? { zIndex: 1000 } : { zIndex: 1 }, // Fix dropdown z-index issue
            ]}
            dropDownContainerStyle={[styles.dropdownContainer,open ? { zIndex: 1000 } : { zIndex: 1 }, ]}
          />
        </View>
        <View style={styles.form}>
          <TextInput
            placeholder="Amount"
            placeholderTextColor="#fff"
            value={amount}
            onChangeText={setAmount}
            style={[styles.input, errors.amount ? styles.inputError : null]}
            keyboardType="numeric"
          />

          <DropDownPicker
            open={openItem}
            value={isOtherSelected ? "Other (Enter manually)" : itemName}
            items={StatementOptions}
            setOpen={setOpenItem}
            setValue={(callback) => {
              const value =
                typeof callback === "function" ? callback(itemName) : callback;
              if (value === "Other (Enter manually)") {
                setIsOtherSelected(true);
              } else {
                setIsOtherSelected(false);
                setItemName(value);
              }
            }}
            placeholder="Statement"
            textStyle={{ color: "#fff" }}
            style={[
              styles.dropdown,
              ((errors.itemName) && !errors.customStatement )? { borderColor: "#E53935" } : null,
            ]}
            dropDownContainerStyle={styles.dropdownContainer}
            zIndex={openItem ? 999 : 2}
          />

          {isOtherSelected && (
            <TextInput
              placeholder="Enter custom statement"
              placeholderTextColor="#fff"
              value={customStatement}
              onChangeText={setCustomStatement}
              style={[
                styles.input,
                { marginTop: 10 },
                errors.customStatement ? styles.inputError : null,
              ]}
            />
          )}

          <TouchableOpacity
            onPress={handlePickImages}
            style={styles.fileButton}
          >
            <Text style={styles.fileButtonText}>Pick Files</Text>
          </TouchableOpacity>
          <ImagePickerComponent
            ref={imagePickerRef}
            onImagesSelected={handleImagesSelected}
          />
          {!isKeyboardVisible && (
        <View style={styles.Buttons}>
            <TouchableOpacity
          onPress={deleteDocument}
          style={[styles.submitButton,{backgroundColor: "darkred",}]}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>Delete</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSubmit}
          style={[styles.submitButton,{backgroundColor: "#1E3A8A",}]}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>Update</Text>
        </TouchableOpacity>
        </ View>
      )}
          
        </View>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </GestureHandlerRootView>
  );
};

export default memo(PaymentRequest);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#222",
    width: "100%",
  },
  submitButton: {
    width: "48%",
    borderRadius: 10,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    padding: 15,
    elevation: 2,
    margin: 5,
  },
  Buttons: {
    flexDirection: 'row',
    justifyContent: "space-between",
    backgroundColor: "transparent",
    alignItems: "center",
    width: "100%",
    position: "absolute",
    bottom: 20,
    alignContent: "center",
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  input: {
    height: 50,
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: "#444",
    fontSize: 16,
    color: "#fff",
    width: "100%",
    elevation: 2,
  },
  inputError: {
    borderColor: "#E53935",
  },
  errorText: {
    color: "#E53935",
    fontSize: 14,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  pickerContainer: {
    width: "100%",
    marginBottom: 10,
  },
  dropdown: {
    backgroundColor: "#444",
    borderColor: "#333",
    borderRadius: 10,
    elevation: 2,
  },
  dropdownContainer: {
    marginBottom: 10,
    backgroundColor: "#444",
    borderColor: "#333",
    borderRadius: 10,
    elevation: 4,
  },
  fileButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
    width: "100%",
  },
  fileButtonText: {
    
    color: "#FFF",
    fontSize: 16,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    alignContent: "center",
    justifyContent: "center",
    marginTop: 20,
    width: "100%",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  form: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  lottie: {
    width: 150,
    height: 150,
  },
});

