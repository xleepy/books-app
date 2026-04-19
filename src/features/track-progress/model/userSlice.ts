import { createSlice } from '@reduxjs/toolkit';
import { mockStats, mockUser } from '@entities/user/mock/user';
import { ReadingStats, User } from '@entities/user/model/types';
import { meApi } from '@store/api/meApi.generated';

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
  extraReducers: (builder) => {
    builder.addMatcher(meApi.endpoints.getMe.matchFulfilled, (state, action) => {
      const me = action.payload;
      const xpRequired = me.level * 500;
      state.user = {
        id: me.id,
        name: me.name,
        avatarHue: me.avatarHue,
        level: me.level,
        levelTitle: me.levelTitle,
        xpCurrent: me.xpTotal % xpRequired,
        xpRequired,
      };
      state.stats = {
        pagesRead: me.pagesRead,
        booksFinished: me.booksFinished,
        dailyAverage: state.stats.dailyAverage,
        hoursRead: me.hoursRead,
        streak: me.streak,
        bestStreak: me.bestStreak,
        weekDays: me.weekDays,
      };
    });
  },
});

export const userReducer = userSlice.reducer;
