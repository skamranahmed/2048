import styles from "@/styles/board.module.css";
import Tile from "./tile";
import { useCallback, useContext, useEffect, useRef } from "react";
import { Tile as TileModel } from "@/models/tile";
import { GameContext } from "@/context/gameContext";
import MobileSwiper, { SwipeInput } from "./mobileSwiper";
import Splash from "./splash";

export default function Board() {
  const { getTiles, moveTiles, startGame, status } = useContext(GameContext);
  const initialized = useRef(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();

      switch (e.code) {
        case "ArrowUp":
          moveTiles("move_up");
          break;
        case "ArrowDown":
          moveTiles("move_down");
          break;
        case "ArrowLeft":
          moveTiles("move_left");
          break;
        case "ArrowRight":
          moveTiles("move_right");
          break;
      }
    },
    [moveTiles],
  );

  const handleSwipe = useCallback(
    ({ deltaX, deltaY }: SwipeInput) => {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          moveTiles("move_right");
        } else {
          moveTiles("move_left");
        }
      } else {
        if (deltaY > 0) {
          moveTiles("move_down");
        } else {
          moveTiles("move_up");
        }
      }
    },
    [moveTiles],
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
      startGame();

      initialized.current = true;
    }
  }, [startGame]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <MobileSwiper onSwipe={handleSwipe}>
      <div className={styles.board}>
        {status === "won" && <Splash heading="You won!" />}
        {status === "lost" && <Splash heading="You lost!" />}
        <div className={styles.tiles}>{renderTiles()}</div>
        <div className={styles.grid}>{renderGrid()}</div>
      </div>
    </MobileSwiper>
  );
}
