import * as Notifications from "expo-notifications";

const REMINDER_NOTIFICATION_ID = "daily-reading-reminder";

export async function scheduleReadingReminder(
  time: string,
  enabled: boolean,
): Promise<void> {
  // Always cancel existing first
  await cancelReadingReminder();

  if (!enabled) return;

  const [hourStr, minuteStr] = time.split(":");
  const hour = parseInt(hourStr ?? "21", 10);
  const minute = parseInt(minuteStr ?? "0", 10);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Time to read! 📚",
      body: "Keep your streak alive — open the app and read a few pages.",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
    identifier: REMINDER_NOTIFICATION_ID,
  });
}

export async function cancelReadingReminder(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(
    REMINDER_NOTIFICATION_ID,
  );
}

export async function getScheduledReminders(): Promise<
  Notifications.NotificationRequest[]
> {
  const requests = await Notifications.getAllScheduledNotificationsAsync();
  return requests.filter((r) => r.identifier === REMINDER_NOTIFICATION_ID);
}
