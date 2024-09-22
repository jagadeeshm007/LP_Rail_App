import React, { useEffect, useRef } from 'react';
import { Animated, Text, View, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper'; // or wherever your Card component is from

const AnimatedCard = () => {
  const elevationAnim = useRef(new Animated.Value(0)).current; // Initial elevation value

  useEffect(() => {
    // Animate the elevation on mount
    Animated.timing(elevationAnim, {
      toValue: 10, // Change this value to adjust the "pop" height
      duration: 300, // Duration of the animation
      useNativeDriver: false, // Use native driver for better performance
    }).start();
  }, [elevationAnim]);

  return (
    <Animated.View style={[styles.card, { elevation: elevationAnim }]}>
      <Text style={styles.text}>⚠️  Do Not Close This Page During the Update</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 20,
    padding: 10,
    backgroundColor: '#F0DF87',
    borderWidth: 1.5,
    borderColor: '#EEC213',
    borderRadius: 10,
    width: '90%',
    // Add shadow properties for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  text: {
    color: '#E5B143',
    fontSize: 14,
    fontWeight: 'light',

  },
});

export default AnimatedCard;
