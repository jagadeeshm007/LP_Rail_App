import React, { memo, useCallback, useEffect, useState } from "react";
import {
  StatusBar,
  FlatList,
  StyleSheet,
  SafeAreaView,
  View,
  RefreshControl,
  Text,
  TouchableOpacity,
} from "react-native";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import TransactionElement from "@/src/components/TransactionElement";
import { useData } from "@/src/providers/DataProvider";
import { Searchbar } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DropDownPicker from "react-native-dropdown-picker";
import { roles, TransactionData } from "@/assets/Types";
import { router, Stack } from "expo-router";
const History = () => {
  const { realTimeData } = useData();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredData, setFilteredData] = useState<TransactionData[]>(realTimeData);
  const [refreshing, setRefreshing] = useState(false);
  const { userProfile,fetchCollection } = useData();
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchProjectCodes = async () => {
      try {
        const codes = await fetchCollection("projects");
        const transformedCodes = codes.map((code: any) => code.name);
        setProjects(transformedCodes);
      } catch (error) {
        console.error("Error fetching project codes:", error);
      }
    };

    fetchProjectCodes();
  }, []);

  useEffect(() => {
    let filtered = realTimeData;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) 
      );
    }

    // Apply project filter
    if (selectedProjects.length > 0) {
      filtered = filtered.filter((item) => selectedProjects.includes(item.projectId));
    }

    setFilteredData(filtered);
  }, [searchQuery, realTimeData, selectedProjects]);

  const onChangeSearch = (query: string) => setSearchQuery(query);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const renderItem = useCallback(
    ({ item }: { item: TransactionData }) => <TransactionElement data={item} />,
    []
  );

  const handleRemoveFilter = (project: string) => {
    setSelectedProjects(selectedProjects.filter((item) => item !== project));
  };

  
  const headlist = () => {
      return (
        <View style={[Styles.header]}>
          <TouchableOpacity
            onPress={() => router.push("/MyRequests")}
            style={Styles.headblock}
          >
            <Text style={{ color: "#eee", fontFamily: "bold" }}>
              My Requests
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/Pending")}
            style={Styles.headblock}
          >
            <Text style={{ color: "#eee", fontFamily: "bold" }}>Pending</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/Others")}
            style={Styles.headblock}
          >
            <Text style={{ color: "#eee", fontFamily: "bold" }}>Others</Text>
          </TouchableOpacity>
        </View>
      );
  };

  return (
    <GestureHandlerRootView style={Styles.container}>
      <SafeAreaView style={Styles.safeArea}>
        <View style={Styles.searchContainer}>
          <Searchbar
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={Styles.searchbar}
            inputStyle={{ color: "#FFFFFF", alignSelf: "center", fontSize: 16 }}
            placeholderTextColor="#D3D3D3"
          />
        </View>

        <View style={Styles.filterContainer}>
          <ScrollView
            style={{ backgroundColor: 'transparent', flex: 1 }}
            contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5 }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {selectedProjects.map((project) => (
              <View key={project} style={Styles.filterTag}>
                <Text style={{ color: '#eee', marginRight: 5 }}>{project}</Text>
                <TouchableOpacity onPress={() => handleRemoveFilter(project)}>
                  <MaterialIcons name="cancel" size={20} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <DropDownPicker
            open={dropdownOpen}
            value={selectedProjects}
            items={projects.map(project => ({ label: project, value: project }))}
            setOpen={setDropdownOpen}
            setValue={setSelectedProjects}
            setItems={setProjects}
            multiple={true} // Enable multiple selection
            min={0} // Allow deselecting all options
            max={projects.length} // No limit on selection
            placeholder="Filter"
            containerStyle={{ width: 100 }}
            style={Styles.dropdown}
            dropDownContainerStyle={Styles.dropdownContainer}
            textStyle={{ color: '#eee' }}
            labelStyle={{ color: '#eee' }}
            selectedItemLabelStyle={{ color: '#eee' }}
            multipleText="Filter"
          />
        </View>

        <FlatList
          data={filteredData}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={headlist}
          keyExtractor={(item) => item.id}
          contentContainerStyle={Styles.flatListContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#4B3F72"]}
            />
          }
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default memo(History);

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  safeArea: {
    flex: 1,
  },
  searchContainer: {
    width: "100%",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  searchbar: {
    width: "100%",
    marginBottom: 10,
    backgroundColor: "#333",
    borderRadius: 10,
    height: 50,
  },
  filterContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  filterTag: {
    flexDirection: 'row',
    backgroundColor: '#444',
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 15,
    marginHorizontal: 5,
    marginVertical: 2,
    minWidth: 80,
    height: 35,
    elevation: 2,
  },
  dropdown: {
    backgroundColor: '#444',
    borderColor: '#444',
    borderRadius: 15,
  },
  dropdownContainer: {
    backgroundColor: '#444',
    borderColor: '#444',
  },
  flatListContent: {
    paddingBottom: 70,
  },
  header: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    height: 60,
    alignItems: "center",
    justifyContent: "space-around",
    alignContent: "space-around",
    backgroundColor: "transprent",
    paddingVertical: 2,
  },
  headblock: {
    flex: 1,
    backgroundColor: "#333",
    width: "100%",
    height: "100%",
    margin: 5,
    borderRadius: 8,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
});
