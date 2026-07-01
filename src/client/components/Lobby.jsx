import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MODES } from '../../shared/constants.js';
import { selectIsHost } from '../store/selectors.js';
import { startGame } from '../store/socketActions.js';

export const Lobby = () => {
    const dispatch = useDispatch();
    const players = useSelector((state) => state.room.players);
    const winner = useSelector((state) => state.game.winner);
    const leaderboard = useSelector((state) => state.room.leaderboard);
    const isHost = useSelector(selectIsHost);
    const myId = useSelector((state) => state.room.myId);
    const [mode, setMode] = useState(MODES[0]);

    return (
        <div className="overlay" data-testid="lobby">
            {winner && (
                <p className="winner-banner" data-testid="winner">
                    🏆 {winner} wins
                </p>
            )}
            <h2>Lobby</h2>
            <ul className="player-list">
                {players.map((p) => (
                    <li key={p.id} className={p.id === myId ? 'me' : ''}>
                        {p.name}
                        {p.host && <span className="host-badge"> ★ host</span>}
                    </li>
                ))}
            </ul>

            {isHost ? (
                <div className="host-controls">
                    <div className="mode-picker" data-testid="mode-picker">
                        {MODES.map((m) => (
                            <button
                                key={m}
                                type="button"
                                className={`mode-btn ${m === mode ? 'active' : ''}`}
                                onClick={() => setMode(m)}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                    <button
                        type="button"
                        className="btn"
                        onClick={() => dispatch(startGame({ mode }))}
                    >
                        {winner !== null || players.length === 0 ? 'Restart' : 'Start game'}
                    </button>
                </div>
            ) : (
                <p className="muted">Waiting for the host to start…</p>
            )}

            {leaderboard.length > 0 && (
                <div className="leaderboard" data-testid="leaderboard">
                    <h3 className="panel-title">Best scores</h3>
                    <ol>
                        {leaderboard.slice(0, 5).map((entry) => (
                            <li key={entry.name}>
                                <span>{entry.name}</span>
                                <span className="lb-score">{entry.score}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            )}
        </div>
    );
};
