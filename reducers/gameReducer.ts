import { tileCountPerDimension } from "@/constants";
import { Tile, TileMap } from "@/models/tile";
import { isNil } from "lodash";
import { uid } from "uid";

type State = { board: string[][]; tiles: TileMap };
type Action =
  | { type: "create_tile"; tile: Tile }
  | { type: "move_up" }
  | { type: "move_down" }
  | { type: "move_left" }
  | { type: "move_right" };

function createBoard() {
  const board: string[][] = [];

  for (let i = 0; i < tileCountPerDimension; i++) {
    board[i] = new Array(tileCountPerDimension).fill(null);
  }

  return board;
}

export const initialState: State = { board: createBoard(), tiles: {} };

export default function gameReducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case "create_tile": {
      const tileId = uid();
      const [x, y] = action.tile.position;
      const newBoard = JSON.parse(JSON.stringify(state.board));

      // the board is an array of arrays
      // each array item in the board represents the y-axis
      // each member in the array item of the board represents the x-axis
      // the index position of the array item is the y-axis coordinate
      // the index position of the member in the array item is the x-axis coordinate
      newBoard[y][x] = tileId;

      return {
        ...state,
        board: newBoard,
        tiles: {
          ...state.tiles,
          [tileId]: { id: tileId, ...action.tile },
        },
      };
    }

    case "move_up": {
      const newBoard = createBoard();
      const newTiles: TileMap = {};

      for (let x = 0; x < tileCountPerDimension; x++) {
        let newY = 0; // top most

        let previousTile: Tile | undefined;

        for (let y = 0; y < tileCountPerDimension; y++) {
          const tileId = state.board[y][x];
          const currentTile = state.tiles[tileId];

          if (!isNil(tileId)) {
            if (previousTile?.value === currentTile.value) {
              // both of these tiles need to be stacked on top of each other

              newTiles[previousTile.id as string] = {
                ...previousTile,
                value: previousTile.value * 2,
              };

              newTiles[tileId] = {
                ...currentTile,
                position: [x, newY - 1],
              };

              previousTile = undefined;
              continue;
            }

            // stacking is not required
            newBoard[newY][x] = tileId;
            newTiles[tileId] = {
              ...currentTile,
              position: [x, newY],
            };
            previousTile = newTiles[tileId];
            newY++;
          }
        }
      }

      return {
        ...state,
        board: newBoard,
        tiles: newTiles,
      };
    }

    case "move_down": {
      const newBoard = createBoard();
      const newTiles: TileMap = {};

      for (let x = 0; x < tileCountPerDimension; x++) {
        let newY = tileCountPerDimension - 1; // bottom most

        let previousTile: Tile | undefined;

        for (let y = 0; y < tileCountPerDimension; y++) {
          const tileId = state.board[y][x];
          const currentTile = state.tiles[tileId];

          if (!isNil(tileId)) {
            if (previousTile?.value === currentTile.value) {
              // both of these tiles need to be stacked on top of each other

              newTiles[previousTile.id as string] = {
                ...previousTile,
                value: previousTile.value * 2,
              };

              newTiles[tileId] = {
                ...currentTile,
                position: [x, newY + 1],
              };

              previousTile = undefined;
              continue;
            }

            // stacking is not required
            newBoard[newY][x] = tileId;
            newTiles[tileId] = {
              ...currentTile,
              position: [x, newY],
            };
            previousTile = newTiles[tileId];
            newY--;
          }
        }
      }

      return {
        ...state,
        board: newBoard,
        tiles: newTiles,
      };
    }

    case "move_left": {
      const newBoard = createBoard();
      const newTiles: TileMap = {};

      for (let y = 0; y < tileCountPerDimension; y++) {
        let newX = 0; // left most

        let previousTile: Tile | undefined;

        for (let x = 0; x < tileCountPerDimension; x++) {
          const tileId = state.board[y][x];
          const currentTile = state.tiles[tileId];

          if (!isNil(tileId)) {
            if (previousTile?.value === currentTile.value) {
              // both of these tiles need to be stacked on top of each other

              newTiles[previousTile.id as string] = {
                ...previousTile,
                value: previousTile.value * 2,
              };

              newTiles[tileId] = {
                ...currentTile,
                position: [newX - 1, y],
              };

              previousTile = undefined;
              continue;
            }

            // stacking is not required
            newBoard[y][newX] = tileId;
            newTiles[tileId] = {
              ...currentTile,
              position: [newX, y],
            };
            previousTile = newTiles[tileId];
            newX++;
          }
        }
      }

      return {
        ...state,
        board: newBoard,
        tiles: newTiles,
      };
    }

    case "move_right": {
      const newBoard = createBoard();
      const newTiles: TileMap = {};

      for (let y = 0; y < tileCountPerDimension; y++) {
        let newX = tileCountPerDimension - 1; // right most

        let previousTile: Tile | undefined;

        for (let x = 0; x < tileCountPerDimension; x++) {
          const tileId = state.board[y][x];
          const currentTile = state.tiles[tileId];

          if (!isNil(tileId)) {
            if (previousTile?.value === currentTile.value) {
              // both of these tiles need to be stacked on top of each other

              newTiles[previousTile.id as string] = {
                ...previousTile,
                value: previousTile.value * 2,
              };

              newTiles[tileId] = {
                ...currentTile,
                position: [newX + 1, y],
              };

              previousTile = undefined;
              continue;
            }

            // stacking is not required
            newBoard[y][newX] = tileId;
            newTiles[tileId] = {
              ...currentTile,
              position: [newX, y],
            };
            previousTile = newTiles[tileId];
            newX--;
          }
        }
      }

      return {
        ...state,
        board: newBoard,
        tiles: newTiles,
      };
    }

    default:
      return state;
  }
}
