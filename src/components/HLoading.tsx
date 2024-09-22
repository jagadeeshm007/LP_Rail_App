import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, Easing } from 'react-native';

const HorizontalLoadingIndicator: React.FC = () => {
  const animationValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animationValue, {
            toValue: 1,
            duration: 1000, // Time to go from left to right
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(animationValue, {
            toValue: 0,
            duration: 1000, // Time to go from right to left
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animate();
  }, [animationValue]);

  // Interpolate the animated value to move the line horizontally
  const translateX = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 250], // Adjust this range for how far the line moves
  });

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <Animated.View
          style={[styles.line, { transform: [{ translateX }] }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  track: {
    width: 260, // Container for the line movement
    height: 4,
    backgroundColor: '#eee',
    borderRadius: 2,
    overflow: 'hidden',
  },
  line: {
    width: 100, // Length of the moving line
    height: 4,
    backgroundColor: '#45CE30', // Color of the line
  },
});

export default HorizontalLoadingIndicator;
