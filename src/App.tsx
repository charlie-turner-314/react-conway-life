import React, { useCallback, useEffect, useRef, useState } from "react";
import produce from "immer";
import "./App.css";
import Cell from "./components/Cell";

const rows = 40;
const cols = 100;
const cellWidth = 20;

const locations = [
  [0, 1],
  [0, -1],
  [1, 0],
  [1, 1],
  [1, -1],
  [-1, 0],
  [-1, 1],
  [-1, -1],
];
const newGrid = (p: number) => {
  let grid = [];
  for (let i = 0; i < rows; i++) {
    grid.push(
      Array.from(Array(cols), () => {
        return Math.random() < p ? 1 : 0;
      })
    );
  }
  return grid;
};

const nextGen = (grid: (1 | 0)[][]) => {
  const newGrid = produce(grid, (gridCopy: (1 | 0)[][]) => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let neighbors = 0;
        locations.forEach(([xinc, yinc]) => {
          let nx = j + xinc;
          let ny = i + yinc;

          // wraparound
          if (nx < 0) nx = cols - 1;
          if (nx >= cols) nx = 0;
          if (ny < 0) ny = rows - 1;
          if (ny >= rows) ny = 0;

          // check if occupied
          if (grid[ny][nx] === 1) neighbors++;
        });
        if (neighbors < 2 || neighbors > 3) {
          gridCopy[i][j] = 0;
        } else if (grid[i][j] === 0 && neighbors === 3) {
          gridCopy[i][j] = 1;
        }
      }
    }
  });
  return newGrid;
};

function App() {
  const [grid, setGrid] = useState(() => newGrid(0.5));
  const [running, setRunning] = useState(false);
  const runningRef = useRef(false);

  useEffect(() => {
    const animate = () => {
      if (runningRef.current) {
        setGrid(nextGen(grid));
      }
    };
    setTimeout(animate, 50);
  }, [grid, running]);

  const handleClick = (r: number, c: number) => {
    runningRef.current = false;
    setRunning(false);
    let newGrid = produce(grid, (newGrid) => {
      newGrid[r][c] = 1;
    });
    setGrid(newGrid);
  };

  return (
    <>
      <button
        onClick={() => {
          runningRef.current = false;
          setRunning(false);
          setGrid(newGrid(0.5));
        }}
      >
        New Random Grid
      </button>
      <button
        onClick={() => {
          runningRef.current = false;
          setRunning(false);
          setGrid(newGrid(0));
        }}
      >
        New Empty Grid
      </button>
      <button
        onClick={() => {
          runningRef.current = !runningRef.current;
          setRunning(!running);
        }}
      >
        {runningRef.current ? "stop" : "start"}
      </button>

      <div className="gridDisplay">
        {grid.map((row, rid) => {
          return (
            <div key={`row-${rid}`} className="row">
              {row.map((cell, cid) => {
                return (
                  <Cell
                    key={`${rid}-${cid}`}
                    value={cell}
                    size={cellWidth}
                    onClick={() => handleClick(rid, cid)}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
