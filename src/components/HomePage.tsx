import * as React from "react";
import { Dimensions, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import Fontisto from "@expo/vector-icons/Fontisto";
import { Text, View } from "@/src/components/Themed";
import TransactionElement from "./TransactionElement";
import { Link } from "expo-router";
import { useData } from "../providers/DataProvider";
import { FlatList } from "react-native";
import Features from "./Features";
import Form from "./Form";
import { TransactionData } from "@/assets/Types";
import {GreetingMessage} from "../utils/Getgreetings";

const Home: React.FunctionComponent = () => {
  const greeting = GreetingMessage();
  const { height } = Dimensions.get("window");
  const { userProfile, realTimeData } = useData();
  const data = realTimeData.length > 0 ? realTimeData.slice(0, 5) : [];
  const sizeOfData = data.length;
  const renderItem = ({ item }: { item: TransactionData }) => (
    //console.log("home screen",item),
    <TransactionElement data={item} backgroundColor="#121212" />
  );

  return (
    <FlatList
      data={data}
      showsVerticalScrollIndicator={false}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      style={styles.flatList}
      ListHeaderComponent={() => (
        <View style={styles.headerContainer}>
          <View style={styles.innerHeaderContainer}>
            <View style={styles.Welcome}>
              <Text style={styles.WelcomeText}>{greeting}</Text>
            </View>
            <Form name={userProfile?.name} />
            <Features />
          </View>

          <View style={styles.scrollheader}>
            <View style={styles.Recent}>
              <Text style={styles.recentText}>Recents</Text>
              <Link href="/(tabs)/history" asChild>
                <TouchableOpacity style={styles.more}>
                  <Text style={styles.textMore}>More</Text>
                  <Fontisto name="caret-right" size={10} color="white" />
                </TouchableOpacity>
              </Link>
            </View>

            <View style={styles.separator} />
          </View>
        </View>
      )}
      ListFooterComponent={() => (
        <View
          style={[
            styles.footerContainer,
            {
              minHeight:
                height - 500 - (sizeOfData < 4 ? sizeOfData * 100 : 270),
            }, // Adjust minHeight based on content
          ]}
        >
          {/* Any additional footer components */}
        </View>
      )}
    />
  );
};

export default Home;

const styles = StyleSheet.create({
  flatList: {
    margin:4,
  },
  headerContainer: {
    backgroundColor: "transprent", 
    alignItems: "center", 
  },
  innerHeaderContainer: {
    backgroundColor: "transprent", 
    width: "100%",
    alignItems: "center", 
  },
  Welcome: {
    backgroundColor: "transparent",
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  WelcomeText: {
    fontSize: 24,
    color: "#fff",
    marginTop: 5,
    marginBottom: 5,
    fontFamily: "monospace",
    textAlign: "center", 
  },
  recentText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center", 
  },
  Recent: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "transparent",
  },
  textMore: {
    color: "white",
    fontSize: 12,
  },
  more: {
    backgroundColor: "#3b5998",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
    padding: 5,
    borderRadius: 30,
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: "90%",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  footerContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#121212",
  },
  scrollheader: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    width: "100%",
    backgroundColor: "#121212",
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
  },
  list: {
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
  },
});
