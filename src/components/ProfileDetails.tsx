import React from "react";
import { StyleSheet, View, Text, Image, Dimensions } from "react-native";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import RoleBadge from '@/src/components/RoleBadge';

const { width } = Dimensions.get("window");

interface ProfileDetailsProps {
  name: string | null;
  email: FirebaseAuthTypes.User["email"] | undefined;
  role: string | null;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({
  name,
  email,
  role,
}) => {
  return (
    <View style={styles.profileContainer}>

      <View style={styles.imageContainer}>
        <Image
          source={require("@/assets/images/Full-Logo.png")}
          style={styles.image}
        />
      </View>
      <View style={{ flex: 1 }}>
        
      <View style={{ flex: 1 ,maxHeight:30,alignItems:'center',alignContent:'center', justifyContent:'center'}}>
      <RoleBadge role={role}  />
      </View>

      <View style={{ flex: 1 ,alignItems:'center',alignContent:'center', justifyContent:'center'}}>
        
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {name}
        </Text>
        <Text style={styles.email} numberOfLines={1} ellipsizeMode="tail">
          {email}
        </Text>
      </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: "row",
    width: width * 0.9,
    height: width * 0.45,
    backgroundColor: "#333",
    borderRadius: 20,
    padding: 10,
    // marginVertical: 10,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    //shadowColor: '#555',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  image: {
    width: 100,
    height: 100,
  },
  userdata: {
    
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  email: {
    fontSize: 18,
    color: "#999",
  },
});

export default ProfileDetails;
