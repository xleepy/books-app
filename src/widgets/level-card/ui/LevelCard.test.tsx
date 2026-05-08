import React from "react";
import { render } from "@testing-library/react-native";
import { LevelCard } from "./LevelCard";
import type { User } from "@entities/user/model/types";

describe("LevelCard", () => {
  const user: User = {
    id: "1",
    name: "Alice",
    avatarHue: 42,
    level: 15,
    levelTitle: "Bookworm",
    xpCurrent: 3500,
    xpRequired: 5000,
    readingGoal: 10,
  };

  it("renders level number", () => {
    const { getByText } = render(<LevelCard user={user} />);
    expect(getByText("15")).toBeTruthy();
    expect(getByText("Level 15")).toBeTruthy();
  });

  it("renders level title", () => {
    const { getByText } = render(<LevelCard user={user} />);
    expect(getByText("Bookworm")).toBeTruthy();
  });

  it("renders XP progress text", () => {
    const { getByText } = render(<LevelCard user={user} />);
    const xpText = getByText(/3[,\s]?500\s*\/\s*5[,\s]?000\s*XP/);
    expect(xpText).toBeTruthy();
  });

  it("renders full XP progress", () => {
    const maxedUser: User = { ...user, xpCurrent: 5000, xpRequired: 5000 };
    const { toJSON } = render(<LevelCard user={maxedUser} />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders zero XP progress", () => {
    const newUser: User = { ...user, xpCurrent: 0 };
    const { toJSON } = render(<LevelCard user={newUser} />);
    expect(toJSON()).toBeTruthy();
  });
});
