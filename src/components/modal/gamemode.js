import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../primary/navbar'

import chessboard from "../../static/img/chessboard1.png"
import { AppContext } from '../../context/appContext'
import { useLocation } from 'react-router-dom'

export default function Gamemode() {
    const { history } = useContext(AppContext)
    
    const [gamemode_chunk_index, set_gamemode_chunk_index] = useState(0)
    const [user_gamemodes, set_user_gamemode] = useState([])
    const [mode, set_mode] = useState("human_bot")

    const { state } = useLocation()

    useEffect(() => {
        if(state) {
            set_mode(state.mode)
        }
    }, [])

    useEffect(() => {
        fetch(`http://192.168.1.249:8080/get_gamemode?page=${gamemode_chunk_index}&size=9`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            set_user_gamemode(data)
        })
        .catch(err => console.log(err))
    }, [])
    

    return (
        <div className="fixed w-full h-full flex flex-col">
            <Navbar back_link="/menu" />
            <di className="w-full h-[8%]"></di>
            <div className="my-4 mx-auto h-[88%] overflow-y-scroll w-[90%] dark:bg-[#0f2845] bg-[#a3dcff] rounded-lg flex flex-col py-4">
                <div className="mx-auto text-3xl font-semibold h-[10%]">CÁC CHẾ ĐỘ CHƠI</div>
                <div className="flex h-[90%]">
                    <div className="w-[49.95%] h-full mx-4 px-4 grid place-content-center">
                        <div className="flex flex-col mx-auto justify-center items-center text-white">
                            {/* {mode === "human_bot" && */}
                                <div className="gamemode_item p-2 my-2 mx-1 rounded-sm select-none bg-slate-400 hover:brightness-90 cursor-pointer transition-all">
                                    <div className="w-48 h-48">
                                        <img src={chessboard} className=" object-cover" />
                                    </div>
                                    <p className="text-3xl w-full text-center pt-2">NORMAL</p>
                                    <div className="gamemode_item-nav absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                        <div onClick={() => history(`/${mode}`)} className="grid place-content-center bg-[#036cdc] px-6 py-4 rounded hover:brightness-105">
                                            <i class="fa-solid fa-play text-xl"></i>
                                        </div>
                                    </div>
                                </div>
                            {/* } */}
                            {/* <div className="flex">
                                <div className="gamemode_item p-2 my-2 mx-1 rounded-sm select-none bg-slate-600 hover:brightness-90 cursor-pointer transition-all">
                                    <div className="w-48 h-48">
                                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6dVMh5DFULcYvXneuqRPELfDruTLz2DyNaw&s" className=" object-cover" />
                                    </div>
                                    <p className="text-3xl w-full text-center pt-2">DEAD ZONE</p>
                                    <div className="gamemode_item-nav absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                        <div className="grid place-content-center bg-slate-400 px-6 py-4 rounded hover:brightness-105 mr-4">
                                            <i class="fa-solid fa-book-open"></i>
                                        </div>

                                        <div className="grid place-content-center bg-[#036cdc] px-6 py-4 rounded hover:brightness-105">
                                            <i class="fa-solid fa-play text-xl"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="gamemode_item p-2 my-2 mx-1 rounded-sm select-none bg-blue-500 hover:brightness-90 cursor-pointer transition-all">
                                    <div className="w-48 h-48">
                                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-VXB4xGC1JdU_DvJRw-VJbBXqtX2PpxyiLw&s" className=" object-cover" />
                                    </div>
                                    <p className="text-2xl w-full text-center pt-2">FROZEN FOREST</p>
                                    <div className="gamemode_item-nav absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                        <div className="grid place-content-center bg-slate-400 px-6 py-4 rounded hover:brightness-105 mr-4">
                                            <i class="fa-solid fa-book-open"></i>
                                        </div>

                                        <div className="grid place-content-center bg-[#036cdc] px-6 py-4 rounded hover:brightness-105">
                                            <i class="fa-solid fa-play text-xl"></i>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            {/* <div className="text-3xl px-10 py-2 my-2 mx-1 rounded-sm bg-red-500 select-none hover:brightness-95 cursor-pointer">HI..ER</div> */}
                        </div>
                    </div>
                    <hr className="w-[1px] h-full bg-[#007BFF]" />
                    <div className="w-[49.95%] h-full mx-4 px-4">
                        <ul className="p-0 m-0 overflow-y-scroll h-full ">
                            {user_gamemodes.map((item) => 
                                <li className="gamemode_item relative rounded flex hover:brightness-90 dark:bg-[#0e335b] bg-[#7ac8ff] p-4 mb-2 transition-all cursor-pointer">
                                    <div className="w-20 h-20 rounded overflow-hidden">
                                        <img className="object-cover" src={item.demo_img} />
                                    </div>
                                    <div className="flex-1 flex flex-col px-4">
                                        <div>
                                            <p className=" leading-[0.7rem]">{item.title}</p>
                                            <p className="text-sm leading-10 dark:text-slate-300 text-slate-700">By {item.author}</p>
                                        </div>
                                        <div className="mt-auto leading-3">
                                            <p className="flex text-center">
                                                <i class="fa-solid fa-heart mr-1"></i>
                                                {item.upvote.length - item.downvote.length}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="gamemode_item-nav absolute right-4 top-1/2 -translate-y-1/2">
                                        <div onClick={() => history("/post/" + item.post_id)} className="grid place-content-center bg-slate-400 px-6 py-4 rounded hover:brightness-105 mr-4">
                                            <i class="fa-solid fa-book-open"></i>
                                        </div>

                                        <div onClick={() => history(`/${mode}`, {state: {
                                            ...item
                                        }})} className="grid place-content-center bg-[#036cdc] px-6 py-4 rounded hover:brightness-105">
                                            <i class="fa-solid fa-play text-xl"></i>
                                        </div>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
