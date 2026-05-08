import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ChallengeCard } from "./ChallengeCard";
import type { Challenge } from "../model/types";

describe("ChallengeCard", () => {
  const challenge: Challenge = {
    id: "1",
    slug: "may-reading-sprint",
    title: "May Reading Sprint",
    subtitle: "Read 5 books this month",
    description: "A monthly challenge to read more.",
    goal: "Read 5 books",
    variant: "monthly",
    metric: "books",
    target: 5,
    creatorId: "user1",
    creatorName: "Alice",
    participantCount: 42,
    badgeText: "Bookworm",
    badgeId: "badge1",
    activeFrom: "2024-05-01",
    activeTo: "2024-05-31",
    current: 2,
    isJoined: true,
    isCreator: false,
  };

  it("renders challenge title", () => {
    const { getByText } = render(<ChallengeCard challenge={challenge} />);
    expect(getByText("May Reading Sprint")).toBeTruthy();
  });

  it("renders progress counter", () => {
    const { getByText } = render(<ChallengeCard challenge={challenge} />);
    expect(getByText("2 / 5")).toBeTruthy();
  });

  it("renders badge text", () => {
    const { getByText } = render(<ChallengeCard challenge={challenge} />);
    expect(getByText("Bookworm")).toBeTruthy();
  });

  it("renders participant count", () => {
    const { getByText } = render(<ChallengeCard challenge={challenge} />);
    expect(getByText("42 participants")).toBeTruthy();
  });

  it("renders target text", () => {
    const { getByText } = render(<ChallengeCard challenge={challenge} />);
    expect(getByText("Read 5 books")).toBeTruthy();
  });

  it('shows "Created by you" when user is creator', () => {
    const creator: Challenge = { ...challenge, isCreator: true };
    const { getByText } = render(<ChallengeCard challenge={creator} />);
    expect(getByText("Created by you")).toBeTruthy();
  });

  it("does not show creator badge when not creator", () => {
    const { queryByText } = render(<ChallengeCard challenge={challenge} />);
    expect(queryByText("Created by you")).toBeNull();
  });

  it("fires onPress when pressed", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ChallengeCard challenge={challenge} onPress={onPress} />,
    );
    fireEvent.press(getByText("May Reading Sprint"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("renders without onPress (non-interactive)", () => {
    const { toJSON } = render(<ChallengeCard challenge={challenge} />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders yearly variant", () => {
    const yearly: Challenge = { ...challenge, variant: "yearly" };
    const { getByText } = render(<ChallengeCard challenge={yearly} />);
    expect(getByText("Yearly Challenge")).toBeTruthy();
  });

  it("renders weekly variant", () => {
    const weekly: Challenge = { ...challenge, variant: "weekly" };
    const { getByText } = render(<ChallengeCard challenge={weekly} />);
    expect(getByText("Weekly Challenge")).toBeTruthy();
  });

  it("renders custom variant", () => {
    const custom: Challenge = { ...challenge, variant: "custom" };
    const { getByText } = render(<ChallengeCard challenge={custom} />);
    expect(getByText("Custom Challenge")).toBeTruthy();
  });

  it("renders streak metric icon", () => {
    const streak: Challenge = { ...challenge, metric: "streak" };
    const { toJSON } = render(<ChallengeCard challenge={streak} />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders pages metric", () => {
    const pages: Challenge = {
      ...challenge,
      metric: "pages",
      target: 500,
      current: 200,
    };
    const { getByText } = render(<ChallengeCard challenge={pages} />);
    expect(getByText("Read 500 pages")).toBeTruthy();
  });

  it("handles unknown variant gracefully (defaults to custom)", () => {
    const unknown: Challenge = {
      ...challenge,
      variant: "unknown" as Challenge["variant"],
    };
    const { toJSON } = render(<ChallengeCard challenge={unknown} />);
    expect(toJSON()).toBeTruthy();
  });

  it("handles zero progress correctly", () => {
    const noProgress: Challenge = { ...challenge, current: 0 };
    const { getByText } = render(<ChallengeCard challenge={noProgress} />);
    expect(getByText("0 / 5")).toBeTruthy();
  });
});
