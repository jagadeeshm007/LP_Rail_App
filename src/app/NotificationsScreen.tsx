import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-paper';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { Stack } from 'expo-router';

interface Notification {
  id: string;
  message: string;
  timestamp: number; // Unix timestamp in milliseconds
  pageLink: string; // Page to navigate to
}

const notifications: Notification[] = [
  // { id: '1', message: 'Your order has been shipped.', timestamp: Date.now() - 60000, pageLink: '/(tabs)' },
  // { id: '2', message: 'New message from John Doe.', timestamp: Date.now() - 3600000, pageLink: '/history' },
  // { id: '3', message: 'App update available.', timestamp: Date.now() - 86400000, pageLink: '/Setting' },
  // Add more notifications here
];

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    try{
      const page = notification.pageLink.split("/")[1]; // Get the page name from the pageLink
      console.log(page);
      navigation.navigate(page as never); // Navigate to the specified pageLink
    }
    catch(e){
      console.log("Page not found");
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} >
      <Card style={styles.card}>
      <Card.Content>
        <Text>{notification.message}</Text>
        <Text style={styles.timestamp}>{moment(notification.timestamp).fromNow()}</Text>
      </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const NotificationsScreen: React.FC = () => {
  const renderItem = ({ item }: { item: Notification }) => <NotificationItem notification={item} />;

  return (
    <View style={styles.container}>
    <Stack.Screen 
        options={{ 
          title: 'Notifications',
          headerStyle: {
            backgroundColor: "#222",
          },
          headerTintColor: "#fff",
          }}
      />
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    padding: 16,
  },
  card: {
    marginVertical: 4,
    backgroundColor: '#333',
  },
  timestamp: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
});

export default NotificationsScreen;