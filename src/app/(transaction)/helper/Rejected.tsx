import CopyClipBoard from "@/src/components/CopyClipBoard";
import { View, Text, StyleSheet } from "react-native";
interface DetailsProps {
  rejectedcause: string;
}

export const RejectedcauseComp: React.FC<DetailsProps> = ({
  rejectedcause,
}) => {
  if (rejectedcause === "NULL") return null;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Rejected Cause {rejectedcause}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    backgroundColor: "#FF6868",
    borderRadius: 5,
    padding: 5,
    elevation: 2,
    borderColor: "#E71C23",
    borderWidth: 0.7,
  },
  text: { color: "#E71C23", fontSize: 16 },
});
