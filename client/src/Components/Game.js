import React, { useState, useEffect, useCallback } from 'react';
import { FaBomb } from "react-icons/fa";
import { FaFaceAngry } from "react-icons/fa6";
import { BiSolidFlagAlt } from "react-icons/bi";
import { GiMineExplosion } from "react-icons/gi";
import ScoreCard from './ScoreCard';
import UserCard from './UserCard';

// Cell Component
function Cell({ value, isVisible, isGameOver, isFlagged, onClick, onRightClick, isRevealed }) {
  let className = '';
  let displayValue = '';
  if (isVisible || (isGameOver && value === 'mine')) {
    if (value === 'mine') {
      className = isGameOver ? 'mine game-over' : 'mine';
      displayValue = <FaBomb />;
      if (isFlagged && isRevealed) {
        displayValue = <div style={{ position: 'relative' }}>
          <FaBomb />
        </div>
      } else if (isGameOver && !isFlagged) {
        displayValue = <GiMineExplosion />;
      } else {
        displayValue = <FaBomb />;
      }
    } else if (typeof value === 'number') {
      className = `number-${value}`;
      displayValue = value > 0 ? value : '';
    }
  } else {
    className = isFlagged ? 'flagged' : 'hidden';
    displayValue = isFlagged ? <BiSolidFlagAlt style={{ color: 'red' }}/> : '';
  }

  return (
    <button className={className} onClick={onClick} onContextMenu={onRightClick}>
      {displayValue}
    </button>
  );
}

// Board Component
function Board({ boardSize, numberOfMines, onCellClick, onGameOver, onScore, onMineClick, setIsActive, gameOver, setGameOver }) {
  const [flags, setFlags] = useState(new Array(boardSize).fill().map(() => new Array(boardSize).fill(false)));
  const [board, setBoard] = useState(createBoard(boardSize, numberOfMines));
  const [visibility, setVisibility] = useState(
    new Array(boardSize).fill().map(() => new Array(boardSize).fill(false))
  );
  const [revealed, setRevealed] = useState(false);

  const resetBoard = useCallback(() => {
    setBoard(createBoard(boardSize, numberOfMines));
    setVisibility(new Array(boardSize).fill().map(() => new Array(boardSize).fill(false)));
    setGameOver(false);
    setFlags(new Array(boardSize).fill().map(() => new Array(boardSize).fill(false)));
    setRevealed(false);
  }, [boardSize, numberOfMines, setGameOver]);

  // Add right click event listener
  function handleRightClick(e, x, y) {
    e.preventDefault();
    if (!visibility[x][y]) {
      let newFlags = [...flags];
      newFlags[x][y] = !newFlags[x][y];
      setFlags(newFlags);
    }
  }

  useEffect(() => {
    resetBoard();
  }, [resetBoard]);

  function reveal(x, y) {
    if (gameOver) {
      return;
    }

    let newVisibility = [...visibility];
    newVisibility[x][y] = true;
    setVisibility(newVisibility);

    if (board[x][y] === 'mine') {
      setGameOver(true);
      setRevealed(true);
      onGameOver();
      onMineClick();
      setIsActive(false);
      return;
    }

    // If the cell is empty, reveal all connected cells
    if (board[x][y] === 0) {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          let nx = x + dx;
          let ny = y + dy;
          if (
            nx >= 0 &&
            ny >= 0 &&
            nx < boardSize &&
            ny < boardSize &&
            !newVisibility[nx][ny]
          ) {
            reveal(nx, ny);
          }
        }
      }
    }
  }

  function handleClick(x, y) {
    if (!visibility[x][y] && !flags[x][y]) {
      reveal(x, y);
      onCellClick();

      if (board[x][y] !== 'mine') {
        onScore();
      }
    }
  }

  return (
    <div className="Board-Background">
    <div className="Board">
      {board.flatMap((row, x) =>
        row.map((value, y) => (
          <Cell
            key={`${x}-${y}`}
            value={value}
            isVisible={visibility[x][y]}
            isGameOver={gameOver}
            isFlagged={flags[x][y]}
            isRevealed={revealed}
            onClick={() => handleClick(x, y)}
            onRightClick={(e) => handleRightClick(e, x, y)}
          />
        ))
      )}
    </div>
    </div>
  );
}

// Game Component
function Game() {
  const boardSize = 10;
  const numberOfMines = 10;

  const [key, setKey] = useState(Math.random());
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const username = 'Player 1';

  const resetGame = () => {
    setKey(Math.random());
    setTimer(0);
    setIsActive(false);
    setScore(0);
  }

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 1000);
    } else if (!isActive && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const handleCellClick = (cellValue) => {
    if (cellValue !== 'mine' && !isActive && !gameOver) {
      setIsActive(true);
    }
  }

  const handleGameOver = () => {
    setIsActive(false);
  }

  const handleScore = () => {
    if (!gameOver) {
    setScore(score + 1);
  }
}

  return (
    <>
      <UserCard username={username} score={score} />
      <div>
        <div className="GameSet">
          <div className="sadface-wrapper">
            <button className="sadface" onClick={resetGame}><FaFaceAngry /></button>
          </div>
          <div className="score">{score}</div>
          <div className="timer">{timer}</div>
        </div>
        <Board key={key} boardSize={boardSize} numberOfMines={numberOfMines} onCellClick={handleCellClick} onGameOver={handleGameOver} onScore={handleScore} onMineClick={handleGameOver} setIsActive={setIsActive} gameOver={gameOver} setGameOver={setGameOver} />
      </div>
      <div className="score-card-container">
        <ScoreCard username={username} score={score} time={timer} />
      </div>
    </>
  );
}

// Function to calculate the number of mines around a cell
function calculateMines(board, x, y) {
  let mines = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      let nx = x + dx;
      let ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < board.length && ny < board[0].length && board[nx][ny] === 'mine') {
        mines++;
      }
    }
  }
  return mines;
}

// Function to create the game board
function createBoard(boardSize, numberOfMines) {
  let board = new Array(boardSize).fill(0).map(() => new Array(boardSize).fill(0));

  for(let i = 0; i < numberOfMines; i++) {
    let x = Math.floor(Math.random() * boardSize);
    let y = Math.floor(Math.random() * boardSize);
    if(board[x][y] === 'mine') {
      i--;
    } else {
      board[x][y] = 'mine';
    }
  }

  // Calculate the number of mines around each cell
  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
      if (board[x][y] !== 'mine') {
        board[x][y] = calculateMines(board, x, y);
      }
    }
  }

  return board;
}

export default Game;