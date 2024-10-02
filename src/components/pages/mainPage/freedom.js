import React, { useContext, useEffect, useRef, useState } from 'react'
import Board_modal from '../../modal/board_modal'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import chess_rule from "../../../uti/chess_rule"

import Piece from '../../modal/freedom_modal/Piece';
import BoardSquare from '../../modal/freedom_modal/BoardSquare';
import AceEditor from "react-ace";
import DropArea from '../../modal/freedom_modal/drop_area';

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/webpack-resolver";
import Loading from '../../modal/loading';
import Spining from '../../modal/spining';
import { json } from 'd3';
import { AppContext } from '../../../context/appContext';
import Bot_list from '../../modal/freedom_modal/bot_list';
import { stringify } from 'postcss';
import Hight_light from '../../modal/freedom_modal/hight_light';
import { type } from '@testing-library/user-event/dist/type';

import break_sound from "../../../static/breaking_glass.mp3"

const initialPieces = [
  { id: '0', position: null, side: 0 },
  { id: '1', position: null, side: 0 },
  { id: '2', position: null, side: 0 },
  { id: '3', position: null, side: 0 },
  { id: '4', position: null, side: 0 },
  { id: '5', position: null, side: 0 },
  { id: '6', position: null, side: 0 },
  { id: '7', position: null, side: 0 },
  { id: '8', position: null, side: 1 },
  { id: '9', position: null, side: 1 },
  { id: '10', position: null, side: 1 },
  { id: '11', position: null, side: 1 },
  { id: '12', position: null, side: 1 },
  { id: '13', position: null, side: 1 },
  { id: '14', position: null, side: 1 },
  { id: '15', position: null, side: 1 },
];

var gameState = {
  current_turn: 1,
  board: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ],
  positions: [
    [],
    []
  ],
  move: {
    selected_pos: [],
    new_pos: []
  },
  move_counter: 0,
  result: null,
  id: 0
}

const { ganh_chet, vay } = chess_rule

export default function Freedom() {
  const { history } = useContext(AppContext)

  const [pieces, setPieces] = useState(initialPieces);
  const [reload, set_reload] = useState(0)
  const [is_open_gameState, set_is_open_gameState] = useState(false)
  const [is_open_chess_place, set_is_open_chess_place] = useState(false)
  const [error, set_error] = useState({
    is_err: false,
    content: "",
    type: "",
    is_open: false,
  })
  const [bot, set_bot] = useState("level1")
  const [hight_light, set_hight_light] = useState([...Array(49).fill(0).map((item, id) => ({id: id, is_HL: false}))])
  const [remove_animaiton, set_remove_animaiton] = useState([...Array(49).fill(0).map((item, id) => ({id: id, is_removed_animating: false, side: 0}))])

  const [codes, set_codes] = useState([
    {
      code: `def main(player):
    return {"selected_pos": (2,2), "new_pos": (3,3)}`,
      is_open: false,
      id: 0,
      move: {
        selected_pos: [],
        new_pos: []
      },
      is_loading: false,
      game_state: JSON.parse(JSON.stringify(gameState)),
      pieces: JSON.parse(JSON.stringify(initialPieces)),
    }
  ])

  const next_move_btn_ref = useRef(null)

  const break_sound_ref = useRef(null)
  if(break_sound_ref.current) {
    break_sound_ref.volume = 1
  }


  function handle_remove(valid_remove, side) {
    let pre_gameBoard = JSON.parse(JSON.stringify(gameState.board))
    set_remove_animaiton(pre => {
      for(let i = 0; i < pre.length; i++) {
        for(let pos of valid_remove) {
          const [x,y] = pos
          let id = (y + 1) * 7 + x + 1
          if(pre[i].id === id) {
            pre[i].is_removed_animating = true
            pre[i].side = pre_gameBoard[y][x]
          }
        }
      }
      return pre
    })
    
    for(let pos of valid_remove) {
      const [x,y] = pos
      gameState.board[y][x] = 0
      gameState.positions[Math.abs(side - 1)] = gameState.positions[Math.abs(side - 1)].filter(item => item[0] !== x && item[1] !== y)
    }
    if(valid_remove.length > 0) {
      break_sound_ref.current.play()
    }
  }

  function handle_move({selected_pos, new_pos}, side) {
    const [x, y] = selected_pos
    const [new_x, new_y] = new_pos
    if(new_x < 0 || new_x > 4 || new_y < 0 || new_y > 4) return
    gameState.board[y][x] = 0
    gameState.board[new_y][new_x] = side
    gameState.move = {
      selected_pos: [x, y],
      new_pos: [new_x, new_y],
    }
    console.log(gameState.move)
  }

  function handle_show_pre_pos(pos) {
    if(pos && pos[0] && pos[1]) {
      
    }
  }
  function handle_show_new_pos(pos) {
    if(pos && pos[0] && pos[1]) {
      
    }
  }

  function handle_clear_hight_light() {
    set_hight_light([...Array(49).fill(0).map((item, id) => ({id: id, is_HL: false}))])
    set_remove_animaiton([...Array(49).fill(0).map((item, id) => ({id: id, is_removed_animating: false, side: 0}))])
  }

  function handle_hight_light(selected_pos, new_pos, valid_remove) {
    let is_v_SP = false
    let is_v_NP = false
    let SP_id = null
    let NP_id = null

    if(Array.isArray(selected_pos) && selected_pos.length === 2) {
      is_v_SP = true
      SP_id = (selected_pos[1] + 1) * 7 + selected_pos[0] + 1
    }
    if(Array.isArray(new_pos) && new_pos.length === 2) {
      is_v_NP = true
      NP_id = (new_pos[1] + 1) * 7 + new_pos[0] + 1
    }

    set_hight_light(pre => {
      if(is_v_SP) {
        pre[SP_id].is_HL = true
      }
      if(is_v_NP) {
        pre[NP_id].is_HL = true
      }
      return pre.map((item, i) => {
        if(i !== SP_id && i !== NP_id) {
          item.is_HL = false
        }
        return item
      })
    })
  }

  const handleDrop = (pieceId, positionId, pos) => {
    setPieces((prevPieces) => {
      return prevPieces.map((piece) => {
        if (piece.id === pieceId && JSON.stringify(piece.pos) !== JSON.stringify(pos)) {
          if (positionId === null && piece.pos && piece.pos.length > 0) {
            gameState.board[piece.pos[1]][piece.pos[0]] = 0
            return { ...piece, position: positionId, pos: pos }
          } else if (positionId === null && (!piece.pos || piece.pos.length === 0)) {
            return { ...piece, position: positionId, pos: pos }
          }
          if (pos && piece.pos && JSON.stringify(piece.pos) !== JSON.stringify(pos)) {
            gameState.move.selected_pos = piece.pos
            gameState.move.new_pos = pos
          }
          let is_has_chess = gameState.board[pos[1]][pos[0]] === 0
          gameState.board[pos[1]][pos[0]] = piece.side === 1 ? 1 : piece.side === 0 ? -1 : 0
          if (piece.pos > 0) {
            gameState.board[piece.pos[1]][piece.pos[0]] = 0
          }
          return is_has_chess ? { ...piece, position: positionId, pos: pos } : piece
        }
        return piece
      })
    });
  };

  useEffect(() => {
    gameState.positions = [[], []]
    pieces.forEach(({ side, pos }, i) => {
      if (side === 1 && pos) {
        gameState.positions[1].push(pos)
      } else if (side === 0 && pos) {
        gameState.positions[0].push(pos)
      }
    })
    set_reload(Math.random())
  }, [pieces])

  function check_err() {
    if(error.is_err) {
      set_error({
        is_open: true,
        is_err: true,
        content: "there is an error in the previous move, please fix it",
        type: "ST"
      })
      return true
    }
    return false
  }

  function run_code(code, id) {
    if(check_err()) return
    // view_gameState(id)
    setTimeout(() => {
      fetch(`http://127.0.0.1:8080/run_freedom_code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            code: code.replaceAll('\r', ''),
            game_state: gameState
        }),
      })
      .then(res => res.json())
      .then(data => {
        // if(data.is_err) return
        if(data.is_err || data.err) {
          set_error({
            is_open: true,
            is_err: true,
            content: data.err,
            type: data.err.type
          })
        }
        if(data.move) {
          let {selected_pos, new_pos} = data.move
          let pre_gameState = JSON.parse(JSON.stringify(gameState))
          if(selected_pos[0] < -1) selected_pos[0] = -1
          if(selected_pos[1] < -1) selected_pos[1] = -1
          if(new_pos[0] < -1) new_pos[0] = -1
          if(new_pos[1] < -1) new_pos[1] = -1
          let positionId = (new_pos[1] + 1) * 7 + new_pos[0] + 1
          let selected_piece = pieces.find(piece => JSON.stringify(piece.pos) === JSON.stringify(selected_pos))
          if(!Number.isInteger(selected_pos[0] + selected_pos[1]) || !Number.isInteger(new_pos[0] + new_pos[1])) return
          handle_hight_light(selected_pos, new_pos)

          if(selected_piece) {
            if(gameState.board[new_pos[1]][new_pos[0]] !== 0) return
            let valid_remove = [...ganh_chet(gameState,[new_pos[0], new_pos[1]], gameState.positions[selected_piece.side === 1 ? 0 : 1], selected_piece.side === 1 ? 1 : -1, selected_piece.side === 1 ? -1 : 1), ...vay(gameState, gameState.positions[selected_piece.side === 1 ? 0 : 1])]
            if(!data.is_err) {
              handle_move(data.move, selected_piece.side === 1 ? 1 : selected_piece.side === 0 ? -1 : 0)
              handle_remove(valid_remove, selected_piece.side)
            }
  
            setPieces((prevPieces) => {
              return prevPieces.map((piece) => {
                if(piece.pos && valid_remove.some(pos => pos[0] === piece.pos[0] && pos[1] === piece.pos[1])) {
                  return { ...piece, position: null, pos: [] }
                }
                return JSON.stringify(piece.pos) === JSON.stringify(selected_pos) ? { ...piece, position: positionId, pos: new_pos } : piece
              })
            });
            set_codes(pre => {
              pre[id].pieces = JSON.parse(JSON.stringify(pieces))
              pre[id].game_state = JSON.parse(JSON.stringify(pre_gameState))
              pre[id].move = {
                selected_pos: selected_pos,
                new_pos: new_pos,
              }
              pre[id].is_loading = false
              return pre
            })
            console.log(data.print_oup)
            if(!(data.is_err || data.err)) {
              set_error({
                is_open: true,
                is_err: false,
                content: data.print_oup,
                type: ""
              })
            }
          }

        }
      })
    }, 1000)
  }

  function get_pos() {
    if(check_err()) return
    let data = {
      your_pos: gameState.positions[1],
      your_side: -1,
      opp_pos: gameState.positions[0],
      board: gameState.board,
    }
    fetch("http://127.0.0.1:8080/get_pos_of_playing_chess", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          data: data,
          choosen_bot: bot,
          type: "bot",
          gamemode: "normal",
      }),
  })
      .then(res => res.json())
      .then(resData => {
          let { selected_pos, new_pos } = resData
          if(!selected_pos) return
          let positionId = (new_pos[1] + 1) * 7 + new_pos[0] + 1
          let selected_piece = pieces.find(piece => JSON.stringify(piece.pos) === JSON.stringify(selected_pos))

          let valid_remove = [...ganh_chet(gameState,[new_pos[0], new_pos[1]], gameState.positions[1], -1, 1), ...vay(gameState, gameState.positions[1])]
          handle_remove(valid_remove, selected_piece.side)
          handle_move(resData, selected_piece.side === 1 ? 1 : selected_piece.side === 0 ? -1 : 0)

          setPieces((prevPieces) => {
            return prevPieces.map((piece) => {
              if(piece.pos && valid_remove.some(pos => pos[0] === piece.pos[0] && pos[1] === piece.pos[1])) {
                return { ...piece, position: null, pos: new_pos }
              }

              return JSON.stringify(piece.pos) === JSON.stringify(selected_pos) ? { ...piece, position: positionId, pos: new_pos } : piece
            })
          });
          set_codes(pre => {
            pre[gameState.id].pieces = JSON.parse(JSON.stringify(pieces))
            pre[gameState.id].game_state = JSON.parse(JSON.stringify(gameState))
            pre[gameState.id].move = {
              selected_pos: selected_pos,
              new_pos: new_pos,
            }
            pre[gameState.id].is_loading = false
            return pre
          })
          handle_hight_light(selected_pos, new_pos)
      })
  }

  function move_bot() {
    get_pos()
  }

  useEffect(() => {
    next_move_btn_ref.current.onclick = () => {
      let new_gameState = JSON.parse(JSON.stringify(gameState))
      new_gameState.id = codes[codes.length-1] + 1
      set_codes(pre => [...pre, 
      {
        code: codes[codes.length - 1].code,
        is_open: true,
        id: codes[codes.length - 1].id + 1,
        move: {
          selected_pos: [],
          new_pos: []
        },
        is_loading: false,
        game_state: new_gameState,
        pieces: JSON.parse(JSON.stringify(pieces)),
      }])
      document.querySelector(`.FD_code_list`).scrollTop = 1000000000
    }
  }, [codes, pieces])

  function view_gameState(id) {
    // if(id === 0 && codes.length <= 1) {
    //   // codes[id].game_state = gameState
    //   // codes[id].pieces = pieces
    //   console.log(codes[id].pieces)
    // }
    gameState = JSON.parse(JSON.stringify(codes[id].game_state))
    console.log(gameState)
    gameState.id = id
    setPieces(codes[id].pieces);
    handle_clear_hight_light()
    set_error(pre => ({...pre, is_err: false}))
  }

  function run_gameState(id) {
    run_code(codes[id].code, id)
  }

  return (
    <div className="w-full h-screen flex overflow-hidden">
      <DndProvider backend={HTML5Backend}>
        <div className="relative w-[60%] h-full bg-slate-700 grid overflow-hidden">
          <div className="absolute z-[100] top-4 left-1/2 -translate-x-1/2">
            <Bot_list bot={bot} set_bot={set_bot} move_bot={move_bot}/>
            <div></div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white">
            <Board_modal />
            <div className="top-[-25%] left-[-25%] absolute w-[175%] h-[175%] grid grid-cols-7 grid-flow-row">
              {[...Array(49).keys()].map((i) => (
                <BoardSquare key={i} id={i} pos={[i % 7 - 1, Math.floor(i / 7) - 1]} onDrop={handleDrop}>
                  {pieces.find((piece) => piece.position === i) && (
                    <Piece
                      side={pieces.find((piece) => piece.position === i).side}
                      id={pieces.find((piece) => piece.position === i).id}
                      pos={pieces.find((piece) => piece.position === i).pos}
                    >
                      {pieces.find((piece) => piece.position === i).id}
                    </Piece>
                  )}
                </BoardSquare>
              ))}
            </div>
            <div className="top-[-25%] left-[-25%] absolute w-[175%] h-[175%] grid grid-cols-7 grid-flow-row select-none pointer-events-none">
              {[...Array(49).keys()].map((i) => <Hight_light key={i} id={i} hight_light={hight_light[i]} remove_animaiton={remove_animaiton[i]}/>)}
            </div>
          </div>
          <div className={`absolute w-[200px] h-[20%] top-0 ${is_open_chess_place ? "right-0" : "right-[-200px]"} transition-all`}>
            <div onClick={() => set_is_open_chess_place(!is_open_chess_place)} className="absolute top-0 left-[-40px] w-[40px] bg-black text-center py-2 pointing_event_br-90">
              {is_open_chess_place ?
                <i class="fa-solid fa-angles-right"></i>
                :
                <i class="fa-solid fa-angles-left"></i>
              }
            </div>
            <DropArea onDrop={handleDrop}>
              {pieces
                .filter((piece) => piece.position === null)
                .map((piece) => (
                  <Piece
                    key={piece.id}
                    id={piece.id}
                    side={pieces.find((item) => item.id === piece.id).side}
                    is_stored={true}
                  >
                  </Piece>
                ))}
            </DropArea>
          </div>
          <div className={`absolute top-[20%] h-[80%] w-[200px] bg-slate-500 py-4 px-2 ${is_open_gameState ? "right-0" : "right-[-200px]"} transition-all`}>
            <div onClick={() => set_is_open_gameState(!is_open_gameState)} className="absolute top-0 left-[-40px] w-[40px] bg-black text-center py-2 pointing_event_br-90">
              {is_open_gameState ?
                <i class="fa-solid fa-angles-right"></i>
                :
                <i class="fa-solid fa-angles-left"></i>
              }
            </div>
            <div className="overflow-y-scroll max-h-full">
              <p className="text-xl font-bold">BOARD</p>
              <div className="w-[150px] h-[150px] flex flex-wrap justify-center items-center border border-white rounded-md">
                {gameState.board.map(row => row.map((chess) =>
                  <div className="w-1/5 text-center">{chess}</div>
                ))}
              </div>
              <div>
                <p className="text-xl font-bold mt-2">Enemy CHESS</p>
                <ul className="p-0 m-0 flex flex-wrap">
                  {gameState.positions[0].map((pos) =>
                    <li className="list-none px-2 py-1 bg-red-500 w-fit rounded mr-1 mb-1 pointing_event_br-90">({pos[1]},{pos[0]})</li>
                  )}
                </ul>
                <p className="text-xl font-bold mt-2">PLAYER CHESS</p>
                <ul className="p-0 m-0 flex flex-wrap">
                  {gameState.positions[1].map((pos) =>
                    <li className="list-none px-2 py-1 bg-blue-600 w-fit rounded mr-1 mb-1 pointing_event_br-90">({pos[1]},{pos[0]})</li>
                  )}
                </ul>
              </div>
              <p className="text-xl font-bold mt-2">MOVE</p>
              <div className="flex w-full justify-between text-xl">
                {console.log(gameState)}
                <div className="list-none px-2 py-1 bg-slate-600 w-fit rounded mr-1 mb-1 pointing_event_br-90">({gameState.move.selected_pos[0]},{gameState.move.selected_pos[1]})</div>
                <div className="list-none px-2 py-1 bg-slate-600 w-fit rounded mr-1 mb-1 pointing_event_br-90"><i class="fa-solid fa-right-long"></i></div>
                <div className="list-none px-2 py-1 bg-slate-600 w-fit rounded mr-1 mb-1 pointing_event_br-90">({gameState.move.new_pos[0]},{gameState.move.new_pos[1]})</div>
              </div>
              <p className="text-xl font-bold mt-2">MOVE COUNTER</p>
              <p className="text-xl font-bold">{gameState.move_counter}</p>
              <p className="text-xl font-bold mt-2">RESULT</p>
              <div className="w-full text-center">
                <div className="px-10 py-3 bg-blue-500 rounded text-2xl font-bold">WIN</div>
              </div>
            </div>
          </div>
          <div className={`absolute bottom-0 h-[200px] w-[50%] opacity-85 ${error.is_open ? "bottom-0" : "bottom-[-200px]"} ${error.is_err ? "bg-red-400" : "bg-blue-400"} transition-all`}>
            <div onClick={() => set_error(pre => ({...pre, is_open: !error.is_open}))} className={`absolute top-[-40px] w-[40px] ${error.is_err ? "bg-red-600" : "bg-blue-600"} text-center py-2 pointing_event_br-90`}>
              {error.is_open ?
                <i class="fa-solid fa-angles-down"></i>
                :
                <i class="fa-solid fa-angles-up"></i>
              }
            </div>
            <div className="w-full h-full p-4 overflow-y-scroll">
              {error.content}
            </div>
          </div>
        </div>
      </DndProvider>
      <div className="w-[40%] h-full bg-slate-500">
        <div className="w-full px-2 py-1 bg-slate-600 flex">
          <div onClick={() => history("/menu")} className="px-2 bg-black grid place-content-center rounded pointing_event_br-90">Menu</div>
          <div ref={next_move_btn_ref} className="ml-auto text-lg py-[2px] px-2 bg-blue-500 w-fit rounded pointing_event_br-90">
            Next move
          </div>
        </div>
        <div className="w-full h-full">
          <ul className="FD_code_list w-full h-full p-0 m-0 overflow-y-scroll">
            {codes.map((item, i) =>
              <li id={item.id} className={`${!item.is_open ? "h-12 opacity-50" : `${i < codes.length - 1 ? "h-[300px]" : "h-full"}`} relative list-none transition-all z-[${item.id}] mb-7`}>
                <div className="w-full bg-black px-2 flex items-center">
                  <p>{item.id}</p>
                  <i onClick={() => set_codes(pre => {
                    pre[item.id].is_open = !item.is_open
                    return [...pre]
                  })} class={`fa-solid fa-caret-right text-xl pointing_event_br-90 ml-2 ${!item.is_open ? "" : "rotate-90"} transition-all`}></i>
                  {item.is_loading && 
                  <div className="w-4 h-4 ml-4">
                    <Spining loading_w="8px"/>
                  </div>
                  }
                  <div className="flex items-center mx-auto text-lg">
                    {item.move.selected_pos[0] &&
                      <>
                        <p>( {item.move.selected_pos[0] + " , " + item.move.selected_pos[1]} )</p>
                        <div className="px-2 rounded mx-4"><i class="fa-solid fa-right-long"></i></div>
                        <p>( {item.move.new_pos[0] + " , " + item.move.new_pos[1]} )</p>
                      </>
                    }
                    <div className="absolute right-[6px] flex leading-[1.4rem] font-semibold">
                      <div onClick={() => view_gameState(item.id)} className="px-2 bg-slate-400 mr-4 pointing_event_br-105 rounded-sm">view</div>
                      <div onClick={() => {
                        if(error.is_err) {
                          view_gameState(item.id)
                        } else {
                          run_gameState(item.id)
                        }
                      }} className={`px-2 ${error.is_err ? "bg-red-500" : "bg-blue-500"} pointing_event_br-105 rounded-sm ${gameState.id !== item.id && "opacity-0 pointer-events-none"}`}>{error.is_err ? "fix" : "run"}</div>
                    </div>
                  </div>
                </div>
                <div className="overflow-hidden h-full">
                  <AceEditor
                    value={item.code}
                    onChange={(e) => set_codes(pre => {
                      pre[item.id].code = e
                      return [...pre]
                    })}
                    mode="python"
                    theme="dracula"
                    name={item.id}
                    editorProps={{ $blockScrolling: true }}
                    setOptions={{
                      enableBasicAutocompletion: true,
                      enableLiveAutocompletion: true,
                      autoScrollEditorIntoView: true,
                    }}
                    readOnly={!item.is_open}
                    width='100%'
                    height='100%'
                    className=""
                    fontSize={15}
                  />
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
      <audio
        className="break_sound"
        ref={break_sound_ref}
        src={break_sound}
      />
    </div>
  )
}
