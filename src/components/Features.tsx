import {
  Animated,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Text, View } from "@/src/components/Themed";
import LottieView from "lottie-react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useData } from "@/src/providers/DataProvider";
import { Dimensions } from "react-native";
import { useState, useRef } from "react";
import { router } from "expo-router";
const width = Dimensions.get("window").width;

const Features = () => {
  const [refreshing, setRefreshing] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const { realTimeData, fetchDocument, fetchCollection, postDocument, fetchDataByRole } = useData(); // Access fetchDataByRole

  const startRotation = async () => {
    if (refreshing) return; // Prevent double refresh
    if (!fetchDataByRole) {
      
      console.error("fetchDataByRole is not defined");
      return; // Exit the function if fetchDataByRole is undefined
    }
  
    setRefreshing(true);
    rotateAnim.setValue(0);
  
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  
    try {
        console.log("Fetching data by role...");
        await fetchDataByRole();
    } catch (error) {
      console.error("Error fetching data by role:", error);
    } finally {
      setRefreshing(false);
    }
  };
  

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.block}>
        <View style={styles.textBlock}>
          <Text style={styles.text}>Work flow</Text>
        </View>
        <View style={styles.aniback}>
          <LottieView
            source={require("@/assets/animation_files/train.json")}
            autoPlay
            loop
            style={{ width: 80, height: 80 }}
          />
        </View>
        <TouchableOpacity
          style={styles.update}
          onPress={() => router.push("/workupdate")}
        >
          <MaterialIcons name="work" size={10} color="black" />
          <Text style={{ fontSize: 12, color: "black" }}>Updates</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.block}>
        <View style={styles.textBlock}>
          <Text style={styles.text}>Status</Text>
        </View>
        <View style={styles.aniback2}>
          <LottieView
            source={require("@/assets/animation_files/loading.json")}
            autoPlay
            loop
            style={{ width: 80, height: 80 }}
          />
        </View>

        <TouchableOpacity style={styles.statusrefresh} onPress={startRotation}>
          <Text style={{ fontSize: 12, color: "black" }}>Refresh </Text>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <MaterialIcons name="refresh" size={12} color="black" />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Features;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  block: {
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#333",
    flex: 1,
    margin: 2,
    borderRadius: 25,
    height: 150,
  },
  aniback: {
    backgroundColor: "darkgray",
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    width: '40%',
  },
  aniback2: {
    backgroundColor: "transparent",
    borderRadius: 100,
    alignContent: "center",
    justifyContent: "center",
    width: "45%",
  },
  text: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  textBlock: {
    backgroundColor: "transparent",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    alignSelf: "center",
  },
  update: {
    position: "absolute",
    backgroundColor: "darkgray",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    alignSelf: "center",
    padding: 5,
    bottom: 15, // Adjust as needed to position it from the bottom
    right: 15, // Adjust as needed to position it from the right
    elevation: 5, // Add elevation for shadow effect (Android)
    shadowColor: "#777", // Add shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  statusrefresh: {
    position: "absolute",
    backgroundColor: "darkgray",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    alignSelf: "center",
    padding: 5,
    bottom: 15, // Adjust as needed to position it from the bottom
    right: 15, // Adjust as needed to position it from the right
    elevation: 5, // Add elevation for shadow effect (Android)
    shadowColor: "#777", // Add shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
});
