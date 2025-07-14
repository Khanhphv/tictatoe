import { useState } from "react";
import type { Player, Score } from "../types/game";

export const useScore = () => {
  const [score, setScore] = useState<Score>({ X: 0, O: 0, draws: 0 });

  const updateScore = (winner: Player | null, isDraw: boolean) => {
    if (winner || isDraw) {
      setScore((prev) => ({
        ...prev,
        ...(winner
          ? { [winner]: prev[winner] + 1 }
          : { draws: prev.draws + 1 }),
      }));
    }
  };

  const resetScore = () => {
    setScore({ X: 0, O: 0, draws: 0 });
  };

  const getTotalGames = () => {
    return score.X + score.O + score.draws;
  };

  return {
    score,
    updateScore,
    resetScore,
    getTotalGames,
  };
};
