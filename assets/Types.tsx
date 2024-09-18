import { Timestamp } from '@react-native-firebase/firestore';
export const roles = {
    roles_1: 'Admin',
    roles_2: 'User',
    roles_3: 'Accountant',
    roles_4: 'SuperAdmin',
};


export type UserProfile = {
    name: string;
    email: string;
    role: string;
    projectId: string;
    mappedAdminId: string;
    mappedAccountantId: string;
  };

 export type permittebytype = {
  name : string;
  id : string;
  };
  
  export interface TransactionData {
    amount: string;
    details: string;
    editedtime: Timestamp;
    id: string;
    projectId: string;
    receiverId: string;
    rejectedcause: string | null;
    senderId: string;
    senderName: string;
    status: string;
    timestamp: Timestamp | undefined;
    urilinks: string[];
    AccountantUri: string[];
    BankId: string;
    development: string;
    Recipts: string[];
    AccountantId: string;
    permitteby: permittebytype | null;
  }

  export interface BankData {
    accountNumber: string;
    ifsc: string;
    ponumber: string;
    vendorname: string;
    timestamp: Timestamp;
  }

  

  export interface developmentData {
    payfor : string | null;
    timestamp: Timestamp;
  }