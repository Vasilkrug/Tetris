export const playfieldColumns = 10;
export const playfieldRows = 20;
export const tetrominoNames = ['I', 'J', 'L', 'O', 'S', 'Z', 'T'];
export const tetrominoes = {
    "I": [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    "J": [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    'L': [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    'O': [
        [1, 1],
        [1, 1],
    ],
    'S': [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    'Z': [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
    'T': [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
    ]
};

export const getRandomElement = (array) => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

export const convertPositionToIndex = (row, column) => {
    return row * playfieldColumns + column;
}

export const rotateMatrix = (matrix) => {
    const N = matrix.length;
    const rotatedMatrix = [];

    for (let i = 0; i < N; i++) {
        rotatedMatrix[i] = [];
        for (let j = 0; j < N; j++) {
            rotatedMatrix[i][j] = matrix[N - j - 1][i];
        }
    }
    return rotatedMatrix;
};