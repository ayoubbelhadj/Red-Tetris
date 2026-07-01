import React from 'react';
import { useSelector } from 'react-redux';
import { getShape } from '../core/pieces.js';
import { selectNextTypes } from '../store/selectors.js';

// one piece rendered as a tiny CSS grid
const Mini = ({ type }) => {
    const shape = getShape(type, 0);
    const size = shape.length;
    return (
        <div
            className="mini"
            style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
        >
            {shape.flat().map((value, i) => (
                <div key={i} className={`cell mini-cell c${value}`} />
            ))}
        </div>
    );
};

export const NextQueue = () => {
    const next = useSelector(selectNextTypes);
    return (
        <div className="next-queue" data-testid="next-queue">
            {next.map((type, i) => (
                <Mini key={`${type}-${i}`} type={type} />
            ))}
        </div>
    );
};
