import * as React from "react";
import { Text, View, Dimensions, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { TransactionData, status as Status } from "@/assets/Types";
import { Timestamp } from "@react-native-firebase/firestore";
import { getStatusColor } from "@/src/utils/TransactionStatus";
const width = Dimensions.get("window").width;

interface TransactionElementProps {
  data: TransactionData;
  backgroundColor?: string;
}

const TransactionElement: React.FC<TransactionElementProps> = ({
  data,
  backgroundColor,
}) => {
  const router = useRouter();

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = String(hours % 12 || 12).padStart(2, "0"); // Convert to 12-hour format and pad with zero if needed
    return `${day}/${month}/${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
  };

  const handlePress = () => {
    const id = JSON.stringify(data);
    router.push(`/(transaction)?id=${id}`);
  };

  const firestoreTimestampToDate = (timestamp: Timestamp) => {
    if (!timestamp) return "---";
    const { seconds, nanoseconds } = timestamp;
    const date = new Date(seconds * 1000 + nanoseconds / 1e6);
    return formatDate(date);
  };

  const ago = data.timestamp ? firestoreTimestampToDate(data.timestamp) : "---";

  const Statustrim = (status: string) => {
    if (status === Status.inital) {
      return "Submitted";
    } else if (status === Status.phase1) {
      return "Approved";
    } else if (status === Status.phase2) {
      return "Uploaded";
    } else if (status === Status.phase3) {
      return "Awaiting";
    } else if (status === Status.phase4) {
      return "onHold";
    } else if (status === Status.final) {
      return "Accepted";
    } else if (status === Status.fail) {
      return "Denied";
    } else if (status === Status.qualityfail) {
      return "Failed";
    } else if (status === Status.Suspend) {
      return "Suspended";
    }
    else {
      return "Unknown";
    }
  };

  return (
    <View style={[styles.maincom, { backgroundColor: backgroundColor }]}>
      <TouchableOpacity
        style={styles.container}
        onPress={handlePress}
        activeOpacity={0.8}
        delayPressIn={100}
      >
        <View style={styles.Date}>
          <Text style={styles.textmore}>
            Transaction
            {/* <Text style={{fontSize:8}}> {data.id} </Text>  */}
          </Text>
          <Text style={styles.ago}>{ago}</Text>
        </View>
        <View style={styles.main}>
          <View style={styles.user}>
            <View style={styles.shape}>
              <MaterialCommunityIcons
                name="arrow-bottom-right-thin-circle-outline"
                size={24}
                color="white"
              />
            </View>

            <View style={{}}>
              <Text
                style={{ color: "#999" }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {data.senderName.length > 25
                  ? `${data.senderName.substring(0, 25)}...`
                  : data.senderName || "Unknown"}
              </Text>
              <Text
                style={{ color: "#888", fontSize: 12 }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {data.projectId || ""}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.status,
              { backgroundColor: getStatusColor(data.status) },
            ]}
          >
            <Text style={styles.state}>{Statustrim(data.status)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  ActivityIndicatorcontainer: {
    backgroundColor: "#333",
    marginVertical: 2,
    padding: 10,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    width: width - 20,
    height: 80,
    borderRadius: 12,
  },
  maincom: {
    alignContent: "center",
    alignItems: "center",
    width: "100%",
  },
  user: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "transparent",
    alignContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#333",
    marginVertical: 2,
    padding: 10,
    alignContent: "center",
    alignItems: "center",
    width: width - 20,
    height: 80,
    borderRadius: 12,
  },
  main: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "transparent",
    alignContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  Date: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "98%",
    backgroundColor: "transparent",
    alignContent: "center",
    alignItems: "center",
  },
  ago: {
    fontSize: 10,
    color: "#888",
  },
  textmore: {
    color: "#888",
    fontSize: 10,
  },
  shape: {
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#444",
    marginRight: 10,
  },
  status: {
    width: 60,
    height: 20,
    borderRadius: 100,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  state: {
    fontSize: 10,
    color: "#fff",
  },
});

export default TransactionElement;
