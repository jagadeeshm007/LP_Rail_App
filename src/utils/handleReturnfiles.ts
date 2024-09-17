import { getFirestore, doc, updateDoc } from "@react-native-firebase/firestore";

const handleReturnfiles = async (transactionId: string, newStatus: string[], setSelectedImages: (images: string[]) => void) => {
  if (!transactionId) return;
  console.log("AccountantUri updated to", newStatus);
  try {
    await updateDoc(doc(getFirestore(), "transactions", transactionId), {
      AccountantUri: newStatus,
    });
    console.log("AccountantUri updated to", newStatus);
  } catch (error) {
    console.error("Error updating AccountantUri:", error);
  }
};

export default handleReturnfiles;
