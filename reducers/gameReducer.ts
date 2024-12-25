import { tileCountPerDimension } from "@/constants";
import { Tile, TileMap } from "@/models/tile";
import { flattenDeep, has, isEqual, isNil } from "lodash";
import { uid } from "uid";

type GameStatus = "ongoing" | "won" | "lost";

type State = {
  board: string[][];
  tiles: TileMap;
  tilesById: string[];
  hasChanged: boolean;
  score: number;
  status: GameStatus;
};

type Action =
  | { type: "create_tile"; tile: Tile }
  | { type: "move_up" }
  | { type: "move_down" }
  | { type: "move_left" }
  | { type: "move_right" }
  | { type: "clean_up" }
  | { type: "update_status"; status: GameStatus }
  | { type: "reset_game" };

function createBoard() {
  const board: string[][] = [];

  for (let i = 0; i < tileCountPerDimension; i++) {
    board[i] = new Array(tileCountPerDimension).fill(null);
  }

  return board;
}

export const initialState: State = {
  board: createBoard(),
  tiles: {},
  tilesById: [],
  hasChanged: false,
  score: 0,
  status: "ongoing",
};

export default function gameReducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case "reset_game": {
      return initialState;
    }

    case "update_status": {
      return {
        ...state,
        status: action.status,
      };
    }

    case "clean_up": {
      const flattenBoard = flattenDeep(state.board);
      const newTiles: TileMap = flattenBoard.reduce((result, tileId: string) => {
        if (isNil(tileId)) {
          return result;
        }

        return {
          ...result,
          [tileId]: state.tiles[tileId],
        };
      }, {});

      return {
        ...state,
        tiles: newTiles,
        tilesById: Object.keys(newTiles),
        hasChanged: false,
      };
    }

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
        tilesById: [...state.tilesById, tileId],
      };
    }

    case "move_up": {
      const newBoard = createBoard();
      const newTiles: TileMap = {};
      let hasChanged = false;
      let { score } = state;

      for (let x = 0; x < tileCountPerDimension; x++) {
        let newY = 0; // top most

        let previousTile: Tile | undefined;

        for (let y = 0; y < tileCountPerDimension; y++) {
          const tileId = state.board[y][x];
          const currentTile = state.tiles[tileId];

          if (!isNil(tileId)) {
            if (previousTile?.value === currentTile.value) {
              // both of these tiles need to be stacked on top of each other

              score += previousTile.value * 2;

              newTiles[previousTile.id as string] = {
                ...previousTile,
                value: previousTile.value * 2,
              };

              newTiles[tileId] = {
                ...currentTile,
                position: [x, newY - 1],
              };

              previousTile = undefined;
              hasChanged = true;
              continue;
            }

            // stacking is not required
            newBoard[newY][x] = tileId;
            newTiles[tileId] = {
              ...currentTile,
              position: [x, newY],
            };
            previousTile = newTiles[tileId];

            if (!isEqual(currentTile.position, [x, newY])) {
              hasChanged = true;
            }

            newY++;
          }
        }
      }

      return {
        ...state,
        board: newBoard,
        tiles: newTiles,
        hasChanged: hasChanged,
        score: score,
      };
    }

    case "move_down": {
      const newBoard = createBoard();
      const newTiles: TileMap = {};
      let hasChanged = false;
      let { score } = state;

      for (let x = 0; x < tileCountPerDimension; x++) {
        let newY = tileCountPerDimension - 1; // bottom most

        let previousTile: Tile | undefined;

        for (let y = tileCountPerDimension - 1; y >= 0; y--) {
          const tileId = state.board[y][x];
          const currentTile = state.tiles[tileId];

          if (!isNil(tileId)) {
            if (previousTile?.value === currentTile.value) {
              // both of these tiles need to be stacked on top of each other

              score += previousTile.value * 2;

              newTiles[previousTile.id as string] = {
                ...previousTile,
                value: previousTile.value * 2,
              };

              newTiles[tileId] = {
                ...currentTile,
                position: [x, newY + 1],
              };

              previousTile = undefined;
              hasChanged = true;
              continue;
            }

            // stacking is not required
            newBoard[newY][x] = tileId;
            newTiles[tileId] = {
              ...currentTile,
              position: [x, newY],
            };
            previousTile = newTiles[tileId];
            if (!isEqual(currentTile.position, [x, newY])) {
              hasChanged = true;
            }
            newY--;
          }
        }
      }

      return {
        ...state,
        board: newBoard,
        tiles: newTiles,
        hasChanged: hasChanged,
        score: score,
      };
    }

    case "move_left": {
      const newBoard = createBoard();
      const newTiles: TileMap = {};
      let hasChanged = false;
      let { score } = state;

      for (let y = 0; y < tileCountPerDimension; y++) {
        let newX = 0; // left most

        let previousTile: Tile | undefined;

        for (let x = 0; x < tileCountPerDimension; x++) {
          const tileId = state.board[y][x];
          const currentTile = state.tiles[tileId];

          if (!isNil(tileId)) {
            if (previousTile?.value === currentTile.value) {
              // both of these tiles need to be stacked on top of each other

              score += previousTile.value * 2;

              newTiles[previousTile.id as string] = {
                ...previousTile,
                value: previousTile.value * 2,
              };

              newTiles[tileId] = {
                ...currentTile,
                position: [newX - 1, y],
              };

              previousTile = undefined;
              hasChanged = true;
              continue;
            }

            // stacking is not required
            newBoard[y][newX] = tileId;
            newTiles[tileId] = {
              ...currentTile,
              position: [newX, y],
            };
            previousTile = newTiles[tileId];
            if (!isEqual(currentTile.position, [newX, y])) {
              hasChanged = true;
            }
            newX++;
          }
        }
      }

      return {
        ...state,
        board: newBoard,
        tiles: newTiles,
        hasChanged: hasChanged,
        score: score,
      };
    }

    case "move_right": {
      const newBoard = createBoard();
      const newTiles: TileMap = {};
      let hasChanged = false;
      let { score } = state;

      for (let y = 0; y < tileCountPerDimension; y++) {
        let newX = tileCountPerDimension - 1; // right most

        let previousTile: Tile | undefined;

        for (let x = tileCountPerDimension - 1; x >= 0; x--) {
          const tileId = state.board[y][x];
          const currentTile = state.tiles[tileId];

          if (!isNil(tileId)) {
            if (previousTile?.value === currentTile.value) {
              // both of these tiles need to be stacked on top of each other

              score += previousTile.value * 2;

              newTiles[previousTile.id as string] = {
                ...previousTile,
                value: previousTile.value * 2,
              };

              newTiles[tileId] = {
                ...currentTile,
                position: [newX + 1, y],
              };

              previousTile = undefined;
              hasChanged = true;
              continue;
            }

            // stacking is not required
            newBoard[y][newX] = tileId;
            newTiles[tileId] = {
              ...currentTile,
              position: [newX, y],
            };
            previousTile = newTiles[tileId];
            if (!isEqual(currentTile.position, [newX, y])) {
              hasChanged = true;
            }
            newX--;
          }
        }
      }

      return {
        ...state,
        board: newBoard,
        tiles: newTiles,
        hasChanged: hasChanged,
        score: score,
      };
    }

    default:
      return state;
  }
}
