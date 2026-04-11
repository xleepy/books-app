import { Challenge, LeaderboardEntry } from '../model/types';

export const mockChallenges: Challenge[] = [
  {
    id: 'c1',
    title: 'April Reading Sprint',
    subtitle: 'Monthly Challenge',
    goal: 'Read 5 books this month',
    current: 3,
    target: 5,
    badgeText: '19 days left',
    variant: 'monthly',
  },
  {
    id: 'c2',
    title: '2025 Reading Goal',
    subtitle: 'Yearly Challenge',
    goal: 'Read 24 books this year',
    current: 12,
    target: 24,
    badgeText: 'On track!',
    variant: 'yearly',
  },
];

export const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: 'l1',
    rank: 1,
    name: 'Sarah M.',
    level: 18,
    levelTitle: 'Bibliophile',
    books: 9,
    xp: 2880,
    avatarHue: 18,
  },
  {
    id: 'l2',
    rank: 2,
    name: 'Alex K.',
    level: 15,
    levelTitle: 'Bookworm',
    books: 7,
    xp: 2340,
    avatarHue: 200,
  },
  {
    id: 'l3',
    rank: 3,
    name: 'You',
    level: 12,
    levelTitle: 'Bookworm',
    books: 5,
    xp: 1940,
    isYou: true,
    avatarHue: 280,
  },
];
