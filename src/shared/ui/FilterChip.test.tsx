import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { FilterChip } from "./FilterChip";

describe("FilterChip", () => {
  it("renders label", () => {
    const { getByText } = render(<FilterChip label="Active" />);
    expect(getByText("Active")).toBeTruthy();
  });

  it("renders inactive by default", () => {
    const { getByText } = render(<FilterChip label="Monthly" />);
    expect(getByText("Monthly")).toBeTruthy();
  });

  it("renders active state", () => {
    const { getByText } = render(<FilterChip label="Weekly" active />);
    expect(getByText("Weekly")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <FilterChip label="Custom" onPress={onPress} />,
    );
    fireEvent.press(getByText("Custom"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("does not crash without onPress", () => {
    const { getByText } = render(<FilterChip label="Yearly" />);
    expect(getByText("Yearly")).toBeTruthy();
  });
});
