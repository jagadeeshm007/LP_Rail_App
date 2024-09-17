
import  React from 'react';
import { Alert } from 'react-native';
import { doc, updateDoc } from '@react-native-firebase/firestore';
import { getFirestore } from '@react-native-firebase/firestore';

interface UpdateStatusHandlerProps {
  transactionId: string | null;
  newStatus: string;
  onSuccess: () => void;
}

const UpdateStatusHandler: React.FC<UpdateStatusHandlerProps> = ({
  transactionId,
  newStatus,
  onSuccess,
}) => {
  const handleUpdateStatus = async () => {
    if (!transactionId) return;

    try {
      await updateDoc(doc(getFirestore(), 'transactions', transactionId), {
        status: newStatus,
      });
      console.log('Status updated to', newStatus);
      onSuccess();
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', 'Failed to update status.');
    }
  };

  React.useEffect(() => {
    handleUpdateStatus();
  }, [newStatus]);

  return null;
};

export default UpdateStatusHandler;
