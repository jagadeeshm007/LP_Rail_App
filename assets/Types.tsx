import { Timestamp } from '@react-native-firebase/firestore';
import PaymentMethods from '../src/app/(forms)/index';
export const roles = {
    roles_1: 'Admin',
    roles_2: 'User',
    roles_3: 'Accountant',
    roles_4: 'SuperAdmin',
};

export const status = {
  inital:"Submitted",
  phase1:"Approved",
  phase2:"Uploaded to Bank",
  phase3:"Payment done,Awaiting for Bills",
  phase4:"Bills Quality Hold",
  final:"Bills Accepted",
  fail:"Denied",
  qualityfail:"Bills Quality failed",
  Suspend : "Suspended",
};

export const statusColors = {
  initial: "#A9A9A9", // Submitted
  phase1: "#4CAF50",  // Approved
  phase2: "#2196F3",  // Uploaded to bank
  phase3: "#FF9800",  // Payment done, awaiting bills
  phase4: "#FF9800",  // Bills quality hold
  final: "#192A56",   // Bills accepted
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
    PaymentMethods : string | null | undefined;
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