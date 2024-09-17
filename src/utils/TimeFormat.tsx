import { Timestamp } from "@react-native-firebase/firestore";
const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = String(hours % 12 || 12).padStart(2, "0"); // Convert to 12-hour format and pad with zero if needed
    return `${day}/${month}/${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
};

const formatTimestamp = (timestamp: Timestamp | undefined): string => {
    if (!timestamp?.seconds) return "---";
    const date = new Date(
        timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1e6
    );
    return formatDate(date);
};

export { formatDate, formatTimestamp };