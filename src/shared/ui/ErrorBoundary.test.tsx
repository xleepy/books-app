import React, { useState } from "react";
import { Text } from "react-native";
import { render, fireEvent } from "@testing-library/react-native";
import { ErrorBoundary } from "./ErrorBoundary";

function ConditionalExploder() {
  const [explode] = useState(true);
  if (explode) {
    throw new Error("Test explosion");
  }
  return <Text>Recovered</Text>;
}

describe("ErrorBoundary", () => {
  it("renders children when no error", () => {
    const { getByText } = render(
      <ErrorBoundary screenName="Test">
        <Text>Hello</Text>
      </ErrorBoundary>,
    );
    expect(getByText("Hello")).toBeTruthy();
  });

  it("renders fallback UI when child throws", () => {
    const { getByText } = render(
      <ErrorBoundary screenName="Test">
        <ConditionalExploder />
      </ErrorBoundary>,
    );
    expect(getByText("Something went wrong")).toBeTruthy();
  });

  it('shows "Try Again" button in fallback', () => {
    const { getByText } = render(
      <ErrorBoundary screenName="Test">
        <ConditionalExploder />
      </ErrorBoundary>,
    );
    expect(getByText("Try Again")).toBeTruthy();
  });

  it("try again handler does not crash", () => {
    const { getByText } = render(
      <ErrorBoundary screenName="Test">
        <ConditionalExploder />
      </ErrorBoundary>,
    );
    expect(getByText("Something went wrong")).toBeTruthy();
    fireEvent.press(getByText("Try Again"));
    expect(getByText("Something went wrong")).toBeTruthy();
  });

  it("does not catch errors outside its tree", () => {
    const { getByText } = render(
      <ErrorBoundary screenName="Test">
        <Text>Safe</Text>
      </ErrorBoundary>,
    );
    expect(getByText("Safe")).toBeTruthy();
  });
});
