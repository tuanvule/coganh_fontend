const chess_rule = {
    ganh_chet(gameState, move, opp_pos, side, opp_side) {
        let valid_remove = [];
        let at_8intction = (move[0] + move[1]) % 2 === 0;

        for (let [x0, y0] of opp_pos) {
            let dx = x0 - move[0];
            let dy = y0 - move[1];
            if (dx >= -1 && dx <= 1 && dy >= -1 && dy <= 1 && (dx === 0 || dy === 0 || at_8intction)) {
                if ((move[0] - dx >= 0 && move[0] - dx <= 4 && move[1] - dy >= 0 && move[1] - dy <= 4 && gameState.board[move[1] - dy][move[0] - dx] === opp_side) ||
                    (x0 + dx >= 0 && x0 + dx <= 4 && y0 + dy >= 0 && y0 + dy <= 4 && gameState.board[y0 + dy][x0 + dx] === side)) {
                    valid_remove.push([x0, y0]);
                }
            }
        }
        return valid_remove;
    },
    vay(gameState, opp_pos) {
        for (let pos of opp_pos) {
            let move_list
            if ((pos[0] + pos[1]) % 2 === 0) {
                move_list = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [-1, 1], [1, -1]];
            } else {
                move_list = [[1, 0], [-1, 0], [0, 1], [0, -1]];
            }
            for (let move of move_list) {
                let new_valid_x = pos[0] + move[0];
                let new_valid_y = pos[1] + move[1];
                if (new_valid_x >= 0 && new_valid_x <= 4 && new_valid_y >= 0 && new_valid_y <= 4 && gameState.board[new_valid_y][new_valid_x] === 0) {
                    return [];
                }
            }
        }
        return JSON.parse(JSON.stringify(opp_pos))
    }
}

export default chess_rule