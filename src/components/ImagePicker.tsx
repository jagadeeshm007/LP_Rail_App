import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, Image, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface ImagePickerComponentProps {
    onImagesSelected: (images: string[]) => void;
}

export interface ImagePickerComponentRef {
    pickImages: () => void;
    clearSelectedImages: () => void;
    getSelectedImages: () => string[];
}

const ImagePickerComponent = forwardRef<ImagePickerComponentRef, ImagePickerComponentProps>(
    ({ onImagesSelected }, ref) => {
        const [selectedImages, setSelectedImages] = useState<string[]>([]);

        useImperativeHandle(ref, () => ({
            pickImages,
            clearSelectedImages,
            getSelectedImages: () => selectedImages,
        }));

        const pickImages = async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                quality: 0.25,
            });

            if (!result.canceled) {
                const images = result.assets.map((asset) => asset.uri);
                setSelectedImages((prevImages) => {
                    const updatedImages = [...prevImages, ...images];
                    onImagesSelected(updatedImages);
                    return updatedImages;
                });
            }
        };

        const clearSelectedImages = () => {
            setSelectedImages([]);
            onImagesSelected([]);
        };

        const deleteImage = (uri: string) => {
            setSelectedImages((prevImages) => {
                const updatedImages = prevImages.filter((image) => image !== uri);
                onImagesSelected(updatedImages);
                return updatedImages;
            });
        };

        const numColumns = 4;
        const imageSize = (Dimensions.get('window').width / (numColumns)) - 20;

        return (
            <View style={styles.container}>
                <FlatList
                    data={selectedImages}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: item }} style={[styles.image, { width: imageSize, height: imageSize }]} />
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => deleteImage(item)}
                            >
                                <View style={styles.cross} />
                            </TouchableOpacity>
                        </View>
                    )}
                    numColumns={numColumns}
                    contentContainerStyle={styles.flatListContent}
                    style={styles.flatList}
                />
            </View>
        );
    }
);

export default ImagePickerComponent;

const styles = StyleSheet.create({
    container: {
        height: (Dimensions.get('window').width / 4) * 2 - 10, // Height for 2 rows of images
    },
    flatList: {
        flexGrow: 0,
        
    },
    flatListContent: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        
    },
    imageContainer: {
        position: 'relative',
        margin: 5,
    },
    image: {
        borderRadius: 10,
    },
    deleteButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cross: {
        width: 14,
        height: 2,
        backgroundColor: 'white',
        transform: [{ rotate: '45deg' }],
    },
});
