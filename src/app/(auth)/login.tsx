import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";
import { FirebaseError } from "firebase/app";
import { defaultStyles } from "@/src/constants/Styles";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authError, setAuthError] = useState("");

  // password visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(String(email).toLowerCase());
  };

  const signIn = async () => {
    setLoading(true);
    setEmailError("");
    setPasswordError("");
    setAuthError("");
    if (!email) {
      setEmailError("Email is required");
      setLoading(false);
      return;
    } else if (!validateEmail(email)) {
      setEmailError("Invalid email");
      setLoading(false);
      return;
    }
    if (!password) {
      setPasswordError("Password is required");
      setLoading(false);
      return;
    }
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (e: any) {
      console.log(e);
      const err = e as FirebaseError;
      // alert('Sign in failed: ' + err.message);
      setAuthError("Incorrect password or email. Please try again.");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={1}
    >
      {loading && (
        <View style={defaultStyles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      <Image
        style={styles.logo}
        source={require("@/assets/images/Full-Logo.png")}
      />

      <Text style={styles.title}>login</Text>

      <View style={{ marginBottom: 20 }}>
        <TextInput
          autoCapitalize="none"
          placeholder="Email"
          style={styles.inputField}
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#888888"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        <View style={styles.inputContainer}>
          <TextInput
            autoCapitalize="none"
            placeholder="Password"
            style={[
              styles.inputField,
              { flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0 },
            ]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
            placeholderTextColor="#888888"
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={24}
              color="#e0e0e0"
            />
          </TouchableOpacity>
        </View>
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}
      </View>
      {authError ? <Text style={styles.errorText}>{authError}</Text> : null}

      <TouchableOpacity
        onPress={signIn}
        style={[defaultStyles.btn, styles.btnPrimary]}
      >
        <Text style={styles.btnPrimaryText}>Login</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#121212",
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginVertical: 10,
  },

  errorText: {
    color: "red",
    fontSize: 14,
    marginVertical: 4,
  },
  successText: {
    color: "green",
    fontSize: 14,
    marginVertical: 4,
  },
  title: {
    fontSize: 30,
    alignSelf: "center",
    fontWeight: "bold",
    color: "#1d72b8",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#1e1e1e",
    color: "#e0e0e0",
  },
  btnPrimary: {
    backgroundColor: "#1d72b8",
    marginVertical: 4,
  },
  btnPrimaryText: {
    color: "#ffffff",
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: "#333333",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Page;
