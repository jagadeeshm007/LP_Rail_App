// src/components/AdminActions.tsx
import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { Button as PaperButton } from "react-native-paper";
import { useData } from "@/src/providers/DataProvider";
import { roles } from "@/assets/Types";
import { status as Status } from "@/assets/Types";

interface AdminActionsProps {
  status: string;
  handleStateChange: (newstatus: string) => void;
}

const AdminActions: React.FC<AdminActionsProps> = ({status,handleStateChange}) => {
  const { userProfile } = useData();
  if (
    userProfile?.role !== roles.roles_1 &&
    userProfile?.role !== roles.roles_4
  )
    return null;

  return (
    <View style={styles.Container}>
      {Status.inital === status && (
        <View style={styles.buttonContainer}>
          <PaperButton
            mode="contained"
            onPress={() => handleStateChange(Status.phase1)}
            style={[
              styles.button,
              {
                backgroundColor: "#4CAF50",
              },
            ]}
            labelStyle={styles.buttonLabel}
          >
            Accept
          </PaperButton>
          <PaperButton
            mode="contained"
            onPress={() => handleStateChange(Status.fail)}
            style={[
              styles.button,
              {
                backgroundColor: "#F44336",
              },
            ]}
            labelStyle={styles.buttonLabel}
          >
            Deny
          </PaperButton>
        </View>
      )}
      {status === Status.phase1  && (
        <PaperButton
          mode="contained"
          onPress={() => handleStateChange(Status.inital)}
          style={[styles.button, { backgroundColor: "#FFC107",marginHorizontal:100 }]}
          labelStyle={styles.buttonLabel}
        >
          Edit Status
        </PaperButton>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: "100%",
    borderRadius: 10,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    margin: 5,
  },
  button: {
    borderRadius: 10,
    flex: 1,
    paddingHorizontal: 5,
    marginHorizontal: 5,
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 16,
  },
});

export default AdminActions;
