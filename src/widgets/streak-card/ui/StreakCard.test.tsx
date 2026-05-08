import React from "react";
import { render } from "@testing-library/react-native";
import { StreakCard } from "./StreakCard";

// Freeze time so getIsoWeekday() is deterministic
const mockDate = new Date("2024-05-15T12:00:00Z"); // Wednesday (iso weekday 2)
jest.useFakeTimers().setSystemTime(mockDate);

describe("StreakCard", () => {
  const weekDays = [true, true, false, true, false, true, false];

  it("renders streak count", () => {
    const { getByText } = render(
      <StreakCard streak={5} bestStreak={12} weekDays={weekDays} />,
    );
    expect(getByText("5 Day Streak")).toBeTruthy();
  });

  it("renders best streak badge", () => {
    const { getByText } = render(
      <StreakCard streak={5} bestStreak={12} weekDays={weekDays} />,
    );
    expect(getByText("Best: 12")).toBeTruthy();
  });

  it("renders all day labels", () => {
    const { getByText, getAllByText } = render(
      <StreakCard streak={5} bestStreak={12} weekDays={weekDays} />,
    );
    expect(getByText("M")).toBeTruthy();
    const tLabels = getAllByText("T");
    expect(tLabels).toHaveLength(2);
    expect(getByText("W")).toBeTruthy();
    expect(getByText("F")).toBeTruthy();
    const sLabels = getAllByText("S");
    expect(sLabels).toHaveLength(2);
  });

  it("renders zero streak", () => {
    const { getByText } = render(
      <StreakCard streak={0} bestStreak={12} weekDays={weekDays} />,
    );
    expect(getByText("0 Day Streak")).toBeTruthy();
  });

  it("renders empty week days", () => {
    const emptyDays = [false, false, false, false, false, false, false];
    const { getByText } = render(
      <StreakCard streak={0} bestStreak={0} weekDays={emptyDays} />,
    );
    expect(getByText("Best: 0")).toBeTruthy();
  });
});
