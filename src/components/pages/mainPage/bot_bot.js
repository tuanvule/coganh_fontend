import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../../context/appContext'

import "../../../style/bot_bot.css"
import roll_img from "../../../static/img/roll.png"
import sword_img from "../../../static/img/sword.png"
import Login_require from '../../modal/requirements/login_require'

export default function Bot_Bot() {
  const { user, history, theme } = useContext(AppContext)

  const [rank_board, set_rank_board] = useState([])
  const [bots, set_enemy_bots] = useState([])
  const [user_bots, set_user_bots] = useState([])
  const [selectedPlayer, set_selectedPlayer] = useState({})
  const [is_open_bot_list, set_is_open_bot_list] = useState(false)
  const [selected_bot, set_selected_bot] = useState(null)
  const [is_require_login, set_is_require_login] = useState(false)

  useEffect(() => {
    fetch("https://coganh-cloud-827199215700.asia-southeast1.run.app/get_rank_board", {
      method: "GET",
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        set_rank_board(data)
      })
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    if (user.username) {
      fetch("https://coganh-cloud-827199215700.asia-southeast1.run.app/get_user_bots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user.username)
      })
        .then(res => res.json())
        .then(data => {
          set_enemy_bots(data.enemy_bots)
          set_user_bots(data.user_bots)
          set_selected_bot(data.user_bots[0])
        })
        .catch(err => console.log(err))
    }
  }, [user])

  useEffect(() => {
    const $ = document.querySelector.bind(document)
    const $$ = document.querySelectorAll.bind(document)

    const playerList = $(".side_bar-player-list")
    let players = $$(".player")
    const newPoint = $(".info_elo-fluc--new")
    const arrow = $(".info_elo-fluc--arrow")
    const fightBtn = $(".BB_fight_btn")
    let fightBtnStatus = {
      onLoading: false,
    }
    let newValue = 0

    function resetSuggestion() {
      fetch("https://coganh-cloud-827199215700.asia-southeast1.run.app/get_user_bots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user.username)
      })
        .then(res => res.json())
        .then(data => {
          Array.from(players).forEach((player) => {
            player.remove()
          })
          console.log(players)
          data.filter(item => item.owner !== user.username).forEach(({ bot_name, elo, owner, id }) => {
            playerList.innerHTML += `
                    <li class="player" data-bot_name=${bot_name} data-owner=${owner} data-elo=${elo} data>
                        <div class="player-avatar"><p>${bot_name[0].toUpperCase()}</p></div>
                        <div class="player-info">
                        <div class="player-info--name">${bot_name}</div>
                        <div class="player-info--elfo">${elo}</div>
                        </div>
                    </li>
                `
          })
          players = $$(".player")
          resetEvent(false, "players")
        })
    }

    // resetSuggestion()

    const rankColor = [
      "#54DDFE",
      "#FD80FF",
      "yellow",
      "silver",
      "brown",
    ]

    function createTopList() {
      let warrior = $$(".warrior")
      Array.from(warrior).forEach((wr, i) => {
        const tC = wr.querySelector(".crown")
        tC.style.color = rankColor[i]
        wr.querySelector(".rank").innerHTML = i + 1
      })
    }

    createTopList()

    const user_bot = $(".BB_user")
    const userName = $(".BB_user-name")
    const enemy = $(".enemy")
    const enemyAva = $(".enemy_ava")
    const enemyName = $(".enemy-name")
    let enemyElo = $(".enemy-elo")
    let warriors = $$(".warrior")
    let your_bot = userName.innerHTML
    function resetEvent(all = false, type) {
      if (type === "players" || all) {
        // console.log(players, $$(".player"))
        Array.from(players).forEach((player) => {
          player.onclick = () => {
            fightBtn.style.backgroundColor = "#007BFF"
            fightBtn.innerHTML = "thách đấu"
            Array.from(players).forEach(p => p.style.backgroundColor = "")
            Array.from(warriors).forEach(p => p.style.backgroundColor = "")
            player.style.backgroundColor = theme === "dark" ? "#232E3B" : "#2997ff"
            set_selectedPlayer({
              enemy_bot: player.dataset.bot_name,
              enemy: player.dataset.owner,
              enemy_bot_id: player.dataset.id,
              elo: player.dataset.elo,
              your_bot: user_bot.dataset.bot_name,
              you: user.username,
              your_bot_id: user_bot.dataset.id
            })

            enemyAva.innerHTML = player.dataset.bot_name[0].toUpperCase()
            enemyName.innerHTML = player.dataset.bot_name
            enemyElo.innerHTML = player.dataset.elo
          }
        })
      }
      if (type === "warriors" || all) {
        Array.from(warriors).forEach((warrior) => {
          warrior.onclick = () => {
            fightBtn.style.backgroundColor = "#007BFF"
            fightBtn.innerHTML = "thách đấu"
            Array.from(warriors).forEach(p => p.style.backgroundColor = "")
            Array.from(players).forEach(p => p.style.backgroundColor = "")
            warrior.style.backgroundColor = "#007bffa4"
            set_selectedPlayer({
              enemy_bot: warrior.dataset.bot_name,
              enemy: warrior.dataset.owner,
              enemy_bot_id: warrior.dataset.id,
              elo: warrior.dataset.elo,
              your_bot: user_bot.dataset.bot_name,
              you: user.username,
              your_bot_id: user_bot.dataset.id
            })
            enemyAva.innerHTML = warrior.dataset.bot_name[0].toUpperCase()
            enemyName.innerHTML = warrior.dataset.bot_name
            enemyElo.innerHTML = warrior.dataset.elo
          }
        })
      }
    }

    resetEvent(true)

    const video = $(".fight_screen-video")
    const loading = $(".fight_screen-loading")
    const standBy = $(".fight_screen-standby")
    const err_screen = $(".fight_screen-err")
    const info = $(".info")
    const info_status = $(".info_status")

    const userElo = $(".BB_user-elo")

    let dem = parseInt(userElo.innerHTML)

    function updateRankBoard(newValue) {
      $(".user-info--elo").innerHTML = newValue
      const uElo = parseInt(userElo.innerHTML)
      const eElo = parseInt(enemyElo.innerHTML)
      const rankBoard = $(".rank_board_list")

      fetch("https://coganh-cloud-827199215700.asia-southeast1.run.app/update_rank_board", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          player: {
            owner_name: selectedPlayer.you,
            elo: uElo,
            bot_name: selectedPlayer.your_bot,
            id: selectedPlayer.your_bot_id
          },
          enemy: {
            owner_name: selectedPlayer.enemy,
            elo: eElo,
            bot_name: selectedPlayer.enemy_bot,
            id: selectedPlayer.enemy_bot_id
          }
        }),
      })
        .then(res => res.json())
        .then(data => {
          Array.from(warriors).forEach(e => e.remove())
          data.forEach(({ bot_name, elo, owner, id }) => {
            rankBoard.innerHTML += `
                <li class="warrior" data-bot_name=${bot_name} data-elo=${elo} data-owner=${owner} data-id=${id}>
                    <div class="warrior_rank">
                        <i class="fa-solid fa-crown crown"></i>
                        <div class="rank">1</div>
                    </div>
                    <div class="warrior-avatar"><p>${bot_name[0].toUpperCase()}</p></div>
                    <div class="warrior-info">
                        <div class="warrior-info--name">${bot_name}</div>
                        <div class="warrior-info--elo">${elo}</div>
                    </div>
                </li>
                `
          })
          warriors = $$(".warrior")
          createTopList()
          // resetSuggestion()
          resetEvent(false, "warriors")
        })
    }

    fightBtn.onclick = () => {
      if (!selectedPlayer || fightBtnStatus.onLoading) return;
      if (!user.username) {
        set_is_require_login(true)
        return
      }
      let options = {
        timeZone: 'Asia/Ho_Chi_Minh',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      }

      let formatter = new Intl.DateTimeFormat([], options);
      let stt = {}
      info.style.display = "none"
      video.style.display = "none";
      standBy.style.display = "none";
      err_screen.style.display = "none"
      loading.style.display = "block";
      $(".info_elo-fluc--pre").innerHTML = userElo.innerHTML
      newPoint.innerHTML = ""
      user_bot.style.backgroundColor = theme === "dark" ? "#121212" : "#ccc"
      enemy.style.backgroundColor = theme === "dark" ? "#121212" : "#ccc"

      fightBtn.innerHTML = `<div class="loading_btn"></div>`
      fightBtn.style.backgroundColor = "#191B26"
      fightBtnStatus.onLoading = true
      fetch("https://coganh-cloud-827199215700.asia-southeast1.run.app/fight_bot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...selectedPlayer, time: formatter.format(new Date()) }),
      })
        .then(res => res.json())
        .then(data => {
          console.log(data)
          if (data.code === 400) {
            console.log(data)
            err_screen.style.display = "flex"
            loading.style.display = "none"
            fightBtn.innerHTML = "chọn đối thủ để đấu"
            fightBtnStatus.onLoading = false
            // set_selectedPlayer(null)
          } else if (data.code === 200) {
            stt = {
              status: data.status,
              max_move_win: data.max_move_win,
              new_url: data.new_url
            }
            info_status.innerHTML = "You " + stt.status
            if (stt.status === "win") {
              info_status.style.backgroundColor = "#007BFF"
              user_bot.style.backgroundColor = "#007BFF"
              enemy.style.backgroundColor = "red"
              newPoint.style.color = "#007BFF"
              if (parseInt(userElo.innerHTML) < parseInt(enemyElo.innerHTML)) {
                let pre = userElo.innerHTML
                userElo.innerHTML = parseInt(enemyElo.innerHTML) + 10
                enemyElo.innerHTML = pre
              } else {
                userElo.innerHTML = parseInt(userElo.innerHTML) + 10
              }
            } else if (stt.status === "lost") {
              info_status.style.backgroundColor = "red"
              user_bot.style.backgroundColor = "red"
              enemy.style.backgroundColor = "#007BFF"
              newPoint.style.color = "red"
              if (parseInt(userElo.innerHTML) < parseInt(enemyElo.innerHTML)) {
                let pre = enemyElo.innerHTML
                enemyElo.innerHTML = parseInt(userElo.innerHTML) + 10
                userElo.innerHTML = pre
              } else {
                userElo.innerHTML = parseInt(userElo.innerHTML) - 10
              }
            } else {
              info_status.style.backgroundColor = theme === "dark" ? "#121212" : "#ccc"
              user_bot.style.backgroundColor = theme === "dark" ? "#121212" : "#ccc"
              enemy.style.backgroundColor = theme === "dark" ? "#121212" : "#ccc"
              newPoint.style.color = theme === "dark" ? "#fff" : "#000"
              console.log(userElo, enemyElo)
              if (parseInt(userElo.innerHTML) <= 0) {
                userElo.innerHTML = 0
              } else if (parseInt(enemyElo.innerHTML) <= 0) {
                enemyElo.innerHTML = 0
              }
            }
            newValue = parseInt(userElo.innerHTML)
            updateRankBoard(newValue)
            const source = $("source")
            loading.style.display = "none"
            source.src = stt.new_url
            video.style.display = "block"
            video.load()
            fightBtn.innerHTML = "chọn đối thủ để đấu"
            fightBtn.style.backgroundColor = "#52b1ff"
            fightBtnStatus.onLoading = false
            // set_selectedPlayer(null)
            setTimeout(() => info.style.display = "block", 1000)
          }
        })
        .catch(err => {
          err_screen.style
            .display = "flex"
          loading.style.display = "none"
          fightBtn.innerHTML = "chọn đối thủ để đấu"
          fightBtnStatus.onLoading = false
          // set_selectedPlayer(null)
        })
    }

    arrow.onanimationend = () => {
      newPoint.innerHTML = newValue >= 0 ? `+${newValue}` : `-${newValue}`
    }

  }, [rank_board, bots, selectedPlayer, selected_bot])

  return (
    <div className="h-screen">
      {is_require_login && <Login_require set_is_require_login={set_is_require_login} />}
      <div className="container md:max-w-full">
        <div className="ranking"></div>
        <div className="side_bar-left dark:bg-[#242527] bg-[#7ac8ff]">
          <a onClick={() => history("/menu")} className="BB_menu_btn dark:bg-opacity-0 bg-[#0062d9]">
            Menu
          </a>
          <ul className="rank_board_list text-white p-0">
            <div className="rank_board_header">Top 5</div>
            {rank_board.map((item, i) =>
              <li key={i} className="warrior" data-bot_name={item.bot_name} data-owner={item.owner} data-elo={item.elo} data-id={item.id}>
                <div className="warrior_rank">
                  <i className="fa-solid fa-crown crown" />
                  <div className="rank">1</div>
                </div>
                <div className="warrior-avatar">
                  <p>{item.bot_name[0].toUpperCase()}</p>
                </div>
                <div className="warrior-info">
                  <div className="warrior-info--name">{item.bot_name}</div>
                  <div className="warrior-info--elo">{item.elo}</div>
                </div>
              </li>
            )}
          </ul>
          <div className="info_header">Kết quả ván đấu</div>
          <div style={{ display: "none" }} className="info">
            <div className="info_status">You Win</div>
            <div className="text-3xl mt-4">ELO</div>
            <p className="info_elo-fluc--new text-4xl mt-6"></p>
            <div className=''>
              <div className="info_elo-fluc">
                <div className="info_elo-fluc--pre hidden">
                  {selected_bot && selected_bot.elo}
                </div>
                <div className="info_elo-fluc--arrow text-[0px]">
                  <i className="fa-solid fa-arrow-down-long" />
                </div>
                {/* <div className="info_elo-fluc--new" /> */}
              </div>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="enemy">
            <div className="enemy_ava dark:text-[#007BFF] dark:bg-white text-white bg-[#007BFF]">{(selectedPlayer.enemy_bot ? selectedPlayer.enemy_bot[0].toUpperCase() : "X")}</div>
            <div className="enemy_info">
              <div className="enemy-name">{(selectedPlayer.enemy_bot ? selectedPlayer.enemy_bot : "No enemy")}</div>
              <div className="enemy-elo">{(selectedPlayer.elo ? selectedPlayer.elo : 0)}</div>
            </div>
          </div>
          <div className="fight_screen dark:bg-[#000] bg-[#52b1ff] text-black dark:text-white">
            <div style={{ display: "none" }} className="fight_screen-err">
              <i className="fa-solid fa-face-dizzy" style={{ fontSize: 50 }} />
              <br />
              Trận đấu bị lỗi
              <span>Có thể bot của đổi thủ hoặc bạn chưa sẵn sàng</span>
              <span>Hãy kiểm tra lại bot và thử lại lần nữa</span>
            </div>
            <div className="fight_screen-standby">
              <i className="fa-solid fa-face-laugh-beam" />
              CHỌN ĐỐI THỦ ĐỂ ĐẤU
            </div>
            <div style={{ display: "none" }} className="fight_screen-loading">
              <img
                className="fight_screen-loading--img sword"
                src={sword_img}
                alt=""
              />
              <div>
                <img
                  className="fight_screen-loading--img roll"
                  src={roll_img}
                  alt=""
                />
              </div>
            </div>
            <video
              data-isreload="false"
              style={{ display: "none" }}
              className="fight_screen-video rounded-xl"
              controls
              cache="no-store"
            >
              <source type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="BB_user" data-bot_name={selected_bot && selected_bot.bot_name} data-id={selected_bot && selected_bot.id}>
            <div className="BB_user_ava dark:text-[#007BFF] dark:bg-white text-white bg-[#007BFF]">{selected_bot && selected_bot.bot_name[0].toUpperCase()}</div>
            <div className="BB_user_info">
              <div className="BB_user-name">{selected_bot && selected_bot.bot_name}</div>
              <div className="BB_user-elo">{selected_bot && selected_bot.elo}</div>
            </div>
          </div>
        </div>
        <div className="side_bar dark:bg-[#242527] bg-[#7ac8ff]">
          <div className="side_bar-header relative">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-4xl bg-white text-[#007BFF] font-bold pb-2">{selected_bot && selected_bot.bot_name[0]}</div>
            {/* <img
              src="https://static.vecteezy.com/system/resources/thumbnails/003/682/252/small/pink-blue-v-alphabet-letter-logo-icon-design-with-swoosh-for-business-and-company-vector.jpg"
              className="user-avatar"
            /> */}
            <div className="user-info">
              <div className="user-info--name">
                {selected_bot && selected_bot.bot_name}
              </div>
              <div className="user-info--elo">{selected_bot && selected_bot.elo}</div>
            </div>
            <i onClick={() => set_is_open_bot_list(!is_open_bot_list)} class="fa-solid fa-repeat ml-auto mr-2 text-3xl cursor-pointer select-none hover:text-slate-300"></i>
            {is_open_bot_list &&
              <ul className="absolute w-full h-96 dark:bg-slate-700 bg-slate-300 right-0 top-full p-2 rounded-md cursor-pointer select-none overflow-y-scroll">
                {user_bots.map(bot =>
                  <li onClick={() => set_selected_bot(bot)} className={`flex items-center dark:hover:bg-slate-800 hover:bg-slate-200 px-2 py-1 rounded-md ${bot.bot_name === selected_bot.bot_name ? "dark:bg-slate-900 bg-slate-100" : ""}`}>
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
          </div>
          <div className="side_bar-content">Đối thủ đề xuất</div>
          <ul className="side_bar-player-list p-0">
            {/* <li class="player">
                <div class="player-avatar"></div>
                <img src="https://static.vecteezy.com/system/resources/thumbnails/003/682/252/small/pink-blue-v-alphabet-letter-logo-icon-design-with-swoosh-for-business-and-company-vector.jpg" class="player-avatar"></img>
                <div class="player-info">
                    <div class="player-info--name">mtlv23</div>
                    <div class="player-info--elo">1000</div>
                </div>
            </li> */}
            {bots && bots.map((bot, i) =>
              <li key={i} className="player dark:hover:bg-[#363535] hover:bg-[#52b1ff]" data-owner={bot.owner} data-bot_name={bot.bot_name} data-elo={bot.elo} data-id={bot.id}>
                <div className="player-avatar">
                  <p>{bot.bot_name[0].toUpperCase()}</p>
                </div>
                <div className="player-info">
                  <div className="player-info--name">{bot.bot_name}</div>
                  <div className="player-info--elo">{bot.elo || 0}</div>
                </div>
              </li>
            )}
          </ul>
          <div className="BB_fight_btn dark:bg-[#191B26] bg-[#52b1ff]">chọn đối thủ để đấu</div>
          {/* <div class="fight_btn"><div class="loading_btn"></div></div> */}
        </div>
      </div>
    </div>

  )
}
