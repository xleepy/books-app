import { libraryReducer, addBook, removeBook } from './librarySlice';
import { Book } from '@entities/book/model/types';

const makeBook = (id: string): Book => ({
  id,
  title: `Book ${id}`,
  author: 'Test Author',
  cover: 'cover1',
  tags: [],
  description: 'Test description',
  rating: 4.0,
  reviewCount: 10,
});

const empty = { savedBooks: [] };

describe('librarySlice', () => {
  describe('initial state', () => {
    it('seeds the library with the first 3 mock books', () => {
      const result = libraryReducer(undefined, { type: '' });
      expect(result.savedBooks).toHaveLength(3);
    });
  });

  describe('addBook', () => {
    it('adds a book to an empty library', () => {
      const book = makeBook('new');
      const result = libraryReducer(empty, addBook(book));
      expect(result.savedBooks).toHaveLength(1);
      expect(result.savedBooks[0]).toEqual(book);
    });

    it('appends to an existing library', () => {
      const state = { savedBooks: [makeBook('a')] };
      const result = libraryReducer(state, addBook(makeBook('b')));
      expect(result.savedBooks).toHaveLength(2);
      expect(result.savedBooks[1].id).toBe('b');
    });

    it('does not add a duplicate (same id)', () => {
      const book = makeBook('dup');
      const result = libraryReducer({ savedBooks: [book] }, addBook(book));
      expect(result.savedBooks).toHaveLength(1);
    });

    it('deduplication is by id — different object with same id is rejected', () => {
      const original = makeBook('x');
      const sameIdDifferentData = { ...original, title: 'Impostor' };
      const result = libraryReducer({ savedBooks: [original] }, addBook(sameIdDifferentData));
      expect(result.savedBooks).toHaveLength(1);
      expect(result.savedBooks[0].title).toBe(original.title);
    });
  });

  describe('removeBook', () => {
    it('removes the book with the matching id', () => {
      const state = { savedBooks: [makeBook('remove-me')] };
      const result = libraryReducer(state, removeBook('remove-me'));
      expect(result.savedBooks).toHaveLength(0);
    });

    it('only removes the targeted book and leaves others intact', () => {
      const state = { savedBooks: [makeBook('a'), makeBook('b'), makeBook('c')] };
      const result = libraryReducer(state, removeBook('b'));
      expect(result.savedBooks).toHaveLength(2);
      expect(result.savedBooks.map((b) => b.id)).toEqual(['a', 'c']);
    });

    it('is a no-op when the id is not in the library', () => {
      const state = { savedBooks: [makeBook('existing')] };
      const result = libraryReducer(state, removeBook('ghost'));
      expect(result.savedBooks).toHaveLength(1);
    });
  });
});
