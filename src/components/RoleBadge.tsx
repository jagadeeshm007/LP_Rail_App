import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface RoleBadgeProps {
  role: string | null | undefined;
  badgeStyle?: ViewStyle;
  textStyle?: TextStyle;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role, badgeStyle, textStyle }) => {
  return (
    <View style={[styles.badge, badgeStyle]}>
      <Text style={[styles.text, textStyle]}>{role}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent black background
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20, // Pill shape
    position: 'absolute',
    top: 10, // Position it at the top of the profile image
    right: 10, // Position it at the right of the profile image
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default RoleBadge;
