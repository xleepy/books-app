import { createSlice } from "@reduxjs/toolkit";
import { mockStats, mockUser } from "@entities/user/mock/user";
import { ReadingStats, User } from "@entities/user/model/types";
import { meApi } from "@shared/api/meApi.generated";

interface UserState {
  user: User;
  stats: ReadingStats;
  readingGoal: number;
}

const initialState: UserState = {
  user: mockUser,
  stats: mockStats,
  readingGoal: 30,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      meApi.endpoints.getMe.matchFulfilled,
      (state, action) => {
        const me = action.payload;
        // Use server-computed within-level progress fields directly
        state.user = {
          id: me.id,
          name: me.name,
          avatarHue: me.avatarHue,
          level: me.level,
          levelTitle: me.levelTitle,
          xpCurrent: me.xpCurrentLevel,
          xpRequired: me.xpToNextLevel,
          readingGoal: me.readingGoal,
        };
        state.stats = {
          pagesRead: me.pagesRead ?? 0,
          booksFinished: me.booksFinished,
          dailyAverage: state.stats.dailyAverage,
          hoursRead: me.hoursRead ?? 0,
          streak: me.streak,
          bestStreak: me.bestStreak,
          weekDays: me.weekDays,
        };
        state.readingGoal = me.readingGoal;
      },
    );
  },
});

export const userReducer = userSlice.reducer;
