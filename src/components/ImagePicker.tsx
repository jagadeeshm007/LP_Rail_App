import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, Image, TouchableOpacity, ScrollView, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
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
        const [loading, setLoading] = useState(false);

        useImperativeHandle(ref, () => ({
            pickImages,
            clearSelectedImages,
            getSelectedImages: () => selectedImages,
        }));

        const pickImages = async () => {
            setLoading(true);
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                quality: 0.25,
            });
            setLoading(false);

            if (!result.canceled) {
                const images = result.assets.map((asset) => asset.uri);
                setSelectedImages((prevImages) => {
                    const updatedImages = [...prevImages, ...images];
                    onImagesSelected(updatedImages);
                    return updatedImages;
                });
            } else {
                // Handle error or cancellation
                console.warn("Image selection canceled or failed.");
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
        const imageSize = (Dimensions.get('window').width / numColumns) - 20;

        return (
            <View style={styles.container}>
                {loading ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                ) : (
                    <ScrollView contentContainerStyle={styles.scrollViewContent} nestedScrollEnabled={true}>
                        <View style={styles.imageGrid}>
                            {selectedImages.map((item, index) => (
                                <View key={index} style={[styles.imageContainer, { width: `${100 / numColumns}%` }]}>
                                    <Image source={{ uri: item }} style={[styles.image, { width: imageSize, height: imageSize }]} />
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => deleteImage(item)}
                                        accessibilityLabel={`Delete image`}
                                    >
                                        <View style={styles.cross} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                   
                )}
            </View>
        );
    }
);

export default ImagePickerComponent;

const styles = StyleSheet.create({
    container: {
        height: (Dimensions.get('window').width / 4) * 2 - 10,
        padding: 5,
        backgroundColor: '#444',
        borderRadius: 15,
        margin: 5,
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    imageContainer: {
        padding: 5,
        position: 'relative',
    },
    image: {
        borderRadius: 8,
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
