import React from "react";
import { render } from "@testing-library/react-native";
import { ReviewCard } from "./ReviewCard";
import type { Review } from "../model/types";

describe("ReviewCard", () => {
  const review: Review = {
    id: "1",
    reviewer: "Bob Smith",
    date: "2 days ago",
    rating: 4.5,
    text: "A beautifully written novel with deep characters.",
    avatarHue: 120,
  };

  it("renders reviewer name and date", () => {
    const { getByText } = render(<ReviewCard review={review} />);
    expect(getByText("Bob Smith")).toBeTruthy();
    expect(getByText("· 2 days ago")).toBeTruthy();
  });

  it("renders review text", () => {
    const { getByText } = render(<ReviewCard review={review} />);
    expect(
      getByText("A beautifully written novel with deep characters."),
    ).toBeTruthy();
  });

  it("renders star rating", () => {
    const { toJSON } = render(<ReviewCard review={review} />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders with a different rating", () => {
    const lowRating: Review = { ...review, rating: 2, text: "Meh." };
    const { getByText } = render(<ReviewCard review={lowRating} />);
    expect(getByText("Meh.")).toBeTruthy();
  });

  it("renders avatar with correct initials", () => {
    const { getByText } = render(<ReviewCard review={review} />);
    expect(getByText("BS")).toBeTruthy();
  });

  it("renders with single name", () => {
    const singleName: Review = { ...review, reviewer: "Alice" };
    const { getByText } = render(<ReviewCard review={singleName} />);
    expect(getByText("A")).toBeTruthy();
  });
});
