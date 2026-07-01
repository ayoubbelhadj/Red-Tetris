import React from 'react';
import { useSelector } from 'react-redux';
import { selectOpponents } from '../store/selectors.js';
import { STATUS } from '../store/gameSlice.js';
import { Spectrum } from './Spectrum.jsx';

export const OpponentList = () => {
    const opponents = useSelector(selectOpponents);
    const winner = useSelector((state) => state.game.winner);
    const started = useSelector((state) => state.game.status !== STATUS.IDLE);

    if (opponents.length === 0) {
        return <p className="muted">Nobody else joined. Do your best.</p>;
    }

    return (
        <ul className="opponent-list">
            {opponents.map((p) => (
                <li
                    key={p.id}
                    className={`opponent ${started && !p.alive && winner === p.name
                        ? 'win'
                        : started && !p.alive && winner !== p.name
                            ? 'dead'
                            : ''
                        }`}
                >
                    <span className="opponent-name">
                        {p.name}
                        {started && !p.alive && winner !== p.name && (
                            <span className="ko"> KO</span>
                        )}
                        {started && !p.alive && winner === p.name && (
                            <span className="ok"> WIN</span>
                        )}
                    </span>
                    <Spectrum spectrum={p.spectrum} />
                </li>
            ))}
        </ul>
    );
};
