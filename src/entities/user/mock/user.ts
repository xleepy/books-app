import { ReadingStats, User } from '../model/types';

export const mockUser: User = {
  id: 'user-1',
  name: 'Jane Doe',
  avatarHue: 280,
  level: 12,
  levelTitle: 'Bookworm',
  xpCurrent: 2450,
  xpRequired: 3000,
};

export const mockStats: ReadingStats = {
  pagesRead: 4280,
  booksFinished: 12,
  dailyAverage: 32,
  hoursRead: 86,
  streak: 14,
  bestStreak: 21,
  weekDays: [true, true, true, true, true, false, false],
};
