import React from "react";
import { render } from "@testing-library/react-native";
import { LeaderboardSection } from "./LeaderboardSection";
import type { LeaderboardEntry } from "@entities/challenge/model/types";

describe("LeaderboardSection", () => {
  const entries: LeaderboardEntry[] = [
    {
      id: "1",
      rank: 1,
      name: "Alice",
      level: 12,
      levelTitle: "Bookworm",
      books: 24,
      xp: 4500,
      isYou: false,
      avatarHue: 42,
    },
    {
      id: "2",
      rank: 2,
      name: "Bob",
      level: 10,
      levelTitle: "Reader",
      books: 18,
      xp: 3200,
      isYou: false,
      avatarHue: 120,
    },
  ];

  it("renders section title", () => {
    const { getByText } = render(<LeaderboardSection entries={entries} />);
    expect(getByText("Leaderboard")).toBeTruthy();
    expect(getByText("This Month")).toBeTruthy();
  });

  it("renders leaderboard rows", () => {
    const { getByText } = render(<LeaderboardSection entries={entries} />);
    expect(getByText("Alice")).toBeTruthy();
    expect(getByText("Bob")).toBeTruthy();
  });

  it("renders empty list", () => {
    const { getByText } = render(<LeaderboardSection entries={[]} />);
    expect(getByText("Leaderboard")).toBeTruthy();
  });

  it("renders correct number of rows", () => {
    const { getByText } = render(<LeaderboardSection entries={entries} />);
    expect(getByText("24 books")).toBeTruthy();
    expect(getByText("18 books")).toBeTruthy();
  });
});
