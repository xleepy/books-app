import { Review } from '../model/types';

export const mockReviews: Review[] = [
  {
    id: 'r1',
    reviewer: 'Sarah Mitchell',
    date: '2 days ago',
    rating: 5,
    text: 'A profoundly moving exploration of regret and possibility. Matt Haig has a way of distilling complex emotions into beautifully readable prose.',
    avatarHue: 18,
  },
  {
    id: 'r2',
    reviewer: 'James Cooper',
    date: '1 week ago',
    rating: 4,
    text: "The premise grabbed me immediately and the execution mostly delivers. A few middle chapters drag, but the ending makes up for it.",
    avatarHue: 160,
  },
  {
    id: 'r3',
    reviewer: 'Priya Patel',
    date: '2 weeks ago',
    rating: 5,
    text: 'I underlined half the book. It made me reconsider so many of my own choices in the best possible way.',
    avatarHue: 280,
  },
];
