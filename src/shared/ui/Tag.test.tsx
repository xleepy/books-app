import React from "react";
import { render } from "@testing-library/react-native";
import { Tag } from "./Tag";

describe("Tag", () => {
  it("renders label", () => {
    const { getByText } = render(<Tag label="Fiction" />);
    expect(getByText("Fiction")).toBeTruthy();
  });

  it("renders accent variant by default", () => {
    const { getByText } = render(<Tag label="Classics" />);
    expect(getByText("Classics")).toBeTruthy();
  });

  it("renders muted variant", () => {
    const { getByText } = render(<Tag label="Mystery" variant="muted" />);
    expect(getByText("Mystery")).toBeTruthy();
  });

  it("renders explicit accent variant", () => {
    const { getByText } = render(<Tag label="Sci-Fi" variant="accent" />);
    expect(getByText("Sci-Fi")).toBeTruthy();
  });
});
