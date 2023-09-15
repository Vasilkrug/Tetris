import {Tetris} from "./tetris.js";
import {convertPositionToIndex, playfieldColumns, playfieldRows} from "./utils.js";

const tetris = new Tetris();
const cells = document.querySelectorAll('.tetris-grid>div');
const score = document.querySelector('.score-count');
let requestId;
let timeoutId;
const draw = () => {
    cells.forEach(cell => cell.removeAttribute('class'));
    score.innerHTML = tetris.score;
    drawPlayfield()
    drawTetromino()
}

const drawPlayfield = () => {
    for (let i = 0; i < playfieldRows; i++) {
        for (let j = 0; j < playfieldColumns; j++) {
            if (!tetris.playfield[i][j]) continue;
            const name = tetris.playfield[i][j];
            const cellIndex = convertPositionToIndex(i, j);
            cells[cellIndex].classList.add(name);
        }
    }
}
const drawTetromino = () => {
    const name = tetris.tetromino.name;
    const tetrominoMatrixSize = tetris.tetromino.matrix.length;
    for (let row = 0; row < tetrominoMatrixSize; row++) {
        for (let column = 0; column < tetrominoMatrixSize; column++) {
            if (!tetris.tetromino.matrix[row][column]) continue;
            if (tetris.tetromino.row + row < 0) continue;
            const cellIndex = convertPositionToIndex(tetris.tetromino.row + row, tetris.tetromino.column + column);
            cells[cellIndex].classList.add(name);
        }
    }
}

const startLoop = () => {
    timeoutId = setTimeout(() => requestId = requestAnimationFrame(moveDown), 700);
};

const stopLoop = () => {
    cancelAnimationFrame(requestId);
    clearTimeout(timeoutId);
};

const gameOver = () => {
    stopLoop();
    document.removeEventListener('keydown', onKeyDown);
};

const moveDown = () => {
    tetris.moveDown()
    draw();
    stopLoop();
    startLoop();

    if (tetris.isGameOver) {
        gameOver();
    }
};

const moveRight = () => {
    tetris.moveRight();
    draw();
};

const moveLeft = () => {
    tetris.moveLeft();
    draw();
};

const rotate = () => {
    tetris.rotateTetromino();
    draw();
};

const onKeyDown = (event) => {
    switch (event.key) {
        case 'ArrowUp':
            rotate();
            break;
        case 'ArrowDown':
            moveDown();
            break
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'ArrowRight':
            moveRight();
            break;
        default:
            break;
    }
};

const initKeyDown = () => {
    document.addEventListener('keydown', onKeyDown);
};

initKeyDown();
moveDown();