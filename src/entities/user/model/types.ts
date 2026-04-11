export interface User {
  id: string;
  name: string;
  avatarHue: number;
  level: number;
  levelTitle: string;
  xpCurrent: number;
  xpRequired: number;
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
