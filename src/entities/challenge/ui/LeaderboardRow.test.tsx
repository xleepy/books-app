import React from "react";
import { render } from "@testing-library/react-native";
import { LeaderboardRow } from "./LeaderboardRow";
import type { LeaderboardEntry } from "../model/types";

describe("LeaderboardRow", () => {
  function makeEntry(overrides: Partial<LeaderboardEntry> = {}): LeaderboardEntry {
    return {
      id: "1",
      rank: 1,
      name: "Alice Johnson",
      level: 12,
      levelTitle: "Bookworm",
      books: 24,
      xp: 4500,
      isYou: false,
      avatarHue: 42,
      ...overrides,
    };
  }

  it("renders rank number", () => {
    const { getByText } = render(<LeaderboardRow entry={makeEntry()} />);
    expect(getByText("1")).toBeTruthy();
  });

  it("renders name and level info", () => {
    const { getByText } = render(<LeaderboardRow entry={makeEntry()} />);
    expect(getByText("Alice Johnson")).toBeTruthy();
    expect(getByText("Level 12 · Bookworm")).toBeTruthy();
  });

  it("renders books and XP", () => {
    const { getByText } = render(<LeaderboardRow entry={makeEntry()} />);
    expect(getByText("24 books")).toBeTruthy();
    const xpText = getByText(/4[,\s]?500\s*XP/);
    expect(xpText).toBeTruthy();
  });

  it("renders avatar with initials", () => {
    const { getByText } = render(<LeaderboardRow entry={makeEntry()} />);
    expect(getByText("AJ")).toBeTruthy();
  });

  it("highlights own entry", () => {
    const { getByText } = render(
      <LeaderboardRow entry={makeEntry({ isYou: true })} />,
    );
    expect(getByText("Alice Johnson")).toBeTruthy();
  });

  it("renders rank 2 entry", () => {
    const { getByText } = render(
      <LeaderboardRow entry={makeEntry({ rank: 2 })} />,
    );
    expect(getByText("2")).toBeTruthy();
  });

  it("renders rank 3 entry", () => {
    const { getByText } = render(
      <LeaderboardRow entry={makeEntry({ rank: 3 })} />,
    );
    expect(getByText("3")).toBeTruthy();
  });

  it("renders rank 4+ entry", () => {
    const { getByText } = render(
      <LeaderboardRow entry={makeEntry({ rank: 4 })} />,
    );
    expect(getByText("4")).toBeTruthy();
  });

  it("renders with single name for avatar initials", () => {
    const { getByText } = render(
      <LeaderboardRow entry={makeEntry({ name: "Bob" })} />,
    );
    expect(getByText("B")).toBeTruthy();
  });
});
