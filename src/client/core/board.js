import { CELL, COLS, ROWS } from '../../shared/constants.js';
import { getCells } from './pieces.js';

// returns an empty ROWS x COLS board
export const createBoard = () =>
    Array.from({ length: ROWS }, () => new Array(COLS).fill(CELL.EMPTY));

// returns true if the piece hits walls, floor or existing cells
export const collides = (board, piece) => {
    const cells = getCells(piece);
    for (const cell of cells) {
        const { x, y } = cell;
        if (x < 0 || x >= COLS || y >= ROWS)
            return true;
        if (y < 0)
            continue;
        if (board[y][x] !== CELL.EMPTY)
            return true;
    }
    return false;
};

// returns a new board with the piece cells written into it
export const merge = (board, piece) => {
    const newBoard = [];
    for (const row of board) newBoard.push([...row]);
    for (const cell of getCells(piece)) {
        if (cell.y >= 0) newBoard[cell.y][cell.x] = cell.value;
    }
    return newBoard;
};

// returns { board, cleared } after removing full lines
export const clearLines = (board) => {
    const kept = [];
    for (const row of board) {
        let isFull = true;
        let hasPenalty = false;
        for (const cell of row) {
            if (cell === CELL.EMPTY) isFull = false;
            if (cell === CELL.PENALTY) hasPenalty = true;
        }
        if (!isFull || hasPenalty)
            kept.push(row);
    }
    const cleared = ROWS - kept.length;
    const newBoard = [];
    for (let i = 0; i < cleared; i++)
        newBoard.push(new Array(COLS).fill(CELL.EMPTY));
    for (const row of kept)
        newBoard.push(row);
    return { board: newBoard, cleared };
};

// returns board with penalty lines pushed from the bottom
export const addPenalty = (board, count) => {
    if (count <= 0) return board;
    const newBoard = [];
    for (let y = count; y < ROWS; y++)
        newBoard.push(board[y]);
    for (let i = 0; i < count; i++)
        newBoard.push(new Array(COLS).fill(CELL.PENALTY));
    return newBoard;
};

// returns array of column heights (stack size per column)
export const getSpectrum = (board) => {
    const heights = [];
    for (let x = 0; x < COLS; x++) {
        let height = 0;
        for (let y = 0; y < ROWS; y++) {
            if (board[y][x] !== CELL.EMPTY) {
                height = ROWS - y; break;
            }
        }
        heights.push(height);
    }
    return heights;
};
