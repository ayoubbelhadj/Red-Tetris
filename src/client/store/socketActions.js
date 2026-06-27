import { createAction } from '@reduxjs/toolkit';

export const joinRoom = createAction('socket/joinRoom'); // { room, name }
export const leaveRoom = createAction('socket/leaveRoom');
export const startGame = createAction('socket/startGame');
