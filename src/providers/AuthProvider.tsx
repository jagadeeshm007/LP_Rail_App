import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    PropsWithChildren,
  } from 'react';
  import { ActivityIndicator, View } from 'react-native';
  import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
  import { StyleSheet } from 'react-native';

  type AuthContextType = {
    isAuthenticated: boolean;
    user: FirebaseAuthTypes.User | null;
  };
  
  const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    user: null,
  });
  
  export default function AuthProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
    const [isReady, setIsReady] = useState(false);
  
    useEffect(() => {
      const unsubscribe = auth().onAuthStateChanged((user) => {
        setUser(user);
        setIsReady(true);
      });
  
      // Cleanup subscription on unmount
      return () => unsubscribe();
    }, []);
  
    if (!isReady) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="black" />
      </View>
      );
    }
  
    return (
      <AuthContext.Provider
        value={{ user, isAuthenticated: !!user }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
  
  export const useAuth = () => useContext(AuthContext);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white', // Set background color to black
    },
  });
  