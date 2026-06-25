import { TYPE_VALUE } from '../../shared/constants.js';

const v = (type) => TYPE_VALUE[type];

const BASE = {
    I: [
        [0, 0, 0, 0],
        [v('I'), v('I'), v('I'), v('I')],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    O: [
        [v('O'), v('O')],
        [v('O'), v('O')],
    ],
    T: [
        [0, v('T'), 0],
        [v('T'), v('T'), v('T')],
        [0, 0, 0],
    ],
    S: [
        [0, v('S'), v('S')],
        [v('S'), v('S'), 0],
        [0, 0, 0],
    ],
    Z: [
        [v('Z'), v('Z'), 0],
        [0, v('Z'), v('Z')],
        [0, 0, 0],
    ],
    J: [
        [v('J'), 0, 0],
        [v('J'), v('J'), v('J')],
        [0, 0, 0],
    ],
    L: [
        [0, 0, v('L')],
        [v('L'), v('L'), v('L')],
        [0, 0, 0],
    ],
};

// returns the matrix rotated 90deg clockwise
export const rotateMatrix = (m) =>
    m[0].map((_, i) => m.map(row => row[i]).reverse());

// returns array of 4 rotation matrices for a shape
const buildRotations = (shape) => {
    const rotations = [shape];
    for (let i = 1; i < 4; i += 1) {
        rotations.push(rotateMatrix(rotations[i - 1]));
    }
    return rotations;
};

export const ROTATIONS = {};
for (const [type, shape] of Object.entries(BASE))
    ROTATIONS[type] = buildRotations(shape);

// returns the shape matrix for a given type and rotation index
export const getShape = (type, rotation) =>
    ROTATIONS[type][((rotation % 4) + 4) % 4];

// returns array of { x, y, value } for each filled cell on the board
export const getCells = (piece) => {
    const shape = getShape(piece.type, piece.rotation);
    const cells = [];
    for (let dy = 0; dy < shape.length; dy++)
        for (let dx = 0; dx < shape[dy].length; dx++)
            if (shape[dy][dx])
                cells.push({ x: piece.x + dx, y: piece.y + dy, value: shape[dy][dx] });
    return cells;
};

// returns a new piece object { type, x, y, rotation }
export const createPiece = (type) => ({
    type,
    x: type === 'O' ? 4 : 3,
    y: 0,
    rotation: 0,
});
