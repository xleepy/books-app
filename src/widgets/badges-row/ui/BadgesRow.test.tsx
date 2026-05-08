import React from "react";
import { render } from "@testing-library/react-native";
import { BadgesRow } from "./BadgesRow";
import type { UserBadge } from "@shared/api/meApi.generated";

describe("BadgesRow", () => {
  const badges: UserBadge[] = [
    { slug: "first-chapter", name: "First Chapter", awardedAt: "2024-01-01" },
    { slug: "on-fire", name: "On Fire", awardedAt: "2024-02-01" },
    { slug: "critic", name: "Top Critic", awardedAt: "2024-03-01" },
  ];

  it("renders loading state", () => {
    const { UNSAFE_queryByType } = render(
      <BadgesRow badges={[]} isLoading />,
    );
    expect(UNSAFE_queryByType).toBeTruthy();
  });

  it("renders empty state when no badges", () => {
    const { getByText } = render(<BadgesRow badges={[]} />);
    expect(
      getByText("No badges earned yet — keep reading!"),
    ).toBeTruthy();
  });

  it("renders badges", () => {
    const { getByText } = render(<BadgesRow badges={badges} />);
    expect(getByText("First Chapter")).toBeTruthy();
    expect(getByText("On Fire")).toBeTruthy();
    expect(getByText("Top Critic")).toBeTruthy();
  });

  it("uses Award icon for unknown slug", () => {
    const unknown: UserBadge[] = [
      { slug: "unknown-badge", name: "Mystery", awardedAt: "2024-01-01" },
    ];
    const { getByText } = render(<BadgesRow badges={unknown} />);
    expect(getByText("Mystery")).toBeTruthy();
  });
});
