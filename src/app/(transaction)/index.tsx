import React, { useState, useEffect, memo } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity, RefreshControl } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import {
  BankData,
  developmentData,
  roles,
  status as Status,
} from "@/assets/Types";
import PaymentSlip from "@/src/components/PaymentSlip";
import Page404Error from "@/src/components/Page404Error";
import { DetailsComp } from "./helper/Details";
import { RejectedcauseComp } from "./helper/Rejected";
import { PermittebyComp } from "./helper/Permitted";
import { BankDetailsComp } from "./helper/BankDetails";
import LoadingPage from "./helper/LoadingPage";
import getData from "./helper/GetData";
import { DevDetailsComp } from "./helper/DevDetails";
import ImageRender from "./helper/imageRender";
import AdminActions from "@/src/components/MainButtons";
import { useData } from "@/src/providers/DataProvider";
import { ActivityIndicator } from "react-native-paper";
import DenyModal from "./helper/DenyModal";
import AccountantButtons from "@/src/components/AccButtons";
import BillsButtons from "@/src/components/UserButtons";
import { GetMessage } from "./helper/Message";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {Notify} from "./helper/Notification";
import { TransactionData } from '../../../assets/Types';
import { onSnapshot, doc, } from "@react-native-firebase/firestore";
import Firestore from "@react-native-firebase/firestore";

const Transaction: React.FC = () => {
  const { postDocumentwithDoc, userProfile,fetchDocument } = useData();
  const { id } = useLocalSearchParams();
  const [transactionData, setTransactionData] =
    useState<TransactionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [bankdata, setBankData] = useState<BankData | null>(null);
  const [developmentdata, setDevelopmentData] =
    useState<developmentData | null>(null);
  const [showError, setShowError] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [waiting, setWaiting] = useState(false);
  const [showDenyModal, setShowDenyModal] = useState(false);
  const [Denystatus, setDenyStatus] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();

  const onRefresh = async () => {
    setRefreshing(true);
    if (!transactionData){
      setRefreshing(false);
      return;
    }
    
    const unsubscribe = onSnapshot(
      doc(Firestore(), "transactions", transactionData.id),
      async (docSnapshot) => {
        if (docSnapshot.exists) {
          const parsedData = { id: docSnapshot.id, ...docSnapshot.data() } as unknown as TransactionData;
          setTransactionData(parsedData);
          setStatus(parsedData.status);

          // Fetch related data like BankData and DevelopmentData
          const fbankdata = await getData(parsedData.BankId, "BankDetails");
          const fdevelopmentdata = await getData(parsedData.development, "developmentData");
          setBankData(fbankdata);
          setDevelopmentData(fdevelopmentdata);
        } else {
          setShowError(true);
        }
      },
      (error) => {
        console.error("Error fetching real-time updates:", error);
        setShowError(true);
      }
    );
    setRefreshing(false);
    return () => unsubscribe(); // Clean up the listener when the component unmounts
  };

  useEffect(() => {
    if (!transactionData) {
      return;
    }
    const unsubscribe = onSnapshot(
      doc(Firestore(), "transactions", transactionData.id),
      async (docSnapshot) => {
        if (docSnapshot.exists) {
          const parsedData = {id:docSnapshot.id,...docSnapshot.data()} as TransactionData;
          setTransactionData(parsedData);
          setStatus(parsedData.status);
          // Fetch related data like BankData and DevelopmentData
          const fbankdata = await getData(parsedData.BankId, "BankDetails");
          const fdevelopmentdata = await getData(parsedData.development, "developmentData");
          setBankData(fbankdata);
          setDevelopmentData(fdevelopmentdata);
        } else {
          setShowError(true);
        }
      },
      (error) => {
        console.error("Error fetching real-time updates:", error);
        setShowError(true);
      }
    );

    return () => unsubscribe(); // Clean up the listener when the component unmounts
  }, [status]);

  useEffect(() => {
    if (!id) {
      setShowError(true);
      return;
    }
    const fetchdata = async () => {
      setLoading(true);
      try {
        const parsedData: TransactionData = JSON.parse(
          decodeURIComponent(id.toString())
        );
        setTransactionData(parsedData);
        setStatus(parsedData.status);
        const fbankdata = await getData(parsedData.BankId, "BankDetails");
        const fdevelopmentdata = await getData(
          parsedData.development,
          "developmentData"
        );
        console.log("bankdata", fbankdata);
        setBankData(fbankdata);
        setDevelopmentData(fdevelopmentdata);
      } catch (error) {
        console.error("Error parsing data:", error);
      }
      setLoading(false);
    };
    fetchdata();
  }, [id]);

  if (showError) return <Page404Error />;
  if (!transactionData) return <LoadingPage />;

  const handleDenypress = async (cause: string) => {
    setWaiting(true);
    console.log("cause", cause);
    try {
      await postDocumentwithDoc("transactions", transactionData.id, {
        status: Denystatus,
        rejectedcause: cause,
        permitteby: {
          id: userProfile?.email,
          name: userProfile?.name,
        },
      });
      transactionData.rejectedcause = Denystatus;
      Notify({
        transactionData: transactionData,
        statement: "Transaction Rejected",
        sendTo: [transactionData.senderId, transactionData.AccountantId,transactionData.receiverId],
        fetchDocument: fetchDocument,
      });
      setStatus(Status.fail);
    setWaiting(false);
    } catch (e) {
      console.log("error updating status", e);
    }
    setWaiting(false);
    setStatus(Status.fail);
    setShowDenyModal(false);
  };

  const handleStateChange = async (newstatus: string) => {
    if (newstatus === Status.phase3) {
      setWaiting(true);
      await postDocumentwithDoc("transactions", transactionData.id, {
        status: newstatus,
      });
      transactionData.status = newstatus;
      Notify({
        transactionData: transactionData,
        statement: "Transaction main"+ newstatus,
        sendTo: [transactionData.senderId],
        fetchDocument: fetchDocument,
      });
      setStatus(newstatus);
      setWaiting(false);
      return;
    } else if (newstatus === Status.phase4) {
      setWaiting(true);
      await postDocumentwithDoc("transactions", transactionData.id, {
        status: newstatus,
      });
      setStatus(newstatus);
      Notify({
        transactionData: transactionData,
        statement: "Transaction "+ newstatus,
        sendTo: [transactionData.senderId, transactionData.AccountantId,transactionData.receiverId],
        fetchDocument: fetchDocument,
      });
      setWaiting(false);
      return;
    }

    const message = GetMessage(newstatus);

    Alert.alert(
      "",
      "Are you sure you want to " + message + " this transaction?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            // setWaiting(true);
            if (newstatus === status) {
              Notify({
                transactionData: transactionData,
                statement: "Transaction "+ newstatus,
                sendTo: [transactionData.senderId, transactionData.AccountantId,transactionData.receiverId],
                fetchDocument: fetchDocument,
              });
              setWaiting(false);
              return;
            }
            if (newstatus === Status.fail || newstatus === Status.qualityfail || newstatus === Status.Suspend) {
              setDenyStatus(newstatus);
              setShowDenyModal(true);
              setWaiting(false);
              return;
        
            }
            let payload = {};
            if (
              userProfile?.role === roles.roles_1 ||
              userProfile?.role === roles.roles_4
            ) {
              payload = {
                status: newstatus,
                permitteby: {
                  id: userProfile?.email,
                  name: userProfile?.name,
                },
              };
            } else {
              payload = {
                status: newstatus,
              };
            }
            console.log("payload", payload);
            try {
              setWaiting(true);
              await postDocumentwithDoc(
                "transactions",
                transactionData.id,
                payload
              );
            } catch (e) {
              console.log("error updating status", e);
            }
            transactionData.status = newstatus;
            Notify({
              transactionData: transactionData,
              statement: "Transaction "+ message,
              sendTo: [transactionData.senderId, transactionData.AccountantId,transactionData.receiverId],
              fetchDocument: fetchDocument,
            });
            setStatus(newstatus);
            setWaiting(false);
            console.log("Yes Pressed");
          },
        },
      ]
    );
  };

  const EditPage = (PaymentMethods: string) => {
    const encodedData = encodeURIComponent(JSON.stringify(transactionData));
    if (PaymentMethods === "Site Expenditure") {
      router.push(`/EditPage?id=${encodedData}` as any);
    } else if (PaymentMethods === "Material and PO Payment") {
      router.push(`/EditPayments?id=${encodedData}` as any);
    } else if (PaymentMethods === "General") {
      router.push(`/Editdevelopment?id=${encodedData}` as any);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Stack.Screen options={StackProps} />
      <ScrollView style={[styles.container, { padding: 15 }]}
      // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {
      //   console.log('Do refresh');
      //   onRefresh}} />} // Pull to refresh
      >
        <View key={transactionData.id}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.title}>{transactionData.PaymentMethods}</Text>
          {userProfile?.email === transactionData.senderId && (
          <TouchableOpacity
            onPress={() =>
              transactionData.PaymentMethods &&
              EditPage(transactionData.PaymentMethods)
            }
          >
            <MaterialCommunityIcons
              name="circle-edit-outline"
              size={24}
              color="white"
            />
          </TouchableOpacity>)}
        </View>

        <PaymentSlip transactionData={transactionData} status={status} />
        {transactionData.rejectedcause && (
          <RejectedcauseComp rejectedcause={transactionData.rejectedcause} />
        )}
        {transactionData.permitteby && (
          <PermittebyComp permitteby={transactionData.permitteby.name} />
        )}
        {transactionData.details && (
          <DetailsComp details={transactionData.details} />
        )}
        {bankdata && <BankDetailsComp bankdetails={bankdata} />}
        {developmentdata && (
          <DevDetailsComp developmentData={developmentdata} />
        )}
        {transactionData.urilinks && (
          <ImageRender images={transactionData.urilinks} title="Attachments" />
        )}
        {transactionData.AccountantUri && (
          <ImageRender
            images={transactionData.AccountantUri}
            title="Accountant Attachments"
          />
        )}
        {transactionData.Recipts && (
          <ImageRender images={transactionData.Recipts} title="Recipts" />
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
      {/* //buttons */}
      <AdminActions
        status={status}
        handleStateChange={(newstatus: string) => handleStateChange(newstatus)}
      />
      {showDenyModal && (
        <DenyModal
          status={Denystatus}
          handleDenypress={(cause: string) => handleDenypress(cause)}
          handleDismiss={(dismiss: boolean) => setShowDenyModal(dismiss)}
        />
      )}
      <AccountantButtons
        status={status}
        handleStateChange={(newstatus: string) => handleStateChange(newstatus)}
        id={transactionData.id}
        transactionData={transactionData}
      />

      <BillsButtons
        status={status}
        handleStateChange={(newstatus: string) => handleStateChange(newstatus)}
        sender={transactionData.senderId}
        id={transactionData.id}
        transactionData={transactionData}
      />

      {waiting && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </GestureHandlerRootView>
  );
};

const StackProps = {
  title: "Transaction",
  headerStyle: { backgroundColor: "#222" },
  headerTintColor: "#fff",
};

export default Transaction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
    alignContent: "center",
  },
  loading: {
    flex: 1,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 24,
    margin: 5,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});
