import chess_rule from "./chess_rule";

const { ganh_chet, vay } = chess_rule

export default class Intervention {
    // return {
    constructor(game_state) {
        this.game_state = game_state
        this._res = []
    }

    view_command() {
        return JSON.parse(JSON.stringify(this._res));
    }

    clear() {
        this._res = [];
    }

    remove_blue(x, y) {
        if (this.game_state.board[y][x] === 1) {
            this._res.push({
                id: new Date().getTime(),
                action: "remove_blue",
                pos: [x, y],
            })
            this.game_state.board[y][x] = 0;
            this.game_state.positions[0] = this.game_state.positions[0].filter(pos => pos[0] !== y || pos[1] !== x);
        } else {
            throw new Error(`There is no blue piece in (${x}, ${y})`);
        }
    }

    remove_red(x, y) {
        console.log(this.game_state.move_counter, x,y)
        if (this.game_state.board[y][x] === -1) {
            this._res.push({
                id: new Date().getTime(),
                action: "remove_red",
                pos: [x, y],
            })
            this.game_state.board[y][x] = 0;
            this.game_state.positions[1] = this.game_state.positions[1].filter(pos => pos[0] !== y || pos[1] !== x);
        } else {
            throw new Error(`There is no red piece in (${x}, ${y})`);
        }
    }

    insert_blue(x, y) {
        if (this.game_state.board[y][x] === 0) {
            this._res.push({
                id: new Date().getTime(),
                action: "insert_blue",
                pos: [x, y],
            })
            let valid_remove = [...ganh_chet(this.game_state, [x, y], this.game_state.positions[1], 1, -1), ...vay(this.game_state, this.game_state.positions[1])]
            this.game_state.board[y][x] = 1;
            this.game_state.positions[0].push([x, y]);
            for (let i in valid_remove) {
                this.remove_red(i)
            }
        } else {
            throw new Error(`There already has a piece in (${x}, ${y})`);
        }
    }

    insert_red(x, y) {
        if (this.game_state.board[y][x] === 0) {
            this._res.push({
                id: new Date().getTime(),
                action: "insert_red",
                pos: [x, y],
            })
            let valid_remove = [...ganh_chet(this.game_state, [x, y], this.game_state.positions[0], -1, 1), ...vay(this.game_state, this.game_state.positions[0])]
            this.game_state.board[y][x] = -1;
            this.game_state.positions[1].push([x, y]);
            for (let i in valid_remove) {
                this.remove_blue(i)
            }
        } else {
            throw new Error(`There already has a piece in (${x}, ${y})`);
        }
    }

    set_value(x, y, value) {
        this._res.push({
            id: new Date().getTime(),
            action: "set_value",
            pos: [x, y],
            value: value
        })
    }

    blue_win(){
        this.game_state.result = "win"
    }

    red_win(){
        this.game_state.result = "lost"
    }

    draw(){
        this.game_state.result = "draw"
    }

    action() {
        if (this.game_state.move_counter === 200 || (!this.game_state.positions[0].length && !this.game_state.positions[1].length)) {
            this.game_state.result = "draw";
        } else if (!this.game_state.positions[0].length) {
            this.game_state.result = "lost";
        } else if (!this.game_state.positions[1].length) {
            this.game_state.result = "win";
        }

        this.clear();
    }
    // }
}