import { Tile } from "@/models/tile";
import gameReducer, { initialState } from "@/reducers/gameReducer";
import { act, renderHook } from "@testing-library/react";
import { isNil } from "lodash";
import { useReducer } from "react";

describe("gameReducer", () => {
  describe("create_tile", () => {
    it("should create a new tile", () => {
      const tile: Tile = {
        position: [0, 0],
        value: 2,
      };

      const { result } = renderHook(() => useReducer(gameReducer, initialState));
      const [, dispatch] = result.current;

      act(() =>
        dispatch({
          type: "create_tile",
          tile: tile,
        }),
      );

      const [state] = result.current;

      expect(state.board[0][0]).toBeDefined();

      expect(Object.values(state.tiles)).toEqual([tile]);
    });
  });

  describe("move up", () => {
    it("should move tiles to the top of the board", () => {
      const tile1: Tile = {
        position: [0, 1],
        value: 2,
      };

      const tile2: Tile = {
        position: [1, 3],
        value: 2,
      };

      const { result } = renderHook(() => useReducer(gameReducer, initialState));
      const [, dispatch] = result.current;

      act(() => {
        dispatch({
          type: "create_tile",
          tile: tile1,
        });

        dispatch({
          type: "create_tile",
          tile: tile2,
        });
      });

      const [stateBefore] = result.current;

      expect(isNil(stateBefore.board[0][0])).toBeTruthy();
      expect(isNil(stateBefore.board[0][1])).toBeTruthy();

      expect(typeof stateBefore.board[1][0]).toBe("string");
      expect(typeof stateBefore.board[3][1]).toBe("string");

      act(() => {
        dispatch({
          type: "move_up",
        });
      });

      const [stateAfter] = result.current;

      expect(typeof stateAfter.board[0][0]).toBe("string");
      expect(typeof stateAfter.board[0][1]).toBe("string");

      expect(isNil(stateAfter.board[1][0])).toBeTruthy();
      expect(isNil(stateAfter.board[3][1])).toBeTruthy();
    });
  });

  describe("move down", () => {
    it("should move tiles to the bottom of the board", () => {
      const tile1: Tile = {
        position: [0, 1],
        value: 2,
      };

      const tile2: Tile = {
        position: [1, 2],
        value: 2,
      };

      const { result } = renderHook(() => useReducer(gameReducer, initialState));
      const [, dispatch] = result.current;

      act(() => {
        dispatch({
          type: "create_tile",
          tile: tile1,
        });

        dispatch({
          type: "create_tile",
          tile: tile2,
        });
      });

      const [stateBefore] = result.current;

      expect(isNil(stateBefore.board[3][0])).toBeTruthy();
      expect(isNil(stateBefore.board[3][1])).toBeTruthy();

      expect(typeof stateBefore.board[1][0]).toBe("string");
      expect(typeof stateBefore.board[2][1]).toBe("string");

      act(() => {
        dispatch({
          type: "move_down",
        });
      });

      const [stateAfter] = result.current;

      expect(typeof stateAfter.board[3][0]).toBe("string");
      expect(typeof stateAfter.board[3][1]).toBe("string");

      expect(isNil(stateAfter.board[1][0])).toBeTruthy();
      expect(isNil(stateAfter.board[2][1])).toBeTruthy();
    });
  });
});
