import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity,StyleSheet } from "react-native";
import * as Clipboard from 'expo-clipboard';

const CopyClipBoard = ({ text }: { text: string | null | undefined }) => {

    const handleCopyId = async (text: string | null | undefined) => {
      if (!text) {
        return;
      }
        await Clipboard.setStringAsync(text);
    }


  return (
    <TouchableOpacity
      onPress={() => handleCopyId(text)}
      style={styles.Container}
    >
      <Ionicons name="copy-outline" size={12} color="white" />
    </TouchableOpacity>
  );
};

export default CopyClipBoard;

const styles = StyleSheet.create({
    Container:{
        marginLeft: 2,
    }
});