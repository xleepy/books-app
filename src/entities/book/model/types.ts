import { BookCoverKey } from '@shared/assets/images';

export interface Book {
  id: string;
  title: string;
  author: string;
  cover: BookCoverKey;
  tags: string[];
  description: string;
  rating: number;
  reviewCount: number;
}
