
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/appContext'
import coganh_logo from "../../static/img/coganh_logo.png"

export default React.memo(function Navbar({ type = {}, back_link = "/menu", mode="dark"}) {
  const { history, user, setUser, theme, setTheme } = useContext(AppContext)
  const [ is_open_setting, set_is_open_setting ] = useState(false)
  const [ is_open_notification, set_is_open_notification ] = useState(false)
  const [ notifications, set_notifications] = useState([])
  const [ reset_notifications, set_reset_notifications] = useState(0)

  function handle_logout() {
    localStorage.clear()
    setUser({})
  }

  useEffect(() => {
    if(user.id) {
      fetch(`http://127.0.0.1:8080/get_user_notification/${user.id}`)
      .then(res => res.json())
      .then(data => set_notifications(data))
      .catch(err => console.log(err))
    }
  }, [reset_notifications])

  function delete_notification(data) {
    fetch(`http://127.0.0.1:8080/delete_notification/${user.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => set_reset_notifications(Math.random()))
    .catch(err => console.log(err))
  }

  function all_delete_notification() {
    if(notifications.length === 0) return
    fetch(`http://127.0.0.1:8080/delete_all_notification/${user.id}`)
      .then(res => res.json())
      .then(() => set_notifications([]))
      .catch(err => console.log(err))
  }
  
  return (
    <div className={`fixed top-0 z-[10000000] left-0 right-0 flex items-center justify-between px-4 h-[8%] border-b border-[#007BFF] ${mode === "dark" && theme === "dark" ? "bg-gray-800 text-white" : "bg-[#e6f6ff] text-black"}`}>
      <div class="left_block">
        <img className="lg:h-7 h-5 cursor-pointer select-none" src={coganh_logo} onClick={() => history("/menu")}/>
        {/* <div onClick={() => history("/menu")} class="logo cursor-pointer select-none">Co ganh</div> */}
        <p onClick={() => history(back_link)} class="back_btn w-full">Quay lại</p>
      </div>

      <div class="right_block">
        {/* {theme === 'dark' ? (
          <div onClick={() => {
            localStorage.setItem("theme", "light")
            setTheme('light')
          }} className="h-8 w-8 mr-4 mt-1 hover:brightness-75 cursor-pointer bg-[#007BFF] rounded-full flex items-center justify-center"><i class="fa-solid fa-circle fa-lg text-white"></i></div>
        )
        :
        (
          <div onClick={() => {
            localStorage.setItem("theme", "dark")
            setTheme('dark')
          }} className="h-8 w-8 mr-4 mt-1 hover:brightness-75 cursor-pointer bg-[#1e1926] rounded-full flex items-center justify-center"><i class="fa-solid fa-moon fa-xl text-[#6cb0f9]"></i></div> 
        )
        } */}
        { user.username && <>
          {type.create_post && <a onClick={() => history("/create_post")} class="create_post dark:text-white">Viết bài</a>}
          {type.create_task && <a onClick={() => history("/create_task")} class="create_post dark:text-white">Viết bài</a>}
          <div className="relative mr-4">
            <i onClick={() => set_is_open_notification(!is_open_notification)} class="fa-solid fa-bell text-2xl cursor-pointer select-none hover:brightness-90"></i>
            {notifications.length > 0 && <div className="absolute top-0 right-0 w-3 h-3 text-xs rounded-full bg-red-500 grid place-content-center select-none">!</div>}
            {is_open_notification && <div className={`absolute flex flex-col right-0 dark:bg-slate-600 bg-slate-300 px-4 py-1 lg:w-96 lg:h-60 w-72 h-52 overflow-y-scroll rounded animate-enlarge origin-top-right shadow-lg shadow-slate-500 ${mode === "light" && "brightness-200 text-white"}`}>
              {notifications.length === 0 && 
              <div className="flex-1 grid place-content-center lg:text-2xl text-xl">
                Chưa có thông báo nào
              </div>
              }
              <ul className="p-0">
                {notifications.map((noti, key) => 
                <li className={`noti_item relative px-4 py-1 bg-slate-700 hover:brightness-90 cursor-pointer select-none rounded transition-all mb-1`}>
                  <div>
                    <p className="font-bold text-blue-400 text-left">{noti.sender}</p>
                  </div>
                  <p className="text-left">{noti.content}</p>
                  <div onClick={() => delete_notification(noti)} className="noti_delete_btn absolute h-full w-9 bg-red-500 right-0 top-0 text-3xl hidden place-content-center hover:brightness-90">
                    <i class="fa-solid fa-xmark"></i>
                  </div>
                </li>
                )}
              </ul>
              <div onClick={all_delete_notification} className="w-full mt-auto border-t border-slate-300 hover:brightness-75 text-center select-none cursor-pointer">xóa hết</div>
            </div>}
          </div>
          <div class="w-8 h-8 relative">
            <div onClick={() => set_is_open_setting(!is_open_setting)} className={`dark:hover:brightness-90 h-full ${mode === "dark" && theme === "dark" ? "bg-white text-[#007BFF]" : "bg-[#007BFF] text-white"} rounded-full text-2xl cursor-pointer grid place-content-center font-semibold select-none`}>
              {user.username && user.username[0].toUpperCase() }
            </div>
            { is_open_setting && 
            <ul className="absolute p-0 w-32 -right-4 top-5 dark:bg-slate-600 bg-slate-300 px-2 py-2 rounded shadow-lg shadow-slate-500">
              <li onClick={() => history("/user/" + user.id)} className="py-1 dark:hover:bg-slate-700 hover:bg-slate-200 px-1 rounded cursor-pointer select-none">Trang cá nhân</li>
              <li onClick={() => {handle_logout(); console.log(123)}} className="py-1 dark:hover:bg-slate-700 hover:bg-slate-200 px-1 rounded cursor-pointer select-none">Đăng xuất</li>
            </ul>}
          </div>
        </>}
        { !user.username && <>
          <div onClick={() => history("/login")} className="text-lg ml-2 px-4 py-1 rounded bg-[#007BFF] hover:brightness-90 cursor-pointer select-none">Đăng nhập</div>
        </>}
      </div>
    </div>
  )
})
