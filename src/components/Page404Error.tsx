import { Redirect, router } from "expo-router";
import { View, Text,StyleSheet } from "react-native";
import { Button } from "react-native-paper";

const Page404Error = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.Text}>Bad Internet Connection ( or 404 Error)</Text>
      <Button
        mode="contained"
        onPress={() => {
          router.dismissAll();
          router.push("/(tabs)/")
        }}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        Go Back
      </Button>
    </View>
  );
};

export default Page404Error;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#222'
  },
  Text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  button: {
    marginTop: 16,
    height: 50,
    backgroundColor: "#cf9033",
    justifyContent: "center",
    alignItems: "center",
    
  },
  buttonLabel: {
    fontSize: 16,
  },
});
