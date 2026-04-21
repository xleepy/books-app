import { Thread } from '../model/types';

export const mockThreads: Thread[] = [
  {
    id: 't1',
    title: 'Is 1984 still relevant today?',
    bookContext: '1984 · George Orwell',
    preview:
      'I just finished re-reading this and the parallels to modern surveillance are striking. What do you all think about...',
    coverUrl: null,
    replies: 24,
    likes: 18,
    timeAgo: '2h ago',
    spoiler: false,
    creatorName: 'Alice Reader',
    creatorAvatarHue: 210,
  },
  {
    id: 't2',
    title: 'Best fantasy series for beginners?',
    bookContext: 'General · Fantasy',
    preview:
      'My friend wants to get into fantasy but finds LOTR too dense. Any suggestions for lighter entry points?',
    coverUrl: null,
    replies: 42,
    likes: 37,
    timeAgo: '5h ago',
    liked: true,
    spoiler: false,
    creatorName: 'Bob Reads',
    creatorAvatarHue: 140,
  },
  {
    id: 't3',
    title: 'The ending of Project Hail Mary 🤯',
    bookContext: 'Project Hail Mary · Andy Weir',
    preview:
      "Can we talk about Rocky? That friendship arc was the most emotional thing I've read in years...",
    coverUrl: null,
    replies: 56,
    likes: 45,
    timeAgo: '1d ago',
    spoiler: true,
    creatorName: 'Carol S.',
    creatorAvatarHue: 310,
  },
  {
    id: 't4',
    title: "What's everyone reading this weekend?",
    bookContext: 'General · Open Thread',
    preview:
      "Drop your current reads below — looking for something cozy to start before Sunday morning coffee.",
    coverUrl: null,
    replies: 31,
    likes: 22,
    timeAgo: '2d ago',
    spoiler: false,
    creatorName: 'Dave Pages',
    creatorAvatarHue: 55,
  },
];
