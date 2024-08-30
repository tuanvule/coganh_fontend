import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../../context/appContext'
import Handle_user_gamemode from '../handle_user_gamemode'

export default function User_gamemode({ u_id, is_owner }) {
  const { history } = useContext(AppContext)
  const [un_public_gamemode, set_un_public_gamemodes] = useState()
  const [UPGM_chunk_index, set_UPGM_chunk_index] = useState(0)
  const [is_reset_gamemode, set_is_reset_gamemode] = useState(0)
  const [gamemode_chunk_index, set_gamemode_chunk_index] = useState(0)
  const [gamemodes, set_gamemodes] = useState([])
  const [fetch_gamemodes, set_fetch_gamemodes] = useState(false)

  console.log(gamemodes)

  function handle_send_notification(u_id, content) {
    fetch(`http://192.168.1.249:8080/send_notification/${u_id}`, {
      method: "gamemode",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: "ADMIN",
        sender_id: "",
        content: content
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
      })
      .catch(err => console.log(err))
  }

  function handle_delete(id, author_id) {
    console.log(id)
    let is_delete = window.confirm("bạn có chắc muốn xóa")
    if (is_delete) {
      let notification = prompt("nhập lý do muốn xóa (tối thiểu 5 ký tự")
      if (notification.length < 5) return
      fetch(`http://192.168.1.249:8080/delete_gamemode/${id}`)
        .then(res => res.json())
        .then(data => {
          if (author_id) {
            handle_send_notification(author_id, notification)
          }
          set_is_reset_gamemode(Math.random())
        })
        .catch(err => console.log(err))
    }
  }

  function handle_accept(id, author_id, gamemode_title) {
    fetch(`http://192.168.1.249:8080/accept_gamemode/${id}`)
      .then(res => res.json())
      .then(data => {
        if (author_id) {
          handle_send_notification(author_id, `bài đăng của bạn với tiêu đề "${gamemode_title.length > 10 ? gamemode_title.slice(0, 10) + "..." : gamemode_title}" đã được chấp nhận`)
        }
        set_is_reset_gamemode(Math.random())
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    fetch(`http://192.168.1.249:8080/get_user_unpublic_gamemode?u_id=${u_id}&page=${UPGM_chunk_index}&size=9`)
      .then(res => res.json())
      .then(data => {
        set_un_public_gamemodes(data)
        set_fetch_gamemodes(true)
      })
      .catch(err => console.log(err))
  }, [is_reset_gamemode])

  function handle_message(author_id) {
    let notification = prompt("Nhập tin nhắn bạn muốn gửi")
    if (notification) {
      handle_send_notification(author_id, notification)
    }
  }

  useEffect(() => {
    if (!fetch_gamemodes) return
    fetch(`http://192.168.1.249:8080/get_user_gamemode?u_id=${u_id}&page=${gamemode_chunk_index}&size=9`)
      .then(res => res.json())
      .then(data => {
        set_gamemodes(data)
      })
      .catch(err => console.log(err))
  }, [is_reset_gamemode, fetch_gamemodes, gamemode_chunk_index])

  useEffect(() => {
    document.querySelectorAll(".gamemode_code_item").forEach(item => {
      item.querySelector(".gamemode_code_item_btn").onclick = () => {
        const code_block = item.querySelector(".handle_user_gamemode_item")
        if (code_block.classList.contains("hidden")) {
          code_block.classList.replace("hidden", "block")
        }
        else {
          code_block.classList.replace("block", "hidden")
        }
      }
    })
  })

  return (
    <div className=" h-full flex flex-col">
      <div className="">
        <p className="text-3xl font-bold mb-4">Chờ được duyệt</p>
        <ul className="p-0 m-0">
          {un_public_gamemode && un_public_gamemode.map((item, i) =>
            <li className="gamemode_code_item relative rounded flex flex-col hover:scale-[1.02] shadow-xl hover:shadow-blue-300 dark:bg-[#0e335b] bg-[#7ac8ff] p-4 mb-2 transition-all cursor-pointer">
              <div className="gamemode_item flex relative w-full h-fit">
                <div className="w-40 h-40 rounded overflow-hidden">
                  <img className="object-cover" src={item.demo_img} />
                </div>
                <div className="flex-1 flex flex-col px-4">
                  <div>
                    <p className=" leading-[1rem] text-xl">{item.title}</p>
                    <p className="leading-10 dark:text-slate-300 text-slate-700">By {item.author}</p>
                  </div>
                  <div className="review_decription text-lg text-slate-300">{item.description}</div>
                  <div className="mt-auto leading-3">
                    <p className="flex text-center">
                      <i class="fa-solid fa-heart mr-1"></i>
                      {item.upvote.length - item.downvote.length}
                    </p>
                  </div>
                </div>

                <div className="gamemode_item-nav absolute right-4 top-1/2 -translate-y-1/2">
                  <div onClick={() => history("/post/" + item.post_id)} className="grid place-content-center bg-slate-400 px-10 py-8 rounded pointing_event_br-105 mr-4">
                    <i class="fa-solid fa-book-open text-5xl"></i>
                  </div>

                  <div className="gamemode_code_item_btn grid place-content-center bg-[#036cdc] px-10 py-8 rounded pointing_event_br-105">
                    <i class="fa-solid fa-code text-5xl"></i>
                  </div>

                  {is_owner &&
                    <div className="text-3xl ml-4">
                      <div onClick={() => handle_delete(item.id, item.author_id)} className="grid place-content-center bg-red-400 px-8 py-4 rounded pointing_event_br-105">
                        <i class="fa-solid fa-xmark"></i>
                      </div>
                    </div>}
                  {/* <div  className="w-10 h-10 grid place-content-center text-xl bg-red-400 absolute z-[100000000] right-0 hover:brightness-90 cursor-pointer"><i class="fa-solid fa-xmark"></i></div>
                <div onClick={() => handle_message(item.author_id)} className="w-10 h-10 grid place-content-center text-xl bg-slate-400 absolute z-[100000000] right-0 top-10 hover:brightness-90 cursor-pointer"></div> */}
                </div>
              </div>
              <div className="handle_user_gamemode_item hidden w-full max-h-[800px] animate-open_code">
                <Handle_user_gamemode gamemode={item} is_reset_gamemode={is_reset_gamemode} set_is_reset_gamemode={set_is_reset_gamemode} is_owner={is_owner} />
              </div>

            </li>
          )}
        </ul>

        <p className="text-3xl font-bold mt-10 mb-4">các chế độ chơi đã đăng</p>
        <ul className="p-0 m-0 h-full">
          {gamemodes.map((item, i) =>
            <li className="gamemode_code_item relative rounded flex flex-col hover:scale-[1.02] shadow-xl hover:shadow-blue-300 dark:bg-[#0e335b] bg-[#7ac8ff] p-4 mb-2 transition-all cursor-pointer">
              <div className="gamemode_item flex relative w-full h-fit">
                <div className="w-40 h-40 rounded overflow-hidden">
                  <img className="object-cover" src={item.demo_img} />
                </div>
                <div className="flex-1 flex flex-col px-4">
                  <div>
                    <p className=" leading-[1rem] text-xl">{item.title}</p>
                    <p className="leading-10 dark:text-slate-300 text-slate-700">By {item.author}</p>
                  </div>
                  <div className="review_decription text-lg text-slate-300">{item.description}</div>
                  <div className="mt-auto leading-3">
                    <p className="flex text-center">
                      <i class="fa-solid fa-heart mr-1"></i>
                      {item.upvote.length - item.downvote.length}
                    </p>
                  </div>
                </div>

                <div className="gamemode_item-nav absolute right-4 top-1/2 -translate-y-1/2">
                  <div onClick={() => history("/post/" + item.post_id)} className="grid place-content-center bg-slate-400 px-10 py-8 rounded pointing_event_br-105 mr-4">
                    <i class="fa-solid fa-book-open text-5xl"></i>
                  </div>

                  <div className="gamemode_code_item_btn grid place-content-center bg-[#036cdc] px-10 py-8 rounded pointing_event_br-105">
                    <i class="fa-solid fa-code text-5xl"></i>
                  </div>

                  {is_owner &&
                    <div className="text-3xl ml-4">
                      <div onClick={() => handle_delete(item.id, item.author_id)} className="grid place-content-center bg-red-400 px-8 py-4 rounded pointing_event_br-105">
                        <i class="fa-solid fa-xmark"></i>
                      </div>
                    </div>}
                  {/* <div  className="w-10 h-10 grid place-content-center text-xl bg-red-400 absolute z-[100000000] right-0 hover:brightness-90 cursor-pointer"><i class="fa-solid fa-xmark"></i></div>
                  <div onClick={() => handle_message(item.author_id)} className="w-10 h-10 grid place-content-center text-xl bg-slate-400 absolute z-[100000000] right-0 top-10 hover:brightness-90 cursor-pointer"></div> */}
                </div>
              </div>
              <div className="handle_user_gamemode_item hidden w-full max-h-[800px] animate-open_code">
                <Handle_user_gamemode gamemode={item} is_reset_gamemode={is_reset_gamemode} set_is_reset_gamemode={set_is_reset_gamemode} is_owner={is_owner} />
              </div>

            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
