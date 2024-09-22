import React from "react";
import { View, Dimensions,Text,StyleSheet } from "react-native";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import PaymentMethods from '../../(forms)/index';

const height = Dimensions.get("window").height;

const TransactionSkeleton = () => {
  return (
    <View style={{ backgroundColor: "Transprent" }}>
      <View style={{ marginBottom: 10 }}>
      <Text style={styles.title}>Payment Method</Text>
        <MotiView
          transition={{
            type: "timing",
            duration: 500,
          }}
          style={[styles.moticontainer, styles.padded]}
          animate={{ backgroundColor: "#000000" }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            {/* Sender Name Skeleton */}
            <Skeleton colorMode={"dark"} height={20} width={150} />

            {/* Date Skeleton */}
            <Skeleton colorMode={"dark"} height={20} width={100} />
          </View>
          <Spacer height={15} />

          {/* Payment Status Skeleton */}
          <Skeleton colorMode={"dark"} height={25} width={"90%"} />
          <Spacer height={20} />

          {/* Amount Skeleton */}
          <Skeleton colorMode={"dark"} height={30} width={"40%"} />
          <Spacer height={20} />

          {/* Transaction ID Skeleton */}
          <Skeleton colorMode={"dark"} height={20} width={200} />
          <Spacer height={10} />
        </MotiView>
      </View>
      <View style={{ marginTop: 20 }}>
        <MotiView
          transition={{
            type: "timing",
            duration: 500,
          }}
          style={[styles.seccontainer, { height: height - 400 }, styles.padded]}
          animate={{ backgroundColor: "#000000" }}
        >
            <Skeleton colorMode={"dark"} height={30} width={"40%"} />
            <Spacer height={20} />
          <View
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          >
            <Skeleton colorMode={"dark"} height={100} width={100} />
            <Skeleton colorMode={"dark"} height={100} width={100} />
            <Skeleton colorMode={"dark"} height={100} width={100} />
          </View>
          <Spacer height={20} />
          <Skeleton colorMode={"dark"} height={30} width={"40%"} />
            <Spacer height={20} />
          <View
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          >
            <Skeleton colorMode={"dark"} height={100} width={100} />
            <Skeleton colorMode={"dark"} height={100} width={100} />
            <Skeleton colorMode={"dark"} height={100} width={100} />
          </View>
        </MotiView>
      </View>
    </View>
  );
};

const Spacer = ({ height = 16 }) => <View style={{ height }} />;

const styles = StyleSheet.create({
  moticontainer: {
    padding: 20,
    borderRadius: 8,
  },
  seccontainer: {
    padding: 20,
    borderRadius: 8,
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 24,
    margin: 5,
  },
  padded: {
    paddingHorizontal: 16,
  },
});

export default TransactionSkeleton;
