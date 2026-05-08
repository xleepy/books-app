import React from "react";
import { render } from "@testing-library/react-native";
import { Avatar } from "./Avatar";

describe("Avatar", () => {
  it("renders with initials", () => {
    const { getByText } = render(<Avatar initials="AJ" />);
    expect(getByText("AJ")).toBeTruthy();
  });

  it("renders empty string when no initials", () => {
    const { toJSON } = render(<Avatar />);
    expect(toJSON()).toBeTruthy();
  });

  it("truncates initials to 2 characters", () => {
    const { getByText } = render(<Avatar initials="ABCD" />);
    expect(getByText("AB")).toBeTruthy();
  });

  it("renders with custom size", () => {
    const { toJSON } = render(<Avatar initials="XY" size={60} />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders with custom hue", () => {
    const { toJSON } = render(<Avatar initials="MN" hue={200} />);
    expect(toJSON()).toBeTruthy();
  });

  it("uppercases initials", () => {
    const { getByText } = render(<Avatar initials="ab" />);
    expect(getByText("AB")).toBeTruthy();
  });
});
