import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ThreadCard } from "./ThreadCard";
import type { Thread } from "../model/types";

describe("ThreadCard", () => {
  const thread: Thread = {
    id: "1",
    title: "Is Gatsby still relevant?",
    bookContext: "The Great Gatsby",
    preview: "I just finished reading and...",
    coverUrl: null,
    replies: 12,
    likes: 45,
    timeAgo: "3h ago",
    spoiler: false,
    liked: false,
    creatorName: "Alice Johnson",
    creatorAvatarHue: 42,
  };

  it("renders thread title and book context", () => {
    const { getByText } = render(<ThreadCard thread={thread} />);
    expect(getByText("Is Gatsby still relevant?")).toBeTruthy();
    expect(getByText("The Great Gatsby")).toBeTruthy();
  });

  it("renders preview text", () => {
    const { getByText } = render(<ThreadCard thread={thread} />);
    expect(getByText("I just finished reading and...")).toBeTruthy();
  });

  it("renders reply and like counts", () => {
    const { getByText } = render(<ThreadCard thread={thread} />);
    expect(getByText("12 replies")).toBeTruthy();
    expect(getByText("45")).toBeTruthy();
  });

  it("renders time ago", () => {
    const { getByText } = render(<ThreadCard thread={thread} />);
    expect(getByText("3h ago")).toBeTruthy();
  });

  it("renders creator name", () => {
    const { getByText } = render(<ThreadCard thread={thread} />);
    expect(getByText("Alice Johnson")).toBeTruthy();
  });

  it("shows spoiler warning when spoiler is true", () => {
    const spoilered: Thread = { ...thread, spoiler: true };
    const { getByText } = render(<ThreadCard thread={spoilered} />);
    expect(getByText("⚠ Spoilers")).toBeTruthy();
  });

  it("does not show spoiler warning when spoiler is false", () => {
    const { queryByText } = render(<ThreadCard thread={thread} />);
    expect(queryByText("⚠ Spoilers")).toBeNull();
  });

  it("fires onPress when pressed", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ThreadCard thread={thread} onPress={onPress} />,
    );
    fireEvent.press(getByText("Is Gatsby still relevant?"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("renders without onPress (non-interactive)", () => {
    const { toJSON } = render(<ThreadCard thread={thread} />);
    expect(toJSON()).toBeTruthy();
  });
});
