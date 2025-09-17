export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

export class NotificationService {
  private notifications = new Map<string, Notification[]>();

  async sendNotification(userId: string, notification: Omit<Notification, 'id' | 'userId' | 'read' | 'createdAt'>): Promise<void> {
    const newNotification: Notification = {
      id: `notif_${Date.now()}`,
      userId,
      read: false,
      createdAt: new Date(),
      ...notification
    };

    const userNotifications = this.notifications.get(userId) || [];
    userNotifications.push(newNotification);
    this.notifications.set(userId, userNotifications);

    // Removed console.log
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    return this.notifications.get(userId) || [];
  }

  async markAsRead(userId: string, notificationId: string): Promise<void> {
    const userNotifications = this.notifications.get(userId) || [];
    const notification = userNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }
}