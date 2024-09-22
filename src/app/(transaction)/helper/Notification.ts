import sendPushNotification from "@/src/lib/notifications";
import { useData } from "@/src/providers/DataProvider";
import { TransactionData } from '../../../../assets/Types';

interface notifyprops {
    transactionData: TransactionData;
    statement: string;
    sendTo: string[];
    fetchDocument: (collection: string, id: string) => Promise<any>;
}

export const Notify = async ({ transactionData, statement, sendTo ,fetchDocument}: notifyprops) => {
    console.log("Preparing to send notifications to:", sendTo);
    
    if (sendTo.length > 0) {
        
        try {
            for (const user of sendTo) {
                console.log(`Fetching tokens for user: ${user}`);
                if(!user || user =="") continue;
                
                const tokens = await fetchDocument("Tokens", user);
                
                if (tokens?.sessions?.length > 0) {
                    console.log(`Found ${tokens.sessions.length} sessions for user: ${user}`);
                    
                    tokens.sessions.forEach((session: string) => {
                        console.log(`Sending notification to session: ${session}`);
                        sendPushNotification(session, "LP Rail", statement, transactionData);
                    });
                } else {
                    console.log(`No active sessions found for user: ${user}`);
                }
            }
        } catch (error) {
            console.error("Error occurred while sending notifications:", error);
        }
    } else {
        console.log("No users to notify.");
    }
};
