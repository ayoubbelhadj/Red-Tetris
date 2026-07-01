import { createSelector } from '@reduxjs/toolkit';
import { CELL } from '../../shared/constants.js';
import { dropDistance } from '../core/engine.js';
import { getCells } from '../core/pieces.js';

// board + ghost + piece, flattened to 200 cells
// invisible mode just hides them visually, data stays untouched
export const selectDisplayCells = createSelector(
    [
        (state) => state.game.board,
        (state) => state.game.piece,
        (state) => state.game.mode,
        (state) => state.game.status,
    ],
    (board, piece, mode, status) => {
        const hidden = mode === 'invisible' && status === 'playing';
        const grid = board.map((row) =>
            hidden ? row.map(() => CELL.EMPTY) : row.slice(),
        );
        if (!piece) 
            return grid.flat();

        const ghost = { ...piece, y: piece.y + dropDistance(board, piece) };
        for (const { x, y } of getCells(ghost)) {
            if (y >= 0 && grid[y][x] === CELL.EMPTY) 
                grid[y][x] = CELL.GHOST;
        }
        for (const { x, y, value } of getCells(piece)) {
            if (y >= 0) 
                grid[y][x] = value;
        }
        return grid.flat();
    },
);

// other players in the room, excluding me
export const selectOpponents = createSelector(
    [(state) => state.room.players, (state) => state.room.myId],
    (players, myId) => players.filter((p) => p.id !== myId),
);

// whether the current player is the room host
export const selectIsHost = (state) => {
    const me = state.room.players.find((p) => p.id === state.room.myId);
    return Boolean(me && me.host);
};

// next 3 piece types from the queue, for the preview panel
export const selectNextTypes = createSelector(
    [(state) => state.game.queue],
    (queue) => queue.slice(0, 3),
);
