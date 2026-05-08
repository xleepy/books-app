import React from "react";
import { render } from "@testing-library/react-native";
import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  it("renders with default props", () => {
    const { toJSON } = render(<ProgressBar value={0.5} />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders empty progress", () => {
    const { toJSON } = render(<ProgressBar value={0} />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders full progress", () => {
    const { toJSON } = render(<ProgressBar value={1} />);
    expect(toJSON()).toBeTruthy();
  });

  it("clamps value above 1", () => {
    const { toJSON } = render(<ProgressBar value={1.5} />);
    expect(toJSON()).toBeTruthy();
  });

  it("clamps value below 0", () => {
    const { toJSON } = render(<ProgressBar value={-0.5} />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders with custom height", () => {
    const { toJSON } = render(<ProgressBar value={0.3} height={10} />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders with custom colors", () => {
    const { toJSON } = render(
      <ProgressBar value={0.7} trackColor="#EEE" fillColor="#F00" />,
    );
    expect(toJSON()).toBeTruthy();
  });
});
