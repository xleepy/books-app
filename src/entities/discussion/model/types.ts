import { BookCoverKey } from '@shared/assets/images';

export interface Thread {
  id: string;
  title: string;
  bookContext: string;
  preview: string;
  cover: BookCoverKey;
  replies: number;
  likes: number;
  timeAgo: string;
  spoiler?: boolean;
  liked?: boolean;
}
