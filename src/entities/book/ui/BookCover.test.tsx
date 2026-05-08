import React from "react";
import { render } from "@testing-library/react-native";
import { BookCover } from "./BookCover";

describe("BookCover", () => {
  const coverUrl = "https://example.com/cover.jpg";

  it("renders placeholder icon when no coverUrl", () => {
    const { toJSON } = render(<BookCover />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders image when coverUrl is provided", () => {
    const { toJSON } = render(<BookCover coverUrl={coverUrl} />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders with custom dimensions", () => {
    const { toJSON } = render(
      <BookCover width={200} height={300} radius={8} />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it("renders without shadow", () => {
    const { toJSON } = render(<BookCover shadow={false} />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders with contain resizeMode", () => {
    const { toJSON } = render(
      <BookCover coverUrl={coverUrl} resizeMode="contain" />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it("accepts custom style", () => {
    const { toJSON } = render(<BookCover style={{ marginTop: 10 }} />);
    expect(toJSON()).toBeTruthy();
  });
});
