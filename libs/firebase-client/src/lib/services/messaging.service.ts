import { getToken, onMessage, MessagePayload } from 'firebase/messaging';
import { messaging } from '../config/messaging.config';

/**
 * @class MessagingService
 * @description A service to abstract Firebase Cloud Messaging (FCM) operations.
 * It simplifies requesting permissions, retrieving tokens, and handling incoming messages.
 */
export class MessagingService {
  private static instance: MessagingService;

  /**
   * @constructor
   * Checks if messaging is supported before proceeding.
   */
  private constructor() {
    if (!messaging) {
      console.warn('Firebase Messaging is not available in this environment.');
    }
  }

  /**
   * Gets the singleton instance of the MessagingService.
   * @returns {MessagingService} The singleton instance.
   */
  public static getInstance(): MessagingService {
    if (!MessagingService.instance) {
      MessagingService.instance = new MessagingService();
    }
    return MessagingService.instance;
  }

  /**
   * Requests permission from the user to show notifications and retrieves the FCM token.
   * @param {string} vapidKey - The VAPID key for web push certificate.
   * @returns {Promise<string | null>} A promise that resolves with the FCM token or null if permission is denied or an error occurs.
   */
  public async requestPermissionAndGetToken(vapidKey: string): Promise<string | null> {
    if (!messaging) return null;

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(messaging, { vapidKey });
        return token;
      } else {
        console.log('Notification permission denied.');
        return null;
      }
    } catch (error) {
      console.error('An error occurred while getting the token.', error);
      return null;
    }
  }

  /**
   * Sets up a listener for incoming messages when the app is in the foreground.
   * @param {(payload: MessagePayload) => void} callback - The callback function to execute with the message payload.
   * @returns {(() => void) | null} An unsubscribe function, or null if messaging is not available.
   */
  public onForegroundMessage(callback: (payload: MessagePayload) => void): (() => void) | null {
    if (!messaging) return null;

    return onMessage(messaging, callback);
  }
}

// Export a singleton instance of the service
export const messagingService = MessagingService.getInstance();