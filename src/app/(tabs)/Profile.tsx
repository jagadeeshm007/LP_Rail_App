import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar} from 'react-native';
import ProfileDetails from '@/src/components/ProfileDetails';
import ProfileOptions from '@/src/components/ProfileOptions';
import { useData } from '@/src/providers/DataProvider';
import { Button } from 'react-native-paper';
import pushDummyDataToFirebase from '@/src/providers/Dummypusher';

export default function Profile() {
  const { userProfile } = useData();
  // console.log(userProfile);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ProfileDetails
         name={userProfile?.name || 'name unknown'}
        email={userProfile?.email || 'email unavailable'}
        role={userProfile?.role || 'No role'}
      />
      <ProfileOptions role={userProfile?.role || 'error'} />
      {/* <Button mode="contained" onPress={pushDummyDataToFirebase }>
        dummy
      </Button> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#222',
  },
});
