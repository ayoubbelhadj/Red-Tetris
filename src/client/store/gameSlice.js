import { createSlice } from '@reduxjs/toolkit';
import { COLS, MODES } from '../../shared/constants.js';
import { createBoard } from '../core/board.js';

export const STATUS = {
    IDLE: 'idle',          // in the lobby, not started
    PLAYING: 'playing',    // round in progress for me
    OVER: 'over',          // I topped out; others may still be playing
    FINISHED: 'finished',  // the round is over for the whole room
};

export const baseState = {
    status: STATUS.IDLE,
    board: createBoard(),
    piece: null,                    // { type, x, y, rotation }
    queue: [],                      // upcoming piece types from the shared sequence
    pieceIndex: 0,                  // how many pieces I've consumed
    touching: false,                // lock-delay flag: set the tick the piece lands
    lockSeq: 0,                     // increments on every lock
    lastCleared: 0,                 // lines cleared by the most recent lock
    spectrum: new Array(COLS).fill(0),
    softDrop: false,
    winner: null,
    score: 0,                       // bonus: scoring
    mode: MODES[0],                 // bonus: classic | invisible | gravity
};


const slice = createSlice({
    name: 'game',
    initialState: baseState,
    reducers: {
    }
});

export default slice.reducer;
