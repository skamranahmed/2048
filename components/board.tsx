import styles from "@/styles/board.module.css";
import Tile from "./tile";
import { useCallback, useContext, useEffect, useRef } from "react";
import { Tile as TileModel } from "@/models/tile";
import { GameContext } from "@/context/gameContext";
import MobileSwiper, { SwipeInput } from "./mobileSwiper";

export default function Board() {
  const { getTiles, dispatch } = useContext(GameContext);
  const initialized = useRef(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();

      switch (e.code) {
        case "ArrowUp":
          dispatch({ type: "move_up" });
          break;
        case "ArrowDown":
          dispatch({ type: "move_down" });
          break;
        case "ArrowLeft":
          dispatch({ type: "move_left" });
          break;
        case "ArrowRight":
          dispatch({ type: "move_right" });
          break;
      }
    },
    [dispatch],
  );

  const handleSwipe = useCallback(
    ({ deltaX, deltaY }: SwipeInput) => {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          dispatch({ type: "move_right" });
        } else {
          dispatch({ type: "move_left" });
        }
      } else {
        if (deltaY > 0) {
          dispatch({ type: "move_down" });
        } else {
          dispatch({ type: "move_up" });
        }
      }
    },
    [dispatch],
  );

  const renderGrid = () => {
    const cells: JSX.Element[] = [];
    const totalCellsCount = 16; // 4x4 grid

    for (let index = 0; index < totalCellsCount; index++) {
      cells.push(<div className={styles.cell} key={index}></div>);
    }

    return cells;
  };

  const renderTiles = () => {
    return getTiles().map((tile: TileModel) => {
      return <Tile key={`${tile.id}`} {...tile}></Tile>;
    });
  };

  useEffect(() => {
    if (initialized.current === false) {
      dispatch({
        type: "create_tile",
        tile: {
          position: [0, 1],
          value: 2,
        },
      });

      dispatch({
        type: "create_tile",
        tile: {
          position: [0, 2],
          value: 2,
        },
      });

      initialized.current = true;
    }
  }, [dispatch]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <MobileSwiper onSwipe={handleSwipe}>
      <div className={styles.board}>
        <div className={styles.tiles}>{renderTiles()}</div>
        <div className={styles.grid}>{renderGrid()}</div>
      </div>
    </MobileSwiper>
  );
}
