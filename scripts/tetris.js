import {playfieldColumns, playfieldRows, tetrominoNames, tetrominoes, getRandomElement} from "./utils.js";

export class Tetris {
    constructor() {
        this.playfield = null;
        this.tetromino = null;
        this.init()
    }

    init() {
        this.generatePlayfield();
        this.generateTetromino();
    }

    generatePlayfield() {
        this.playfield = new Array(playfieldRows).fill()
            .map(() => new Array(playfieldColumns).fill(0))
        console.table(this.playfield)
    }

    generateTetromino() {
        const name = getRandomElement(tetrominoNames);
        const matrix = tetrominoes[name];
        const column = playfieldColumns / 2 - Math.floor(matrix.length / 2);
        // const row = -2;
        const row = 3;
        this.tetromino = {
            name, matrix, row, column
        }
    }
}