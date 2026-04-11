import { createSlice } from '@reduxjs/toolkit';
import { mockStats, mockUser } from '@entities/user/mock/user';
import { ReadingStats, User } from '@entities/user/model/types';

interface UserState {
  user: User;
  stats: ReadingStats;
  currentBook: {
    title: string;
    author: string;
    progress: number;
    timeLeft: string;
  };
}

const initialState: UserState = {
  user: mockUser,
  stats: mockStats,
  currentBook: {
    title: 'Atomic Habits',
    author: 'James Clear',
    progress: 0.68,
    timeLeft: '4h left',
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
});

export const userReducer = userSlice.reducer;
