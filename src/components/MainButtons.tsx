// src/components/AdminActions.tsx
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { useData } from '@/src/providers/DataProvider';
import { roles } from '@/assets/Types';

interface AdminActionsProps {
  status: string;
  handleUpdateStatus: (newStatus: string) => void;
  handleDeny: () => void;
  handleEdit: () => void;
}

const AdminActions: React.FC<AdminActionsProps> = ({ status, handleUpdateStatus, handleDeny,handleEdit }) => {
  const { userProfile } = useData();

  if (userProfile?.role === roles.roles_1 || userProfile?.role === roles.roles_4 ) {
  return (
    <View style={styles.actionContainer}>
      {status === 'Pending' && (
        <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <PaperButton
              mode="contained"
              onPress={() => handleUpdateStatus('Accepted')}
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
}
return null;
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

export default AdminActions;
