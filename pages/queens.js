import React from 'react'

const SIZE = 8;

function isSafe(board, row, col) {
  for (let i = 0; i < row; i++) {
    if (
      board[i] === col ||
      board[i] - i === col - row ||
      board[i] + i === col + row
    ) {
      return false;
    }
  }
  return true;
}

function solveNQueens(row, board, solutions) {
  if (row === SIZE) {
    solutions.push([...board]);
    return;
  }
  for (let col = 0; col < SIZE; col++) {
    if (isSafe(board, row, col)) {
      board[row] = col;
      solveNQueens(row + 1, board, solutions);
    }
  }
}

const EightQueensVisualizer = () => {
  const [solutions, setSolutions] = React.useState([]);
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    const sol = [];
    solveNQueens(0, Array(SIZE).fill(-1), sol);
    setSolutions(sol);
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % solutions.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [solutions]);

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">8 Queens Problem - Visualizer</h1>
      <div className="grid grid-cols-8 gap-1">
        {Array.from({ length: SIZE * SIZE }).map((_, i) => {
          const row = Math.floor(i / SIZE);
          const col = i % SIZE;
          const queenCol = solutions[current]?.[row];
          const isQueen = queenCol === col;
          const isDark = (row + col) % 2 === 1;
          return (
            <div
              key={i}
              className={`w-10 h-10 flex items-center justify-center text-xl font-bold ${
                isDark ? 'bg-stone-600' : 'bg-stone-300'
              }`}
            >
              {isQueen ? '♕' : ''}
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-sm text-gray-600">
        Solution {current + 1} of {solutions.length}
      </p>
    </div>
  );
};

export default EightQueensVisualizer;
