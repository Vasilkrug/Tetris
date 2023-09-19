import {Tetris} from "./tetris.js";
import {convertPositionToIndex, playfieldColumns, playfieldRows} from "./utils.js";
import {gameOverAudio, moveAudio, tetrisTheme} from "./audio.js";

const tetris = new Tetris();
const cells = document.querySelectorAll('.tetris-grid>div');
const score = document.querySelector('.score-count');
const gameControlsButtons = document.querySelectorAll('.game-control');
const startGameBtn = document.querySelector('.start-game');
let requestId;
let timeoutId;

const draw = () => {
    cells.forEach(cell => cell.removeAttribute('class'));
    score.innerHTML = tetris.score;
    drawPlayfield();
    drawTetromino();
};

const drawPlayfield = () => {
    for (let i = 0; i < playfieldRows; i++) {
        for (let j = 0; j < playfieldColumns; j++) {
            if (!tetris.playfield[i][j]) continue;
            const name = tetris.playfield[i][j];
            const cellIndex = convertPositionToIndex(i, j);
            cells[cellIndex].classList.add(name);
        }
    }
};

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
};

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
    tetrisTheme.pause();
    gameOverAudio.play().then(r => r.play());
    exitFromGame()
    hideMenuToggle();
};

const moveDown = () => {
    tetris.moveDown();
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
            moveAudio.play().then(r => r.play());
            break;
        case 'ArrowDown':
            moveDown();
            moveAudio.play().then(r => r.play());
            break
        case 'ArrowLeft':
            moveLeft();
            moveAudio.play().then(r => r.play());
            break;
        case 'ArrowRight':
            moveRight();
            moveAudio.play().then(r => r.play())
            break;
        default:
            break;
    }
};


const initKeyDown = () => {
    document.addEventListener('keydown', onKeyDown);
};
const startGame = () => {
    initKeyDown();
    moveDown();
}
const pauseGame = () => {
    tetrisTheme.pause();
    stopLoop();
    document.removeEventListener('keydown', onKeyDown);
}
const exitFromGame = () => {
    tetrisTheme.pause();
    tetris.clearGame();
    pauseGame();
    draw();
}

const hideMenuToggle = () => {
    const menuWrapper = document.querySelector('.game-menu-container');
    const menu = document.querySelector('.game-menu');
    menuWrapper.classList.toggle('hide');
    menu.classList.toggle('hide');
};

startGameBtn.addEventListener('click', () => {
    document.querySelector('[data-game="play"]').classList.add('active');
    tetrisTheme.play().then(r => r.play());
    startGame();
    hideMenuToggle();
});

gameControlsButtons.forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector('.active').classList.remove('active');
        button.classList.add('active');
        const gameStatus = button.dataset.game;
        if (gameStatus === 'play') {
            startGame();
        } else if (gameStatus === 'pause') {
            pauseGame();
        } else {
            button.classList.remove('active')
            exitFromGame();
            hideMenuToggle();
        }
    });
});