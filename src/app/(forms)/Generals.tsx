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
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import DropDownPicker from "react-native-dropdown-picker";
import ImagePickerComponent, {
  ImagePickerComponentRef,
} from "@/src/components/ImagePicker";
import { useData } from "../../providers/DataProvider";
import firestore from "@react-native-firebase/firestore";
import { Stack } from "expo-router";
import sendPushNotification from "@/src/lib/notifications";
import { TransactionData, developmentData } from "@/assets/Types";
import { uploadImage } from "@/src/utils/uploadImage";
type TransactionDataSnap = Omit<TransactionData, "id">;

const General = () => {
  // data hooks
  const { userProfile, postDocument, fetchCollection, fetchDocument } =
    useData();

  // form state

  const [projectCodes, setProjectCodes] = useState<any[]>([]);
  const [amount, setAmount] = useState<string>("");
  const [itemName, setItemName] = useState<string>("");
  const [projectCode, setProjectCode] = useState<string | null>(null);
  const [option, setoption] = useState<string | null>(null);
  const [options, setoptions] = useState<any[]>([
    { label: "Rent", value: "Rent" },
    { label: "Business", value: "Business" },
    { label: "Development", value: "Development" },
  ]);
  const [optionsopen, setoptionsOpen] = useState<boolean>(false);


  // operations
  const [StatementOptions, setStatementOptions] = useState<any[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [openItem, setOpenItem] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOtherSelected, setIsOtherSelected] = useState<boolean>(false);
  const [customStatement, setCustomStatement] = useState<string>("");
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  // refs
  const imagePickerRef = useRef<ImagePickerComponentRef>(null);

  // helpers and effects for form operations and validations
  const notify = async (transactionData: TransactionData) => {
    console.log("Transaction Data", transactionData);
    if (userProfile?.mappedAdminId) {
      console.log("User Profile", userProfile.mappedAdminId);
      const tokens = await fetchDocument("Tokens", userProfile.mappedAdminId);
      const sessions = tokens.sessions;
      console.log("Tokens", tokens.sessions);
      if (sessions.length > 0) {
        sessions.map((session: string, index: string) => {
          sendPushNotification(
            session,
            "Payment Request",
            "New Payment Request",
            transactionData
          );
          console.log("Notification sent to", session);
        });
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!amount) newErrors.amount = "Amount is required";
    if (!projectCode) newErrors.projectCode = "Project Code is required";
    if (!option) newErrors.option = "Pay Type is required";
    if (isOtherSelected && !customStatement)
      newErrors.customStatement = "Custom statement is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setProjectCode(null);
    setCustomStatement("");
    setAmount("");
    setItemName("");
    setErrors({});
    setoption("");
    setOpen(false);
    setOpenItem(false);
    setoptionsOpen(false);
    setImages([]);
    imagePickerRef.current?.clearSelectedImages();
  };

  const handleImagesSelected = (selectedImages: string[]) => {
    setImages(selectedImages);
  };

  const handlePickImages = () => {
    imagePickerRef.current?.pickImages();
  };

  useEffect(() => {
    if(isOtherSelected){
      setItemName(customStatement);
    }
  }
  ,[isOtherSelected, customStatement]);


  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    const uploadedImages = await Promise.all(images.map(uploadImage));
    const successfulUploads = uploadedImages.filter((url) => url !== null);

    console.log("Uploaded images:", successfulUploads);
    if (successfulUploads.length !== uploadedImages.length) {
      setLoading(false);
      alert("Failed to upload images. Please try again.");
      return;
    }

    const developmentData: developmentData = {
      payfor: option || "",
      timestamp: firestore.Timestamp.now(),
    };

    const developmentId = await postDocument(
      "developmentData",
      developmentData
    );

    const transactionData: TransactionDataSnap = {
      amount,
      details: itemName,
      editedtime: firestore.Timestamp.now(),
      projectId: projectCode!,
      receiverId: userProfile?.mappedAdminId || "",
      rejectedcause: "NULL",
      senderId: userProfile?.email || "",
      senderName: userProfile?.name || "",
      status: "Pending",
      timestamp: firestore.Timestamp.now(),
      urilinks: successfulUploads,
      AccountantUri: [],
      BankId: "",
      development: (developmentId as string) || "",
      Recipts: [],
      AccountantId: userProfile?.mappedAdminId || "",
      permitteby: null,
      PaymentMethods : "General",
    };

    try {
      const id = await postDocument("transactions", transactionData);
      if (typeof id === "string") {
        // send notification to the admin
        const data = { id, ...transactionData };
        notify(data);
      }
      resetForm();
      alert("Payment request submitted successfully!");
    } catch (error) {
      console.error("Error submitting payment request:", error);
      alert("Failed to submit payment request. Please try again.");
    } finally {
      setLoading(false);
    }
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
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <Stack.Screen options={style} />

      <DropDownPicker
        open={open}
        value={projectCode}
        items={projectCodes}
        setOpen={setOpen}
        setValue={setProjectCode}
        placeholder="Project"
        textStyle={{ color: "#fff" }}
        style={[styles.input, errors.projectCode ? styles.inputError : null]}
        dropDownContainerStyle={[styles.dropdownContainer]}
        zIndex={1000}
      />

<TextInput
        placeholder="Amount"
        placeholderTextColor="#fff"
        value={amount}
        onChangeText={setAmount}
        style={[styles.input, errors.amount ? styles.inputError : null]}
        keyboardType="numeric"
      />

      <DropDownPicker
        open={optionsopen}
        value={option}
        items={options}
        setOpen={setoptionsOpen}
        setValue={setoption}
        setItems={setoptions}
        placeholder="Pay Type"
        textStyle={{ color: "#fff" }}
        style={[styles.input, errors.option ? styles.inputError : null]}
        dropDownContainerStyle={[styles.dropdownContainer]}
        zIndex={1000}
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
        style={[styles.input, errors.itemName ? styles.inputError : null]}
        dropDownContainerStyle={styles.dropdownContainer}
        zIndex={openItem ? 999 : 2}
      />
      {isOtherSelected && (
        <TextInput
          placeholder="Enter custom statement"
          placeholderTextColor="#fff"
          value={customStatement}
          onChangeText={setCustomStatement}
          style={[styles.input]}
        />
      )}

      <TouchableOpacity onPress={handlePickImages} style={styles.fileButton}>
        <Text style={styles.fileButtonText}>Pick Files</Text>
      </TouchableOpacity>

      <ImagePickerComponent
        ref={imagePickerRef}
        onImagesSelected={handleImagesSelected}
      />

      {!isKeyboardVisible && (
        <TouchableOpacity
          onPress={handleSubmit}
          style={styles.submitButton}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      )}

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </GestureHandlerRootView>
  );
};

export default memo(General);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#222",
    width: "100%",
  },
  input: {
    height: 50,
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#444",
    fontSize: 16,
    color: "#fff",
    width: "100%",
    elevation: 2,
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  inputError: {
    borderColor: "#E53935",
  },
  errorText: {
    color: "#E53935",
    fontSize: 14,
    alignSelf: "flex-start",
  },
  dropdown: {
    backgroundColor: "#444",
    borderColor: "#333",
    borderRadius: 10,
    elevation: 2,
  },
  dropdownContainer: {
    backgroundColor: "#444",
    borderColor: "#333",
    borderRadius: 10,
    elevation: 4,
  },
  fileButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    padding: 15,
    elevation: 2,
  },
  fileButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#1E3A8A",
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    position: "absolute",
    bottom: 20,
    alignContent: "center",
    justifyContent: "center",
    padding: 15,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    zIndex: 1000,
  },
});

const style: NativeStackNavigationOptions = {
  title: "Payment",
  headerStyle: {
    backgroundColor: "#222",
  },
  headerTintColor: "#fff",
  contentStyle: {
    backgroundColor: "#222",
  },
};
