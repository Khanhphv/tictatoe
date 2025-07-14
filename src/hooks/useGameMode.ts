import { useState } from "react";
import type { GameMode } from "../types/game";

export const useGameMode = () => {
  const [gameMode, setGameMode] = useState<GameMode>("ai");

  const changeGameMode = (mode: GameMode) => {
    setGameMode(mode);
  };

  return {
    gameMode,
    changeGameMode,
  };
};
