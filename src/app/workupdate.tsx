import { Stack } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { MonoText } from '../components/StyledText';
const WorkUpdate = () => {
  return (
    <View style={styles.container}>
      <Stack.Screen
          options={{
            title: "",
            headerStyle: { backgroundColor: "#222" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        />
      <Image
        source={require("@/assets/images/ufo.png")} // Replace with your image source
        style={styles.image}
      />
      <MonoText style={styles.text}>work updates</MonoText>
      <MonoText style={styles.text2}>
        Coming soon!
      </MonoText>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  image: {
    width: 300,
    height: 300, // Adjust the height as needed
    backgroundColor: 'transparent',
  },
  text: {
    color: '#fff',
    fontSize: 20,
  },
  text2: {
    color: '#fff',
    fontSize: 30,
  },
});

export default WorkUpdate;