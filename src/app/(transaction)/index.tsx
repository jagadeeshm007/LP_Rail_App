import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { ActivityIndicator, Button, Card, Modal } from "react-native-paper";
import { getFirestore, doc, updateDoc } from "@react-native-firebase/firestore";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import { BankData, developmentData, TransactionData } from "@/assets/Types";
import { TextInput } from "react-native-paper";
import PaymentSlip from "@/src/components/PaymentSlip";
import ShareButton from "@/src/components/ShareButton";
import Page404Error from "@/src/components/Page404Error";
import CopyClipBoard from "@/src/components/CopyClipBoard";
import MainButtons from "@/src/components/MainButtons";
import AccountantButtons from "@/src/components/AccButtons";
import uploadToCloudinary from "@/src/utils/uploadToCloudinary";
import DropDownPicker from "react-native-dropdown-picker";
import { useData } from "@/src/providers/DataProvider";
import { NativeStackNavigationOptions } from "react-native-screens/lib/typescript/native-stack/types";
import UserButtons from "@/src/components/UserButtons";
import sendPushNotification from "@/src/lib/notifications";
import ImageViewing from "react-native-image-viewing"; // Import the image viewer library
import { permittebytype } from '../../../assets/Types';

const Transaction: React.FC = () => {
  const { fetchCollection } = useData();
  const viewShotRef = useRef<View>(null);
  const { id } = useLocalSearchParams();
  const [transactionData, setTransactionData] =
    useState<TransactionData | null>(null);
  const [status, setStatus] = useState<string>("Unknown");
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImageSet, setSelectedImageSet] = useState<string[]>([]);
  const [denycause, setDenycause] = useState<string>("");
  const [showInput, setShowInput] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [preloading, setPreloading] = useState(true);
  const [itemName, setItemName] = useState<string>("");
  const [openItem, setOpenItem] = useState<boolean>(false);
  const [isOtherSelected, setIsOtherSelected] = useState<boolean>(false);
  const [type, settype] = useState<string>("Site Expenditure");
  const [bankdata, setbankdata] = useState<BankData | null>(null);
  const [developmentdata, setdevelopmentdata] = useState<developmentData | null>(null);
  const { userProfile,fetchDocument } = useData();
  

  const [StatementOptions, setStatementOptions] = useState<any[]>([
    { label: "Other (Enter manually)", value: "Other (Enter manually)" },
  ]);

  useEffect(() => {
    const fetchStatements = async () => {
      try {
        const codes = await fetchCollection("DenyReasons");
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
    const timer = setTimeout(() => {
      setPreloading(false);
    }, 100000); // 100 seconds

    return () => clearTimeout(timer); // Clear timer on unmount
  }, []);

  const closeMenu = () => {
    if (isMenuVisible) setMenuVisible(false);
  };

  useEffect( ()  => {
    if (id) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(id.toString()));
        setTransactionData(parsedData);
        setStatus(parsedData.status);
        settype(parsedData.PaymentMethods);
        if(parsedData.BankId || parsedData.development) {
          if(parsedData.BankId){
            try{
            const data = fetchDocument("BankDetails", parsedData.BankId);
            data.then((doc) => {
              setbankdata(doc);
            });
            console.log("Bank Data", bankdata);
          } catch (error) {
            console.error("Error parsing data of bank:", error);
          }
          }
          else{
            try{
            const data = fetchDocument("developmentData", parsedData.development);
            data.then((doc) => {
              setdevelopmentdata(doc);
            });
          } catch (error) {
            console.error("Error parsing data of development:", error);
          }
          }
        }
        setPreloading(false);
      } catch (error) {
        console.error("Error parsing data:", error);
      }
    }
  }, [id]);

  const notify = async (statement:string) => {
    console.log("Transaction Data", transactionData);
    if (transactionData?.senderId) {
      console.log("User Profile", transactionData.senderId);
      const tokens = await fetchDocument("Tokens", transactionData.senderId);
      const sessions = tokens.sessions;
      console.log("Tokens", tokens.sessions);
      if (sessions.length > 0) {
        sessions.map((session: string, index: string) => {
          sendPushNotification(session, "Payment Request",statement, transactionData);
          console.log("Notification sent to", session);
        });
      }
    }
    if (transactionData?.AccountantId) {
      console.log("User Profile", transactionData.AccountantId);
      const tokens = await fetchDocument("Tokens", transactionData.AccountantId);
      const sessions = tokens.sessions;
      console.log("Tokens", tokens.sessions);
      if (sessions.length > 0) {
        sessions.map((session: string, index: string) => {
          sendPushNotification(session, "Payment Request",statement, transactionData);
          console.log("Notification sent to", session);
        });
      }
    }
  };

  const handleDenypress = async () => {
    if (!transactionData?.id) return;
    try {
      if(userProfile?.role !== "Accountant"){
      await updateDoc(doc(getFirestore(), "transactions", transactionData.id), {
        status: "Denied",
        rejectedcause: denycause,
        permitteby: {name: userProfile?.name ?? "Admin", id: userProfile?.email ?? "Admin"},
      });
    }
    else {
      await updateDoc(doc(getFirestore(), "transactions", transactionData.id), {
        status: "Denied",
        rejectedcause: denycause,
      });
    }
      setStatus("Denied");
      router.replace("/(tabs)");
      console.log("Status updated to Denied");
      transactionData.status = "Denied";
      notify("Request Rejected");
    
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  const handleEdit = async (currstate: string) => {
    if (!transactionData?.id) return;
    try{
    await updateDoc(doc(getFirestore(), "transactions", transactionData.id), {
      status: currstate,
      rejectedcause: "NULL",
    }).then(() => {

    setStatus(currstate);
    setDenycause("");
    transactionData.status = "Pending";
    notify("A Updated Request");
    console.log("Status updated to ",currstate);
    });
  } catch (error) {
    console.error("Error updating status:", error);
  }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!transactionData?.id) return;
    try {
      if(newStatus==="postAccepted"){
        await updateDoc(doc(getFirestore(), "transactions", transactionData.id), {
          status: "Accepted",
          
        });
        setStatus("Accepted");
        transactionData.status = "Accepted";
      notify("Request has been Accepted");
        
      }
      else if(newStatus==="Accepted"){
        await updateDoc(doc(getFirestore(), "transactions", transactionData.id), {
          status: "Processing",
          rejectedcause: "NULL",
          permitteby: {name: userProfile?.name ?? "Admin", id: userProfile?.email ?? "Admin"},
        });
        setStatus("Processing");
        transactionData.status = "Processing";
      notify("Request is in Processing Now");
      }
      else{
      await updateDoc(doc(getFirestore(), "transactions", transactionData.id), {
        status: newStatus,
      });
      setStatus(newStatus);
      transactionData.status = newStatus;
      notify("Request "+newStatus);
    }
      console.log("Status updated to", newStatus);
      
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleReturnfiles = async (newStatus: string[]) => {
    if (!transactionData?.id) return;
    console.log("AccountantUri updated to", newStatus);
    try {
      await updateDoc(doc(getFirestore(), "transactions", transactionData.id), {
        AccountantUri: newStatus,
      });
      console.log("AccountantUri updated to", newStatus);
    } catch (error) {
      console.error("Error updating AccountantUri:", error);
    }
  };

  const handleRecipts = async (newStatus: string[]) => {
    if (!transactionData?.id) return;
    console.log("Recipts updated to", newStatus);
    try {
      await updateDoc(doc(getFirestore(), "transactions", transactionData.id), {
        Recipts: newStatus,
      });
      console.log("Recipts updated to", newStatus);
    } catch (error) {
      console.error("Error updating Recipts:", error);
    }
  };

  if (preloading) return <View style={styles.blank} />;

  if (!transactionData) {
    return <Page404Error />;
  }

  const handleDeny = () => {
    setShowInput(true);
  };

  const ImagePickerHandler = async () => {
    // pick image from gallery
    try {
      setLoading(true); // Start loading
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
      setLoading(false); // End loading
      setSelectedImages((prevImages) => {
        handleReturnfiles(prevImages);
        return prevImages;
      });
      Alert.alert("Success", "successfully Updated the payment");
      handleUpdateStatus("postAccepted");
    }
  };

  const ReciptsPicker = async () => {
    // pick image from gallery
    try {
      setLoading(true); // Start loading
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
      setLoading(false); // End loading
      setSelectedImages((prevImages) => {
        handleRecipts(prevImages);
        return prevImages;
      });
      notify("Recipts Uploaded");
    }
  };

  const handleImageClick = (imageSet: string[], index: number) => {
    setSelectedImageSet(imageSet);
    setCurrentImageIndex(index);
    setIsViewerVisible(true);
  };

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

  const validInitialScrollIndex = (list: any[], index: number) => {
    return list.length > index ? index : 0;
  };

  // console.log("Transaction Data", transactionData.details);
  const receipts = transactionData?.Recipts ?? [];

  const convertToText = (data: BankData) => {
    return `Vendor Name: ${data.vendorname}\nAccount Number: ${data.accountNumber}\nIFSC Code: ${data.ifsc}\nPO Number: ${data.ponumber}`;
  }


  return (
    <TouchableWithoutFeedback style={{ flex: 1 }} onPress={closeMenu}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <Stack.Screen
            options={{
              title: "Transaction",
              headerStyle: { backgroundColor: "#222" },
              headerTintColor: "#fff",
              headerRight: () => <ShareButton viewShotRef={viewShotRef} />,
            }}
          />
          <ScrollView style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          >
            {/* // title of the transaction */}
            {
              <View style={{margin:10}}>
                <Text style={{color:'white', fontSize:20,fontWeight:'bold'}}>
                  {type}
                </Text>
              </View>
            }
            <PaymentSlip
              transactionData={transactionData}
              status={status}
              viewShotRef={viewShotRef}
              isMenuVisible={isMenuVisible}
              setMenuVisible={setMenuVisible}
            />
            {(transactionData.rejectedcause !== "NULL" && transactionData.rejectedcause !== '') && (
              <Card style={{marginVertical:10, padding: 10,backgroundColor: "rgba(255, 72, 72, 0.8)", // semi-transparent rich red color
                borderRadius: 8, 
                elevation: 5, borderColor:"rgba(255, 42, 42, 0.9)",borderWidth:2}}>
                <Text style={{ color: "#fff", fontSize: 16 }}>
                  Rejected Cause: {transactionData.rejectedcause}
                </Text>
              </Card>
            )}

            { transactionData.permitteby && (
              <Card style={{marginVertical:10, padding: 10,backgroundColor: "#758AA2", // semi-transparent rich red color
                borderRadius: 8, 
                elevation: 5, borderColor:"#978AA2",borderWidth:2}}>
                  <Text style={{ color: "#fff", fontSize: 16 }} numberOfLines={1} ellipsizeMode='tail'>
                  Permitted by {transactionData.permitteby.name}
                  </Text>
              </Card>
            )}
            
            {transactionData.details &&
              (
                <View
                style={{
                  flex: 1,
                  marginVertical: 10,
                  backgroundColor: "#888",
                  padding: 20,
                  borderRadius: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color: "#E0E0E0",
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                  >
                    Details:
                  </Text>
                  <CopyClipBoard text={transactionData.details} />
                </View>

                <Text style={{ color: "#E0E0E0", fontSize: 18 }}>
                  {transactionData.details}
                </Text>
              </View>
              )
            }
            {/* //-------------------------------------------------------------------------------------> // */}
            {
              (bankdata ) && (
                <View
                style={{
                  flex: 1,
                  marginVertical: 10,
                  backgroundColor: "#888",
                  padding: 20,
                  borderRadius: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color: "#E0E0E0",
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                  >
                    Bank Details:
                  </Text>
                  <CopyClipBoard text={convertToText(bankdata)} />
                </View>

                <Text style={{ color: "#E0E0E0", fontSize: 18 }} >
                  <Text style={{ color: "#E0E0E0", fontSize: 18, fontWeight: "bold" }}>
                    Vendor Name:
                  </Text>
                  {bankdata?.vendorname}
                </Text>
                <Text style={{ color: "#E0E0E0", fontSize: 18 }}>
                <Text style={{ color: "#E0E0E0", fontSize: 18, fontWeight: "bold" }}>
                    Account Number:
                  </Text>
                  {bankdata?.accountNumber}
                </Text>
                <Text style={{ color: "#E0E0E0", fontSize: 18 }}>
                <Text style={{ color: "#E0E0E0", fontSize: 18, fontWeight: "bold" }}>
                    IFSC Code:
                  </Text>
                  {bankdata?.ifsc}
                </Text>
                <Text style={{ color: "#E0E0E0", fontSize: 18 }}>
                <Text style={{ color: "#E0E0E0", fontSize: 18, fontWeight: "bold" }}>
                    PO Number:
                  </Text>
                  {bankdata?.ponumber}
                </Text>
              </View>
              )
            }
            {
              (developmentdata  ) && (
                <View
                style={{
                  flex: 1,
                  marginVertical: 10,
                  backgroundColor: "#888",
                  padding: 20,
                  borderRadius: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color: "#E0E0E0",
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                  >
                    Payed for:<Text style={{color:'#fff',fontWeight:'500',fontSize:18}}>{developmentdata?.payfor}</Text>
                  </Text>
                  <CopyClipBoard text={developmentdata.payfor} />
                </View>
              </View>
              )
            }
            <ScrollView
              style={{
                flex: 1,
                backgroundColor: "#444",
                margin: 1,
                borderRadius: 20,
                maxHeight: 350,
              }}
            
            >
              {transactionData.urilinks?.length > 0 && (
              <View style={{ margin: 10 }}>
                <Text
                  style={{ color: "#E0E0E0", fontSize: 20, fontWeight: "bold" }}
                >
                  Attachments
                </Text>
                <ScrollView
                  horizontal={true}
                  contentContainerStyle={{
                    alignItems: "flex-start",
                    justifyContent: "center",
                  }}
                  showsHorizontalScrollIndicator={false}
                >
                  <View style={styles.imageRow}>
                    {transactionData.urilinks?.map(
                      (link, index) =>
                        typeof link === "string" &&
                        link !== "" && (
                          <TouchableOpacity
                            key={index}
                            onPress={() =>
                              handleImageClick(transactionData.urilinks, index)
                            }
                            style={styles.imageview}
                          >
                            <Image
                              source={{ uri: link }}
                              style={styles.image}
                              resizeMode="cover"
                            />
                          </TouchableOpacity>
                        )
                    )}
                  </View>
                </ScrollView>
              </View>)}
            </ScrollView>
            <ScrollView
              style={{
                flex: 1,
                backgroundColor: "#444",
                margin: 1,
                borderRadius: 20,
                maxHeight: 350,
              }}>
                {transactionData.AccountantUri?.length > 0 && (
                <View style={{ flex: 1, margin: 10 }}>
                <Text
                  style={{ color: "#E0E0E0", fontSize: 20, fontWeight: "bold" }}
                >
                  Confirmation Attachments
                </Text>
                <ScrollView
                  horizontal={true}
                  contentContainerStyle={{
                    alignItems: "flex-start",
                    justifyContent: "center",
                  }}
                >
                  <View style={styles.imageRow}>
                    {transactionData.AccountantUri?.map(
                      (link, index) =>
                        typeof link === "string" &&
                        link !== "" && (
                          <TouchableOpacity
                            key={index}
                            onPress={() =>
                              handleImageClick(
                                transactionData.AccountantUri,
                                index
                              )
                            }
                            style={styles.imageview}
                          >
                            <Image
                              source={{ uri: link }}
                              style={styles.image}
                              resizeMode="cover"
                            />
                          </TouchableOpacity>
                        )
                    )}
                  </View>
                </ScrollView>
              </View>)}

              </ScrollView>

              {/* {--------------------------------------------------------------------------------------} */}

              <ScrollView
              style={{
                flex: 1,
                backgroundColor: "#444",
                margin: 1,
                borderRadius: 20,
                maxHeight: 350,
              }}>
                {transactionData.Recipts?.length > 0 && (
                <View style={{ flex: 1, margin: 10 }}>
                <Text
                  style={{ color: "#E0E0E0", fontSize: 20, fontWeight: "bold" }}
                >
                  Recipts
                </Text>
                <ScrollView
                  horizontal={true}
                  contentContainerStyle={{
                    alignItems: "flex-start",
                    justifyContent: "center",
                  }}
                >
                  <View style={styles.imageRow}>
                    {transactionData.Recipts?.map(
                      (link, index) =>
                        typeof link === "string" &&
                        link !== "" && (
                          <TouchableOpacity
                            key={index}
                            onPress={() =>
                              handleImageClick(
                                transactionData.Recipts,
                                index
                              )
                            }
                            style={styles.imageview}
                          >
                            <Image
                              source={{ uri: link }}
                              style={styles.image}
                              resizeMode="cover"
                            />
                          </TouchableOpacity>
                        )
                    )}
                  </View>
                </ScrollView>
              </View>)}

              </ScrollView>

              <View style={{margin:100}} />

          </ScrollView>
          {/* // on overlaping components------------------------------------------- */}
          
          {Platform.OS !== 'web' && (
          <ImageViewing
              images={selectedImageSet.map((uri) => ({ uri })) || []}
              imageIndex={validInitialScrollIndex(
                selectedImageSet,
                currentImageIndex
              )}
              visible={isViewerVisible}
              onRequestClose={() => setIsViewerVisible(false)}
              FooterComponent={({ imageIndex }) => (
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() =>
                    saveImageToGallery(transactionData.urilinks[imageIndex])
                  }
                >
                  <Text style={styles.saveButtonText}>Save to Gallery</Text>
                </TouchableOpacity>
              )}
            />)}


          {showInput && (
              <Modal
                visible={showInput}
                onDismiss={() => setShowInput(false)}
                contentContainerStyle={{
                  backgroundColor: "#333",
                  padding: 20,
                  borderRadius: 10,
                  margin: 20,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 20,
                    fontWeight: "bold",
                    marginBottom: 10,
                  }}
                >
                  Deny Cause
                </Text>
                <DropDownPicker
                  open={openItem}
                  value={isOtherSelected ? "Other (Enter manually)" : itemName}
                  items={StatementOptions}
                  setOpen={setOpenItem}
                  setValue={(callback) => {
                    const value =
                      typeof callback === "function"
                        ? callback(itemName)
                        : callback;
                    if (value === "Other (Enter manually)") {
                      setIsOtherSelected(true);
                    } else {
                      setIsOtherSelected(false);
                      setItemName(value);
                    }
                  }}
                  placeholder="Reasons"
                  textStyle={{ color: "#fff" }}
                  style={styles.input}
                  dropDownContainerStyle={styles.dropdownContainer}
                  zIndex={openItem ? 999 : 2}
                />
                {isOtherSelected && (
                  <TextInput
                    mode="outlined"
                    placeholder="Enter the cause for deny"
                    value={denycause}
                    onChangeText={setDenycause}
                    style={{ marginBottom: 10, backgroundColor: "#444" }}
                    textColor="#fff"
                    placeholderTextColor="#888"
                  />
                )}

                <Button
                  mode="contained"
                  onPress={() => {
                    handleDenypress();
                    setShowInput(false);
                  }}
                  style={{ borderRadius: 10, backgroundColor: "#d22" }}
                  labelStyle={{ color: "#fff" }}
                >
                  Deny
                </Button>
              </Modal>
            )}

            {/* ------------------------------------------------------------------------------------buttons  */}
          <MainButtons
            status={status}
            handleUpdateStatus={handleUpdateStatus}
            handleDeny={handleDeny}
            handleEdit={() => handleEdit("Pending")}
          />
          <AccountantButtons
              status={status}
              handleUpdateStatus={handleUpdateStatus}
              handleDeny={handleDeny}
              handleEdit={() => handleEdit("Processing")}
              ImagePickerHandler={() => ImagePickerHandler()}
            />

            {receipts.length <= 0 &&(
              <UserButtons
              status={status}
              handleUpdateStatus={handleUpdateStatus}
              handleDeny={handleDeny}
              handleEdit={() => handleEdit("Pending")}
              ReciptsPickerHandler={() => ReciptsPicker()}
            />)}
            
        </ScrollView>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
      </GestureHandlerRootView>
    </TouchableWithoutFeedback>
  );
};

export default Transaction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#222",
  },
  blank: {
    flex: 1,
    backgroundColor: "#222",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  Attachements: {
    color: "#E0E0E0",
    fontSize: 24,
    fontWeight: "bold",
    margin: 20,
  },
  imageRow: {
    flexDirection: "row",
    padding: 5,
    borderRadius: 30,
  },
  saveButton: {
    backgroundColor: "rgba(50, 50, 50, 0.75)", // Dark theme color
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    margin: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
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
  dropdownContainer: {
    backgroundColor: "#444",
    borderColor: "#333",
    borderRadius: 10,
    elevation: 4,
  },
  imageview: {
    width: 100,
    height: 100,
    margin: 3,
    padding: 2,
    
    backgroundColor: "#111",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});


const options: NativeStackNavigationOptions = {
  title: "Payment",
  headerStyle: {
    backgroundColor: "#222",
  },
  headerTintColor: "#fff",
};