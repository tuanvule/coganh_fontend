import React, { useContext, useEffect, useState } from 'react'
import level1 from "../../../static/img/level1.png"
import level2 from "../../../static/img/level2.png"
import level3 from "../../../static/img/level3.png"
import level4 from "../../../static/img/level4.png"
import Master from "../../../static/img/Master.png"
import chessboard1 from "../../../static/img/chessboard1.png"
import capture_audio from "../../../static/capture.mp3"
import move_audio from "../../../static/move-self.mp3"
// import fireSound_audio from "../../../static/fireSound.mp3"
import logo from "../../../static/img/logo.png"
import red_break_img from "../../../static/img/red_remove_tracker.png"
import blue_break_img from "../../../static/img/blue_remove_tracker.png"
import break_sound from "../../../static/breaking_glass.mp3"

import CreateRateModel from "../../modal/rate_model"

import "../../../style/human_bot.css"
import "../../../style/rate_model.css"
import { AppContext } from '../../../context/appContext'
import Intervention from '../../../uti/intervention'
// import breakRule from '../../../uti/break_rule'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'
import chess_rule from "../../../uti/chess_rule"

const {ganh_chet, vay} = chess_rule

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

export default function Human_Bot() {
    const { user, history } = useContext(AppContext)

    const { username } = user

    const [ bot, set_bot ] = useState("Master")
    const [ reload, set_reload ] = useState()
    const [ is_open_rate_modal, set_is_open_rate_modal ] = useState({})
    const [ rate, set_rate ] = useState()
    const [ user_bots, set_user_bots] = useState([])
    const [ selected_user_bot, set_selected_user_bot] = useState()
    const [ is_open_bot_list, set_is_open_bot_list] = useState(false)
    const isMobile = (window.innerWidth <= 600)
    let radius = 16

    let {state} = useLocation()
    // let game_info = state
    const [searchParams] = useSearchParams();
    let title = searchParams.get("title")
    let upload_time = searchParams.get("upload_time")

    const [game_info, set_game_info] = useState(state)

    useEffect(() => {
        if(!(game_info && game_info.title)) {
            fetch(`http://192.168.1.249:8080/get_gamemode_by_post?title=${title}&upload_time=${upload_time}`)
            .then(res => res.json())
            .then(data => {
                set_game_info(data)
            })
            .catch(err => console.log(err))
        }
    }, [])

    useEffect(() => {
        if(selected_user_bot) {
            const bot_info_name = $(`.bot_info_name_${isMobile ? "mobile" : "pc"}`)
            const bot_avatar_img = $(`.bot_avatar_${isMobile ? "mobile" : "pc"} img`)
            bot_avatar_img.src = logo
            bot_info_name.innerHTML = selected_user_bot.bot_name
        }
    }, [selected_user_bot])
    useEffect(() => {
        // console.log(game_info)
        let board = $(".board")
        let display_outBoard = $(".display_outBoard")
        let custom_board = $(".custom_board")
        let boardValue = board.getBoundingClientRect()
        let chessGrapX = boardValue.width / 4
        let chessGrapY = boardValue.height / 4
        let ready = true
        let d1 = [[1, 0], [0, 1], [0, -1], [-1, 0]]
        let d2 = [[1, 0], [0, 1], [0, -1], [-1, 0], [-1, -1], [-1, 1], [1, 1], [1, -1]]
        let canvas = $("canvas")
        canvas.style.left = board.offsetLeft - radius - 5 + "px"
        canvas.style.top = board.offsetTop - radius - 5 + "px"
        canvas.width = boardValue.width + 2 * radius + 10
        canvas.height = boardValue.height + 2 * radius + 10
        let cv2 = canvas.getContext("2d")
        let rs = 1
        let dem
        let chessEnemy

        if (window.outerWidth <= 600) {
            rs = 0.5
            radius = 8
        } else {
            rs = 1
            radius = 16
        }

        // let username = user.username

        let selectedChess
        const gameResult = $(".game_result")
        const gameStatus = $(".HB_game_status")
        const play_again_btn = $(".play_again_btn")
        const moveSound = $(".move_sound")
        const captureSound = $(".capture_sound")
        const fireSound = $(".fire_sound")
        fireSound.volume = 1

        const rate_btn = $(".rate_btn")

        play_again_btn.onclick = () => set_reload(Math.random())

        const gridHTML = `
<div class="HB_grid dark:bg-white bg-slate-200">
    <div class="HB_row1"></div>
    <div class="HB_row2"></div>            
    <div class="HB_row3"></div>
    <div class="HB_row4"></div>
</div>
<div class="HB_grid dark:bg-white bg-slate-200">
    <div class="HB_row1"></div>
    <div class="HB_row2"></div>            
    <div class="HB_row3"></div>
    <div class="HB_row4"></div>
</div>
<div class="HB_grid dark:bg-white bg-slate-200">
    <div class="HB_row1"></div>
    <div class="HB_row2"></div>            
    <div class="HB_row3"></div>
    <div class="HB_row4"></div>
</div>
<div class="HB_grid dark:bg-white bg-slate-200">
    <div class="HB_row1"></div>
    <div class="HB_row2"></div>            
    <div class="HB_row3"></div>
    <div class="HB_row4"></div>
</div>
<div class="HB_rowx"></div>
<div class="HB_rowy"></div>
`

        // let grid = 

        // let gameState.positions = 
        let gamemode_bot = {}

        var gameState = {
            current_turn: 1,
            board: [
                [-1, -1, -1, -1, -1],
                [-1, 0, 0, 0, -1],
                [1, 0, 0, 0, -1],
                [1, 0, 0, 0, 1],
                [1, 1, 1, 1, 1]
            ],
            custom_board: [
                [{value: ""},{value: ""},{value: ""},{value: ""},{value: ""}],
                [{value: ""},{value: ""},{value: ""},{value: ""},{value: ""}],
                [{value: ""},{value: ""},{value: ""},{value: ""},{value: ""}],
                [{value: ""},{value: ""},{value: ""},{value: ""},{value: ""}],
                [{value: ""},{value: ""},{value: ""},{value: ""},{value: ""}],
            ],
            outside_display: [],
            positions: [
                [[0, 2], [0, 3], [2, 4], [4, 3], [0, 4], [1, 4], [3, 4], [4, 4]],
                [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [0, 1], [4, 1], [4, 2]]
            ],
            move_counter: 0,
            result: null
        }

        let global_var = {}

        let local_var = {
            data: null
        }

        let curBoard = [
        [-1, -1, -1, -1, -1],
        [-1, 0, 0, 0, -1],
        [1, 0, 0, 0, -1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1]]
        let intervention = new Intervention(gameState)

        function reset_display_item_outside(item) {
            if(item) {
                const {pos, value, fill, size, stroke_fill, stroke_width} = item
                const [x,y] = pos
                
                display_outBoard.innerHTML += `
                    <div data-choosable="false" class="custom_icon emoji-text w-[60px] h-[60px] rounded-full select-none pointer-events-none grid place-content-center text-xl text-white -translate-x-1/2 -translate-y-1/2" style="top:${y/4*100}%; left:${x/4*100}%; font-size: ${size * 1}px; border: ${stroke_width}px solid rgb(${stroke_fill}); background-color: rgb(${fill})">${value}</div>
                `
            }
            // gameState.outside_display.forEach(item => {
            // })
        
        }

        function check_is_display_outside(x,y) {
            if(Number.isInteger(x+y) && x >= 0 && x <=4 && y >= 0 && y <= 4) {
                return false
            }
            return true
        }

        if(game_info && game_info.title) {
            // let func = JSON.parse(game_info.break_rule_js).code
            
            // let breakRule = new Function('return ' + func )()
            // console.log(game_info)
            const functionString = JSON.parse(game_info.break_rule_js).code;
            eval(functionString);

            window.breakRule(gameState, intervention, global_var, local_var)
            let result = intervention.view_command()

            let a = result.filter(item => item.action === "set_value" && !check_is_display_outside(item.pos[0],item.pos[1])).forEach((item) => reset_custom_board(item))
            result.filter(item => item.action === "set_value" && check_is_display_outside(item.pos[0],item.pos[1])).forEach((item) => reset_display_item_outside(item))

            

            intervention.action()
            game_info.bots.forEach(bot => {
                gamemode_bot[bot.name] = bot.code
                gamemode_bot[bot.name + "_avatar"] = bot.avatar
            })
        }
        
        const type = [
            [1, 0, 1, 0, 1],
            [0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1],
            [0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1]
        ]

        function reset_custom_board(item) {
            const { value, size, fill, stroke_width, stroke_fill, pos} = item
            const [x,y] = pos

            custom_board.innerHTML += `
                <p data-choosable="false" data-posx="${x}" data-posy="${y}" class="custom_icon emoji-text pb-1" style="top:${chessGrapY * y}px; left:${chessGrapX * x}px; font-size: ${size * 1.8}px; border: ${stroke_width}px solid rgb(${stroke_fill}); ">${value}</p>
            `
            // for (let i = 0; i < gameState.custom_board.length; i++) {
            //     for (let j = 0; j < gameState.custom_board[i].length; j++) {
            //     }
            // }
        }

        function resetBoard() {
            board = $(".board")
            boardValue = board.getBoundingClientRect()
            chessGrapX = boardValue.width / 4
            chessGrapY = boardValue.height / 4
            canvas = $("canvas")
            canvas.style.left = boardValue.x - radius - 5 + "px"
            canvas.style.top = boardValue.y - radius - 5 + "px"
            canvas.width = boardValue.width + 2 * radius + 10
            canvas.height = boardValue.height + 2 * radius + 10
            cv2 = canvas.getContext("2d")
            board.innerHTML = gridHTML
            // custom_board.innerHTML = ""
            dem = 0
            for (let i = 0; i < gameState.board.length; i++) {
                for (let j = 0; j < gameState.board[i].length; j++) {
                    const { value, size, fill, stroke_width, stroke_fill} = gameState.custom_board[i][j]
                    board.innerHTML += `<div data-choosable="false" data-posx="${j}" data-posy="${i}" class="box z-[1000]" style="top:${chessGrapY * i}px; left:${chessGrapX * j}px;"></div>`
                    if (gameState.board[i][j] === -1) {
                        board.innerHTML += `<div data-so="${dem}" data-posx="${j}" data-posy="${i}" style="background-color: red; top:${chessGrapY * i}px; left:${chessGrapX * j}px;" class="chess HB_enemy"></div>`
                    } else if (gameState.board[i][j] === 1) {
                        board.innerHTML += `<div data-so="${dem}" data-posx="${j}" data-posy="${i}" style="background-color: blue; top:${chessGrapY * i}px; left:${chessGrapX * j}px;" class="chess player"></div>`
                    }
                    dem++
                }
            }
        }

        resetBoard()

        let choosen_bot = bot
        const bot_items = $$(".bot_item")
        const fight_btn = $(".fight_btn")
        const overflow = $(".overflow")
        const bot_avatar_img = $(`.bot_avatar_${isMobile ? "mobile" : "pc"} img`)
        const bot_info_name = $(`.bot_info_name_${isMobile ? "mobile" : "pc"}`)

        bot_items.forEach(item => {
            item.onclick = (e) => {
                if (item.classList.contains("selected")) {
                    choosen_bot = ""
                    item.classList.remove("selected")
                    fight_btn.classList.remove("active")
                    return
                }
                bot_items.forEach(e => e.classList.remove("selected"))
                choosen_bot = item.dataset.level
                item.classList.add("selected")
                // bot_html = item
                fight_btn.classList.add("active")
            }
        })

        function get_user_bot() {
            fetch(`http://192.168.1.249:8080/get_your_bots?username=${user.username}&gamemode=${game_info ? game_info.gamemode : "normal"}`)
            .then(res => res.json())
            .then(data => {
                set_selected_user_bot(data[0])
                set_user_bots(data)
            })
            .catch(err => console.log(err))
        }

        fight_btn.onclick = () => {
            if (!choosen_bot) return
            let bot

            switch (choosen_bot) {
                case "level1": bot = level1; break
                case "level2": bot = level2; break
                case "level3": bot = level3; break
                case "level4": bot = level4; break
                case "Master": bot = Master; break
                default: bot = $(".bot_item.selected img").src; break
            }
            bot_avatar_img.src = bot
            bot_info_name.innerHTML = choosen_bot
            overflow.style.display = "none"
            if(choosen_bot === "you") {
                get_user_bot()
            }
            set_bot(choosen_bot)
        }

        let move_list = []

        let img_data = {
            username: username || `Coganh_${Date.now()}`,
            side: 1,
            img: [],
            setup: {},
        }

        let rateModel

        rate_btn.onclick = () => {
            // rate.classList.toggle("RM_appear")
            if(rate_btn.classList.contains("active")) {
                rate_btn.classList.remove("active")
                set_is_open_rate_modal({is_open: false, is_loading: true})
                return
            } else {
                set_is_open_rate_modal({is_open: true, is_loading: true})
                rate_btn.classList.add("active")
            }
            rateModel = true
            fetch("http://192.168.1.249:8080/get_rate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ move_list: move_list, img_data: img_data })
            })
                .then(res => res.json())
                .then(data => {
                    const img_list = JSON.parse(data.img_url)
                    let rating = []
                    img_list.splice(1,img_list.length).forEach((url, i) => {
                        rating.push({
                            type: data.rate[i],
                            move: {
                                sellected_pos: `(${move_list[i].move.selected_pos[0]}, ${move_list[i].move.selected_pos[1]})`,
                                new_pos: `(${move_list[i].move.new_pos[0]}, ${move_list[i].move.new_pos[1]})`,
                            },
                            img_url: url,
                        })
                    })
                    set_rate(rating)
                    set_is_open_rate_modal({is_open: true, is_loading: false})
                    // rateModel = createRateModel(".RM_rate", rating)
                    // rateModel.start()
                })
        }

        let boxes = $$(".box")

        function getPos(e) {
            if (!ready) return

            const eX = Number(e.dataset.posx)
            const eY = Number(e.dataset.posy)
            selectedChess = e

            clearBox()

            if (type[eX][eY] === 0) {
                d1.forEach(pos => {
                    let newPosX = eX + pos[0]
                    let newPosY = eY + pos[1]
                    if (newPosX >= 0 && newPosX < 5 && newPosY >= 0 && newPosY < 5 && gameState.board[newPosY][newPosX] === 0) {
                        let box = Array.from(boxes).filter(e => Number(e.dataset.posx) === newPosX && Number(e.dataset.posy) === newPosY)
                        box.forEach(e => {
                            e.dataset.choosable = "true"
                            e.style.zIndex = "1000"
                        })
                    }
                })
            } else {
                d2.forEach(pos => {
                    let newPosX = eX + pos[0]
                    let newPosY = eY + pos[1]
                    if (newPosX >= 0 && newPosX < 5 && newPosY >= 0 && newPosY < 5 && gameState.board[newPosY][newPosX] === 0) {
                        let box = Array.from(boxes).filter(e => Number(e.dataset.posx) === newPosX && Number(e.dataset.posy) === newPosY)
                        box.forEach(e => {
                            e.dataset.choosable = "true"
                            e.style.zIndex = "1000"
                        })
                    }
                })
            }
        }

        function changeTurn(ob1, ob2) {
            $(ob1).classList.add("unavalable")
            $(ob2).classList.remove("unavalable")
        }

        function findI(e) {
            return e[0] === this[0] && e[1] === this[1]
        }

        async function delete_chess(j,i, trackOn = true) {
            const chesses = $$(".chess")
            // console.log(Array.from(chesses).map(e => [Number(e.dataset.posx), Number(e.dataset.posy)]))
            const changedChess = Array.from(chesses).find(e => {
                return Number(e.dataset.posx) === j && Number(e.dataset.posy) === i
            })
            if(changedChess) {
                // console.log("changedChess: ",changedChess)
                gameState.positions.forEach((es,index) => es.forEach((e, indx)=> {
                    if(es.findIndex(findI, [j,i]) !== -1) {
                        gameState.positions[index].splice(es.findIndex(findI, [j,i]),1)
                    }
                }))
                captureSound.play()
                if(trackOn) {
                    fireSound.play()
                    const breaking_img = document.createElement("img")
                    breaking_img.setAttribute("src", changedChess.classList.contains("player") ? blue_break_img : red_break_img)
                    breaking_img.setAttribute("style", `top:${chessGrapY*i}px; left:${chessGrapX*j}px;`)
                    breaking_img.setAttribute("class", "breaking")
                    changedChess.remove()
                    let new_breaking_img = board.appendChild(breaking_img)
                    setTimeout(() => {
                        console.log("end")
                        new_breaking_img.remove();
                        console.log(Array.from($$(".breaking")).forEach(item => item.remove()))
                    }, 500);
                    return
                }
                changedChess.remove()
            }
        }

        async function add_chess([j,i], chess_type) {
            board = $(".board")
            board.innerHTML += `<div data-so="${dem}" data-posx="${j}" data-posy="${i}" style="background-color: ${chess_type === "red" ? "red" : "blue"}; top:${chessGrapY * i}px; left:${chessGrapX * j}px;" class="chess ${chess_type === "red" ? "HB_enemy" : "player"}"></div>`
            dem++
            boxes = $$(".box")
            boxes.forEach((e) => {
                e.onclick = () => {
                    if (e.dataset.choosable === "true" && selectedChess) {
                        isReady(false)
                        swap(selectedChess, e)
                        clearBox()
                        getBotmove()
                    }
                }
                e.ontouchend = () => {
                    if (e.dataset.choosable === "true" && selectedChess) {
                        isReady(false)
                        swap(selectedChess, e)
                        clearBox()
                        getBotmove()
                    }
                }
            })
            handle_event()
        }

        async function handle_action(intervention) {
            // gameState.custom_board = [
            //     [{value: ""},{value: ""},{value: ""},{value: ""},{value: ""}],
            //     [{value: ""},{value: ""},{value: ""},{value: ""},{value: ""}],
            //     [{value: ""},{value: ""},{value: ""},{value: ""},{value: ""}],
            //     [{value: ""},{value: ""},{value: ""},{value: ""},{value: ""}],
            //     [{value: ""},{value: ""},{value: ""},{value: ""},{value: ""}],
            // ]
            // gameState.outside_display = []
            custom_board = $(".custom_board")
            custom_board.innerHTML = ""

            display_outBoard = $(".display_outBoard")
            display_outBoard.innerHTML = ""
            
            let intervention_result = intervention.view_command()
            for(let item of intervention_result) {
                let { action, pos: [x,y] } = item
                switch(action) {
                    case "remove_blue" :
                        await delete_chess(Number(x),Number(y), item.trackOn)
                        break
                    case "remove_red" :
                        await delete_chess(Number(x),Number(y), item.trackOn)
                        break
                    case "insert_blue" :
                        await add_chess([x,y], "blue")
                        break
                    case "insert_red" :
                        await add_chess([x,y], "red")
                        break
                    case "set_value" :
                        if(!check_is_display_outside(x,y)) {
                            reset_custom_board(item)
                        } else {
                            // gameState.outside_display.push({
                            //     ...item
                            // })
                            reset_display_item_outside(item)
                        }
                        break
                    default:
                        break
                }
            }
        }

        function changeBoard(newBoard, removeDict, selected_pos, new_pos) {
            for(let i = 0; i < 5; i++) {
                for(let j = 0; j < 5; j++) {
                    if(curBoard[i][j] !== newBoard[i][j] && Object.keys(removeDict).length !== 0) {
                        if((curBoard[i][j] !== 0 && newBoard[i][j] === 0)) {
                            delete_chess(j,i)
                        }
                    }
                    curBoard[i][j] = newBoard[i][j];
                }
            }
            
            img_data.img.push([selected_pos[0],selected_pos[1],new_pos[0],new_pos[1], intervention.view_command()])

            intervention.action()
        
            if(gameState.positions[1].length === 0 || gameState.result === "win") {
                gameStatus.innerHTML = "You Win"
                gameStatus.style.backgroundColor = "green"
                gameStatus.style.display = "block"
                gameStatus.style.opacity = "1";
                rate_btn.style.display = "block"
            } else if(gameState.positions[0].length === 0 || gameState.result === "lost") {
                gameStatus.innerHTML = "You lost"
                gameStatus.style.backgroundColor = "red"
                gameStatus.style.opacity = "1";
                rate_btn.style.display = "block"
            } else if(gameState.positions[0].length === 1 && gameState.positions[1].length === 1) {
                gameStatus.innerHTML = "draw"
                gameStatus.style.backgroundColor = "#ccc"
                gameStatus.style.display = "block"
                gameStatus.style.opacity = "1";
                rate_btn.style.display = "block"
            }
        }

        function isReady(bol) {
            const chesses = $$(".chess")
            if (bol) {
                chesses.forEach(chess => chess.classList.remove("not_ready"))
                changeTurn(`.bot_info_${isMobile ? "mobile" : "pc"}`, `.player_info_${isMobile ? "mobile" : "pc"}`)
            } else {
                chesses.forEach(chess => chess.classList.add("not_ready"))
                changeTurn(`.player_info_${isMobile ? "mobile" : "pc"}`, `.bot_info_${isMobile ? "mobile" : "pc"}`)
            }
            ready = bol
        }

        function changePos(x, y, newX, newY) {
            const chessX = Number(x)
            const chessY = Number(y)
            const boxX = Number(newX)
            const boxY = Number(newY)
            let path = gameState.board[chessY][chessX]
            gameState.board[chessY][chessX] = gameState.board[boxY][boxX]
            gameState.board[boxY][boxX] = path
        }

        function handle_canvas(chess,color) {
            let r = [2,1.5,2,2.5,2]
            cv2.beginPath()
            cv2.arc(chess.dataset.posx * (boardValue.width / 4) + radius + 5, chess.dataset.posy * (boardValue.height / 4) + radius + 5, radius, 0, 2 * Math.PI);
            cv2.lineWidth = 5;
            cv2.fillStyle = color
            cv2.fill()
            cv2.strokeStyle = color;
            cv2.stroke();
        }

        async function swap(chess, box, newPos, selected_pos) {
            let valid_remove
            cv2.clearRect(0, 0, canvas.width, canvas.height);
            moveSound.play()
            let preBoard = curBoard.map(row => row.map(item => item))
            let removeDict = {};
            gameState.move_counter += 1
            const chesses = $$(".chess")
            if(box) {
                handle_canvas(chess, "rgba(87, 125, 255, 0.6)")

                chess.style.left = box.offsetLeft + "px"
                chess.style.top = box.offsetTop + "px"
        
                newPos = [Number(box.dataset.posx), Number(box.dataset.posy)]
                selected_pos = [Number(chess.dataset.posx),Number(chess.dataset.posy)]

                gameState.move = {
                    selected_pos: selected_pos,
                    new_pos: newPos,
                }
                
                changePos(chess.dataset.posx,chess.dataset.posy, box.dataset.posx, box.dataset.posy)
                gameState.positions[0][gameState.positions[0].findIndex(findI, [Number(chess.dataset.posx), Number(chess.dataset.posy)])] = [Number(box.dataset.posx), Number(box.dataset.posy)]
                let opp_pos = gameState.positions[1]
                valid_remove = [...ganh_chet(gameState,[Number(box.dataset.posx), Number(box.dataset.posy)], opp_pos, 1, -1), ...vay(gameState, opp_pos)]
                if(valid_remove.length > 0) valid_remove.forEach(item => intervention.remove_red(...item))
                
                move_list.push({
                    your_pos: [...gameState.positions[0]],
                    opp_pos: [...gameState.positions[1]],
                    board: preBoard,
                    side: 1,
                    remove: valid_remove,
                    move: {
                        selected_pos: selected_pos,
                        new_pos: newPos,
                    }
                })

                valid_remove.forEach(i => {
                    removeDict[i.join(',')] = "remove_red";
                });
                
                chess.dataset.posx = box.dataset.posx
                chess.dataset.posy = box.dataset.posy

                if(game_info && game_info.title) {
                    window.breakRule(gameState, intervention, global_var, local_var)
                }
                await handle_action(intervention)

                gameState.current_turn = -1
            } else {
                handle_canvas(chess, "rgba(252, 102, 102, 0.6)")

                gameState.move = {
                    selected_pos: selected_pos,
                    new_pos: newPos,
                }
                
                changePos(selected_pos[0], selected_pos[1], newPos[0], newPos[1])
                gameState.positions[1][gameState.positions[1].findIndex(findI, [selected_pos[0], selected_pos[1]])] = [newPos[0], newPos[1]]
                let opp_pos = gameState.positions[0]
                valid_remove = [...ganh_chet(gameState, [newPos[0], newPos[1]], opp_pos, -1, 1), ...vay(gameState, opp_pos)]
                if(valid_remove.length > 0) valid_remove.forEach(item => intervention.remove_blue(...item))

                // console.log(JSON.parse(JSON.stringify(gameState.board)))
        
                move_list.push({
                    your_pos: [...gameState.positions[0]],
                    opp_pos: [...gameState.positions[1]],
                    board: preBoard,
                    side: -1,
                    remove: valid_remove,
                    move: {
                        selected_pos: selected_pos,
                        new_pos: newPos,
                    }
                })
                valid_remove.forEach(i => {
                    removeDict[i.join(',')] = "remove_blue";
                });
        
                chess.style.left = newPos[0] * chessGrapX + "px"
                chess.style.top = newPos[1] * chessGrapX + "px"
                chess.dataset.posx  = `${newPos[0]}`
                chess.dataset.posy = `${newPos[1]}`

                if(game_info && game_info.title) {
                    window.breakRule(gameState, intervention, global_var, local_var)
                }
                await handle_action(intervention)

                isReady(true)
                gameState.current_turn = 1
            }
            changeBoard(gameState.board, removeDict, selected_pos, newPos)
        }

        function clearBox() {
            boxes.forEach(box => {
                box.dataset.choosable = "false"
                box.style.zIndex = "0"
            })
        }

        function getBotmove() {
            setTimeout(() => {
                if (gameState.positions[1].length <= 0 || gameState.positions[0].length <= 0) return
                chessEnemy = $$(".chess.HB_enemy")
                let data = {
                    your_pos: [],
                    your_side: -1,
                    opp_pos: [],
                    board: gameState.board,
                    global_var: global_var
                }

                gameState.board.forEach((row, i) => {
                    row.forEach((__, j) => {
                        if (gameState.board[i][j] === 1) data.your_pos.push([j, i])
                        if (gameState.board[i][j] === -1) data.opp_pos.push([j, i])
                    })
                })

                fetch("http://192.168.1.249:8080/get_pos_of_playing_chess", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        data: data,
                        choosen_bot: choosen_bot,
                        type: choosen_bot === "you" ? "you" : "bot",
                        user_bot_code: choosen_bot === "you" ? selected_user_bot.code : "",
                        enemy_code: gamemode_bot[choosen_bot],
                        gamemode: game_info && game_info.title ? game_info.title : "normal",
                        game_data: {
                            gameState,
                            global_var,
                            local_var: {
                                ...local_var.data,
                                updated: true
                            }
                        }
                    }),
                })
                    .then(res => res.json(data))
                    .then(resData => {
                        const { selected_pos, new_pos } = resData
                        const selectedChess = Array.from(chessEnemy).find(e => {
                            return Number(e.dataset.posx) === selected_pos[0] && Number(e.dataset.posy) === selected_pos[1]
                        })
                        swap(selectedChess, null, new_pos, selected_pos)
                    })
            }, 1000)
        }

        boxes.forEach((e) => {
            e.onclick = () => {
                if (e.dataset.choosable === "true" && selectedChess) {
                    isReady(false)
                    swap(selectedChess, e)
                    clearBox()
                    getBotmove()
                }
            }
            e.ontouchend = () => {
                if (e.dataset.choosable === "true" && selectedChess) {
                    isReady(false)
                    swap(selectedChess, e)
                    clearBox()
                    getBotmove()
                }
            }
        })

        function handle_event() {
            const chess = $$(".chess.player")
    
            chess.forEach(e => {
                e.onclick = () => { getPos(e); cv2.clearRect(0, 0, canvas.width, canvas.height);}
                e.ontouchend = () => { getPos(e); cv2.clearRect(0, 0, canvas.width, canvas.height); }
            });
        }
        handle_event()

        window.onresize = function (event) {
            if (window.outerWidth <= 600) {
                rs = 0.5
                radius = 8
            } else {
                rs = 1
                radius = 16
            }
            resetBoard()
            boxes = $$(".box")
            boxes.forEach((e) => {
                e.onclick = () => {
                    if (e.dataset.choosable === "true" && selectedChess) {
                        isReady(false)
                        swap(selectedChess, e)
                        clearBox()
                        getBotmove()
                    }
                }
                e.ontouchend = () => {
                    if (e.dataset.choosable === "true" && selectedChess) {
                        isReady(false)
                        swap(selectedChess, e)
                        clearBox()
                        getBotmove()
                    }
                }
            })

            handle_event()
        }

        window.onload= (event) => {
            if (window.outerWidth <= 500) {
                rs = 0.5
                radius = 8
            } else {
                rs = 1
                radius = 16
            }
            resetBoard()
            boxes = $$(".box")
            boxes.forEach((e) => {
                e.onclick = () => {
                    if (e.dataset.choosable === "true" && selectedChess) {
                        isReady(false)
                        swap(selectedChess, e)
                        clearBox()
                        getBotmove()
                    }
                }
                e.ontouchend = () => {
                    if (e.dataset.choosable === "true" && selectedChess) {
                        isReady(false)
                        swap(selectedChess, e)
                        clearBox()
                        getBotmove()
                    }
                }
            })

            handle_event()
        }
    }, [game_info, username, reload, selected_user_bot])

    return (
        <div className={`h-screen relative flex ${isMobile && "flex-col"} justify-around items-center overflow-hidden`}>
            <div className="game_state pc">
                <div className="game_turn game_turn-bot relative">
                    <div className="bot_avatar_pc min-w-20">
                        <img src={Master} alt="" />
                    </div>
                    <div className="game_turn_info bot_info_pc dark:bg-[#ff00004d] bg-red-500 dark:text-[red] text-white unavalable w-48">
                        <div className="bot_info_name_pc overflow-hidden whitespace-nowrap text-ellipsis w-full">Master</div>
                    </div>
                    {user.id &&
                        <>
                        {user_bots.length > 0 && <i onClick={() => set_is_open_bot_list(!is_open_bot_list)} class="absolute bottom-0 right-0 fa-solid fa-repeat ml-auto mr-2 text-3xl cursor-pointer select-none hover:text-slate-300"></i>}
                        {is_open_bot_list &&
                            <ul className="absolute w-full h-64 dark:bg-slate-700 bg-slate-300 right-0 top-full p-2 rounded-md cursor-pointer select-none overflow-y-scroll">
                            {user_bots.length > 0 && user_bots.map(bot =>
                                <li onClick={() => set_selected_user_bot(bot)} className={`flex items-center dark:hover:bg-slate-800 hover:bg-slate-200 px-2 py-1 rounded-md ${bot.bot_name === selected_user_bot.bot_name ? "dark:bg-slate-900 bg-slate-100" : ""}`}>
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-3xl bg-white text-[#007BFF] font-bold pb-2">{bot.bot_name[0]}</div>
                                <div className="ml-2">
                                <div className="">
                                    {bot.bot_name}
                                </div>
                                <div className="">{bot.elo}</div>
                                </div>
                            </li>
                            )}

                            </ul>
                        }
                        </>
                    }
                </div>
                <div className="game_turn game_turn-player">
                    <div className="player_avatar min-w-20">{(username && username[0].toUpperCase()) || "C"}</div>
                    <div className="game_turn_info player_info_pc dark:bg-[#007bff4d] bg-blue-500 dark:text-[#007BFF] text-white">
                        <div className="player_info_name overflow-hidden whitespace-nowrap text-ellipsis w-full">{username || "Coganh"}</div>
                    </div>
                </div>
            </div>
            <div className="game_turn game_turn-bot mobile_active relative">
                <div className="bot_avatar_mobile ">
                    <img src={Master} alt="" />
                </div>
                <div className="game_turn_info bot_info_mobile dark:bg-[#ff00004d] bg-red-500 dark:text-[red] text-white unavalable w-48">
                    {/* <div class="bot_title">DEFEATED</div> */}
                    <div className="bot_info_name_mobile">Master</div>
                </div>
                {user.id &&
                        <>
                        {user_bots.length > 0 && <i onClick={() => set_is_open_bot_list(!is_open_bot_list)} class="absolute bottom-0 right-0 fa-solid fa-repeat ml-auto mr-2 text-xl cursor-pointer select-none hover:text-slate-300"></i>}
                        {is_open_bot_list &&
                            <ul className="absolute w-full h-96 dark:bg-slate-700 bg-slate-300 right-0 top-full p-2 rounded-md cursor-pointer select-none overflow-y-scroll z-[100000]">
                            {user_bots.length > 0 && user_bots.map(bot =>
                                <li onClick={() => set_selected_user_bot(bot)} className={`flex items-center dark:hover:bg-slate-800 hover:bg-slate-200 px-2 py-1 rounded-md ${bot.bot_name === selected_user_bot.bot_name ? "dark:bg-slate-900 bg-slate-100" : ""}`}>
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-3xl bg-white text-[#007BFF] font-bold pb-2">{bot.bot_name[0]}</div>
                                <div className="ml-2">
                                <div className="text-base">
                                    {bot.bot_name}
                                </div>
                                <div className="">{bot.elo}</div>
                                </div>
                            </li>
                            )}

                            </ul>
                        }
                        </>
                    }
            </div>
            <div className="relative">
                <div style={{width: `100%`, height: `100%`}} class="display_outBoard emoji-text absolute top-0 z-[10000] pointer-events-none grid grid-cols-5 grid-flow-row text-5xl select-none"></div>
                <div style={{width: `100%`, height: `100%`}} class="custom_board emoji-text absolute top-0 z-[10000] pointer-events-none grid grid-cols-5 grid-flow-row text-5xl select-none"></div>
                <div className="board"/>
                <canvas className="z-[10000]"/>
            </div>
            <div className="game_turn game_turn-player mobile_active">
                <div className="player_avatar">{(username && username[0].toUpperCase()) || "C"}</div>
                <div className="game_turn_info player_info_mobile dark:bg-[#007bff4d] bg-blue-500 dark:text-[#007BFF] text-white">
                    <div className="player_info_name">{username || "Coganh"}</div>
                </div>
            </div>
            { is_open_rate_modal.is_open && <CreateRateModel data={rate} is_loading={is_open_rate_modal.is_loading}/>}
            <input
                type="checkbox"
                name=""
                id="open_game_result"
                hidden
                style={{ position: "fixed" }}
            />
            <div className="game_result">
                <label htmlFor="open_game_result" className="game_result_nav">
                    <i className="fa-solid fa-angles-up arrow_up" />
                    <i className="fa-solid fa-angles-down arrow_down" />
                </label>
                <div className="HB_game_status text-white dark:bg-[#007BFF] bg-[#2997ff]">Game on...</div>
                <a onClick={() => history("/menu")} className={` dark:bg-[#111c2c] bg-[#0062d9] ${isMobile ? "HB_menu_btn" : "fixed top-5 left-5 HB_menu_btn"}`}>
                    Menu
                </a>
                <div className="rate_btn hidden dark:bg-[#111c2c] bg-[#0062d9] text-white">Xem đánh giá</div>
                <div className="play_again_btn dark:bg-[#111c2c] bg-[#0062d9] text-white">Play again</div>
            </div>
            <div className="overflow">
                <div className="choose_bot_model dark:bg-[#242527] bg-[#a3dcff] lg:scale-100 sm:scale-50 z-[10000]">
                    <div className="choose_bot_model-title">Chọn bot</div>
                    <div className="bot_list">
                        {game_info && game_info.title && game_info.bots.length > 0 ? game_info.bots.map(bot =>
                            <div data-level={bot.name} className="bot_item h-auto level4">
                                <img className="" src={bot.avatar} alt="" />
                                <div className="bot_item_title level4">{bot.name}</div>
                            </div>
                        )
                        :
                        <>
                            <div className="bot_list_block">
                                <div data-level="level1" className="bot_item h-auto level1">
                                    <img className="" src={level1} alt="" />
                                    <div className="bot_item_title level1">level 1</div>
                                </div>
                                <div data-level="level2" className="bot_item h-auto level2">
                                    <img className="" src={level2} alt="" />
                                    <div className="bot_item_title level2">level 2</div>
                                </div>
                                <div data-level="level3" className="bot_item h-auto level3">
                                    <img className="" src={level3} alt="" />
                                    <div className="bot_item_title level3">level 3</div>
                                </div>
                            </div>
                            <div className="bot_list_block">
                                <div data-level="level4" className="bot_item h-auto level4">
                                    <img className="" src={level4} alt="" />
                                    <div className="bot_item_title level4">level 4</div>
                                </div>
                                <div data-level="Master" className="bot_item h-auto Master">
                                    <img className="" src={Master} alt="" />
                                    <div className="bot_item_title Master">MASTER</div>
                                </div>
                            </div>
                        </>
                        }
                        {user.id &&
                        <div className="bot_list_block">
                            <div data-level="you" className="bot_item h-auto level3">
                                <img className="" src={logo} alt="" />
                                <div className="bot_item_title level3">Your Bot</div>
                            </div>
                        </div>
                        }
                    </div>
                    <div className="fight_btn border dark:border-[#ccc] border-[#333]">Thách đấu</div>
                </div>
            </div>
            {/* <img className="fire" src={fire_webp} alt="" hidden/> */}
            <audio
                className="capture_sound"
                src={capture_audio}
            />
            <audio
                className="move_sound"
                src={move_audio}
            />
            <audio
                className="fire_sound"
                src={break_sound}
            />
        </div>

    )
}
