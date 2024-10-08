import React, { useState, useRef, useEffect, memo } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Keyboard,
  Alert,
} from "react-native";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import DropDownPicker from "react-native-dropdown-picker";
import ImagePickerComponent, {
  ImagePickerComponentRef,
} from "@/src/components/ImagePicker";
import { useData } from "../../providers/DataProvider";
import firestore from "@react-native-firebase/firestore";
import { Stack,useLocalSearchParams, useRouter } from "expo-router";
import sendPushNotification from "@/src/lib/notifications";
import { TransactionData,BankData,status } from "@/assets/Types";
import { uploadImage } from "@/src/utils/uploadImage";
import { Notify } from "./helper/Notification";
const EditPaymentRequest = () => {

    // data hooks
    const { id } = useLocalSearchParams();
  const { userProfile, postDocument, fetchCollection, fetchDocument ,postDocumentwithDoc} =
    useData();

  // form state

  const [projectCodes, setProjectCodes] = useState<any[]>([]);
  const [amount, setAmount] = useState<string>("");
  const [itemName, setItemName] = useState<string>("");
  const [projectCode, setProjectCode] = useState<string | null>(null);
  const [ponumber, setPonumber] = useState<string>("");
  const [vendorname, setVendorname] = useState<string>("");
  const [ifsc, setIfsc] = useState<string>("");
  const [accountnumber, setAccountnumber] = useState<string>("");

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
  const [transactionData, setTransactionData] =
    useState<TransactionData | null>(null);
  const router = useRouter();

  // set transaction data
  useEffect(() => {
      const fetchData = async () => {
        if (id) {
          try {
            const decodedData = JSON.parse(decodeURIComponent(id.toString()));
            const BankData = await fetchDocument("BankDetails", decodedData.BankId);
            setTransactionData(decodedData);
            setAmount(decodedData.amount);
            setProjectCode(decodedData.projectId);
            setIfsc(BankData.ifsc);
            setPonumber(BankData.ponumber);
            setVendorname(BankData.vendorname);
            setAccountnumber(BankData.accountNumber);
            setImages(decodedData.urilinks);
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
      };
      fetchData();
    }, [id]);

    useEffect(() => {
      if(isOtherSelected){
        setItemName(customStatement);
      }
    }
    ,[isOtherSelected, customStatement]);
  



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
          sendPushNotification(session, "Payment Request","A Updated Request", transactionData);
          console.log("Notification sent to", session);
        });
      }
    }
  };

  const deleteDocument = async () => {
    try {
      await firestore().collection("BankDetails").doc(transactionData?.BankId).delete();
      await firestore()
        .collection("transactions") 
        .doc(transactionData?.id) 
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

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!amount) newErrors.amount = "Amount is required";
    if (!projectCode) newErrors.projectCode = "Project Code is required";
    if (!ponumber) newErrors.ponumber = "PO Number is required";
    if (!vendorname) newErrors.vendorname = "Vendor Name is required";
    if (!ifsc) newErrors.ifsc = "IFSC Code is required";
    if (!accountnumber) newErrors.accountnumber = "Account Number is required";
    // if (isOtherSelected && !customStatement)
    //   newErrors.customStatement = "Custom statement is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setAmount("");
    setItemName("");
    setErrors({});
    setPonumber("");
    setVendorname("");
    setIfsc("");
    setAccountnumber("");
    setOpen(false);
    setOpenItem(false);
    setImages([]);
    imagePickerRef.current?.clearSelectedImages();
  };

  const handleImagesSelected = (selectedImages: string[]) => {
    setImages(selectedImages);
  };

  const handlePickImages = () => {
    imagePickerRef.current?.pickImages();
  };

  const handleSubmit = async () => {
    // console.log("Submitting form data");
    if (!validateForm()) {
      console.log("Form is invalid");
      return;
    }
    // console.log("Form is valid");

    setLoading(true);

    const uploadedImages = await Promise.all(images.map(uploadImage));
    const successfulUploads = uploadedImages.filter((url) => url !== null);

    console.log("Uploaded images:", successfulUploads);
    if (successfulUploads.length !== uploadedImages.length) {
      setLoading(false);
      alert("Failed to upload images. Please try again.");
      return;
    }
    console.log("new account number", accountnumber);
    const bankData: BankData = {
        accountNumber: accountnumber,
        ifsc: ifsc,
        ponumber: ponumber,
        vendorname: vendorname,
        timestamp: firestore.Timestamp.now(),
    };
    if(transactionData?.BankId){
      await postDocumentwithDoc("BankDetails", transactionData?.BankId,bankData);
      }else {
        console.log("Bank details not updated");
      }
      const transactionDatasnap: TransactionData = {
        amount: amount || "", // fallback to an empty string if undefined
        details: itemName || "",
        editedtime: firestore.Timestamp.now(),
        projectId: projectCode || "",
        receiverId: transactionData?.receiverId || "",
        rejectedcause: "NULL",
        senderId: transactionData?.senderId || "",
        senderName: transactionData?.senderName || "",
        status: status.inital,
        timestamp: transactionData?.timestamp || firestore.Timestamp.now(),
        urilinks: successfulUploads || [],
        AccountantUri: transactionData?.AccountantUri || [],
        BankId: transactionData?.BankId || "",
        development: transactionData?.development || "",
        id: transactionData?.id || "",
        Recipts: transactionData?.Recipts || [],
        AccountantId: transactionData?.AccountantId || "",
        permitteby: transactionData?.permitteby || null, // explicitly set null if undefined
        PaymentMethods: transactionData?.PaymentMethods || "",
      };

    try {
      await firestore().collection("transactions").doc(transactionData?.id).set(transactionDatasnap);
      Notify({
        transactionData: transactionDatasnap,
        statement: "Edited Payment Request",
        sendTo:[ transactionData?.senderId || "", transactionData?.AccountantId || "", transactionData?.receiverId || ""],
        fetchDocument: fetchDocument,
      });
      resetForm();
      Alert.alert("Successfully updated!", "Your payment request has been successfully updated.",
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
      console.error("Error updating payment request:", error);
      alert("Failed to updating payment request. Please try again.");
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
      <ScrollView
          style={styles.scrollcontainer}
          nestedScrollEnabled={true}
          contentContainerStyle={styles.scrollContent}
        >

      <DropDownPicker
      listMode="SCROLLVIEW"
      scrollViewProps={{
        nestedScrollEnabled: true,
      }}
        open={open}
        value={projectCode}
        items={projectCodes}
        setOpen={setOpen}
        setValue={setProjectCode}
        placeholder="Project"
        textStyle={{ color: "#fff" }}
        style={[styles.input, errors.projectCode ? styles.inputError : null]}
        dropDownContainerStyle={[
          styles.dropdownContainer,
          {
            position: "relative",
            top: -10,
          },
        ]}
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

      <TextInput
        placeholder="PO Number"
        placeholderTextColor="#fff"
        value={ponumber}
        onChangeText={setPonumber}
        style={[styles.input, errors.ponumber ? styles.inputError : null]}
        keyboardType="default"
      />

      <TextInput
        placeholder="Vendor Name"
        placeholderTextColor="#fff"
        value={vendorname}
        onChangeText={setVendorname}
        style={[styles.input, errors.vendorname ? styles.inputError : null]}
        keyboardType="default"
      />

      <TextInput
        placeholder="IFSC Code"
        placeholderTextColor="#fff"
        value={ifsc}
        onChangeText={setIfsc}
        style={[styles.input, errors.ifsc ? styles.inputError : null]}
        keyboardType="default"
      />

      <TextInput
        placeholder="Account Number"
        placeholderTextColor="#fff"
        value={accountnumber}
        onChangeText={setAccountnumber}
        style={[styles.input, errors.accountnumber ? styles.inputError : null]}
        keyboardType="default"
      />

      <DropDownPicker
      listMode="SCROLLVIEW"
      scrollViewProps={{
        nestedScrollEnabled: true,
      }}
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
        placeholder="Remark"
        textStyle={{ color: "#fff" }}
        style={[styles.input, errors.itemName ? styles.inputError : null]}
        dropDownContainerStyle={[
          styles.dropdownContainer,
          {
            position: "relative",
            top: -10,
          },
        ]}
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

<View style={styles.bottomSpace} />
      </ScrollView>
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

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </GestureHandlerRootView>
  );
};

export default memo(EditPaymentRequest);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#222",
    width: "100%",
  },
  scrollcontainer: {
    flex: 1,
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
  scrollContent: {
    paddingBottom: 100, // Or any desired value to add scrollable space at the bottom
  },
  bottomSpace: {
    height: 100, // Adjust this value to create extra scrollable space
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
