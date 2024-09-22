import CopyClipBoard from "@/src/components/CopyClipBoard";
import { View, Text, StyleSheet } from "react-native";
interface DetailsProps {
  permitteby: string;
}

export const PermittebyComp: React.FC<DetailsProps> = ({ permitteby }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>permitted by {permitteby}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    backgroundColor: "#487EB0",
    borderRadius: 5,
    padding: 5,
    elevation: 2,
    borderColor: "#192A56",
    borderWidth: 0.7,
  },
  text: { color: "#192A56", fontSize: 16 },
});
