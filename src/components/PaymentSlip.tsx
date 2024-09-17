import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { TransactionData } from "@/assets/Types";
import { formatTimestamp } from "@/src/utils/TimeFormat";
import { getStatusColor } from "@/src/utils/TransactionStatus";
import CopyClipBoard from "@/src/components/CopyClipBoard";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useData } from "../providers/DataProvider";

interface PaymentSlipProps {
  transactionData: TransactionData;
  status: string;
  viewShotRef: React.RefObject<View>;
  isMenuVisible: boolean;
  setMenuVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const PaymentSlip: React.FC<PaymentSlipProps> = ({
  transactionData,
  status,
  viewShotRef,
  isMenuVisible,
  setMenuVisible,
}) => {
  const router = useRouter();
  const [CanEdit, setCanEdit] = React.useState(false);
  const { userProfile } = useData();

  if (!transactionData) return null;

  const handleEditRequest = () => {
    const encodedData = encodeURIComponent(JSON.stringify(transactionData));
    // console.log(transactionData.development," development ",transactionData.BankId,"BankId");
    if (transactionData.BankId!==undefined && transactionData.BankId!==null && transactionData.BankId!=="") {
      router.push(`/EditPayments?id=${encodedData}` as any);
    } else if (transactionData.development !== undefined && transactionData.development !== null && transactionData.development !== "") {
      router.push(`/Editdevelopment?id=${encodedData}` as any);
    } else {
      router.push(`/EditPage?id=${encodedData}` as any);
    }
  };

  React.useEffect(() => {
    if (
      (transactionData.status === "Pending" ||
        transactionData.status === "Denied") &&
      transactionData.senderId === userProfile?.email
    ) {
      setCanEdit(true);
    }
  }, [transactionData]);

  return (
    <View style={styles.Container} ref={viewShotRef}>
      <View style={styles.header}>
        <Text style={styles.senderName} numberOfLines={1} ellipsizeMode="tail">
        {transactionData.senderName
    ? transactionData.senderName.length > 12
      ? `${transactionData.senderName.substring(0, 12)}...`
      : transactionData.senderName
    : "Unknown"}
        </Text>
        <Text style={styles.date}>
          {formatTimestamp(transactionData.timestamp)}
        </Text>

        {/* Three-dot menu */}
        {CanEdit && (
          <TouchableOpacity
            onPress={() => setMenuVisible(!isMenuVisible)}
            style={styles.menuButton}
          >
            <Ionicons name="ellipsis-vertical" size={14} color="#fff" />
          </TouchableOpacity>
        )}

        {/* Dropdown Menu */}
        {isMenuVisible && (
          <View style={styles.menu}>
            <TouchableOpacity
              onPress={() => {
                handleEditRequest();
                // Handle edit action here
                setMenuVisible(false); // Collapse menu after click
              }}
              style={styles.menuItem}
            >
              <Text style={styles.menuText}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Text style={styles.title}>
        Payment Status:{" "}
        <Text style={{ color: getStatusColor(status) }}>{status}</Text>
      </Text>
      <Text style={styles.amount}>₹ {transactionData.amount || "--"}</Text>
      <Text style={{ fontWeight: "bold", color: "white" }}>
        Project {transactionData.projectId || ""}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.transactionId}>
          Transaction ID: {transactionData.id || "NULL"}
        </Text>
        <CopyClipBoard text={transactionData.id || ""} />
      </View>
    </View>
  );
};

export default PaymentSlip;

const styles = StyleSheet.create({
  Container: {
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  senderName: {
    color: "#B0B0B0",
    fontSize: 18,
  },
  date: {
    color: "#B0B0B0",
    fontSize: 14,
    marginLeft: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#E0E0E0",
    borderRadius: 10,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  amount: {
    color: "#E0E0E0",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  transactionId: {
    color: "#B0B0B0",
    fontSize: 12,
  },
  menuButton: {
    padding: 1,
  },
  menu: {
    position: "absolute",
    top: 20,
    right: 8,
    backgroundColor: "#333",
    borderRadius: 5,
    padding: 2,
    zIndex: 1,
  },
  menuItem: {
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  menuText: {
    color: "#fff",
    fontSize: 16,
  },
});
