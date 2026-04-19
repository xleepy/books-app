import { createSlice } from '@reduxjs/toolkit';
import { mockStats, mockUser } from '@entities/user/mock/user';
import { ReadingStats, User } from '@entities/user/model/types';

interface UserState {
  user: User;
  stats: ReadingStats;
}

const initialState: UserState = {
  user: mockUser,
  stats: mockStats,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
});

export const userReducer = userSlice.reducer;
