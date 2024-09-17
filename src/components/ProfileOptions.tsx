import React from "react";
import { StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
const { width } = Dimensions.get("window");
import { Text, View } from "@/src/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";
import { Link } from "expo-router";
import { roles } from "@/assets/Types";
import Firestore from "@react-native-firebase/firestore";
import { useData } from "@/src/providers/DataProvider";
import { useNotification } from "@/src/providers/NotificationContext";
import { useRouter } from 'expo-router';
interface ProfileOptionsProps {
  role: string;
}

const ProfileOptions: React.FC<ProfileOptionsProps> = (role) => {
  const { userProfile } = useData();
  const { expoPushToken } = useNotification();
  const [loading, setLoading] = React.useState(false);
  const router  = useRouter();

  const deleteTokenOnLogout = async () => {
    if (userProfile?.email && expoPushToken) {
      const docRef = Firestore().collection("Tokens").doc(userProfile.email);

      try {
        const docSnapshot = await docRef.get();

        if (docSnapshot.exists) {
          const docData = docSnapshot.data();
          const currentArray: string[] = docData?.sessions || [];

          if (currentArray.includes(expoPushToken)) {
            // Remove the token from the array
            await docRef.update({
              sessions: Firestore.FieldValue.arrayRemove(expoPushToken),
            });
            console.log("Token removed from the array.");
          } else {
            console.log("Token not found in the array.");
          }
        } else {
          console.log("Document does not exist.");
        }
      } catch (error) {
        console.error("Error deleting token from Tokens:", error);
        throw error;
      }
    } else {
      console.error(
        "Error: userProfile.email or expoPushToken is undefined or null"
      );
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      // Call the function to delete the token
      await deleteTokenOnLogout();

      // Perform the actual logout
      // For example, using Firebase Auth
      await auth().signOut();
      setLoading(false);
      // Optionally, clear user profile and other state
      //setUserProfile(null);
      // Redirect to login or other screen if necessary
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      {role.role === roles.roles_1 || role.role === roles.roles_4 ? (
        <Link href="/Setting" style={styles.option} asChild>
          <TouchableOpacity style={styles.option}>
            <MaterialIcons
              name="admin-panel-settings"
              size={24}
              color="white"
            />
            <Text style={styles.optionText}>User Management Settings</Text>
          </TouchableOpacity>
        </Link>
      ) : null}

      {/* <Link href="/About" style={styles.option} asChild>
      <TouchableOpacity style={styles.option} >
      <Ionicons name="information-circle-sharp" size={24} color="white" />
        <Text style={styles.optionText}>About</Text>
      </TouchableOpacity>
      </Link> */}

      <TouchableOpacity style={styles.option} onPress={()=> router.push("/Update")}>
        <MaterialIcons name="update" size={24} color="white" />
        <Text style={styles.optionText}>updates</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={handleLogout}
        disabled={loading}
      >
        <MaterialIcons name="logout" size={24} color="#D22B2B" />
        <Text style={[styles.optionText, { color: "#D22B2B" }]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    padding: 10,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222",
  },
  option: {
    flexDirection: "row",
    width: width * 0.9,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "flex-start",
    alignContent: "center",
  },
  optionText: {
    //color: '#007bff',
    color: "white",
    fontSize: 18,
    marginLeft: 10,
  },
  separator: {
    height: 1,
    width: "90%",
    marginBottom: 10,
  },
});

export default ProfileOptions;
