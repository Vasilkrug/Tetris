import {getRandomElement, playfieldColumns, playfieldRows, rotateMatrix, tetrominoes, tetrominoNames} from "./utils.js";
import {removeRowAudio} from "./audio.js";

export class Tetris {
    constructor() {
        this.playfield = null;
        this.tetromino = null;
        this.isGameOver = false;
        this.score = 0;
        this.init();
    }

    init() {
        this.generatePlayfield();
        this.generateTetromino();
    };

    generatePlayfield() {
        this.playfield = new Array(playfieldRows).fill()
            .map(() => new Array(playfieldColumns).fill(0));
    };

    generateTetromino() {
        const name = getRandomElement(tetrominoNames);
        const matrix = tetrominoes[name];
        const column = playfieldColumns / 2 - Math.floor(matrix.length / 2);
        const row = -2;
        this.tetromino = {
            name, matrix, row, column
        }
    };

    moveDown() {
        this.tetromino.row += 1;
        if (!this.isValid()) {
            this.tetromino.row -= 1;
            this.placeTetromino();
        }
    };

    moveLeft() {
        this.tetromino.column -= 1;
        if (!this.isValid()) {
            this.tetromino.column += 1;
        }
    };

    moveRight() {
        this.tetromino.column += 1;
        if (!this.isValid()) {
            this.tetromino.column -= 1;
        }
    };

    rotateTetromino() {
        const oldMatrix = this.tetromino.matrix;
        this.tetromino.matrix = rotateMatrix(this.tetromino.matrix);
        if (!this.isValid()) {
            this.tetromino.matrix = oldMatrix;
        }
    };

    isValid() {
        const matrixSize = this.tetromino.matrix.length;
        for (let i = 0; i < matrixSize; i++) {
            for (let j = 0; j < matrixSize; j++) {
                if (!this.tetromino.matrix[i][j]) continue;
                if (this.isOutsideOfGameBoard(i, j)) return false;
                if (this.isCollides(i, j)) return false;
            }
        }
        return true;
    };

    isOutsideOfGameBoard(row, column) {
        return this.tetromino.column + column < 0 ||
            this.tetromino.column + column >= playfieldColumns ||
            this.tetromino.row + row >= this.playfield.length;
    };

    isCollides(row, column) {
        return this.playfield[this.tetromino.row + row]?.[this.tetromino.column + column];
    };

    placeTetromino() {
        const matrixSize = this.tetromino.matrix.length;
        for (let i = 0; i < matrixSize; i++) {
            for (let j = 0; j < matrixSize; j++) {
                if (!this.tetromino.matrix[i][j]) continue;
                if (this.isOutsideOfTopGameBoard(i)) {
                    this.isGameOver = true;
                    return;
                }
                this.playfield[this.tetromino.row + i][this.tetromino.column + j] = this.tetromino.name;
            }
        }
        this.processFillRows();
        this.generateTetromino();
    };

    isOutsideOfTopGameBoard(row) {
        return this.tetromino.row + row < 0;
    };

    processFillRows() {
        const fieldLines = this.findFilledRows();
        this.removeFilledRows(fieldLines);
    };

    findFilledRows() {
        const filledRows = [];
        for (let i = 0; i < playfieldRows; i++) {
            if (this.playfield[i].every(cell => Boolean(cell))) {
                filledRows.push(i);
            }
        }
        return filledRows;
    };

    removeFilledRows(fieldRows) {
        fieldRows.forEach(row => {
            this.dropRowsAbove(row);
        })
    };

    dropRowsAbove(rowToDelete) {
        for (let i = rowToDelete; i > 0; i--) {
            this.playfield[i] = this.playfield[i - 1];
        }
        this.playfield[0] = new Array(playfieldColumns).fill(0);
        this.score += 100;
        removeRowAudio.play();
    };

    clearGame() {
        this.playfield = null;
        this.tetromino = null;
        this.isGameOver = false;
        this.score = 0;
        this.init();
    };
}