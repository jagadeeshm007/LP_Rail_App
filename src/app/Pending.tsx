import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet } from 'react-native';
import { useData } from '@/src/providers/DataProvider';
import { Stack, useRouter } from 'expo-router';
import { TransactionData } from '@/assets/Types';
import TransactionElement from '../components/TransactionElement';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


// dummy data
const filter1 = "project1";

const History = () => {
  const { realTimeData } = useData();
  const [filteredData, setFilteredData] = useState<TransactionData[]>(realTimeData);
  const [refreshing, setRefreshing] = useState(false);
  const { userProfile } = useData();

  const router = useRouter();

  useEffect(() => {
    setFilteredData(
      realTimeData.filter((item) =>
        item.status === 'Pending'
      )
    );
  }, [realTimeData, userProfile?.email]);

  const renderItem = useCallback(
    ({ item }: { item: TransactionData }) => <TransactionElement data={item} />,
    []
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <Stack.Screen 
      options={{
        title: "",
        headerStyle: { backgroundColor: "#222", },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    />
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    paddingTop: 20,
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },
});

export default History;