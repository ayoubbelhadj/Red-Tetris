import { collides } from './board.js';

// returns moved piece or null if blocked
export const tryMove = (board, piece, dx, dy) => {
    const moved = { ...piece, x: piece.x + dx, y: piece.y + dy };
    return collides(board, moved) ? null : moved;
};

const KICKS = [0, -1, 1, -2, 2];

// returns rotated piece (with wall kick) or null if no valid position
export const tryRotate = (board, piece) => {
    if (piece.type === 'O') return piece;
    const rotation = (piece.rotation + 1) % 4;
    for (const kick of KICKS) {
        const rotated = { ...piece, rotation, x: piece.x + kick };
        if (!collides(board, rotated)) return rotated;
    }
    return null;
};

// returns how many rows the piece can fall
export const dropDistance = (board, piece, distance = 0) => {
    const fallen = { ...piece, y: piece.y + 1 };
    return collides(board, fallen)
        ? distance
        : dropDistance(board, fallen, distance + 1);
};