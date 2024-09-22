import * as FileSystem from 'expo-file-system';

export const deleteFile = async (fileUri: string) => {
  const fileInfo = await FileSystem.getInfoAsync(fileUri);
  if (fileInfo.exists) {
    try {
      await FileSystem.deleteAsync(fileUri, { idempotent: true });
        console.log('File deleted:', fileUri);
    } catch (error) {
        console.error('Error deleting file:', error);
        }
  }
  else {
    console.log('File does not exist:', fileUri);
  }
};