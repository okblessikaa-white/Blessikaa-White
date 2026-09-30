import { NotificationItem } from '../types';

export class NotificationService {
  public static isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  public static getPermissionStatus(): NotificationPermission | 'unsupported' {
    if (!this.isSupported()) return 'unsupported';
    return Notification.permission;
  }

  public static async requestPermission(): Promise<NotificationPermission | 'unsupported'> {
    if (!this.isSupported()) return 'unsupported';
    try {
      const result = await Notification.requestPermission();
      return result;
    } catch {
      return 'denied';
    }
  }

  public static sendSystemNotification(title: string, options?: NotificationOptions): boolean {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      return false;
    }

    try {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });
      return true;
    } catch {
      return false;
    }
  }

  public static createNotificationItem(
    title: string,
    body: string,
    type: 'reminder' | 'motivation' | 'milestone' | 'streak' = 'reminder'
  ): NotificationItem {
    return {
      id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title,
      body,
      timestamp: new Date().toISOString(),
      read: false,
      type,
    };
  }
}
