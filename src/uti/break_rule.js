// export default function break_rule(gameState, Intervention, global_var) {
//     // Trạng thái lưu lại qua các lượt
//     // let valBoard = Array(5).fill().map(() => Array(5).fill("❄"));

//     if (gameState.move_counter === 0) {
//         // Setup
//         for (let y = 0; y < 5; y++) {
//             for (let x = 0; x < 5; x++) {
//                 Intervention.set_value(x, y, "❄");
//             }
//         }

//         global_var.val_board = Array(5).fill(null).map(() => Array(5).fill("❄"));
//     } else {
//         let [selectedX, selectedY] = gameState.move.selected_pos;

//         // Vỡ băng khi di chuyển
//         switch (global_var.val_board[selectedY][selectedX]) {
//             case "❄":
//                 global_var.val_board[selectedY][selectedX] = "🧊";
//                 break;
//             case "🧊":
//                 global_var.val_board[selectedY][selectedX] = "💧";
//                 break;
//             default:
//                 break;
//         }

//         // Chết khi vỡ hết băng
//         let [newX, newY] = gameState.move.new_pos;
//         if (global_var.val_board[newY][newX] === "💧") {
//             if (gameState.board[newY][newX] === 1) {
//                 Intervention.remove_blue(newX, newY);
//             } else {
//                 Intervention.remove_red(newX, newY);
//             }
//         }

//         // Cài đặt trạng thái
//         for (let y = 0; y < 5; y++) {
//             for (let x = 0; x < 5; x++) {
//                 Intervention.set_value(x, y, global_var.val_board[y][x]);
//             }
//         }
//     }
// }

// export default function breakRule(gameState, Intervention, globalVar) {
//     if (gameState.move_counter === 0) {
//         // Setup
//         Intervention.set_value(0, 2, "🔵     \n\n");
//         Intervention.set_value(4, 2, "🔵     \n\n");

//         // Trạng thái lưu lại qua các lượt
//         globalVar.valBoard = [
//             [null, null, null, null, null],
//             [null, null, null, null, null],
//             ["🔵     \n\n", null, null, null, "🔵     \n\n"],
//             [null, null, null, null, null],
//             [null, null, null, null, null]
//         ];
//     } else {
//         console.log(globalVar.valBoard)
//         let selected_pos = gameState.move.selected_pos;
//         let new_pos = gameState.move.new_pos;

//         // Đổi vị trí trạng thái khi di chuyển
//         console.log(gameState.move)
//         globalVar.valBoard[new_pos[1]][new_pos[0]] = globalVar.valBoard[selected_pos[1]][selected_pos[0]];
//         globalVar.valBoard[selected_pos[1]][selected_pos[0]] = null;

//         // console.log(globalVar.valBoard[selected_pos[1]][selected_pos[0]])
//         // console.log(globalVar.valBoard[new_pos[1]][new_pos[0]])

//         // Giảm số lượt sống
//         for (let y = 0; y < 5; y++) {
//             for (let x = 0; x < 5; x++) {
//                 if (globalVar.valBoard[y][x] !== null) {
//                     switch (globalVar.valBoard[y][x]) {
//                         case "🔵     \n\n":
//                             globalVar.valBoard[y][x] = "🟢     \n\n";
//                             break;
//                         case "🟢     \n\n":
//                             globalVar.valBoard[y][x] = "🟡     \n\n";
//                             break;
//                         case "🟡     \n\n":
//                             globalVar.valBoard[y][x] = "🟠     \n\n";
//                             break;
//                         case "🟠     \n\n":
//                             globalVar.valBoard[y][x] = "🤮";
//                             break;
//                         case "🤮":
//                             globalVar.valBoard[y][x] = "🔴";
//                             break;
//                         default:
//                             break;
//                     }
//                 }
//             }
//         }

//         // Chết khi bị gánh/ chẹt/ vây
//         let result = Intervention.getResult();
//         console.log(result)
//         for (let {pos: [x,y], id} of result) {
//             globalVar.valBoard[y][x] = "🔴";
//             // delete result[key];
//             Intervention.deleteItem(id)
//         }

//         // Truyền bệnh
//         for (let y = 0; y < 5; y++) {
//             for (let x = 0; x < 5; x++) {
//                 if (globalVar.valBoard[y][x] === "🔴") {
//                     for (let y1 = 0; y1 < 5; y1++) {
//                         for (let x1 = 0; x1 < 5; x1++) {
//                             let dx = Math.abs(x - x1);
//                             let dy = Math.abs(y - y1);
//                             if (Math.max(dx, dy) + ((x + y) % 2 && (x1 + y1) % 2 && dx === dy && dx !== 0) === 1) {
//                                 if (globalVar.valBoard[y1][x1] === null && gameState.board[y1][x1] !== 0) {
//                                     globalVar.valBoard[y1][x1] = "🔵     \n\n";
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//         }

//         // Chết khi hết lượt sống
//         for (let y = 0; y < 5; y++) {
//             for (let x = 0; x < 5; x++) {
//                 if (globalVar.valBoard[y][x] === "🔴") {
//                     if (gameState.board[y][x] === 1) {
//                         console.log("hello", x,y)
//                         Intervention.remove_blue(x, y);
//                     } else {
//                         Intervention.remove_red(x, y);
//                     }
//                     globalVar.valBoard[y][x] = null;
//                 }
//             }
//         }

//         // Cài đặt trạng thái
//         for (let y = 0; y < 5; y++) {
//             for (let x = 0; x < 5; x++) {
//                 Intervention.set_value(x, y, globalVar.valBoard[y][x]);
//             }
//         }
//     }
// }


// export default function breakRule(gameState, Intervention, globalVar) {
//     if (gameState.move_counter === 0) {
//         // Setup
//         globalVar.counter = 5;
//         globalVar.direction = null;
//     } else {
//         // Cài đặt
//         globalVar.counter -= 1;
//         if (globalVar.counter === 0) {
//             if (globalVar.direction === null) {
//                 globalVar.counter = 5;
//                 globalVar.direction = ['←', '→', '↓', '↑'][Math.floor(Math.random() * 4)];
//             } else {
//                 globalVar.counter = 4;
//                 globalVar.direction = null;
//             }
//         }

//         // Làn nước
//         if (globalVar.direction !== null) {
//             let c = globalVar.counter;
//             let pos_lst;

//             switch (globalVar.direction) {
//                 case '←':
//                     pos_lst = Array.from({ length: 5 }, (_, i) => [c - 1, i]);
//                     break;
//                 case '→':
//                     pos_lst = Array.from({ length: 5 }, (_, i) => [5 - c, i]);
//                     break;
//                 case '↓':
//                     pos_lst = Array.from({ length: 5 }, (_, i) => [i, 5 - c]);
//                     break;
//                 case '↑':
//                     pos_lst = Array.from({ length: 5 }, (_, i) => [i, c - 1]);
//                     break;
//             }

//             pos_lst.forEach(([x, y]) => {
//                 let board = gameState.board;
//                 let d8 = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [-1, 1], [1, -1]];
//                 let d4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
                
//                 let directions = (x + y) % 2 === 0 ? d8 : d4;
//                 let connect = directions
//                     .map(([mx, my]) => [x + mx, y + my])
//                     .filter(([nx, ny]) => 
//                         nx >= 0 && nx <= 4 && ny >= 0 && ny <= 4 && 
//                         board[ny][nx] !== 0 && board[y][x] !== 0
//                     );

//                 if (connect.length >= 2) {
//                     Intervention.set_value(x, y, "⛵");
//                 } else {
//                     // Cuốn trôi
//                     if (board[y][x] === 1) {
//                         Intervention.remove_blue(x, y);
//                     } else if (board[y][x] === -1) {
//                         Intervention.remove_red(x, y);
//                     }
//                     Intervention.set_value(x, y, "🌊");
//                 }
//             });
//         }

//         // Cài đặt trạng thái
//         if (globalVar.direction === null) {
//             Intervention.set_value(2, -0.5, String(globalVar.counter));
//         } else {
//             Intervention.set_value(2, -0.5, globalVar.direction);
//         }
//     }
// }

function execute(intervention, command, x, y, side, trackOn=false) {
    if (command === "remove" && side === 1) intervention.remove_blue(x, y, trackOn);
    else if (command === "remove" && side !== 1) intervention.remove_red(x, y, trackOn);
    else if (command === "insert" && side === 1) intervention.insert_blue(x, y, trackOn);
    else if (command === "insert" && side !== 1) intervention.insert_red(x, y, trackOn);
}

export default function breakRule(gameState, intervention, globalVar, localVar) {
    if(!localVar.data) {
        localVar.data = {
            king: [[2, 0], [2, 4]],
            spy: [[4, 2], [0, 2]],
            traitor: [[], []],
            traitorNum: 0
        }
    }
    localVar = localVar.data

    let king = localVar.king;
    let spy = localVar.spy;
    let traitor = localVar.traitor;

    if (gameState.move_counter > 0) {
        let selectedPos = gameState.move.selected_pos;
        let newPos = gameState.move.new_pos;
        let side = gameState.move_counter % 2;
        let choseRightSide = true;

        // Di chuyển
        if (arraysEqual(selectedPos, king[side])) {
            king[side] = newPos;
        } else if (arraysEqual(selectedPos, spy[side])) {
            spy[side] = newPos;

            // Thâu tóm
            for (let i of intervention.view_command()) {
                execute(intervention, "insert", ...i.pos, side);
                traitor[side].push(i.pos);
                localVar.traitorNum += 1;
            }
        } else if (arrayInArray(selectedPos, traitor[side])) {
            traitor[side][traitor[side].findIndex(findI, selectedPos)] = newPos;
        } else if (arraysEqual(selectedPos, spy[+!side]) || arrayInArray(selectedPos, traitor[+!side])) {
            choseRightSide = false;

            // Mất lượt
            execute(intervention, "remove", ...newPos, side);
            let commands = intervention.view_command();
            for (let i = 0; i < commands.length - 1; i++) {
                execute(intervention, "insert", ...commands[i].pos, +!side);
            }
            execute(intervention, "insert", ...selectedPos, side);
        }

        // Cải trang
        let pos = spy.concat(traitor[0]).concat(traitor[1]);
        for (let i of pos) {
            execute(intervention, "remove", i[0], i[1], side)
        };
        for (let i of pos) {
            execute(intervention, "insert", i[0], i[1], +!side)
        }

        // Vua
        if (choseRightSide) {
            for (let i of intervention.view_command()) {
                let pos = i.pos;
                if (arraysEqual(pos, king[0])) {
                    intervention.blue_win();
                } else if (arraysEqual(pos, king[1])) {
                    intervention.red_win();
                }
            }
        }

    } else {
        // Setup
        intervention.remove_red(4, 2, false);
        intervention.insert_blue(4, 2, false);
    }

    // Cài đặt trạng thái
    for (let i = 0; i < 2; i++) {
        intervention.set_value(spy[i][0], spy[i][1], "⚪", 35, [255,255,255])
        intervention.set_value(...spy[i], "👥");
    }
    for (let i of traitor[0].concat(traitor[1])) {
        intervention.set_value(i[0], i[1], "⚪", 35, [255,255,255])
    }
    for (let i = 0; i < 2; i++) {
        intervention.set_value(...king[i], "👑");
    }

    globalVar.king = king;
    globalVar.spy = randomSample(spy, 2);
    globalVar.traitor = randomSample(traitor[0].concat(traitor[1]), localVar.traitorNum);
}

// Helper functions
function arraysEqual(a, b) {
    return a.every((val, index) => val === b[index]);
}

function arrayInArray(arr, arrList) {
    return arrList.some(el => arraysEqual(el, arr));
}

function randomSample(array, num) {
    let result = [];
    let arrayCopy = array.slice();
    for (let i = 0; i < num; i++) {
        let index = Math.floor(Math.random() * arrayCopy.length);
        result.push(arrayCopy.splice(index, 1)[0]);
    }
    return result;
}

function findI(e) {
    return e[0] === this[0] && e[1] === this[1]
}