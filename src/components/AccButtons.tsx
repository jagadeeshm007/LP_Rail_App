// src/components/AdminActions.tsx
import React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { useData } from '@/src/providers/DataProvider';
import { roles } from '@/assets/Types';

interface AccountantActionsProps {
  status: string;
  handleUpdateStatus: (newStatus: string) => void;
  handleDeny: () => void;
  handleEdit: () => void;
  ImagePickerHandler: () => void;
}

const AccountantButtons: React.FC<AccountantActionsProps> = ({ status, handleUpdateStatus, handleDeny,handleEdit,ImagePickerHandler }) => {
  const { userProfile } = useData();

  if (userProfile?.role !== roles.roles_3) return null;

  const askForPermission = () => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to accept this payment?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Accept',
          onPress: () => handleUpdateStatus('Completed'),
        },
      ],);
  }

  const askPermission = () => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to accept this payment?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Accept',
          onPress: ImagePickerHandler,
        },
      ],);
  }

  return (
    <View style={styles.actionContainer}>
      { status === 'Accepted' && (
        <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <PaperButton
              mode="contained"
              onPress={() => askForPermission()}
              style={styles.button}
              labelStyle={styles.buttonLabel}
            >
              Completed Payment
            </PaperButton>
          </View>
        </View>
      )}
      {status === 'Processing' && (
        <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <PaperButton
              mode="contained"
              onPress={() => askPermission()}
              style={styles.button}
              labelStyle={styles.buttonLabel}
            >
              Accept
            </PaperButton>
          </View>
          <View style={styles.buttonWrapper}>
            <PaperButton
              mode="contained"
              onPress={() => handleDeny()}
              style={styles.buttonDeny}
              labelStyle={styles.buttonLabel}
            >
              Deny
            </PaperButton>
          </View>
        </View>
      )}
      {status === 'Denied' && (
        <PaperButton
          mode="contained"
          onPress={() => handleEdit()}
          style={styles.buttonUpdate}
          labelStyle={styles.buttonLabel}
        >
          Edit Status
        </PaperButton>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  actionContainer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    borderRadius: 10,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  buttonWrapper: {
    flex: 1,
    paddingHorizontal: 5,
    marginHorizontal: 1,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
  },
  buttonDeny: {
    backgroundColor: '#F44336',
    borderRadius: 10,
  },
  buttonUpdate: {
    marginTop: 10,
    backgroundColor: '#FFC107',
    borderRadius: 10,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AccountantButtons;
