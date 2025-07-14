import { useState } from "react";
import type { Player, Board, GameState } from "../types/game";
import {
  getInitialBoard,
  checkWinner,
  getDefaultConfig,
} from "../utils/gameUtils";

export const useGameState = (
  initialBoardSize: number = 3,
  initialWinLength?: number
) => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const config = getDefaultConfig(initialBoardSize);
    if (
      initialWinLength &&
      initialWinLength >= 3 &&
      initialWinLength <= initialBoardSize
    ) {
      config.winLength = initialWinLength;
    }
    const initialBoard = getInitialBoard(config.boardSize);
    return {
      board: initialBoard,
      currentPlayer: "X",
      winner: null,
      isDraw: false,
      gameHistory: [initialBoard],
      historyIndex: 0,
      config,
    };
  });

  const updateGameState = (newBoard: Board, newCurrentPlayer: Player) => {
    const winner = checkWinner(newBoard, gameState.config);
    const isDraw = !winner && newBoard.flat().every(Boolean);

    setGameState((prev) => ({
      ...prev,
      board: newBoard,
      currentPlayer: newCurrentPlayer,
      winner,
      isDraw,
      gameHistory: [
        ...prev.gameHistory.slice(0, prev.historyIndex + 1),
        newBoard,
      ],
      historyIndex: prev.historyIndex + 1,
    }));

    return { winner, isDraw };
  };

  const resetGame = (newBoardSize?: number, newWinLength?: number) => {
    const config = newBoardSize
      ? getDefaultConfig(newBoardSize)
      : gameState.config;
    if (newWinLength && newWinLength >= 3 && newWinLength <= config.boardSize) {
      config.winLength = newWinLength;
    }
    const initialBoard = getInitialBoard(config.boardSize);
    setGameState({
      board: initialBoard,
      currentPlayer: "X",
      winner: null,
      isDraw: false,
      gameHistory: [initialBoard],
      historyIndex: 0,
      config,
    });
  };

  const changeBoardSize = (newBoardSize: number) => {
    resetGame(newBoardSize);
  };

  const changeWinLength = (newWinLength: number) => {
    if (newWinLength >= 3 && newWinLength <= gameState.config.boardSize) {
      const newConfig = { ...gameState.config, winLength: newWinLength };
      setGameState((prev) => ({
        ...prev,
        config: newConfig,
      }));
    }
  };

  const undoMove = () => {
    if (gameState.historyIndex > 0) {
      const newHistoryIndex = gameState.historyIndex - 1;
      const previousBoard = gameState.gameHistory[newHistoryIndex];
      const previousPlayer = newHistoryIndex % 2 === 0 ? "X" : "O";

      setGameState((prev) => ({
        ...prev,
        board: previousBoard,
        currentPlayer: previousPlayer,
        winner: null,
        isDraw: false,
        historyIndex: newHistoryIndex,
      }));
    }
  };

  const makeMove = (row: number, col: number) => {
    if (gameState.board[row][col] || gameState.winner || gameState.isDraw)
      return null;

    const newBoard = gameState.board.map((r: Player[], i: number) =>
      r.map((cell: Player, j: number) =>
        i === row && j === col ? gameState.currentPlayer : cell
      )
    );

    const newCurrentPlayer = gameState.currentPlayer === "X" ? "O" : "X";
    return updateGameState(newBoard, newCurrentPlayer);
  };

  return {
    gameState,
    makeMove,
    resetGame,
    undoMove,
    changeBoardSize,
    changeWinLength,
    canUndo: gameState.historyIndex > 0,
  };
};
