import { useState } from "react";

export const useWinLength = (
  initialBoardSize: number = 3,
  initialWinLength?: number
) => {
  const [winLength, setWinLength] = useState(
    initialWinLength || Math.min(4, initialBoardSize)
  );

  const changeWinLength = (newWinLength: number, boardSize: number) => {
    // Win length cannot exceed board size and must be at least 3
    if (newWinLength >= 3 && newWinLength <= boardSize) {
      setWinLength(newWinLength);
    }
  };

  const getAvailableWinLengths = (boardSize: number) => {
    const lengths = [];
    for (let i = 3; i <= boardSize; i++) {
      lengths.push(i);
    }
    return lengths;
  };

  const getDefaultWinLength = (boardSize: number) => {
    // Default to 4 in a row for most board sizes, but adapt for smaller boards
    if (boardSize >= 4) return 4;
    return boardSize; // For 3x3, use 3 in a row
  };

  return {
    winLength,
    changeWinLength,
    getAvailableWinLengths,
    getDefaultWinLength,
  };
};
