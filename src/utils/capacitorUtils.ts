import { Haptics } from '@capacitor/haptics';
import { Share } from '@capacitor/share';
import { Preferences } from '@capacitor/preferences';
import { Network } from '@capacitor/network';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

// Haptic Feedback Utilities
export const hapticFeedback = {
  light: () => Haptics.impact({ style: 'light' }),
  medium: () => Haptics.impact({ style: 'medium' }),
  heavy: () => Haptics.impact({ style: 'heavy' }),
  success: () => Haptics.notification({ type: 'success' }),
  warning: () => Haptics.notification({ type: 'warning' }),
  error: () => Haptics.notification({ type: 'error' }),
};

// Share Functionality
export const shareVerse = async (verse: any, language: string = 'hindi') => {
  try {
    const meaning = language === 'hindi' ? verse.HinMeaning : verse.EngMeaning;
    const title = `Bhagavad Gita - Chapter ${verse.Chapter}, Verse ${verse.Verse}`;
    const text = `${verse.Shloka}\n\n${meaning}`;
    
    await Share.share({
      title,
      text,
      url: 'https://dharma-gita-wisdom.app',
      dialogTitle: 'Share this divine wisdom'
    });
    
    hapticFeedback.success();
  } catch (error) {
    console.error('Share failed:', error);
  }
};

// Offline Storage (Better than localStorage)
export const storage = {
  async set(key: string, value: any): Promise<void> {
    try {
      await Preferences.set({
        key,
        value: JSON.stringify(value)
      });
    } catch (error) {
      console.error('Storage set failed:', error);
    }
  },

  async get(key: string): Promise<any> {
    try {
      const { value } = await Preferences.get({ key });
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Storage get failed:', error);
      return null;
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await Preferences.remove({ key });
    } catch (error) {
      console.error('Storage remove failed:', error);
    }
  },

  async clear(): Promise<void> {
    try {
      await Preferences.clear();
    } catch (error) {
      console.error('Storage clear failed:', error);
    }
  }
};

// Network Status
export const networkStatus = {
  async checkConnection(): Promise<boolean> {
    try {
      const status = await Network.getStatus();
      return status.connected;
    } catch (error) {
      console.error('Network check failed:', error);
      return false;
    }
  },

  async addListener(callback: (connected: boolean) => void): Promise<void> {
    try {
      Network.addListener('networkStatusChange', (status) => {
        callback(status.connected);
      });
    } catch (error) {
      console.error('Network listener failed:', error);
    }
  }
};

// Enhanced Notifications
export const notifications = {
  async requestPermissions(): Promise<boolean> {
    try {
      const result = await LocalNotifications.requestPermissions();
      return result.display === 'granted';
    } catch (error) {
      console.error('Notification permission failed:', error);
      return false;
    }
  },

  async scheduleDailyReminders(): Promise<void> {
    try {
      // Cancel existing notifications
      await LocalNotifications.cancel({ notifications: [{ id: 1 }, { id: 2 }] });

      // Schedule morning reminder
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 1,
            title: '🌅 Morning Dharma',
            body: 'Start your day with divine wisdom from Bhagavad Gita',
            schedule: { 
              every: 'day', 
              at: new Date('7:00:00'),
              on: { hour: 7, minute: 0 }
            },
            sound: 'default',
            actionTypeId: 'OPEN_APP',
            extra: { verseType: 'morning' }
          },
          {
            id: 2,
            title: '🌙 Evening Reflection',
            body: 'Reflect on today\'s verse and find inner peace',
            schedule: { 
              every: 'day', 
              at: new Date('18:00:00'),
              on: { hour: 18, minute: 0 }
            },
            sound: 'default',
            actionTypeId: 'OPEN_APP',
            extra: { verseType: 'evening' }
          }
        ]
      });
    } catch (error) {
      console.error('Schedule notifications failed:', error);
    }
  },

  async scheduleVerseReminder(verse: any, delayMinutes: number = 30): Promise<void> {
    try {
      const reminderTime = new Date();
      reminderTime.setMinutes(reminderTime.getMinutes() + delayMinutes);

      await LocalNotifications.schedule({
        notifications: [
          {
            id: 100 + Math.floor(Math.random() * 1000),
            title: '📖 Verse Reminder',
            body: `Remember to reflect on Chapter ${verse.Chapter}, Verse ${verse.Verse}`,
            schedule: { at: reminderTime },
            sound: 'default',
            actionTypeId: 'OPEN_VERSE',
            extra: { 
              chapter: verse.Chapter, 
              verse: verse.Verse 
            }
          }
        ]
      });
    } catch (error) {
      console.error('Verse reminder failed:', error);
    }
  },

  async cancelAll(): Promise<void> {
    try {
      await LocalNotifications.cancel({ notifications: [] });
    } catch (error) {
      console.error('Cancel notifications failed:', error);
    }
  }
};

// App State Management
export const appState = {
  async addListeners(): Promise<void> {
    try {
      // Handle notification taps
      LocalNotifications.addListener('localNotificationReceived', (notification) => {
        console.log('Notification received:', notification);
        hapticFeedback.light();
      });

      LocalNotifications.addListener('localNotificationActionPerformed', (notificationAction) => {
        console.log('Notification action:', notificationAction);
        // Handle notification actions (open specific verse, etc.)
        if (notificationAction.actionId === 'OPEN_VERSE') {
          const { chapter, verse } = notificationAction.notification.extra;
          // Navigate to specific verse
          window.location.href = `/chapter/${chapter}?verse=${verse}`;
        }
      });
    } catch (error) {
      console.error('App state listeners failed:', error);
    }
  }
};

// Initialize all Capacitor features
export const initializeCapacitorFeatures = async (): Promise<void> => {
  try {
    // Request notification permissions
    const hasPermission = await notifications.requestPermissions();
    if (hasPermission) {
      await notifications.scheduleDailyReminders();
    }

    // Add app state listeners
    await appState.addListeners();

    // Check initial network status
    const isConnected = await networkStatus.checkConnection();
    if (!isConnected) {
      console.log('App is offline');
    }

    console.log('Capacitor features initialized successfully');
  } catch (error) {
    console.error('Capacitor initialization failed:', error);
  }
};

// Utility to check if running on native platform
export const isNativePlatform = (): boolean => {
  return Capacitor.isNativePlatform();
}; 