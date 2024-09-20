import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
} from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import Firestore from "@react-native-firebase/firestore";
import { useAuth } from "./AuthProvider"; // Adjust the import path as needed
import Messaging from "@react-native-firebase/messaging";
import { roles } from "@/assets/Types";
import { UserProfile } from "@/assets/Types";
import { useNotification } from "./NotificationContext";

// Define the DataContext type
type DataContextType = {
  userProfile: UserProfile | null;
  isLoading: boolean;
  fetchDocument: (collection: string, docId: string) => Promise<any>;
  fetchCollection: (collection: string) => Promise<any[]>;
  postDocument: (collection: string, data: any) => Promise<String>;
  postDocumentwithDoc: (
    collection: string,
    Doc: string,
    data: any
  ) => Promise<void>;
  updateTransactionLocally: (id: string, status: string) => void;
  realTimeData: any[];
  fetchDataByRole?: () => void;
};

// Create the context with an initial value
const DataContext = createContext<DataContextType>({
  userProfile: null,
  isLoading: true,
  fetchDocument: async () => null,
  fetchCollection: async () => [],
  postDocument: async () => "",
  postDocumentwithDoc: async () => {},
  updateTransactionLocally: () => {},
  realTimeData: [],
});

export default function DataProvider({ children }: PropsWithChildren<{}>) {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [realTimeData, setRealTimeData] = useState<any[]>([]);
  const { expoPushToken } = useNotification();

  // Fetch user profile when the component mounts or the user changes

  useEffect(() => {
    if (user) {
      const userDocRef = Firestore().collection("users").doc(user.email!);

      // Set up a real-time listener for the user profile document
      const unsubscribe = userDocRef.onSnapshot(
        (snapshot) => {
          if (snapshot.exists) {
            const profileData = snapshot.data() as UserProfile;
            setUserProfile(profileData);
            setIsLoading(false);
          } else {
            console.error("User profile does not exist.");
            setUserProfile(null);
            setIsLoading(false);
          }
        },
        (error) => {
          console.error("Error listening to user profile updates:", error);
          setIsLoading(false);
        }
      );

      // Cleanup the listener when the component unmounts or user changes
      return () => unsubscribe();
    } else {
      setUserProfile(null);
      setIsLoading(false);
    }
  }, [user]);

  const NotificationTockenManager = async () => {
    if (userProfile?.email && expoPushToken) {
      const docRef = Firestore().collection("Tokens").doc(userProfile.email);
  
      try {
        const docSnapshot = await docRef.get();
  
        if (docSnapshot.exists) {
          const docData = docSnapshot.data();
          const currentArray: string[] = docData?.sessions || [];
  
          if (currentArray.includes(expoPushToken)) {
            console.log("Value already exists in the array.");
            return;
          }
  
          // Add the new value to the array
          await docRef.update({
            sessions: Firestore.FieldValue.arrayUnion(expoPushToken),
          });
  
          console.log("Value added to the array.");
        } else {
          console.log("Document does not exist.");
          // Optionally handle the case where the document does not exist
          await docRef.set({
            sessions: [expoPushToken],
          });
          console.log("Document created and value added.");
        }
      } catch (error) {
        console.error("Error fetching or updating document from Tokens:", error);
        throw error;
      }
    } else {
      console.error("Error: userProfile.email or expoPushToken is undefined or null");
    }
  };
  

  useEffect(() => {
    if (userProfile && expoPushToken) {
      NotificationTockenManager();
    }
  }, [userProfile, expoPushToken]);


  // Fetch a single document from a collection
  const fetchDocument = async (collection: string, docId: string) => {
    try {
      const doc = await Firestore().collection(collection).doc(docId).get();
      return doc.data();
    } catch (error) {
      console.error(
        `Error fetching document from ${collection}/${docId}:`,
        error
      );
      throw error;
    }
  };

  // Fetch all documents from a collection
  const fetchCollection = async (collection: string) => {
    try {
      const snapshot = await Firestore().collection(collection).get();

      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error(`Error fetching collection ${collection}:`, error);
      throw error;
    }
  };

  // Add a new document to a collection
  const postDocument = async (collection: string, data: any) => {
    try {
      const docRef = await Firestore().collection(collection).add(data);
      return docRef.id;
      console.log("Document written with ID:", docRef.id);
    } catch (error) {
      console.error(`Error posting document to ${collection}:`, error);
      throw error;
    }
  };

  // Add a new document to a collection
  const postDocumentwithDoc = async (
    collection: string,
    Doc: string,
    data: any
  ) => {
    try {
      await Firestore().collection(collection).doc(Doc).set(data);
      console.log("Document written Successfully");
    } catch (error) {
      console.error(`Error posting document to ${collection}:`, error);
      throw error;
    }
  };

  // Update a transaction locally
  const updateTransactionLocally = (id: string, status: string) => {
    setRealTimeData((prevData) =>
      prevData.map((transaction) =>
        transaction.id === id ? { ...transaction, status } : transaction
      )
    );
  };

  // Fetch data based on the user's role
  const fetchDataByRole = () => {
    if (!userProfile) return;

    let unsubscribe: (() => void) | undefined;

    switch (userProfile.role) {
      case roles.roles_2:
        if (!userProfile.email) {
          console.error("Error: userProfile.email is undefined or null");
          setIsLoading(false);
          return;
        }
        unsubscribe = Firestore()
          .collection("transactions")
          .where("senderId", "==", userProfile.email)
          .orderBy("timestamp", "desc")
          .onSnapshot(
            (snapshot) => {
              const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              setRealTimeData(data);
              setIsLoading(false);
            },
            (error) => {
              console.error("Error fetching user transactions:", error);
              setIsLoading(false);
            }
          );
        break;

      case roles.roles_1:
        if (!userProfile.email) {
          console.error("Error: userProfile.email is undefined or null");
          setIsLoading(false);
          return;
        }
        unsubscribe = Firestore()
          .collection("transactions")
          .where("receiverId", "==", userProfile.email)
          .orderBy("timestamp", "desc")
          .onSnapshot(
            (snapshot) => {
              const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              setRealTimeData(data);
              setIsLoading(false);
            },
            (error) => {
              console.error("Error fetching admin transactions:", error);
              setIsLoading(false);
            }
          );
        break;

      case roles.roles_3:
        if (!userProfile.projectId) {
          console.error("Error: userProfile.email is undefined or null");
          setIsLoading(false);
          return;
        }
        unsubscribe = Firestore()
          .collection("transactions")
          .where("projectId", "==", userProfile.projectId)
          .where("status", "in", ["Accepted", "Denied", "Processing"])
          .orderBy("timestamp", "desc")
          .onSnapshot(
            (snapshot) => {
              const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              setRealTimeData(data);
              setIsLoading(false);
            },
            (error) => {
              console.error("Error fetching Accountant transactions:", error);
              setIsLoading(false);
            }
          );
        break;

        case roles.roles_4:
        unsubscribe = Firestore()
          .collection("transactions")
          .orderBy("timestamp", "desc")
          .onSnapshot(
            (snapshot) => {
              const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              setRealTimeData(data);
              // console.log("data", data);
              setIsLoading(false);
            },
            (error) => {
              console.error("Error fetching user transactions:", error);
              setIsLoading(false);
            }
          );
        break;

      default:
        console.error("Unknown user role:", userProfile.role);
        setIsLoading(false);
        break;
    }

    return unsubscribe;
  };

  // Start fetching data based on the user profile when it changes
  useEffect(() => {
    if (userProfile) {
      const unsubscribe = fetchDataByRole();

      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
  }, [userProfile]);

  //

  const getToken = async () => {
    try {
      const token = await Messaging().getToken();
      //console.log('Token:', token);---------------------------------------------------------------------------------->
    } catch (error) {
      console.log("Error while getting the token", error);
    }
  };

  getToken();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }
  //console.log("realTimeData", realTimeData);
  return (
    <DataContext.Provider
      value={{
        userProfile,
        isLoading,
        fetchDocument,
        fetchCollection,
        postDocument,
        postDocumentwithDoc,
        updateTransactionLocally,
        realTimeData,
        fetchDataByRole,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});
