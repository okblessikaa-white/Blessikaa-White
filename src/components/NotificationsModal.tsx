import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  Send,
  Trash2,
  X,
  Sparkles,
  Flame,
  Award,
  AlertCircle,
} from 'lucide-react';
import { AppSettings, NotificationItem } from '../types';
import { NotificationService } from '../utils/notifications';
import { soundManager } from '../utils/audio';

interface NotificationsModalProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  notifications: NotificationItem[];
  onClearNotifications: () => void;
  onMarkAllRead: () => void;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  settings,
  onUpdateSettings,
  notifications,
  onClearNotifications,
  onMarkAllRead,
  onClose,
}) => {
  const [permissionStatus, setPermissionStatus] = useState<string>(
    NotificationService.getPermissionStatus()
  );
  const [reminderTime, setReminderTime] = useState(settings.reminderTime || '08:30');
  const [reminderEnabled, setReminderEnabled] = useState(settings.reminderEnabled || false);
  const [testSent, setTestSent] = useState(false);

  const handleRequestPermission = async () => {
    soundManager.playTick();
    const result = await NotificationService.requestPermission();
    setPermissionStatus(result);
    if (result === 'granted') {
      setReminderEnabled(true);
      onUpdateSettings({
        ...settings,
        reminderEnabled: true,
        reminderTime,
      });
      NotificationService.sendSystemNotification('Push Notifications Activated! ✨', {
        body: 'You will receive your daily 21-day challenge reminder and motivational boost.',
      });
    }
  };

  const handleSaveReminderSettings = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playTick();
    onUpdateSettings({
      ...settings,
      reminderEnabled,
      reminderTime,
    });
  };

  const handleSendTestNotification = () => {
    soundManager.playStreakChime();
    setTestSent(true);

    const title = 'Daily 21-Day Habit Reminder 🔥';
    const body = 'Day by day, your new identity is forming. Tap to execute today’s action checklist!';

    NotificationService.sendSystemNotification(title, { body });

    setTimeout(() => setTestSent(false), 3000);
  };

  const getNotifIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'motivation':
        return Sparkles;
      case 'streak':
        return Flame;
      case 'milestone':
        return Award;
      default:
        return Bell;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-purple-100 shadow-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-purple-100 text-purple-700 border border-purple-200">
              <Bell className="w-3.5 h-3.5 text-purple-600" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
              Reminders & Push Center
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Daily Motivational Reminders
          </h3>
          <p className="text-xs text-slate-600">
            Never break the chain. Configure automated daily browser push notifications to keep your streak burning.
          </p>
        </div>

        {/* Permission Banner */}
        {permissionStatus !== 'granted' ? (
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <span className="font-bold text-slate-900">
                  Enable Browser Push Notifications
                </span>
                <p className="text-slate-600">
                  Allow notifications so your device can alert you at your scheduled habit time every day.
                </p>
              </div>
            </div>
            <button
              onClick={handleRequestPermission}
              className="w-full py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              Grant Notification Permission
            </button>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-medium">Browser Push Notifications Active</span>
            </div>
            <button
              onClick={handleSendTestNotification}
              className="px-3 py-1 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-[11px] font-bold text-emerald-800 transition-colors"
            >
              {testSent ? '✓ Sent!' : 'Send Test Push'}
            </button>
          </div>
        )}

        {/* Schedule Form */}
        <form
          onSubmit={handleSaveReminderSettings}
          className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-600" />
                <span>Daily Reminder Schedule</span>
              </label>
              <span className="text-[11px] text-slate-500 block">
                Choose the exact hour you want to be reminded
              </span>
            </div>

            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-purple-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-purple-100">
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={reminderEnabled}
                onChange={(e) => setReminderEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 border-purple-300 focus:ring-purple-500"
              />
              <span>Enable daily automated push reminder</span>
            </label>

            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-bold text-white transition-colors"
            >
              Save Schedule
            </button>
          </div>
        </form>

        {/* In-app Notification Inbox */}
        <div className="space-y-2 pt-2 border-t border-purple-100">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Notification Inbox ({notifications.length})
            </h4>
            <div className="flex items-center gap-2">
              <button
                onClick={onMarkAllRead}
                className="text-[11px] text-purple-700 font-semibold hover:text-purple-900"
              >
                Mark all read
              </button>
              <button
                onClick={onClearNotifications}
                className="p-1 text-slate-400 hover:text-red-500"
                title="Clear all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {notifications.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                No notifications logged yet.
              </div>
            ) : (
              notifications.map((n) => {
                const Icon = getNotifIcon(n.type);
                return (
                  <div
                    key={n.id}
                    className={`p-3 rounded-2xl border flex items-start gap-2.5 text-xs transition-colors ${
                      n.read
                        ? 'bg-slate-50 border-slate-200 text-slate-500'
                        : 'bg-purple-50/50 border-purple-100 text-slate-800'
                    }`}
                  >
                    <div className="p-1.5 rounded-xl bg-purple-100 text-purple-700 shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="font-semibold text-slate-900 leading-tight">
                        {n.title}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        {n.body}
                      </p>
                      <span className="text-[10px] text-slate-400 block pt-0.5">
                        {new Date(n.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
