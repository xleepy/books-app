import { Book } from '../model/types';

export const mockBooks: Book[] = [
  {
    id: 'book-1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    cover: 'cover1',
    tags: ['Fiction', 'Philosophy', 'Fantasy'],
    description:
      'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.',
    rating: 4.5,
    reviewCount: 128,
  },
  {
    id: 'book-2',
    title: 'A Place For Dreamers',
    author: 'Evelyn Reed',
    cover: 'cover2',
    tags: ['Fiction', 'Inspirational'],
    description:
      'A heartfelt journey through the corridors of imagination where dreamers find a home for their wildest stories.',
    rating: 4.6,
    reviewCount: 92,
  },
  {
    id: 'book-3',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    cover: 'cover3',
    tags: ['Fiction', 'Fantasy', 'Inspirational'],
    description:
      'Would you have done anything different, if you had the chance to undo your regrets? A novel about all the choices that go into a life well lived.',
    rating: 4.7,
    reviewCount: 245,
  },
  {
    id: 'book-4',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    cover: 'cover4',
    tags: ['Bestseller', 'Fiction', 'Fantasy'],
    description:
      'Over 1 million copies sold. A beautifully imagined exploration of what makes a life worth living.',
    rating: 4.8,
    reviewCount: 312,
  },
];
