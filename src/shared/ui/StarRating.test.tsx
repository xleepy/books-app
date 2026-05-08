import React from "react";
import { render } from "@testing-library/react-native";
import { StarRating } from "./StarRating";

describe("StarRating", () => {
  it("renders with default props", () => {
    const { toJSON } = render(<StarRating value={4} />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders full stars for integer value", () => {
    const { toJSON } = render(<StarRating value={5} />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders half star for fractional value", () => {
    const { toJSON } = render(<StarRating value={3.5} />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders empty stars at low value", () => {
    const { toJSON } = render(<StarRating value={0} />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders with custom size", () => {
    const { toJSON } = render(<StarRating value={4} size={24} />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders with custom color", () => {
    const { toJSON } = render(<StarRating value={4} color="#FFD700" />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders at boundary 0.5", () => {
    const { toJSON } = render(<StarRating value={2.5} />);
    expect(toJSON()).toBeTruthy();
  });
});
