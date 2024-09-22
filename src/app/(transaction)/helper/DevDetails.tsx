import CopyClipBoard from "@/src/components/CopyClipBoard";
import { View, Text, StyleSheet } from "react-native";
import { developmentData } from "@/assets/Types";
interface DetailsProps {
  developmentData: developmentData;
}
export const DevDetailsComp: React.FC<DetailsProps> = ({
  developmentData: developmentData,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.order}>
        <Text style={styles.text}>
          Payed for:
          <Text style={styles.innertext}>{developmentData.payfor}</Text>
        </Text>
        <CopyClipBoard text={developmentData.payfor ?? ""} />
      </View>
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
  innertext: { color: "#fff", fontWeight: "500", fontSize: 18 },
});
