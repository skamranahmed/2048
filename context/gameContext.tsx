import { gameWinTileValue, mergeAnimationDuration, tileCountPerDimension } from "@/constants";
import { Tile } from "@/models/tile";
import gameReducer, { initialState } from "@/reducers/gameReducer";
import { isNil, throttle } from "lodash";
import { createContext, PropsWithChildren, useCallback, useEffect, useReducer } from "react";

type MoveDirection = "move_up" | "move_down" | "move_left" | "move_right";

export const GameContext = createContext({
  status: "ongoing",
  score: 0,
  getTiles: () => [] as Tile[],
  moveTiles: (_: MoveDirection) => {},
  startGame: () => {},
});

export default function GameProvider({ children }: PropsWithChildren) {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

  const getEmptyCells = () => {
    const results: [number, number][] = [];

    for (let x = 0; x < tileCountPerDimension; x++) {
      for (let y = 0; y < tileCountPerDimension; y++) {
        if (isNil(gameState.board[y][x])) {
          results.push([x, y]);
        }
      }
    }

    return results;
  };

  const appendRandomTile = () => {
    const emptyCells = getEmptyCells();
    if (emptyCells.length > 0) {
      const cellIndex = Math.floor(Math.random() * emptyCells.length);
      const newTile: Tile = {
        position: emptyCells[cellIndex],
        value: 2,
      };
      dispatch({ type: "create_tile", tile: newTile });
    }
  };

  const getTiles = () => {
    return gameState.tilesById.map((tileId: string) => gameState.tiles[tileId]);
  };

  const moveTiles = useCallback(
    throttle(
      (type: MoveDirection) => {
        dispatch({ type: type });
      },
      mergeAnimationDuration * 1.05,
      { trailing: false },
    ),
    [dispatch],
  );

  const startGame = () => {
    dispatch({
      type: "reset_game",
    });

    dispatch({
      type: "create_tile",
      tile: {
        position: [0, 1],
        value: 1024,
      },
    });

    dispatch({
      type: "create_tile",
      tile: {
        position: [0, 2],
        value: 1024,
      },
    });
  };

  const checkGameState = () => {
    const isWon =
      Object.values(gameState.tiles).filter((tile) => tile.value === gameWinTileValue).length > 0;

    if (isWon) {
      dispatch({ type: "update_status", status: "won" });
    }
  };

  useEffect(() => {
    if (gameState.hasChanged) {
      setTimeout(() => {
        dispatch({ type: "clean_up" });
        appendRandomTile();
        checkGameState();
      }, mergeAnimationDuration);
    }
  }, [gameState.hasChanged]);

  return (
    <GameContext.Provider
      value={{ status: gameState.status, score: gameState.score, getTiles, moveTiles, startGame }}
    >
      {children}
    </GameContext.Provider>
  );
}
