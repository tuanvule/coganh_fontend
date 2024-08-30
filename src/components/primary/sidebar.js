import React, { memo, useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../../context/appContext'

function SideBar({ page, set_page }) {
    const { history, user } = useContext(AppContext)
    const [creators, setCreators] = useState([])

    return (
        <div className="fixed left-0 scrollbar w-10 h-full overflow-y-auto lg:min-w-[100px] mt-24">
            <ul className=" mt-4 dark:text-gray-200 p-0 m-0 flex flex-col items-center dark:bg-[#111c2c] bg-[#e6f6ff]">
                <li onClick={() => set_page("help_post")} className={`mb-4 flex flex-col justify-center items-center pointing_event_br-95 w-20 h-20 rounded-lg cursor-pointer bg-inherit ${page === 'help_post' ? 'dark:bg-slate-500 bg-slate-20' : ""} dark:hover:bg-slate-500 hover:bg-slate-200 text-xl font-medium`}>
                    <i class="fa-solid fa-circle-question"></i>
                    <p className="text-sm font-bold">Help</p>
                </li>
                <li onClick={() => set_page("user_post")} className={`mb-4 flex flex-col justify-center items-center pointing_event_br-95 w-20 h-20 rounded-lg cursor-pointer bg-inherit ${page === 'user_post' ? 'dark:bg-slate-500 bg-slate-20' : ""} dark:hover:bg-slate-500 hover:bg-slate-200 text-xl font-medium`}>
                    <i class="fa-solid fa-newspaper"></i>
                    <p className="text-sm font-bold">Blog</p>
                </li>
                <li onClick={() => set_page("gamemode_post")} className={`mb-4 flex flex-col justify-center items-center pointing_event_br-95 w-20 h-20 rounded-lg cursor-pointer bg-inherit ${page === 'gamemode_post' ? 'dark:bg-slate-500 bg-slate-20' : ""} dark:hover:bg-slate-500 hover:bg-slate-200 text-xl font-medium`}>
                    <i class="fa-solid fa-chess-board"></i>
                    <p className="text-xs font-bold">Game</p>
                </li>
            </ul>
            <p className=" text-gray-500 font-semibold ml-3 mb-3"></p>
        </div>
    )
}

export default memo(SideBar)
