import React from 'react';
import { COLS, ROWS } from '../../shared/constants.js';

// opponent field preview: 10 columns whose fill height = stack height
export const Spectrum = ({ spectrum }) => (
    <div className="spectrum" data-testid="spectrum">
        {Array.from({ length: COLS }, (_, x) => (
            <div key={x} className="spectrum-col">
                <div
                    className="spectrum-fill"
                    style={{ height: `${(spectrum[x] / ROWS) * 100}%` }}
                />
            </div>
        ))}
    </div>
);
