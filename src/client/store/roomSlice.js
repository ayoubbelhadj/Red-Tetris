import { createSlice } from '@reduxjs/toolkit';
import { joinRoom, leaveRoom } from './socketActions.js';

const initialState = {
    joined: false,
    connecting: false,
    room: null,
    name: null,
    myId: null,
    started: false,
    winner: null,
    players: [], // [{ id, name, host, alive, spectrum, score }]
    leaderboard: [], // [{ name, score }] persisted best scores
    error: null,
};

const slice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        joined: (state, action) => ({
            ...state,
            joined: true,
            connecting: false,
            myId: action.payload.id,
            error: null,
        }),

        joinFailed: (state, action) => ({
            ...state,
            joined: false,
            connecting: false,
            error: action.payload.error,
        }),

        // Authoritative room snapshot from the server.
        roomState: (state, action) => ({
            ...state,
            started: action.payload.started,
            winner: action.payload.winner,
            players: action.payload.players,
        }),

        // Lightweight per-player spectrum push (between full snapshots).
        spectrumUpdated: (state, action) => ({
            ...state,
            players: state.players.map((p) =>
                p.id === action.payload.id
                    ? { ...p, spectrum: action.payload.spectrum }
                    : p,
            ),
        }),

        leaderboardUpdated: (state, action) => ({
            ...state,
            leaderboard: action.payload,
        }),

        connectionLost: (state) => ({
            ...state,
            joined: false,
            connecting: false,
            error: 'Connection to the server was lost',
        }),
    },
    extraReducers: (builder) => {
        builder
            .addCase(joinRoom, (state, action) => ({
                ...initialState,
                connecting: true,
                room: action.payload.room,
                name: action.payload.name,
            }))
            .addCase(leaveRoom, () => initialState);
    },
});

export const {
    joined,
    joinFailed,
    roomState,
    spectrumUpdated,
    leaderboardUpdated,
    connectionLost,
} = slice.actions;

export default slice.reducer;
