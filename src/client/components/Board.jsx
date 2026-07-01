import React from 'react';
import { useSelector } from 'react-redux';
import { selectDisplayCells } from '../store/selectors.js';
import { Cell } from './Cell.jsx';

// 10x20 grid of divs, styled via CSS grid
export const Board = () => {
    const cells = useSelector(selectDisplayCells);
    return (
        <div className="board" data-testid="board">
            {cells.map((value, i) => (
                <Cell key={i} value={value} />
            ))}
        </div>
    );
};
