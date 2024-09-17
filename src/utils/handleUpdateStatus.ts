import { getFirestore, doc, updateDoc } from "@react-native-firebase/firestore";

const handleUpdateStatus = async (transactionId: string, newStatus: string, setStatus: (status: string) => void) => {
  if (!transactionId) return;
  try {
    await updateDoc(doc(getFirestore(), "transactions", transactionId), {
      status: newStatus,
    });
    setStatus(newStatus);
    console.log("Status updated to", newStatus);
  } catch (error) {
    console.error("Error updating status:", error);
  }
};

export default handleUpdateStatus;
