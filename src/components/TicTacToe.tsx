import React from "react";
import Button from "./atoms/Button";
import { useGameState } from "../hooks/useGameState";
import { useScore } from "../hooks/useScore";
import { useAI } from "../hooks/useAI";
import { useGameMode } from "../hooks/useGameMode";
import { useBoardSize } from "../hooks/useBoardSize";
import { useWinLength } from "../hooks/useWinLength";

interface TicTacToeProps {
  initialBoardSize?: number;
  initialWinLength?: number;
  showConfigControls?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onWinner?: () => void;
}

const TicTacToe: React.FC<TicTacToeProps> = ({
  initialBoardSize = 10,
  initialWinLength = 4,
  showConfigControls = true,
  className = "",
  style = {},
  onWinner = () => {},
}) => {
  const { boardSize } = useBoardSize(initialBoardSize);
  const { winLength } = useWinLength(initialBoardSize, initialWinLength);
  const { gameMode } = useGameMode();
  const { gameState, makeMove, resetGame } = useGameState(boardSize, winLength);
  const { updateScore, getTotalGames } = useScore();

  // Handle AI moves
  const handleAIMove = (row: number, col: number) => {
    const result = makeMove(row, col);
    if (result) {
      updateScore(result.winner, result.isDraw);
    }
  };

  useAI(
    gameMode,
    gameState.currentPlayer,
    gameState.board,
    gameState.winner,
    gameState.isDraw,
    gameState.config,
    handleAIMove
  );

  const handleClick = (row: number, col: number) => {
    const result = makeMove(row, col);
    if (result) {
      updateScore(result.winner, result.isDraw);
    }
  };

  const handleReset = () => {
    resetGame();
  };

  const getGameStatus = () => {
    if (gameState.winner) {
      if (gameState.winner === "X") {
        onWinner?.();
      }
      return `Winner: ${gameState.winner}`;
    }
    if (gameState.isDraw) return "It's a draw!";
    return `Current player: ${gameState.currentPlayer}`;
  };

  const getCellSize = () => {
    // Responsive cell sizing based on board size and screen width
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;

    if (isSmallMobile) {
      if (boardSize <= 4) return 60;
      if (boardSize <= 6) return 45;
      if (boardSize <= 8) return 35;
      return 28;
    }

    if (isMobile) {
      if (boardSize <= 4) return 70;
      if (boardSize <= 6) return 55;
      if (boardSize <= 8) return 45;
      return 35;
    }

    // Desktop
    if (boardSize <= 4) return 80;
    if (boardSize <= 6) return 60;
    if (boardSize <= 8) return 50;
    return 40;
  };

  const cellSize = getCellSize();
  const fontSize = Math.max(1.2, 2.5 - (boardSize - 3) * 0.2);

  return (
    <div
      className={`tic-tac-toe-container ${className}`}
      style={{
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        maxWidth: "100vw",
        width: "100%",
        margin: "0 auto",
        padding: "1rem",
        boxSizing: "border-box",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        ...style,
      }}
    >
      <h1
        style={{
          color: "#333",
          marginBottom: "1rem",
          fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
          fontWeight: "bold",
          lineHeight: 1.2,
        }}
      >
        Tic Tac Toe
      </h1>

      {/* Game Configuration - Only show if showConfigControls is true */}
      {showConfigControls && (
        <div style={{ marginBottom: "1rem" }}>
          {/* Win Condition Highlight */}
          <div
            style={{
              background: "#e7f3ff",
              padding: "clamp(0.5rem, 2vw, 0.75rem)",
              borderRadius: "0.5rem",
              border: "2px solid #007bff",
              marginTop: "0.5rem",
              fontSize: "clamp(0.8rem, 2.5vw, 1rem)",
            }}
          >
            <strong style={{ color: "#007bff" }}>
              🎯 Win Condition: {winLength} in a row
            </strong>
            <div
              style={{
                fontSize: "clamp(0.7rem, 2vw, 0.9rem)",
                color: "#666",
                marginTop: "0.25rem",
              }}
            >
              {winLength === 3
                ? "Classic Tic-Tac-Toe"
                : winLength === 4
                  ? "Connect Four Style"
                  : `${winLength}-in-a-Row Challenge`}
            </div>
          </div>
        </div>
      )}

      {/* Game Status */}
      <div
        style={{
          marginBottom: "1rem",
          padding: "clamp(0.4rem, 2vw, 0.5rem)",
          background: gameState.winner
            ? "#d4edda"
            : gameState.isDraw
              ? "#fff3cd"
              : "#7f8eab",
          borderRadius: "0.5rem",
          fontWeight: "bold",
          fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
        }}
      >
        {getGameStatus()}
      </div>

      {/* Game Board */}
      <div
        style={{
          display: "inline-block",
          background: "#fff",
          padding: "clamp(0.5rem, 2vw, 1rem)",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          overflow: "auto",
          maxWidth: "100%",
          maxHeight: "70vh",
          margin: "0 auto",
        }}
      >
        {gameState.board.map((row, i) => (
          <div key={i} style={{ display: "flex" }}>
            {row.map((cell, j) => (
              <Button
                key={j}
                style={{
                  width: cellSize,
                  height: cellSize,
                  margin: 1,
                  fontSize: `${fontSize}rem`,
                  fontWeight: "bold",
                  border: "2px solid #dee2e6",
                  background: cell ? "#e9ecef" : "#fff",
                  color: cell === "X" ? "#dc3545" : "#28a745",
                  minWidth: cellSize,
                  minHeight: cellSize,
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  touchAction: "manipulation",
                }}
                onClick={() => handleClick(i, j)}
                disabled={!!cell || !!gameState.winner || !!gameState.isDraw}
              >
                {cell}
              </Button>
            ))}
          </div>
        ))}
      </div>

      {/* Game Controls */}
      <div style={{ marginTop: "1rem" }}>
        <Button
          onClick={handleReset}
          style={{
            background: "#dc3545",
            color: "#fff",
            fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
            padding: "clamp(0.6rem, 2vw, 0.8rem) clamp(1rem, 3vw, 1.5rem)",
            minHeight: "44px",
          }}
        >
          New Game
        </Button>
      </div>

      {/* Game Info */}
      <div
        style={{
          marginTop: "1rem",
          padding: "clamp(0.5rem, 2vw, 1rem)",
          background: "#f8f9fa",
          borderRadius: "0.5rem",
          fontSize: "clamp(0.7rem, 2vw, 0.9rem)",
          color: "#6c757d",
        }}
      >
        {gameMode === "ai" && (
          <div>
            <strong>AI Mode:</strong> You play as X, AI plays as O
          </div>
        )}
        <div style={{ marginTop: "0.5rem" }}>
          <strong>Board:</strong> {boardSize}x{boardSize} |{" "}
          <strong>Win Condition:</strong> {gameState.config.winLength} in a row
        </div>
        <div style={{ marginTop: "0.5rem" }}>
          <strong>Total Games:</strong> {getTotalGames()}
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;
