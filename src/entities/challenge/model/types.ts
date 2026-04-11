export type ChallengeVariant = 'monthly' | 'yearly';

export interface Challenge {
  id: string;
  title: string;
  subtitle: string;
  goal: string;
  current: number;
  target: number;
  badgeText: string;
  variant: ChallengeVariant;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  level: number;
  levelTitle: string;
  books: number;
  xp: number;
  isYou?: boolean;
  avatarHue: number;
}
