import { useState } from "react";

export const useBoardSize = (initialSize: number = 3) => {
  const [boardSize, setBoardSize] = useState(initialSize);

  const changeBoardSize = (newSize: number) => {
    if (newSize >= 3 && newSize <= 10) {
      // Limit to reasonable sizes
      setBoardSize(newSize);
    }
  };

  const getAvailableSizes = () => [3, 4, 5, 6, 7, 8, 9, 10];

  return {
    boardSize,
    changeBoardSize,
    getAvailableSizes,
  };
};
