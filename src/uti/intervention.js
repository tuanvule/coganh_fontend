import chess_rule from "./chess_rule";

const { ganh_chet, vay } = chess_rule

// export default class Intervention {
//     constructor(game_state) {
//         this.game_state = game_state
//         this._res = []
//     }

//     view_command() {
//         return JSON.parse(JSON.stringify(this._res));
//     }

//     clear() {
//         this._res = [];
//     }

//     remove_blue(x, y) {
//         if (this.game_state.board[y][x] === 1) {
//             this._res.push({
//                 id: new Date().getTime(),
//                 action: "remove_blue",
//                 pos: [x, y],
//             })
//             this.game_state.board[y][x] = 0;
//             this.game_state.positions[0] = this.game_state.positions[0].filter(pos => pos[0] !== x || pos[1] !== y);
//         } else {
//             throw new Error(`There is no blue piece in (${x}, ${y})`);
//         }
//     }

//     remove_red(x, y) {
//         if (this.game_state.board[y][x] === -1) {
//             this._res.push({
//                 id: new Date().getTime(),
//                 action: "remove_red",
//                 pos: [x, y],
//             })
//             this.game_state.board[y][x] = 0;
//             this.game_state.positions[1] = this.game_state.positions[1].filter(pos => pos[0] !== x || pos[1] !== y);
//         } else {
//             throw new Error(`There is no red piece in (${x}, ${y})`);
//         }
//     }

//     insert_blue(x, y) {
//         if (this.game_state.board[y][x] === 0) {
//             this._res.push({
//                 id: new Date().getTime(),
//                 action: "insert_blue",
//                 pos: [x, y],
//             })
//             this.game_state.board[y][x] = 1;
//             this.game_state.positions[0].push([x, y]);
//             let valid_remove = [...ganh_chet(this.game_state, [x, y], this.game_state.positions[1], 1, -1), ...vay(this.game_state, this.game_state.positions[1])]
//             for (let i of valid_remove) {
//                 this.remove_red(...i)
//             }
//         } else {
//             throw new Error(`There already has a piece in (${x}, ${y})`);
//         }
//     }

//     insert_red(x, y) {
//         if (this.game_state.board[y][x] === 0) {
//             this._res.push({
//                 id: new Date().getTime(),
//                 action: "insert_red",
//                 pos: [x, y],
//             })
//             this.game_state.board[y][x] = -1;
//             this.game_state.positions[1].push([x, y]);
//             let valid_remove = [...ganh_chet(this.game_state, [x, y], this.game_state.positions[0], -1, 1), ...vay(this.game_state, this.game_state.positions[0])]
//             for (let i of valid_remove) {
//                 this.remove_blue(...i)
//             }
//         } else {
//             throw new Error(`There already has a piece in (${x}, ${y})`);
//         }
//     }

//     set_value(x, y, value) {
//         this._res.push({
//             id: new Date().getTime(),
//             action: "set_value",
//             pos: [x, y],
//             value: value
//         })
//     }

//     blue_win(){
//         this.game_state.result = "win"
//     }

//     red_win(){
//         this.game_state.result = "lost"
//     }

//     draw(){
//         this.game_state.result = "draw"
//     }

//     action() {
//         if (this.game_state.move_counter === 200 || (!this.game_state.positions[0].length && !this.game_state.positions[1].length)) {
//             this.game_state.result = "draw";
//         } else if (!this.game_state.positions[0].length) {
//             this.game_state.result = "lost";
//         } else if (!this.game_state.positions[1].length) {
//             this.game_state.result = "win";
//         }

//         this.clear();
//     }
//     // }
// }

export default class Intervention {
    constructor(game_state) {
        this._res = [];
        this.game_state = game_state
    }

    view_command() {
        return [...this._res]
    }

    remove_blue(x, y, trackOn = true) {
        if (this.game_state.board[y][x] !== 1) throw new Error(`There is no blue piece in (${x}, ${y})`);
        if (typeof trackOn !== 'boolean') throw new Error(`trackOn must be boolean (not ${typeof trackOn})`);
        this._res.push({ action: 'remove_blue', pos: [x, y], trackOn });
        this.game_state.board[y][x] = 0;
        this.game_state.positions[0] = this.game_state.positions[0].filter(pos => pos[0] !== x || pos[1] !== y);
    }

    remove_red(x, y, trackOn = true) {
        if (this.game_state.board[y][x] !== -1) throw new Error(`There is no red piece in (${x}, ${y})`);
        if (typeof trackOn !== 'boolean') throw new Error(`trackOn must be boolean (not ${typeof trackOn})`);
        this._res.push({ action: 'remove_red', pos: [x, y], trackOn });
        this.game_state.board[y][x] = 0;
        this.game_state.positions[1] = this.game_state.positions[1].filter(pos => pos[0] !== x || pos[1] !== y);
    }

    insert_blue(x, y, trackOn = true) {
        if (this.game_state.board[y][x] !== 0) throw new Error(`There already has a piece in (${x}, ${y})`);
        if (typeof trackOn !== 'boolean') throw new Error(`trackOn must be boolean (not ${typeof trackOn})`);
        this._res.push({ action: 'insert_blue', pos: [x, y], trackOn });
        this.game_state.board[y][x] = 1;
        this.game_state.positions[0].push([x, y]);
        let remove = new Set(vay(this.game_state, this.game_state.positions[1]));
        remove = new Set([...remove, ...ganh_chet(this.game_state, [x, y], this.game_state.positions[1], 1, -1)]);
        remove = new Set([...remove, ...vay(this.game_state, this.game_state.positions[1])]);
        remove.forEach(pos => this.remove_red(pos[0], pos[1]));
    }

    insert_red(x, y, trackOn = true) {
        if (this.game_state.board[y][x] !== 0) throw new Error(`There already has a piece in (${x}, ${y})`);
        if (typeof trackOn !== 'boolean') throw new Error(`trackOn must be boolean (not ${typeof trackOn})`);
        this._res.push({ action: 'insert_red', pos: [x, y], trackOn });
        this.game_state.board[y][x] = -1;
        this.game_state.positions[1].push([x, y]);
        let remove = new Set(vay(this.game_state, this.game_state.positions[0]));
        remove = new Set([...remove, ...ganh_chet(this.game_state, [x, y], this.game_state.positions[0], -1, 1)]);
        remove = new Set([...remove, ...vay(this.game_state,this.game_state.positions[0])]);
        remove.forEach(pos => this.remove_blue(pos[0], pos[1]));
    }

    blue_win() {
        this.game_state.result = "win";
    }

    red_win() {
        this.game_state.result = "lost";
    }

    draw() {
        this.game_state.result = "draw";
    }

    set_value(x, y, value, size = 20, fill = [255, 255, 255], stroke_width = 1, stroke_fill = [0, 0, 0]) {
        if (typeof value !== 'string') throw new Error(`value must be string (not ${typeof value})`);
        if (typeof size !== 'number') throw new Error(`size must be int (not ${typeof size})`);
        if (!Array.isArray(fill) || fill.length !== 3) throw new Error(`fill must be list of [r, g, b]`);
        if (typeof stroke_width !== 'number') throw new Error(`stroke_width must be int (not ${typeof stroke_width})`);
        if (!Array.isArray(stroke_fill) || stroke_fill.length !== 3) throw new Error(`stroke_fill must be list of [r, g, b]`);
        this._res.push({ action: 'set_value', pos: [x, y], value, size, fill, stroke_width, stroke_fill });
    }

    action() {
        if (!this.game_state.result) {
            if (this.game_state.move_counter === 200 || (!this.game_state.positions[0].length && !this.game_state.positions[1].length)) {
                this.game_state.result = "draw";
            } else if (!this.game_state.positions[0].length) {
                this.game_state.result = "lost";
            } else if (!this.game_state.positions[1].length) {
                this.game_state.result = "win";
            }
        }
        this._res = [];
    }
}
