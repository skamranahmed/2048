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

      expect(Object.values(state.tiles)).toEqual([{ id: state.board[0][0], ...tile }]);
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

    it("should stack tiles with the same values on top of each other", () => {
      const tile1: Tile = {
        position: [0, 1],
        value: 2,
      };

      const tile2: Tile = {
        position: [0, 3],
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
      expect(typeof stateBefore.board[1][0]).toBe("string");

      expect(isNil(stateBefore.board[2][0])).toBeTruthy();
      expect(typeof stateBefore.board[3][0]).toBe("string");

      act(() => {
        dispatch({
          type: "move_up",
        });
      });

      const [stateAfter] = result.current;

      expect(typeof stateAfter.board[0][0]).toBe("string");

      expect(isNil(stateAfter.board[1][0])).toBeTruthy();
      expect(isNil(stateAfter.board[2][0])).toBeTruthy();
      expect(isNil(stateAfter.board[3][0])).toBeTruthy();
    });

    it("should merge tiles with the same values", () => {
      const tile1: Tile = {
        position: [0, 1],
        value: 2,
      };

      const tile2: Tile = {
        position: [0, 3],
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
      expect(stateBefore.tiles[stateBefore.board[1][0]].value).toBe(2);

      expect(isNil(stateBefore.board[2][0])).toBeTruthy();
      expect(stateBefore.tiles[stateBefore.board[3][0]].value).toBe(2);

      act(() => {
        dispatch({
          type: "move_up",
        });
      });

      const [stateAfter] = result.current;

      expect(stateAfter.tiles[stateAfter.board[0][0]].value).toBe(4);

      expect(isNil(stateAfter.board[1][0])).toBeTruthy();
      expect(isNil(stateAfter.board[2][0])).toBeTruthy();
      expect(isNil(stateAfter.board[3][0])).toBeTruthy();
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

    it("should stack tiles with the same values on top of each other", () => {
      const tile1: Tile = {
        position: [0, 0],
        value: 2,
      };

      const tile2: Tile = {
        position: [0, 1],
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
      expect(typeof stateBefore.board[0][0]).toBe("string");

      expect(isNil(stateBefore.board[2][0])).toBeTruthy();
      expect(typeof stateBefore.board[1][0]).toBe("string");

      act(() => {
        dispatch({
          type: "move_down",
        });
      });

      const [stateAfter] = result.current;

      expect(typeof stateAfter.board[3][0]).toBe("string");

      expect(isNil(stateAfter.board[2][0])).toBeTruthy();
      expect(isNil(stateAfter.board[1][0])).toBeTruthy();
      expect(isNil(stateAfter.board[0][0])).toBeTruthy();
    });

    it("should merge tiles with the same values", () => {
      const tile1: Tile = {
        position: [0, 0],
        value: 2,
      };

      const tile2: Tile = {
        position: [0, 1],
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
      expect(stateBefore.tiles[stateBefore.board[0][0]].value).toBe(2);

      expect(isNil(stateBefore.board[2][0])).toBeTruthy();
      expect(stateBefore.tiles[stateBefore.board[1][0]].value).toBe(2);

      act(() => {
        dispatch({
          type: "move_down",
        });
      });

      const [stateAfter] = result.current;

      expect(stateAfter.tiles[stateAfter.board[3][0]].value).toBe(4);

      expect(isNil(stateAfter.board[2][0])).toBeTruthy();
      expect(isNil(stateAfter.board[1][0])).toBeTruthy();
      expect(isNil(stateAfter.board[0][0])).toBeTruthy();
    });
  });

  describe("move left", () => {
    it("should move tiles to the left of the board", () => {
      const tile1: Tile = {
        position: [2, 1],
        value: 2,
      };

      const tile2: Tile = {
        position: [3, 2],
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

      expect(isNil(stateBefore.board[1][0])).toBeTruthy();
      expect(isNil(stateBefore.board[2][0])).toBeTruthy();

      expect(typeof stateBefore.board[1][2]).toBe("string");
      expect(typeof stateBefore.board[2][3]).toBe("string");

      act(() => {
        dispatch({
          type: "move_left",
        });
      });

      const [stateAfter] = result.current;

      expect(typeof stateAfter.board[1][0]).toBe("string");
      expect(typeof stateAfter.board[2][0]).toBe("string");

      expect(isNil(stateAfter.board[1][2])).toBeTruthy();
      expect(isNil(stateAfter.board[2][3])).toBeTruthy();
    });

    it("should stack tiles with the same values on top of each other", () => {
      const tile1: Tile = {
        position: [3, 2],
        value: 2,
      };

      const tile2: Tile = {
        position: [2, 2],
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

      expect(isNil(stateBefore.board[2][0])).toBeTruthy();
      expect(typeof stateBefore.board[2][3]).toBe("string");

      expect(isNil(stateBefore.board[2][1])).toBeTruthy();
      expect(typeof stateBefore.board[2][2]).toBe("string");

      act(() => {
        dispatch({
          type: "move_left",
        });
      });

      const [stateAfter] = result.current;

      expect(typeof stateAfter.board[2][0]).toBe("string");

      expect(isNil(stateAfter.board[2][3])).toBeTruthy();
      expect(isNil(stateAfter.board[2][2])).toBeTruthy();
      expect(isNil(stateAfter.board[2][1])).toBeTruthy();
    });

    it("should merge tiles with the same values", () => {
      const tile1: Tile = {
        position: [3, 2],
        value: 2,
      };

      const tile2: Tile = {
        position: [2, 2],
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

      expect(isNil(stateBefore.board[2][0])).toBeTruthy();
      expect(stateBefore.tiles[stateBefore.board[2][3]].value).toBe(2);

      expect(isNil(stateBefore.board[2][1])).toBeTruthy();
      expect(stateBefore.tiles[stateBefore.board[2][2]].value).toBe(2);

      act(() => {
        dispatch({
          type: "move_left",
        });
      });

      const [stateAfter] = result.current;

      expect(stateAfter.tiles[stateAfter.board[2][0]].value).toBe(4);

      expect(isNil(stateAfter.board[2][3])).toBeTruthy();
      expect(isNil(stateAfter.board[2][2])).toBeTruthy();
      expect(isNil(stateAfter.board[2][1])).toBeTruthy();
    });
  });

  describe("move right", () => {
    it("should move tiles to the right of the board", () => {
      const tile1: Tile = {
        position: [2, 1],
        value: 2,
      };

      const tile2: Tile = {
        position: [0, 2],
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

      expect(isNil(stateBefore.board[1][3])).toBeTruthy();
      expect(isNil(stateBefore.board[2][3])).toBeTruthy();

      expect(typeof stateBefore.board[1][2]).toBe("string");
      expect(typeof stateBefore.board[2][0]).toBe("string");

      act(() => {
        dispatch({
          type: "move_right",
        });
      });

      const [stateAfter] = result.current;

      expect(typeof stateAfter.board[1][3]).toBe("string");
      expect(typeof stateAfter.board[2][3]).toBe("string");

      expect(isNil(stateAfter.board[1][2])).toBeTruthy();
      expect(isNil(stateAfter.board[2][0])).toBeTruthy();
    });

    it("should stack tiles with the same values on top of each other", () => {
      const tile1: Tile = {
        position: [0, 2],
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

      expect(isNil(stateBefore.board[2][3])).toBeTruthy();
      expect(typeof stateBefore.board[2][0]).toBe("string");

      expect(isNil(stateBefore.board[2][2])).toBeTruthy();
      expect(typeof stateBefore.board[2][1]).toBe("string");

      act(() => {
        dispatch({
          type: "move_right",
        });
      });

      const [stateAfter] = result.current;

      expect(typeof stateAfter.board[2][3]).toBe("string");

      expect(isNil(stateAfter.board[2][2])).toBeTruthy();
      expect(isNil(stateAfter.board[2][1])).toBeTruthy();
      expect(isNil(stateAfter.board[2][0])).toBeTruthy();
    });

    it("should merge tiles with the same values", () => {
      const tile1: Tile = {
        position: [0, 2],
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

      expect(isNil(stateBefore.board[2][3])).toBeTruthy();
      expect(stateBefore.tiles[stateBefore.board[2][0]].value).toBe(2);

      expect(isNil(stateBefore.board[2][2])).toBeTruthy();
      expect(stateBefore.tiles[stateBefore.board[2][1]].value).toBe(2);

      act(() => {
        dispatch({
          type: "move_right",
        });
      });

      const [stateAfter] = result.current;

      expect(stateAfter.tiles[stateAfter.board[2][3]].value).toBe(4);

      expect(isNil(stateAfter.board[2][2])).toBeTruthy();
      expect(isNil(stateAfter.board[2][1])).toBeTruthy();
      expect(isNil(stateAfter.board[2][0])).toBeTruthy();
    });
  });
});
