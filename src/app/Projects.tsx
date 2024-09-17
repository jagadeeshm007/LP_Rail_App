import BottomSheet, { BottomSheetBackdrop, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert, Keyboard } from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { Button } from "react-native-paper";
import { useData } from "../providers/DataProvider";
import firestore from "@react-native-firebase/firestore";
import { Stack } from "expo-router";

export default function TabOneScreen() {
  const { fetchCollection } = useData();
  const [projectCodes, setProjectCodes] = useState<any[]>([]);
  const [projectCode, setProjectCode] = useState<string | undefined>(undefined);
  const [type, setType] = useState("");
  
  const snapPoints = useMemo(() => ["50%", "100%"], []);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleClosePress = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      bottomSheetRef.current?.close();
    }, 100);
  };

  const handleOpenPress = (type: string) => {
    setType(type);
    snapeToIndex(0);
  };

  const handleCollapsePress = () => bottomSheetRef.current?.collapse();
  const snapeToIndex = (index: number) => bottomSheetRef.current?.snapToIndex(index);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );

  const [projectName, setProjectName] = useState("");
  const [text, setText] = useState("");

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setText("");
    }
  }, []);

  const handleAddProject = async () => {
    setProjectName(text);
    try {
      await firestore().collection("projects").doc(text).set({
        name: text,
        users: [],
        data: [],
      });
      setProjectCodes(prevCodes => [
        ...prevCodes,
        { label: text, value: text } // Add new project to state
      ]);
      handleClosePress();
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const handleDeleteProject = async (code: string) => {
    try {
      await firestore().collection("projects").doc(code).delete();
      setProjectCodes(prevCodes => prevCodes.filter(project => project.value !== code));
      console.log("Project deleted");
      handleClosePress();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleDelete = (item: string) => {
    Alert.alert(
      "",
      "Are you sure you want to delete this project?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => handleDeleteProject(item),
        },
      ],
      { cancelable: false }
    );
  };

  const handleWarning = () => {
    if (projectCode === "") {
      Alert.alert(
        "",
        "Please enter a project name",
        [
          {
            text: "OK",
            onPress: () => console.log("OK Pressed"),
          },
        ],
        { cancelable: false }
      );
      return;
    } else {
      Alert.alert(
        "",
        "Are you sure you want to add this project?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: handleAddProject,
          },
        ],
        { cancelable: false }
      );
    }
  };

  useEffect(() => {
    const fetchProjectCodes = async () => {
      try {
        const codes = await fetchCollection("projects");
        const transformedCodes = codes.map((code: any) => ({
          label: code.name,
          value: code.id,
        }));
        setProjectCodes(transformedCodes);
      } catch (error) {
        console.error("Error fetching project codes:", error);
      }
    };

    fetchProjectCodes();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack.Screen 
      options={{
        title: "Projects",
        headerStyle: { backgroundColor: "#222", },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    />
      <View style={styles.container}>
        <View style={{ flex: 1, marginHorizontal: 10 }}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleOpenPress("add")}
          >
            <Text style={styles.text}>Add Project</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.option}
            onPress={() => handleOpenPress("delete")}
          >
            <Text style={styles.text}>Delete Project</Text>
          </TouchableOpacity>

          <View style={styles.divider} />
        </View>

        <BottomSheet
          enableContentPanningGesture={true}
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          handleIndicatorStyle={{ backgroundColor: "#fff" }}
          backgroundStyle={{ backgroundColor: "rgba(50, 50, 50, 1)" }}
          onChange={handleSheetChanges}
        >
          {type === "add" && (
            <View style={{ flex: 1 }}>
              <BottomSheetTextInput
                style={styles.input}
                value={text}
                onChangeText={setText}
                placeholder="Project Name"
                placeholderTextColor="#fff"
              />
              <View style={styles.contentContainer}>
                <Button
                  onPress={handleWarning}
                  mode="contained"
                  style={{ backgroundColor: "#3b5998", borderRadius: 10 }}
                >
                  Add Project
                </Button>
              </View>
            </View>
          )}
          {type === "delete" && (
            <GestureHandlerRootView style={{ flex: 1 }}>
              <FlatList
                data={projectCodes}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignContent: 'center', alignItems: 'center', backgroundColor: '#444', margin: 2, borderRadius: 10, width: '80%', alignSelf: 'center' }}>
                    <Text style={[styles.text,{right:100}]}>{item.label}</Text>
                    <Button
                      onPress={() => handleDelete(item.value)}
                      mode="contained"
                      style={{ backgroundColor: "#3b5998", borderRadius: 10, margin: 2 }}
                    >
                      Delete
                    </Button>
                  </View>
                )}
              />
            </GestureHandlerRootView>
          )}
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  containerHeadline: {
    fontSize: 24,
    fontWeight: "600",
    padding: 20,
    color: "#fff",
  },
  dropdown: {
    backgroundColor: "#444",
    borderColor: "#333",
    borderRadius: 30,
    elevation: 2,
  },
  dropdownContainer: {
    maxHeight: 200,
    backgroundColor: "#444",
    borderColor: "#333",
    borderRadius: 30,
    elevation: 4,
  },
  input: {
    marginTop: 8,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 16,
    lineHeight: 20,
    padding: 8,
    backgroundColor: "rgba(151, 151, 151, 0.25)",
    color: "#fff",
  },
  base: {
    flex: 1,
    padding: 20,
    backgroundColor: "#222",
    justifyContent: "flex-start",
  },
  option: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "transparent",
    borderRadius: 5,
  },
  text: {
    color: "#E0E0E0",
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#444",
    marginVertical: 5,
  },
});
