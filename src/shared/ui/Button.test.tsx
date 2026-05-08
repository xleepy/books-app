import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Button } from "./Button";

describe("Button", () => {
  it("renders the title", () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Submit" onPress={onPress} />);
    expect(getByText("Submit")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Click" onPress={onPress} />);
    fireEvent.press(getByText("Click"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("does not call onPress when disabled", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Click" onPress={onPress} disabled />,
    );
    fireEvent.press(getByText("Click"));
    expect(onPress).toHaveBeenCalledTimes(0);
  });

  it("does not call onPress when loading", () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <Button title="Click" onPress={onPress} loading />,
    );
    fireEvent.press(getByRole("button"));
    expect(onPress).toHaveBeenCalledTimes(0);
  });

  it("renders secondary variant", () => {
    const { getByText } = render(
      <Button title="Cancel" variant="secondary" onPress={jest.fn()} />,
    );
    expect(getByText("Cancel")).toBeTruthy();
  });

  it("renders outline variant", () => {
    const { getByText } = render(
      <Button title="Outline" variant="outline" onPress={jest.fn()} />,
    );
    expect(getByText("Outline")).toBeTruthy();
  });

  it("renders ghost variant", () => {
    const { getByText } = render(
      <Button title="Ghost" variant="ghost" onPress={jest.fn()} />,
    );
    expect(getByText("Ghost")).toBeTruthy();
  });

  it("renders small size", () => {
    const { getByText } = render(
      <Button title="Small" size="sm" onPress={jest.fn()} />,
    );
    expect(getByText("Small")).toBeTruthy();
  });

  it("renders large size", () => {
    const { getByText } = render(
      <Button title="Large" size="lg" onPress={jest.fn()} />,
    );
    expect(getByText("Large")).toBeTruthy();
  });

  it("renders full width", () => {
    const { getByText } = render(
      <Button title="Full" fullWidth onPress={jest.fn()} />,
    );
    expect(getByText("Full")).toBeTruthy();
  });

  it("has accessibility button role", () => {
    const { getByRole } = render(<Button title="Accessible" onPress={jest.fn()} />);
    expect(getByRole("button")).toBeTruthy();
  });
});
