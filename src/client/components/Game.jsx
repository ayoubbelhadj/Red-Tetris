import React from 'react';
import { useSelector } from 'react-redux';
import { useGameLoop } from '../hooks/useGameLoop.js';
import { useKeyboard } from '../hooks/useKeyboard.js';
import { STATUS } from '../store/gameSlice.js';
import { Board } from './Board.jsx';
import { Lobby } from './Lobby.jsx';
import { NextQueue } from './NextQueue.jsx';
import { OpponentList } from './OpponentList.jsx';

export const Game = () => {
    const status = useSelector((state) => state.game.status);
    const started = useSelector((state) => state.room.started);
    const room = useSelector((state) => state.room.room);
    const name = useSelector((state) => state.room.name);
    const score = useSelector((state) => state.game.score);
    const mode = useSelector((state) => state.game.mode);

    const playing = status === STATUS.PLAYING;
    useGameLoop(playing);
    useKeyboard(playing);

    // Lobby covers the board between rounds (idle, or finished + not restarted).
    const showLobby = !started && status !== STATUS.PLAYING;
    const spectating = started && status === STATUS.OVER;

    return (
        <main className="game-layout">
            <header className="topbar">
                <span className="logo small">
                    RED<span className="logo-accent">_</span>TETRIS
                </span>
                <span className="room-tag">
                    {room} / {name}
                </span>
            </header>

            <div className="panels">
                <aside className="panel opponents-panel">
                    <h3 className="panel-title">Opponents</h3>
                    <OpponentList />
                </aside>

                <section className="board-wrap">
                    <Board />
                    {showLobby && <Lobby />}
                    {spectating && (
                        <div className="overlay" data-testid="overlay-over">
                            <h2>Topped out</h2>
                            <p className="muted">Spectating, waiting for the round to end</p>
                        </div>
                    )}
                </section>

                <aside className="panel side-panel">
                    <h3 className="panel-title">Score</h3>
                    <p className="score" data-testid="score">
                        {score}
                    </p>
                    {mode !== 'classic' && <p className="mode-tag">{mode} mode</p>}
                    <h3 className="panel-title">Next</h3>
                    <NextQueue />
                    <div className="controls-help">
                        <h3 className="panel-title">Controls</h3>
                        <p>← → move</p>
                        <p>↑ rotate</p>
                        <p>↓ soft drop</p>
                        <p>space hard drop</p>
                    </div>
                </aside>
            </div>
        </main>
    );
};
