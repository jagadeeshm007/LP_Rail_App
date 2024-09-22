import { BankData, developmentData } from "@/assets/Types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";

const setCache = async (id: string, data: BankData | developmentData) => {
  try {
    await AsyncStorage.setItem(`${id}`, JSON.stringify(data));
  } catch (e) {
    console.log("Error while setting cache", e);
  }
};

const getCache = async (id: string) => {
  try {
    const cacheData = await AsyncStorage.getItem(`${id}`);
    if (cacheData) return JSON.parse(cacheData);
  } catch (e) {
    console.log("Error while getting cache", e);
  }
  return null;
};

const getData = async (id: string, type: string): Promise<any | null> => {
  const cacheData = await getCache(id);
  if (cacheData) {
    return cacheData;
  }
  try {
    const doc = await firestore().collection(type).doc(id).get();
    if (doc.exists) {
      const docData = doc.data() as BankData | developmentData;
      const docId = doc.id;
      setCache(docId, docData);
      return docData;
    }
  } catch (error) {
    console.error("Error fetching document: ", error);
  }
  return null;
};

export default getData;
