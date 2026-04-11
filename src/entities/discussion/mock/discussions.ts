import { Thread } from '../model/types';

export const mockThreads: Thread[] = [
  {
    id: 't1',
    title: 'Is 1984 still relevant today?',
    bookContext: '1984 · George Orwell',
    preview:
      'I just finished re-reading this and the parallels to modern surveillance are striking. What do you all think about...',
    cover: 'cover1',
    replies: 24,
    likes: 18,
    timeAgo: '2h ago',
  },
  {
    id: 't2',
    title: 'Best fantasy series for beginners?',
    bookContext: 'General · Fantasy',
    preview:
      'My friend wants to get into fantasy but finds LOTR too dense. Any suggestions for lighter entry points?',
    cover: 'cover2',
    replies: 42,
    likes: 37,
    timeAgo: '5h ago',
    liked: true,
  },
  {
    id: 't3',
    title: 'The ending of Project Hail Mary 🤯',
    bookContext: 'Project Hail Mary · Andy Weir',
    preview:
      "Can we talk about Rocky? That friendship arc was the most emotional thing I've read in years...",
    cover: 'cover3',
    replies: 56,
    likes: 45,
    timeAgo: '1d ago',
    spoiler: true,
  },
  {
    id: 't4',
    title: "What's everyone reading this weekend?",
    bookContext: 'General · Open Thread',
    preview:
      "Drop your current reads below — looking for something cozy to start before Sunday morning coffee.",
    cover: 'cover4',
    replies: 31,
    likes: 22,
    timeAgo: '2d ago',
  },
];
