import { getMessaging, Messaging } from 'firebase/messaging';
import { app } from './firebase.config'; // Import the initialized Firebase app

let messaging: Messaging | null = null;

// Firebase Cloud Messaging is only available in the browser
if (typeof window !== 'undefined') {
  messaging = getMessaging(app);
}

/**
 * The initialized Firebase Messaging instance.
 * Exported for use in other parts of the library, such as the MessagingService.
 * It will be null in non-browser environments.
 */
export { messaging };