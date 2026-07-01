import React from 'react';

// memoized to avoid repainting all 200 cells every frame
export const Cell = React.memo(({ value }) => (
    <div className={`cell c${value}`} />
));

Cell.displayName = 'Cell';
