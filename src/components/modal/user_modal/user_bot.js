import React, { useContext, useEffect, useRef, useState } from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { LineChart } from '@mui/x-charts';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import level1 from "../../../static/img/level1.png"
import level2 from "../../../static/img/level2.png"
import level3 from "../../../static/img/level3.png"
import level4 from "../../../static/img/level4.png"
import Master from "../../../static/img/Master.png"
import logo from "../../../static/img/logo.png"
import View_code from '../view_code';
import { AppContext } from '../../../context/appContext';

export default function User_bot({ bots, raw_bots, is_owner, set_is_require_owner }) {
  const { history, user, theme } = useContext(AppContext)
  console.log(user)
  const [bot_status, set_bot_status] = useState({
    win: 0,
    lost: 0,
    draw: 0,
  })
  const [chunk_index, set_chunk_index] = useState(0)
  const [is_public_list, set_is_public_list] = useState(bots[chunk_index] ? bots[chunk_index].map(bot => bot.is_public) : [])
  const [is_un_public, set_is_un_public] = useState(false)

  const [enemy_bot_id, set_enemy_bot_id] = useState([])
  const [code_to_show, set_code_to_show] = useState([])

  const is_moblie = (window.innerWidth <= 600)

  useEffect(() => {
    set_is_public_list(bots[chunk_index] ? bots[chunk_index].map(bot => bot.is_public) : [])
  }, [chunk_index, raw_bots])

  useEffect(() => {
    const status = {
      win: 0,
      lost: 0,
      draw: 0,
    }

    raw_bots.forEach(bot => {
      bot.fight_history.forEach(fight => status[fight.status]++)
    });
    const U_bot_item = document.querySelectorAll(".U_bot_item")
    U_bot_item.forEach((item, i) => {
      const open_BIF_bnt = item.querySelector(".open_bot_info_btn")
      open_BIF_bnt.onclick = () => {
        // console.log(Boolean(open_BIF_bnt.dataset.isp))

        if(!is_owner && !is_public_list[i]) {
          set_is_un_public(true)
          return
        }
        open_BIF_bnt.classList.toggle("bg-[#a0d8fa]")
        open_BIF_bnt.classList.toggle("text-black")
        item.querySelector(".bot_info").classList.toggle("hidden")
      }
    })
    set_enemy_bot_id(raw_bots.map(bot => bot.fight_history.map(item => item.enemy.bot_id)))
    set_bot_status(status)
  }, [raw_bots, user, chunk_index, is_public_list])

  useEffect(() => {
    if (enemy_bot_id.length > 0) {
      fetch("https://coganh-cloud-tixakavkna-as.a.run.app/get_code_to_show", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(enemy_bot_id)
      })
        .then(res => res.json())
        .then(data => {
          let d = []
          for (let i = 0; i < data.length; i += 4) {
            const chunk = data.slice(i, i + 4);
            d.push(chunk)
          }
          set_code_to_show(d)
        })
        .catch(err => console.log(err))
    }
  }, [enemy_bot_id])

  useEffect(() => {
    document.querySelectorAll(".fight_history_item").forEach(item => {
      item.querySelector("div .fight_history_item-view_code_btn").onclick = () => {
        const code_block = item.querySelector(".show_code_block")
        if (code_block.classList.contains("hidden")) {
          code_block.classList.replace("animate-close_code", "animate-open_code")
          code_block.classList.replace("hidden", "flex")
        }
        else {
          code_block.classList.replace("animate-open_code", "animate-close_code")
          code_block.classList.replace("flex", "hidden")
        }
      }
    })
  }, [code_to_show])

  function handle_satus(status) {
    switch (status) {
      case "win":
        return "text-[#A0D8FA]  shadow-[#87bdff]"
      case "lost":
        return "text-red-500  shadow-red-300"
      case "draw":
        return "shadow-white"
      default:
        return "shadow-white"
    }
  }

  function handle_elo(elo) {
    switch (elo) {
      case elo > 0:
        return { class: "text-[#A0D8FA]  shadow-[#87bdff]", text: "+" + elo }
      case elo < 0:
        return { class: "text-red-500  shadow-red-300", text: "-" + elo }
      case elo === 0:
        return { class: "shadow-white", text: elo }
      default:
        return { class: "shadow-white", text: elo }
    }
  }

  function toggle_is_public(id, type, index) {
    if(!is_owner) {
      set_is_require_owner(true)
      return
    }
    fetch(`https://coganh-cloud-tixakavkna-as.a.run.app/change_is_public?bot_id=${id}&type=${type ? 1 : 0}`)
      .then(res => res.json())
      .then(data => {
        let new_IPLL = JSON.parse(JSON.stringify(is_public_list))
        new_IPLL[index] = Boolean(type)
        set_is_public_list(new_IPLL)
      })
      .catch(err => console.log(err))
  }
  console.log(is_public_list)
  return (
    <>
      {/* {bots[0] && */}
      <div className="w-full h-full flex flex-col justify-between">
        <div className="statistical w-full flex justify-between lg:flex-row flex-col lg:p-0">
          <div className="statistical_bot lg:mt-0 mt-4 lg:w-[40%] w-full h-72 rounded-lg bg-[#52b1ff] dark:text-white text-black dark:bg-[#0b427e]  py-5 grid grid-rows-5 grid-flow-col">
            <div className="statistical_title text-2xl font-bold px-5">THÔNG SỐ TẤT CẢ CÁC BOT</div>
            <div className="grid grid-cols-2 row-span-4">
              <div className="flex flex-col items-center justify-center">
                {/* <p className="text-xl font-semibold mb-5">Số bot sở hữu</p> */}
                <div className="statistical_bot-circle w-32 h-32 rounded-full bg-[#202634] text-[#a0d8fa] flex flex-col justify-center items-center">
                  <span className="text-2xl text-[#a0d8fa] font-bold">Số bot</span>
                  <div className="text-5xl text-[#a0d8fa]">{bots[0] ? bots.length : 0}</div>
                </div>
              </div>
              <div className="text-2xl flex flex-col justify-center">
                {/* <div>Thông số</div> */}
                <ul className="p-0">
                  <li className="text-lg">
                    <span className=" font-bold text-xl">Thắng : </span>{bot_status.win}
                  </li>
                  <li className="text-lg">
                    <span className=" font-bold">Thua : </span>{bot_status.lost}
                  </li>
                  <li className="text-lg">
                    <span className="text-white font-bold">Hòa : </span>{bot_status.draw}
                  </li>
                  <li className="text-lg">
                    <span className="text-white font-bold">Tổng số trận : </span>{bot_status.draw + bot_status.win + bot_status.lost}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="statistical_posts lg:mt-0 mt-4 lg:w-[28%] w-full h-72 rounded-lg dark:bg-[#767f80] bg-slate-400 p-5 flex flex-col items-center">
            <div className="statistical_title text-2xl self-start font-bold">ELO TRUNG BÌNH</div>
            <div className="grid place-content-center h-full font-bold text-4xl">
              {raw_bots[0] ? raw_bots.reduce((cur_elo, bot) => bot.elo + cur_elo, 0) / bots.length : 0}
            </div>
          </div>

          <div className="statistical_training lg:mt-0 mt-4 lg:w-[28%] w-full h-72 rounded-lg bg-[#52b1ff] dark:text-white text-black dark:bg-[#0b427e] p-5 flex flex-col items-center">
            <div className="statistical_title text-2xl self-start font-bold">RANK CAO NHẤT</div>
            <div className="statistical_posts-circle my-auto w-32 h-32 rounded-full bg-slate-200 grid place-content-center ">
              <div className="text-5xl text-[#007BFF]">{raw_bots[0] && raw_bots[0].rank}</div>
            </div>
          </div>
        </div>

        {bots.length === 0 &&
          <div className="w-full h-1/2 flex flex-col justify-center items-center text-5xl">
            {is_owner ?  "Bạn chưa có bot" : "người dùng này chưa có bot"}
            {is_owner && <div onClick={() => history("create_bot")} className="text-2xl mt-2 text-[#007BFF] font-semibold underline hover:brightness-90 cursor-pointer">Hãy tạo bot tại đây</div>}
          </div>
        }

        <ul className="U_bot_list p-0 lg:w-full lg:mx-0 mx-auto">
          {bots && bots[chunk_index] && bots[chunk_index].map((bot, i) =>
            <li className="U_bot_item rounded-lg border-[#a0d8fa] dark:bg-[#111c2c] bg-white border-2 dark:bg-opacity-15 lg:p-5 py-5 mb-4">
              <div className="ml-auto flex w-fit">
                <div onClick={() => toggle_is_public(bot.id, !is_public_list[i], i)} className="text-2xl grid place-content-center border border-[#a0d8fa] hover:bg-[#a0d8fa] hover:text-black transition-all cursor-pointer select-none w-fit p-3 py-1 rounded-md mb-5 mr-2">{is_public_list[i] ? "PUBLIC" : "PRIVATE"}</div>
                <div data-isp={is_public_list[i]} className="open_bot_info_btn text-3xl border border-[#a0d8fa] hover:bg-[#a0d8fa] hover:text-black transition-all cursor-pointer select-none p-3 py-1 rounded-md mb-5">
                  <i class="fa-solid fa-bars"></i>
                </div>
              </div>
              <div className="U_bot_item-profile flex justify-between lg:flex-row flex-col">
                <div className="lg:w-[55%] w-full lg:h-72 h-56 rounded-lg py-5 pr-5 mb-5 flex">
                  <div className="flex flex-col items-center w-1/2">
                    <div className="lg:w-28 lg:h-28 w-20 h-20 lg:text-5xl text-3xl font-bold rounded-full bg-[#a0d8fa] text-black grid place-content-center">{bot.bot_name[0].toUpperCase()}</div>
                    <div className="my-5 lg:text-3xl text-2xl">{bot.bot_name}</div>
                    <div className="text-2xl">{bot.elo}</div>
                  </div>
                  <div className="w-1/2 flex lg:h-full">
                    <div className="flex-1 flex flex-col">
                      <p className="text-center lg:text-2xl text-lg mb-5">BOT LEVEL</p>
                      {bot.level === 0 &&
                        <div data-level="level1" className="level1 flex-1 bg-[#a0d8fa] text-black flex flex-col items-center w-full rounded-md">
                          <img className="w-5/6 h-auto" src={logo} alt="" />
                          <div className="level1 text-black text-xl mt-auto">level 0</div>
                        </div>
                      }
                      {bot.level === 1 &&
                        <div data-level="level1" className="level1 flex-1 bg-[#a0d8fa] text-black flex flex-col items-center w-full rounded-md">
                          <img className="w-5/6" src={level1} alt="" />
                          <div className="level1 text-black text-xl">level 1</div>
                        </div>
                      }
                      {bot.level === 2 &&
                        <div data-level="level2" className="level2 flex-1 bg-[#a0d8fa] text-black flex flex-col items-center w-full rounded-md">
                          <img className="max-w-24" src={level2} alt="" />
                          <div className="level2 text-white text-xl">level 2</div>
                        </div>
                      }
                      {bot.level === 3 &&
                        <div data-level="level3" className="level3 flex-1 bg-[#a0d8fa] text-black flex flex-col items-center w-full rounded-md">
                          <img className="max-w-24" src={level3} alt="" />
                          <div className="level3 text-white text-xl">level 3</div>
                        </div>
                      }
                      {bot.level === 4 &&
                        <div data-level="level3" className="level3 flex-1 bg-[#a0d8fa] text-black flex flex-col items-center w-full rounded-md">
                          <img className="max-w-24" src={level4} alt="" />
                          <div className="level3 text-white text-xl">level 4</div>
                        </div>
                      }
                      {bot.level === 5 &&
                        <div data-level="Master" className="Master bg-[#a0d8fa] text-black flex flex-col items-center w-full rounded-md">
                          <img className="max-w-24" src={Master} alt="" />
                          <div className="Master text-white text-xl">MASTER</div>
                        </div>
                      }
                    </div>
                    <div className="w-2"></div>
                    <div className="flex-1 flex flex-col">
                      <p className="text-center lg:text-2xl text-lg mb-5">RANK</p>
                      <div data-level="level1" className="relative flex-1 bg-[#a0d8fa] text-black flex flex-col items-center w-full rounded-md">
                        {/* <img className="w-5/6 opacity-0" src={level1} alt="" /> */}
                        <div className="level1 text-white text-xl opacity-0">0</div>
                        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl max-w-full">1</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:w-[43%] w-full overflow-hidden h-72 rounded-lg lg:p-5 flex flex-col items-start">
                  {(() => {
                    const win_count = bot.fight_history.filter(h => h.status === "win").length
                    const lost_count = bot.fight_history.filter(h => h.status === "lost").length
                    const draw_count = bot.fight_history.filter(h => h.status === "draw").length
                    let dem = 0
                    if (win_count > 0) dem++
                    if (lost_count > 0) dem++
                    if (draw_count > 0) dem++

                    return (<PieChart
                      series={[
                        {
                          arcLabel: (item) => `${item.value}`,
                          arcLabelMinAngle: 100,
                          data: [
                            { id: 0, value: win_count, label: 'WIN', color: "#1F81C1" },
                            { id: 1, value: lost_count, label: 'LOST', color: "#CD151A" },
                            { id: 2, value: draw_count, label: 'DRAW', color: "#767f80" },
                          ],
                          highlightScope: { faded: 'global', highlighted: 'item' },
                          faded: { innerRadius: 10, additionalRadius: -10, color: 'gray' },
                          innerRadius: 30,
                          outerRadius: 100,
                          paddingAngle: dem === 3 ? 5 : 0,
                          cornerRadius: 5,
                          startAngle: 0,
                          endAngle: 360,
                          cx: 150,
                          cy: 150,
                        },
                      ]}
                      sx={{
                        [`& .${pieArcLabelClasses.root}`]: {
                          fill: theme === "dark" ? 'white' : "black",
                          font: 'bold 20px sans-serif',
                        },
                        ["& .MuiChartsLegend-series text"]: {
                          fill: theme === "dark" ? 'white' : "black",
                          font: 'bold 20px sans-serif !important',
                        }
                      }}
                      width={is_moblie? 360 : 400}
                      height={is_moblie? 300 : 300}
                    />)
                  })()}
                </div>
              </div>
              <div className="bot_info hidden overflow-hidden transition-all">
                <div className="w-full h-[40rem] flex">
                  <div className="w-11/12 h-5/6 py-5 m-auto rounded-lg bg-[#282A36] relative text-xl">
                    {bots[0] && <View_code bot={bot} bot_code={bot.code} enable_edit={is_owner} pos={{ top: "-8%", left: (is_moblie ? "64%" : "84%") }} />}
                  </div>
                </div>

                <div className="U_fight_history flex flex-col mt-10 mx-auto w-[96%] mb-4 max-h-[48rem] rounded-lg border-[#a0d8fa] border-2 bg-opacity-15">
                  <div className="flex px-2 w-[96%] mx-auto lg:text-base text-[0.7rem]">
                    <div className="flex-1">Status</div>
                    <div className="flex-auto w-1/12">Enemy</div>
                    <div className="flex-auto w-1/12">Enemy's owner</div>
                    <div className="flex-1">Moves</div>
                    <div className="flex-auto w-1/12">Time</div>
                    <div className="flex-auto w-1/12">Elo change</div>
                    <div className="lg:flex-1 flex-auto"></div>
                  </div>
                  <div className="my-2 h-[1px] bg-[#036CDC] w-[96%] mx-auto"></div>
                  <ul className="fight_history_list p-0 pl-[1px] flex-1 overflow-scroll w-[96%] mx-auto lg:text-base text-[0.7rem]">
                    {bot.fight_history.map(({ status, elo_change, move, time, enemy }, j) =>
                      <li key={j} className={`fight_history_item flex flex-col `}>
                        <div className={`flex w-full px-2 py-1 ${j % 2 == 0 ? "dark:bg-[#111C2C] bg-white" : "dark:bg-[#0E335B] bg-slate-300"}`}>
                          <div className={`flex items-center flex-1 font-bold lg:text-lg text-[0.7rem] [text-shadow:0px_0px_12px_var(--tw-shadow-color)] ${handle_satus(status)}`}>DRAW</div>
                          <div className="flex items-center flex-auto w-1/12">{enemy.bot_name}</div>
                          <div className="flex items-center flex-auto w-1/12">{enemy.owner}</div>
                          <div className="flex items-center flex-1">{move}</div>
                          <div className="flex items-center flex-auto w-1/12">{is_moblie ? time.split(",")[1] : time}</div>
                          <div className={`flex items-center flex-auto w-1/12 font-bold text-lg [text-shadow:0px_0px_12px_var(--tw-shadow-color)] ${handle_elo(elo_change).class}`}>{handle_elo(elo_change).text}</div>
                          <div className={`fight_history_item-view_code_btn flex items-center lg:flex-1 dark:text-[#a0d8fa] text-[#007BFF] font-bold underline select-none ${code_to_show[chunk_index] && (code_to_show[chunk_index][i][j] ? " cursor-pointer" : "text-opacity-25 cursor-not-allowed pointer-events-none")}`}><p className="lg:ml-auto lg:mr-2">CODE</p></div>
                        </div>
                        <div className={`show_code_block w-full overflow-hidden hidden justify-center items-center animate-open_code animate-close_code will-change-contents`}>
                          <div className="lg:w-3/4 w-[90%] h-[30rem] rounded-md overflow-hidden py-4 my-6 bg-[#282A36]">
                            <View_code bot_code={code_to_show[chunk_index] && code_to_show[chunk_index][i][j]} />
                          </div>
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </li>
          )}
        </ul>

        { is_un_public && 
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-20 z-[100000000000000]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0757ad] w-1/3 h-3/4 rounded-2xl grid place-content-center px-20">
                <div className="flex flex-col items-center text-2xl"> 
                    <p className="text-3xl text-center">
                        bot này không được public
                    </p>
                    <div className="text-2xl py-1 px-4 rounded-lg mt-10 bg-[#278ae8] hover:brightness-90 cursor-pointer select-none" onClick={() => set_is_un_public(false)}>OK</div>
                </div>
            </div>
        </div>}
      </div>
    </>
  )
}
