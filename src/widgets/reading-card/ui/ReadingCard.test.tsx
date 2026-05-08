import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ReadingCard } from "./ReadingCard";

describe("ReadingCard", () => {
  const props = {
    coverUrl: "https://example.com/cover.jpg",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    progress: 0.45,
    timeLeft: "~2h remaining",
  };

  it("renders title and author", () => {
    const { getByText } = render(<ReadingCard {...props} />);
    expect(getByText("The Great Gatsby")).toBeTruthy();
    expect(getByText("F. Scott Fitzgerald")).toBeTruthy();
  });

  it("renders progress percentage", () => {
    const { getByText } = render(<ReadingCard {...props} />);
    expect(getByText("45% complete · ~2h remaining")).toBeTruthy();
  });

  it("renders Continue Reading button", () => {
    const { getByText } = render(<ReadingCard {...props} />);
    expect(getByText("Continue Reading")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ReadingCard {...props} onPress={onPress} />,
    );
    fireEvent.press(getByText("The Great Gatsby"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("renders without coverUrl", () => {
    const { getByText } = render(
      <ReadingCard {...props} coverUrl={null} />,
    );
    expect(getByText("The Great Gatsby")).toBeTruthy();
  });

  it("renders 0% progress", () => {
    const { getByText } = render(
      <ReadingCard {...props} progress={0} timeLeft="just started" />,
    );
    expect(getByText("0% complete · just started")).toBeTruthy();
  });

  it("renders 100% progress", () => {
    const { getByText } = render(
      <ReadingCard {...props} progress={1} timeLeft="finished" />,
    );
    expect(getByText("100% complete · finished")).toBeTruthy();
  });

  it("renders without onPress (non-interactive)", () => {
    const { getByText } = render(<ReadingCard {...props} />);
    expect(getByText("The Great Gatsby")).toBeTruthy();
  });
});
