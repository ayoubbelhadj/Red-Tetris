import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './gameSlice.js';
import roomReducer from './roomSlice.js';

export const createStore = (socketFactory) =>
  configureStore({
    reducer: {
      game: gameReducer,
      room: roomReducer,
    },
  });
