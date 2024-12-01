import { render } from "@testing-library/react";
import Board from "@/components/board";

describe("Board component", () => {
  it("should render board with 16 cells", () => {
    const { container } = render(<Board />);
    const cellElements = container.querySelectorAll(".cell");

    expect(cellElements.length).toBe(16);
  });

  it("should render board with 2 tiles", () => {
    const { container } = render(<Board />);
    const tiles = container.querySelectorAll(".tile");

    expect(tiles.length).toBe(2);
  });
});
