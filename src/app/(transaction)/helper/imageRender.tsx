import React, { useState } from "react";
import { ScrollView, View, TouchableOpacity, Alert } from "react-native";
import { Image, Text, StyleSheet } from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import ImageViewing from "react-native-image-viewing";

const ImageRender = ({
  images,
  title,
}: {
  images: string[];
  title: string;
}) => {
  if (images.length <= 0) {
    return null;
  }
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [selectedImageSet, setSelectedImageSet] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const saveImageToGallery = async (uri: string) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied!",
          "You need to give storage permission to download the image"
        );
        return;
      }

      const fileName = uri.split("/").pop();
      const downloadDest = `${FileSystem.documentDirectory}${fileName}`;
      const downloadResult = await FileSystem.downloadAsync(uri, downloadDest);

      if (downloadResult.status === 200) {
        await MediaLibrary.createAssetAsync(downloadResult.uri);
        Alert.alert("Success", "Image saved to gallery");
      } else {
        Alert.alert("Error", "Failed to save image");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while saving the image");
    }
  };

  const validInitialScrollIndex = (list: any[], index: number) => {
    return list.length > index ? index : 0;
  };

  const handleImageClick = (imageSet: string[], index: number) => {
    setSelectedImageSet(imageSet);
    setCurrentImageIndex(index);
    setIsViewerVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView
        horizontal={true}
        contentContainerStyle={styles.inscroll}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.imageRow}>
          {images.map((link, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleImageClick(images, index)}
              style={styles.imageview}
            >
              <Image
                source={{ uri: link }}
                style={styles.image}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ImageViewing
        images={selectedImageSet.map((uri) => ({ uri })) || []}
        imageIndex={validInitialScrollIndex(
          selectedImageSet,
          currentImageIndex
        )}
        visible={isViewerVisible}
        onRequestClose={() => setIsViewerVisible(false)}
        FooterComponent={({ imageIndex }) => (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => saveImageToGallery(images[imageIndex])}
          >
            <Text style={styles.saveButtonText}>Save to Gallery</Text>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
};

export default ImageRender;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#444",
    marginVertical: 10,
    borderRadius: 20,
    padding: 15,
    maxHeight: 350,
  },
  imageRow: {
    flexDirection: "row",
    padding: 5,
    borderRadius: 30,
  },
  imageview: {
    width: 100,
    height: 100,
    margin: 3,
    padding: 2,
    backgroundColor: "#111",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },

  saveButton: {
    backgroundColor: "rgba(50, 50, 50, 0.75)", // Dark theme color
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    margin: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  title: { color: "#E0E0E0", fontSize: 20, fontWeight: "bold" },
  inscroll: {
    alignItems: "flex-start",
    justifyContent: "center",
  },
});
