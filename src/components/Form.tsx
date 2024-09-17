import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { MonoText } from "@/src/components/StyledText";
import { defaultStyles } from "@/src/constants/Styles";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const Form = ({ name }: { name: string | undefined }) => {

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const [date, setDate] = React.useState(formatDate(new Date()));
 
  React.useEffect(() => {
    const interval = setInterval(() => {
      setDate( formatDate(new Date()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.Container}>
      <View style={styles.DateBar}>
        <MonoText style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {name}
        </MonoText>
        <MonoText style={styles.date}>{date}</MonoText>
      </View>
      <View style={{ marginTop: 55 }}>
        <TouchableOpacity
          onPress={() => router.push("/(forms)")}
          style={[defaultStyles.btn, styles.btnPrimary]}
        >
          <Text style={styles.btnPrimaryText}>Payment Request</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    width: "100%",
    height: 150,
    backgroundColor: "#333",
    borderRadius: 20,
    padding: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  date: {
    fontSize: 16,
    color: "#fff",
    justifyContent: "flex-end",
  },
  DateBar: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    color: "#fff",
    justifyContent: "flex-start",
  },
  btnPrimary: {
    backgroundColor: "#1d72b8",
    borderRadius: 20,
  },
  btnPrimaryText: {
    color: "#ffffff",
    fontSize: 16,
  },
});

export default Form;
