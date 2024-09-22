import { useEffect, useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { Button, Modal } from "react-native-paper";
import { TextInput, Text } from "react-native-paper";
import { StyleSheet } from "react-native";
import { useData } from "@/src/providers/DataProvider";

interface DenyModalProps {
  handleDenypress: (cause: string) => void;
  handleDismiss: (dismiss: boolean) => void;
}

const DenyModal: React.FC<DenyModalProps> = ({ handleDenypress,handleDismiss }) => {
  const { fetchCollection } = useData();
  const [showInput, setShowInput] = useState(true);
  const [openItem, setOpenItem] = useState(false);
  const [denycause, setDenycause] = useState("");
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [StatementOptions, setStatementOptions] = useState<any[]>([
    { label: "Other (Enter manually)", value: "Other (Enter manually)" },
  ]);

  useEffect(() => {
    const fetchStatements = async () => {
      try {
        const codes = await fetchCollection("DenyReasons");
        const transformedCodes = codes.map((code: any) => ({
          label: code.name,
          value: code.id,
        }));
        setStatementOptions(transformedCodes);
      } catch (error) {
        console.error("Error fetching Statements :", error);
      }
    };

    fetchStatements();
  }, []);

  return (
    <Modal
      visible={showInput}
      onDismiss={() => {
        setShowInput(false);
        handleDismiss(false);
    }}
      contentContainerStyle={styles.modal}
    >
      <Text style={styles.text}>Deny Cause</Text>
      <DropDownPicker
        open={openItem}
        value={isOtherSelected ? "Other (Enter manually)" : denycause}
        items={StatementOptions}
        setOpen={setOpenItem}
        setValue={(callback) => {
          const value = typeof callback === "function" ? callback(denycause) : callback;

          if (value === "Other (Enter manually)") {
            setIsOtherSelected(true);
            setDenycause(""); // Clear cause input for manual entry
          } else {
            setIsOtherSelected(false);
            setDenycause(value); // Set selected value as cause
          }
        }}
        placeholder="Reasons"
        textStyle={{ color: "#fff" }}
        style={styles.input}
        dropDownContainerStyle={styles.dropdownContainer}
        zIndex={openItem ? 999 : 2}
      />

      {isOtherSelected && (
        <TextInput
          mode="outlined"
          placeholder="Enter the cause for deny"
          value={denycause}
          onChangeText={setDenycause}
          style={styles.textinput}
          textColor="#fff"
          placeholderTextColor="#888"
        />
      )}

      <Button
        mode="contained"
        onPress={() => {
          handleDenypress(denycause);
          setShowInput(false);
        }}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        Deny
      </Button>
    </Modal>
  );
};

export default DenyModal;

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#444",
    fontSize: 16,
    color: "#fff",
    width: "100%",
    elevation: 2,
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  dropdownContainer: {
    backgroundColor: "#444",
    borderColor: "#333",
    borderRadius: 10,
    elevation: 4,
  },
  modal: {
    backgroundColor: "#333",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    margin: 20,
  },
  text: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  button: { borderRadius: 10, backgroundColor: "#d22" },
  buttonLabel: { color: "#fff" },
  textinput: { marginBottom: 10, backgroundColor: "#444" },
});
