import CopyClipBoard from "@/src/components/CopyClipBoard";
import { View, Text, StyleSheet } from "react-native";
interface DetailsProps {
  details: string;
}

export const DetailsComp: React.FC<DetailsProps> = ({ details }) => {
  return (
    <View style={styles.container}>
      <View style={styles.divider}>
        <Text style={[styles.text, { fontWeight: "bold" }]}>Details</Text>
        <CopyClipBoard text={details} />
      </View>
      <Text style={styles.text}>{details}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    backgroundColor: "#444",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  divider: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
  },
});
