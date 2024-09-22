import { TransactionData } from "@/assets/Types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";

interface FetchTransactionDataProps {
  type: string;
  id: string;
}

const fetchTransactionData = async ({type,id,}: FetchTransactionDataProps): Promise<{error: boolean;data: any | null;}> => {

  const timeoutId = setTimeout(() => {
    return { error: true, data: null };
  }, 1000 * 30);
  
  try {
    const parsedData = JSON.parse(decodeURIComponent(id.toString()));
  } catch (error) {
    console.error("Error parsing data:", error);
  }


  try {
    const doc = await firestore().collection("transactions").doc(id).get();
    if (doc.exists) {
      const data = { id: doc.id, ...doc.data() } as TransactionData;
      clearTimeout(timeoutId);
      return { error: false, data };
    }
  } catch (error) {
    console.error("Error fetching document: ", error);
    // Show 404 error on failure
  }
  return { error: true, data: null };
};
export default fetchTransactionData;
