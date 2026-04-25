export interface User {
  id: string;
  name: string;
  avatarHue: number;
  level: number;
  levelTitle: string;
  xpCurrent: number;
  xpRequired: number;
  readingGoal: number;
}

export interface ReadingStats {
  pagesRead: number;
  booksFinished: number;
  dailyAverage: number;
  hoursRead: number;
  streak: number;
  bestStreak: number;
  weekDays: boolean[];
}

export interface Preferences {
  readingGoalMinutes: number;
  reminderTime?: string | null;
  reminderEnabled: boolean;
  preferredGenres: string[];
  notifyPush: boolean;
  notifyWeeklyDigest: boolean;
  notifyChallenge: boolean;
  profileVisibility: "public" | "friends" | "private";
}
