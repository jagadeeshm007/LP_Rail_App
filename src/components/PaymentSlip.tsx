import React from "react";
import { View, Text, StyleSheet } from 'react-native';
import { TransactionData } from "@/assets/Types";
import { formatTimestamp } from "@/src/utils/TimeFormat";
import { getStatusColor } from "@/src/utils/TransactionStatus";
import CopyClipBoard from "@/src/components/CopyClipBoard";
import { useRouter } from "expo-router";
import { status } from '../../assets/Types';
interface PaymentSlipProps {
  transactionData: TransactionData;
  status  : string;
}

const PaymentSlip: React.FC<PaymentSlipProps> = ({ transactionData , status}) => {

  if(!transactionData) return null;

  return (
    <View style={styles.Container}>
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
      </View>

      <Text style={styles.title}>
        Payment Status:{" "}
        <Text style={[{ color: getStatusColor(status) }]}>
          {status}
        </Text>
      </Text>
      
      <Text style={styles.amount}>₹ {transactionData.amount}</Text>
      <Text style={{ fontWeight: "bold", color: "white" }}>
        Project {transactionData.projectId}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.transactionId}>
          Transaction ID: {transactionData.id}
        </Text>
        <CopyClipBoard text={transactionData.id} />
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
    marginVertical: 10,
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
    fontSize: 20,
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
  Status: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
