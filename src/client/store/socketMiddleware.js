import { io } from 'socket.io-client';
import { EVENTS, REFILL_THRESHOLD } from '../../shared/constants.js';
import {
    penaltyReceived,
    piecesReceived,
    roundEnded,
    roundStarted,
    STATUS,
} from './gameSlice.js';
import {
    connectionLost,
    joined,
    joinFailed,
    leaderboardUpdated,
    roomState,
    spectrumUpdated,
} from './roomSlice.js';
import { joinRoom, leaveRoom, startGame } from './socketActions.js';

const defaultFactory = () =>
    io({ transports: ['websocket', 'polling'] });

export const createSocketMiddleware = (socketFactory = defaultFactory) => {
    let socket = null;
    let lastRequestFrom = -1;

    return (store) => {
        const bindListeners = () => {
            socket.on(EVENTS.ROOM_STATE, (payload) => store.dispatch(roomState(payload)));
            socket.on(EVENTS.GAME_STARTED, (payload) => {
                lastRequestFrom = -1;
                store.dispatch(roundStarted(payload));
            });
            socket.on(EVENTS.GAME_PIECES, (payload) => store.dispatch(piecesReceived(payload)));
            socket.on(EVENTS.GAME_PENALTY, (payload) => store.dispatch(penaltyReceived(payload)));
            socket.on(EVENTS.GAME_SPECTRUM, (payload) => store.dispatch(spectrumUpdated(payload)));
            socket.on(EVENTS.GAME_ENDED, (payload) => store.dispatch(roundEnded(payload)));
            socket.on(EVENTS.LEADERBOARD, (payload) => store.dispatch(leaderboardUpdated(payload)));
            socket.on('disconnect', () => {
                if (store.getState().room.joined) store.dispatch(connectionLost());
            });
            socket.on('connect_error', () => {
                if (!store.getState().room.joined) {
                    store.dispatch(joinFailed({ error: 'Could not reach the server' }));
                }
            });
        };

        const teardown = () => {
            if (!socket) return;
            socket.removeAllListeners();
            socket.disconnect();
            socket = null;
        };

        return (next) => (action) => {
            if (joinRoom.match(action)) {
                const result = next(action);
                teardown();
                socket = socketFactory();
                bindListeners();
                socket.emit(EVENTS.ROOM_JOIN, action.payload, (reply) => {
                    if (reply && reply.ok) store.dispatch(joined(reply));
                    else store.dispatch(joinFailed(reply || { error: 'Join failed' }));
                });
                return result;
            }

            if (leaveRoom.match(action)) {
                if (socket) socket.emit(EVENTS.ROOM_LEAVE);
                teardown();
                return next(action);
            }

            if (startGame.match(action)) {
                if (socket) socket.emit(EVENTS.GAME_START, action.payload);
                return next(action);
            }

            // Let the reducers compute the new state, then diff it.
            const prev = store.getState().game;
            const result = next(action);
            const cur = store.getState().game;
            if (!socket || prev === cur) return result;

            // My stack changed shape -> opponents need my new spectrum.
            if (cur.spectrum !== prev.spectrum) {
                socket.emit(EVENTS.PLAYER_SPECTRUM, { spectrum: cur.spectrum });
            }

            // A lock that cleared n lines -> the server turns it into n-1 penalties.
            if (cur.lockSeq !== prev.lockSeq && cur.lastCleared > 0) {
                socket.emit(EVENTS.PLAYER_LINES, { count: cur.lastCleared });
            }

            // My score changed -> the server tracks it for the leaderboard.
            if (cur.score !== prev.score) {
                socket.emit(EVENTS.PLAYER_SCORE, { score: cur.score });
            }

            // I just topped out.
            if (prev.status === STATUS.PLAYING && cur.status === STATUS.OVER) {
                socket.emit(EVENTS.PLAYER_OVER);
            }

            // Queue running low -> ask for the next batch (once per cursor).
            if (cur.status === STATUS.PLAYING && cur.queue.length < REFILL_THRESHOLD) {
                const from = cur.pieceIndex + cur.queue.length;
                if (from !== lastRequestFrom) {
                    lastRequestFrom = from;
                    socket.emit(EVENTS.PIECES_REQUEST, { from });
                }
            }

            return result;
        };
    };
};
