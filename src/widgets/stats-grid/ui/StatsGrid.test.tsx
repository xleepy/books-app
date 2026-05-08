import React from "react";
import { render } from "@testing-library/react-native";
import { StatsGrid } from "./StatsGrid";
import type { ReadingStats } from "@entities/user/model/types";

describe("StatsGrid", () => {
  const stats: ReadingStats = {
    pagesRead: 1250,
    booksFinished: 8,
    dailyAverage: 25,
    hoursRead: 42,
    streak: 5,
    bestStreak: 12,
    weekDays: [true, true, false, true, false, true, false],
  };

  it("renders all four stat tiles", () => {
    const { getByText } = render(<StatsGrid stats={stats} />);
    expect(getByText(/1[,\s]?250/)).toBeTruthy();
    expect(getByText("Pages Read")).toBeTruthy();
    expect(getByText("8")).toBeTruthy();
    expect(getByText("Books Finished")).toBeTruthy();
  });

  it("renders daily average and reading time", () => {
    const { getByText } = render(<StatsGrid stats={stats} />);
    expect(getByText("25 pages")).toBeTruthy();
    expect(getByText("Daily Average")).toBeTruthy();
    expect(getByText("42 hrs")).toBeTruthy();
    expect(getByText("Reading Time")).toBeTruthy();
  });

  it("renders with zero stats", () => {
    const zeroStats: ReadingStats = {
      pagesRead: 0,
      booksFinished: 0,
      dailyAverage: 0,
      hoursRead: 0,
      streak: 0,
      bestStreak: 0,
      weekDays: [false, false, false, false, false, false, false],
    };
    const { getAllByText } = render(<StatsGrid stats={zeroStats} />);
    const zeros = getAllByText("0");
    expect(zeros.length).toBeGreaterThanOrEqual(1);
  });

  it("renders with large numbers", () => {
    const largeStats: ReadingStats = {
      ...stats,
      pagesRead: 100000,
      booksFinished: 999,
    };
    const { getByText } = render(<StatsGrid stats={largeStats} />);
    expect(getByText(/100[,\s]?000/)).toBeTruthy();
    expect(getByText("999")).toBeTruthy();
  });
});
