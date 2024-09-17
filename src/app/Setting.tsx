import { Text } from 'react-native';
import { StyleSheet } from 'react-native';
import { View } from '../components/Themed';
import {TouchableOpacity} from 'react-native';
import { Stack, useRouter } from 'expo-router';

export default function Settings() {
  const router = useRouter();

  return (
    <View style={styles.base}>
      <Stack.Screen 
      options={{
        title: "Settings",
        headerStyle: { backgroundColor: "#222", },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    />

      {/* <TouchableOpacity style={styles.option} onPress={() => router.push('/DataView')} > 
        <Text style={styles.text}>View Data</Text>
      </TouchableOpacity> */}

      {/* <View style={styles.divider} /> */}

      <TouchableOpacity style={styles.option} onPress={() => router.push('/Projects')}>
        <Text style={styles.text}>Projects</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      {/* <TouchableOpacity style={styles.option} onPress={() => router.push('/UsersData')}>
        <Text style={styles.text}> Users</Text>
      </TouchableOpacity>

      <View style={styles.divider} /> */}
      
    </View>
  );
}

const styles = StyleSheet.create({
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
