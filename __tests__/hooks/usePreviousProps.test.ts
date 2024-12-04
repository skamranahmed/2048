import usePreviousProps from "@/hooks/usePreviousProps";
import { renderHook } from "@testing-library/react";

describe("usePreviousProps", () => {
  it("should return undefined for the first render", () => {
    const { result } = renderHook(() => usePreviousProps("value 0"));
    expect(result.current).toBeUndefined();
  });

  it("should return the previous prop value", () => {
    const { result, rerender } = renderHook(({ value }) => usePreviousProps(value), {
      initialProps: { value: "value 0" },
    });

    rerender({ value: "value 1" });

    expect(result.current).toEqual("value 0");
  });
});
