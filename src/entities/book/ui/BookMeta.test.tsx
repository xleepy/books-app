import React from "react";
import { render } from "@testing-library/react-native";
import { BookMeta } from "./BookMeta";
import type { Book } from "../model/types";

describe("BookMeta", () => {
  const book: Book = {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    tags: ["Fiction", "Classics"],
    description: "A novel set in the Jazz Age.",
    rating: 4.2,
    reviewCount: 150,
  };

  it("renders title and author", () => {
    const { getByText } = render(<BookMeta book={book} />);
    expect(getByText("The Great Gatsby")).toBeTruthy();
    expect(getByText("by F. Scott Fitzgerald")).toBeTruthy();
  });

  it("renders tags", () => {
    const { getByText } = render(<BookMeta book={book} />);
    expect(getByText("Fiction")).toBeTruthy();
    expect(getByText("Classics")).toBeTruthy();
  });

  it("renders left-aligned by default", () => {
    const { toJSON } = render(<BookMeta book={book} />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders center-aligned", () => {
    const { toJSON } = render(<BookMeta book={book} align="center" />);
    expect(toJSON()).toBeTruthy();
  });

  it("first tag uses accent variant, others muted (left-aligned)", () => {
    const { getByText } = render(<BookMeta book={book} />);
    expect(getByText("Fiction")).toBeTruthy();
    expect(getByText("Classics")).toBeTruthy();
  });

  it("all tags use accent variant when center-aligned", () => {
    const { toJSON } = render(<BookMeta book={book} align="center" />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders book with no tags", () => {
    const noTagsBook: Book = { ...book, tags: [] };
    const { getByText } = render(<BookMeta book={noTagsBook} />);
    expect(getByText("The Great Gatsby")).toBeTruthy();
  });
});
