import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Image, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Application from 'expo-application';
import { useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { Stack } from 'expo-router';
import * as Updates from "expo-updates";
import Constants from 'expo-constants';

const isDevelopment = Constants.manifest2?.extra?.expoGo?.developer ?? __DEV__;

const UpdateApp: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [data, setData] = useState<any>(null);
  const [update, setUpdate] = useState<any>(null);

  useEffect(() => {
    const checkForUpdate = async () => {
      if(!isDevelopment){
      const update = await Updates.checkForUpdateAsync();
      setUpdate(update);
      }
    };
    checkForUpdate();
  }, []);

  const currentVersion = Application.nativeApplicationVersion || '1.0.0';

    const checkForUpdate = async () => {
      const update = await firestore().collection('appUpdate').doc('latest').get();
      setData(update.data());
      if (update.data()?.version > currentVersion) {
        console.log(JSON.stringify(update.data()));
        Alert.alert(
          'Update available',
          'A new version of the app is available. Do you want to download it?',
          [
            {
              text: 'Download',
              onPress:()=> downloadAndOpenFile(update.data()?.apkUrl),
            },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
      }
      else{
        Alert.alert('No Update', 'No new version available');
      }
    };


  const downloadAndOpenFile = async (apkUrl : string) => {
    setLoading(true);
    // Use the document directory for Android as a fallback
    const fileUri = Platform.OS === 'android'
      ? FileSystem.documentDirectory + 'lprail.apk'
      : FileSystem.cacheDirectory + 'lprail.apk'; // For iOS, use cacheDirectory

    try {
      // Create a download resumable instance to track progress
      console.log('Downloading file to', apkUrl);
      const downloadResumable = FileSystem.createDownloadResumable(
        apkUrl,
        fileUri,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          setDownloadProgress(progress);
        }
      );

      // Start the download
      const { uri } : any = await downloadResumable.downloadAsync();

      // Ensure the file exists
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.exists) {
        Alert.alert('Download complete', 'Do you want to open the file?', [
          {
            text: 'Open',
            onPress: async () => {
              if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri, {
                  mimeType: 'application/vnd.android.package-archive', // MIME type for APK files
                  dialogTitle: 'Open APK',
                });
              } else {
                Alert.alert('Error', 'File sharing is not available on this device.');
              }
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ]);
      } else {
        Alert.alert('Error', 'Failed to download the file.');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      Alert.alert('Error', 'Failed to download the file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
      options={{
        title: "Updates",
        headerStyle: { backgroundColor: "#222", },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    />
      <Image source={require('@/assets/images/Full-Logo.png')} style={{ width: 200, height: 200 }} />
      <Text style={styles.title}>Pay Bill</Text>
      <Text style={styles.text}>App Version {Application.nativeApplicationVersion}</Text>
      <Text style={styles.text}>Build Version {Application.nativeBuildVersion}</Text>
      <Text style={styles.text}>Updates on {update.isAvailable}</Text>
      

      {loading ? (
        <View style={styles.progressContainer}>
          <Text style={styles.text}>Downloading {Math.round(downloadProgress * 100)}%</Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${downloadProgress * 100}%` },
              ]}
            />
          </View>
          <ActivityIndicator size="large" color="#758AA2" style={styles.activityIndicator} />
        </View>
      ) : (
        <Button
          mode="contained"
          onPress={checkForUpdate}
          style={styles.button}
          contentStyle={{ justifyContent: 'center', alignItems: 'center' }}
        >
          Check for updates
        </Button>
      )}
    </View>
  );
};

export default UpdateApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#222',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  text: {
    fontSize: 16,
    color: '#fff',
  },
  button: {
    marginTop: 20,
    padding: 5,
    width: '80%',
    backgroundColor: '#758AA2',
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBarContainer: {
    width: '80%',
    height: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#758AA2',
    borderRadius: 5,
  },
  activityIndicator: {
    marginTop: 10,
  },
});