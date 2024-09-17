// src/components/AdminActions.tsx
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { useData } from '@/src/providers/DataProvider';
import { roles } from '@/assets/Types';

interface AccountantActionsProps {
  status: string;
  handleUpdateStatus: (newStatus: string) => void;
  handleDeny: () => void;
  handleEdit: () => void;
  ReciptsPickerHandler: () => void;
}

const AccountantButtons: React.FC<AccountantActionsProps> = ({ status, handleUpdateStatus, handleDeny,handleEdit,ReciptsPickerHandler }) => {
  const { userProfile } = useData();

  if (userProfile?.role === roles.roles_3) return null;

  return (
    <View style={styles.actionContainer}>
      {status === 'Accepted' && (
        <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <PaperButton
              mode="contained"
              onPress={ReciptsPickerHandler}
              style={styles.button}
              labelStyle={styles.buttonLabel}
            >
              Upload Receipt
            </PaperButton>
          </View>
        </View>
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
    backgroundColor: '#192A56',
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
