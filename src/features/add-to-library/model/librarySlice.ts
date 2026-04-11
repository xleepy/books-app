import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Book } from '@entities/book/model/types';
import { mockBooks } from '@entities/book/mock/books';

interface LibraryState {
  savedBooks: Book[];
}

const initialState: LibraryState = {
  savedBooks: [mockBooks[1], mockBooks[2], mockBooks[3]],
};

const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    addBook(state, action: PayloadAction<Book>) {
      if (!state.savedBooks.find((b) => b.id === action.payload.id)) {
        state.savedBooks.push(action.payload);
      }
    },
    removeBook(state, action: PayloadAction<string>) {
      state.savedBooks = state.savedBooks.filter((b) => b.id !== action.payload);
    },
  },
});

export const { addBook, removeBook } = librarySlice.actions;
export const libraryReducer = librarySlice.reducer;
