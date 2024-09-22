import { BankData } from "@/assets/Types";
import CopyClipBoard from "@/src/components/CopyClipBoard";
import { View, Text, StyleSheet } from "react-native";

interface DetailsProps {
  bankdetails: BankData;
}

export const BankDetailsComp: React.FC<DetailsProps> = ({ bankdetails }) => {
  const convertToText = (data: BankData) => {
    return `Vendor Name: ${data.vendorname}\nAccount Number: ${data.accountNumber}\nIFSC Code: ${data.ifsc}\nPO Number: ${data.ponumber}`;
  };

  const info = (header: string, value: string): JSX.Element => (
    <Text style={styles.info}>
      <Text style={styles.infohead}>{header}</Text>
      {value}
    </Text>
  );

  return (
    <View style={styles.container}>
      <View style={styles.order}>
        <Text style={styles.text}>Bank Details:</Text>
        <CopyClipBoard text={convertToText(bankdetails)} />
      </View>

      <Text style={styles.info}>
        <Text style={styles.infohead}>Vendor Name:</Text>
        {bankdetails.vendorname}
      </Text>
      <Text style={styles.info}>
        <Text style={styles.infohead}>Account Number:</Text>
        {bankdetails.accountNumber}
      </Text>
      <Text style={styles.info}>
        <Text style={styles.infohead}>IFSC Code:</Text>
        {bankdetails.ifsc}
      </Text>
      <Text style={styles.info}>
        <Text style={styles.infohead}>PO Number:</Text>
        {bankdetails.ponumber}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
    backgroundColor: "#888",
    padding: 20,
    borderRadius: 10,
  },
  order: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    color: "#E0E0E0",
    fontSize: 20,
    fontWeight: "bold",
  },
  info: {
    color: "#E0E0E0",
    fontSize: 18,
  },
  infohead: {
    color: "#E0E0E0",
    fontSize: 18,
    fontWeight: "bold",
  },
});
