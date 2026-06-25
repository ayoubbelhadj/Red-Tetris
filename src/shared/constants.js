// shared between client and server

export const COLS = 10;
export const ROWS = 20;

// cell values
export const CELL = {
  EMPTY: 0,
  // 1..7 = tetromino types (see TYPE_VALUE)
  PENALTY: 8,
  GHOST: 9,
};

export const TYPES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

export const TYPE_VALUE = {
  I: 1,
  O: 2,
  T: 3,
  S: 4,
  Z: 5,
  J: 6,
  L: 7,
};

// timing (ms)
export const GRAVITY_MS = 800;
export const SOFT_DROP_MS = 50;
export const FAST_GRAVITY_MS = 200;

// scoring
export const SCORE = { 1: 40, 2: 100, 3: 300, 4: 1200 };

// game modes
export const MODES = ['classic', 'invisible', 'gravity'];

// piece batching
export const BATCH_SIZE = 30;
export const REFILL_THRESHOLD = 10;

// Single source of truth for every socket event name.
export const EVENTS = {
  // client -> server
  ROOM_JOIN: 'room:join',
  ROOM_LEAVE: 'room:leave',
  GAME_START: 'game:start',
  PIECES_REQUEST: 'pieces:request',
  PLAYER_LINES: 'player:lines',
  PLAYER_SPECTRUM: 'player:spectrum',
  PLAYER_OVER: 'player:gameover',
  PLAYER_SCORE: 'player:score',
  // server -> client
  ROOM_STATE: 'room:state',
  LEADERBOARD: 'scores:leaderboard',
  GAME_STARTED: 'game:started',
  GAME_PIECES: 'game:pieces',
  GAME_PENALTY: 'game:penalty',
  GAME_SPECTRUM: 'game:spectrum',
  GAME_ENDED: 'game:ended',
};
