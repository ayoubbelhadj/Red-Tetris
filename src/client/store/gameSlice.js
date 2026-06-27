import { createSlice } from '@reduxjs/toolkit';
import { COLS, MODES, SCORE } from '../../shared/constants.js';
import {
    addPenalty,
    clearLines,
    collides,
    createBoard,
    getSpectrum,
    merge,
} from '../core/board.js';
import { dropDistance, tryMove, tryRotate } from '../core/engine.js';
import { createPiece } from '../core/pieces.js';
import { leaveRoom } from './socketActions.js';

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

const spawn = (state) => {
    const nextType = state.queue[0];
    if (!nextType)
        return { ...state, piece: null };
    const piece = createPiece(nextType);
    if (collides(state.board, piece)) {
        const board = merge(state.board, piece);
        return {
            ...state,
            status: STATUS.OVER,
            board,
            piece: null,
            spectrum: getSpectrum(board),
            softDrop: false,
            touching: false,
        };
    }
    return {
        ...state,
        piece,
        queue: state.queue.slice(1),
        pieceIndex: state.pieceIndex + 1,
        touching: false,
    };
};

const lock = (state) => {
    const { board, cleared } = clearLines(merge(state.board, state.piece));
    return spawn({
        ...state,
        board,
        piece: null,
        touching: false,
        lockSeq: state.lockSeq + 1,
        lastCleared: cleared,
        score: state.score + (SCORE[cleared] || 0),
        spectrum: getSpectrum(board),
    });
};

const playing = (state) => state.status === STATUS.PLAYING;

const slice = createSlice({
    name: 'game',
    initialState: baseState,
    reducers: {
        roundStarted: (state, action) =>
            spawn({
                ...baseState,
                status: STATUS.PLAYING,
                queue: action.payload.pieces,
                mode: MODES.includes(action.payload.mode)
                    ? action.payload.mode
                    : MODES[0],
                spectrum: new Array(COLS).fill(0),
            }),

        tick: (state) => {
            if (!playing(state))
                return state;
            if (!state.piece)
                return spawn(state);
            const moved = tryMove(state.board, state.piece, 0, 1);
            if (moved)
                return { ...state, piece: moved, touching: false };
            if (!state.touching)
                return { ...state, touching: true };
            return lock(state);
        },

        moveLeft: (state) => {
            if (!playing(state) || !state.piece)
                return state;
            const moved = tryMove(state.board, state.piece, -1, 0);
            return moved ? { ...state, piece: moved } : state;
        },

        moveRight: (state) => {
            if (!playing(state) || !state.piece)
                return state;
            const moved = tryMove(state.board, state.piece, 1, 0);
            return moved ? { ...state, piece: moved } : state;
        },

        rotate: (state) => {
            if (!playing(state) || !state.piece)
                return state;
            const rotated = tryRotate(state.board, state.piece);
            if (!rotated || rotated === state.piece)
                return state;
            return { ...state, piece: rotated };
        },

        setSoftDrop: (state, action) => {
            if (!playing(state))
                return state;
            return { ...state, softDrop: Boolean(action.payload) };
        },

        hardDrop: (state) => {
            if (!playing(state) || !state.piece)
                return state;
            const dist = dropDistance(state.board, state.piece);
            const dropped = { ...state.piece, y: state.piece.y + dist };
            return lock({ ...state, piece: dropped });
        },

        penaltyReceived: (state, action) => {
            if (!playing(state))
                return state;
            const count = Math.min(4, Math.max(0, action.payload.count | 0));
            if (count === 0)
                return state;
            const board = addPenalty(state.board, count);
            const lifted = state.piece
                ? { ...state.piece, y: state.piece.y - count }
                : null;
            if (lifted && collides(board, lifted)) {
                return {
                    ...state,
                    status: STATUS.OVER,
                    board,
                    piece: null,
                    spectrum: getSpectrum(board),
                    softDrop: false,
                    touching: false,
                };
            }
            return { ...state, board, piece: lifted, spectrum: getSpectrum(board) };
        },

        piecesReceived: (state, action) => {
            if (!playing(state)) return state;
            const { from, pieces } = action.payload;
            if (from !== state.pieceIndex + state.queue.length) return state;
            return { ...state, queue: [...state.queue, ...pieces] };
        },

        roundEnded: (state, action) => ({
            ...state,
            status: STATUS.FINISHED,
            winner: action.payload.winner,
            piece: null,
            touching: false,
            softDrop: false,
        }),
    },
    extraReducers: (builder) => {
        builder.addCase(leaveRoom, () => baseState);
    },
});

export const {
    roundStarted,
    tick,
    moveLeft,
    moveRight,
    rotate,
    setSoftDrop,
    hardDrop,
    penaltyReceived,
    piecesReceived,
    roundEnded,
} = slice.actions;

export default slice.reducer;
