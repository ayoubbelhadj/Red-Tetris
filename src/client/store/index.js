import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './gameSlice.js';
import roomReducer from './roomSlice.js';
import { createSocketMiddleware } from './socketMiddleware.js';

export const createStore = (socketFactory) =>
    configureStore({
        reducer: {
            game: gameReducer,
            room: roomReducer,
        },
        middleware: (getDefault) =>
            getDefault().concat(createSocketMiddleware(socketFactory)),
    });
