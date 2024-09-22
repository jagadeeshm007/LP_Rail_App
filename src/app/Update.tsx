import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Image, Platform } from 'react-native';
import { Button, Card } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import * as Application from 'expo-application';
import firestore from '@react-native-firebase/firestore';
import { Stack } from 'expo-router';
import Constants from 'expo-constants';
import { startActivityAsync } from 'expo-intent-launcher';
import { FileSystemDownloadResult } from 'expo-file-system';
import HorizontalLoadingIndicator from '@/src/components/HLoading';
import {deleteFile} from '@/src/utils/Deletefiles';
import AnimatedCard from '../components/Warning';

const isDevelopment = Constants.manifest2?.extra?.expoGo?.developer ?? __DEV__;

type update = {
  version: string;
  apkUrl: string;
} ;

const UpdateApp: React.FC = () => {

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const currentVersion = Application.nativeApplicationVersion + '.' + Application.nativeBuildVersion;

    const checkForUpdate = async () => {
      setVerifying(true);
      const update = await firestore().collection('appUpdate').doc('latest').get();
      if (update.data()?.version > currentVersion) {
        const updatedata = update.data() as update;
        Alert.alert(
          'Update available',
          'A new version of the app is available. Do you want to download it?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Download',
              onPress:()=> downloadAndOpenFile(updatedata),
            },
          ]
        );
      }
      else{
        Alert.alert('No Update', 'No new version available');
      }
      setVerifying(false);
    };


    const downloadAndOpenFile = async (data : update) => {
      const apkUrl = data?.apkUrl ;
      if (!apkUrl) {
        Alert.alert('Error', 'APP URL not found');
        return;
      }
      const version = data?.version ;
      setLoading(true);
      const fileUri = Platform.OS === 'android'
        ? FileSystem.documentDirectory + `${version}.apk`
        : FileSystem.cacheDirectory + `${version}.apk`;
    
      try {
        // Check if the file already exists
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (fileInfo.exists) {
          // File exists, open it directly
          await openAPK(fileUri);
          deleteFile(fileUri);
        } else {
          // File does not exist, download it
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
    
          const downloadResult: FileSystemDownloadResult | undefined = await downloadResumable.downloadAsync();
          if (downloadResult) {
            await openAPK(downloadResult.uri);
            deleteFile(fileUri);
          } else {
            throw new Error('Download failed');
          }
        }
      } catch (error) {
        console.error('Error downloading file:', error);
        Alert.alert('Error', 'Failed to download the file.');
        // Delete the incomplete file if an error occurs
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (fileInfo.exists) {
          console.log('Deleting incomplete file:', fileUri);
          await FileSystem.deleteAsync(fileUri, { idempotent: true });
        }
      } finally {
        setLoading(false);
        setDownloadProgress(0);
      }
    };
    
    
    const openAPK = async (uri: string) => {
      try {
        const cUri = await FileSystem.getContentUriAsync(uri);
        console.log('Content URI:', cUri);
    
        await startActivityAsync('android.intent.action.INSTALL_PACKAGE', {
          data: cUri,
          flags: 1,
          type: 'application/vnd.android.package-archive',
        });
        console.log('APK opened successfully');
        setDownloadProgress(0);
      } catch (err) {
        console.log('Error while opening APK:', err);
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
      <Text style={styles.title}>{Application.applicationName}</Text>
      <Text style={styles.text}>App Version {Application.nativeApplicationVersion}</Text>
      <Text style={styles.text}>Build Version {Application.nativeBuildVersion}</Text>
      {loading && <AnimatedCard />}
      {loading ? (
        <View style={styles.progressContainer}>
          <Text style={styles.text}>{Math.round(downloadProgress * 100)}%</Text>
          <HorizontalLoadingIndicator />
        </View>
      ) : (
        <Button
          mode="contained"
          onPress={checkForUpdate}
          style={[styles.button,{borderRadius:10,}]}
          contentStyle={{ justifyContent: 'center', alignItems: 'center', }}
        >
         {verifying ? (<ActivityIndicator color={"white"} />) :"Check for updates"}
        </Button>
      )}
    </View>
  );
};

export default UpdateApp;

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    padding: 1,
    width: '80%',
    backgroundColor: '#758AA2',
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 100,
    alignItems: 'center',
    marginTop: 20,  // Add some space above the progress bar
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