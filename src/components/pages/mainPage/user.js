import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../../context/appContext'
import User_dashboard from '../../modal/user_modal/user_dashboard'
import User_bot from '../../modal/user_modal/user_bot'
import User_post from '../../modal/user_modal/user_posts'
import User_training from '../../modal/user_modal/user_training'
import { useParams } from 'react-router-dom'
import User_gamemode from '../../modal/user_modal/user_gamemode'

export default function User() {
    const { user, history } = useContext(AppContext)
    const { id } = useParams()
    // const { username } = user
    const [username, set_username] = useState()
    const [page, set_page] = useState("dashboard")
    const [data, set_data] = useState(JSON.parse(localStorage.getItem("data")))
    const [is_owner, set_is_owner] = useState(true)
    const [is_require_owner, set_is_require_owner] = useState(false)
    const [is_open_sidebar, set_is_open_sidebar] = useState(true)
    const [is_reset_gamemode, set_is_reset_gamemode] = useState(0)
    const [gamemode_chunk_index, set_gamemode_chunk_index] = useState(0)
    const [gamemodes, set_gamemodes] = useState([])
    const [fetch_gamemodes, set_fetch_gamemodes] = useState(false)
    // console.log(JSON.parse(localStorage.getItem("data")))

    useEffect(() => {
        if(id) {
            fetch("http://192.168.1.249:8080/get_all_user_data/" + id)
            .then(res => res.json())
            .then(data => {set_data({raw_data: data, chunked_data: handle_chunk(data)}); {
                set_is_owner(data.username === user.username)
                set_username(data.username)
                set_fetch_gamemodes(true)
            }})
        }
    }, [id])

    useEffect(() => {
        if(username) {
            set_is_owner(username === user.username)
        }
    }, [username, user])

    useEffect(() => {
        document.querySelectorAll(".U_nav_item").forEach(item => {
            item.onclick = () => {
                set_page(item.dataset.name)
            }
        })
    }, [])

    function create_chunk(array, size) {
        let d = []
        for (let i = 0; i < array.length; i += size) {
            const chunk = array.slice(i, i + size);
            d.push(chunk)
        }

        return d
    }

    function handle_chunk(data) {
        const {bots, your_tasks, tasks, posts} = data
        let res = {
            bots: create_chunk(bots, 4),
            your_tasks: create_chunk(your_tasks, 10),
            tasks: create_chunk(tasks, 40),
            posts: create_chunk(posts, 9),
        }

        return res
    }

    localStorage.setItem("data", JSON.stringify(data))

    // if(data.training) {
    //     data.training = [] 
    //     data.posts = [] 
    //     console.log(JSON.stringify(data))
    // }

    useEffect(() => {
        if (!fetch_gamemodes) return
        fetch(`http://192.168.1.249:8080/get_user_gamemode?page=${gamemode_chunk_index}&size=9`)
            .then(res => res.json())
            .then(data => {
                set_gamemodes(data)
            })
            .catch(err => console.log(err))
    }, [is_reset_gamemode, fetch_gamemodes, gamemode_chunk_index])


    return (
        <div className="w-full h-screen flex dark:bg-[#111c2c] bg-[#e6f6ff]">
            <div className={`U_side_bar lg:w-1/4 h-full dark:bg-[#0B427E] bg-[#52b1ff] flex flex-col lg:relative fixed w-[60%] z-[1000000] ${is_open_sidebar ? "left-0" : "-left-[60%]"} transition-all duration-200`}>
                <div onClick={() => set_is_open_sidebar(!is_open_sidebar)} className="absolute top-1/2 -translate-y-1/2 -right-5 text-xl bg-[#0B427E] w-10 h-10 rounded-r-full border-r-2 border-white grid place-content-center pl-3 select-none lg:hidden">
                    {is_open_sidebar && <i class="fa-solid fa-angle-left"></i>}
                    {!is_open_sidebar && <i class="fa-solid fa-angle-right"></i>}
                </div>
                <div className="U_user flex flex-col items-center w-full px-5 py-5 mb-5 dark:bg-[#0757AD] bg-[#2997ff]">
                    <div className="U_avatar text-5xl mb-5 bg-[#007BFF] text-white min-w-16 min-h-16 rounded-full grid place-content-center">{username && username[0].toUpperCase()}</div>
                    <div className="U_info">
                        <div className="U_name text-2xl text-center">{username}</div>
                    </div>
                </div>
                <ul className="U_nav_list p-0">
                    <li data-name="dashboard" className={`U_nav_item text-xl px-5 py-5 dark:hover:bg-blue-600 hover:bg-blue-300 hover:bg-opacity-50 rounded-md cursor-pointer select-none bg-opacity-80 ${page === "dashboard" ? "dark:bg-blue-700 bg-blue-500" : ""}`}>
                        <i class="fa-solid fa-chart-line mr-5"></i>
                        Dash board
                    </li>
                    <li data-name="bot" className={`U_nav_item text-xl px-5 py-5 dark:hover:bg-blue-600 hover:bg-blue-300 hover:bg-opacity-50 rounded-md cursor-pointer select-none bg-opacity-80 ${page === "bot" ? "dark:bg-blue-700 bg-blue-500" : ""}`}>
                        <i className="fa-solid fa-robot mr-5"></i>
                        Bot
                    </li>
                    <li data-name="post" className={`U_nav_item text-xl px-5 py-5 dark:hover:bg-blue-600 hover:bg-blue-300 hover:bg-opacity-50 rounded-md cursor-pointer select-none bg-opacity-80 ${page === "post" ? "dark:bg-blue-700 bg-blue-500" : ""}`}>
                        <i className="fa-solid fa-book-open mr-5"></i>
                        Blog
                    </li>
                    <li data-name="training" className={`U_nav_item text-xl px-5 py-5 dark:hover:bg-blue-600 hover:bg-blue-300 hover:bg-opacity-50 rounded-md cursor-pointer select-none bg-opacity-80 ${page === "training" ? "dark:bg-blue-700 bg-blue-500" : ""}`}>
                        <i class="fa-solid fa-graduation-cap mr-5"></i>
                        Training
                    </li>
                    <li data-name="gamemodes" className={`U_nav_item text-xl px-5 py-5 hover:bg-blue-600 hover:bg-opacity-50 rounded-md cursor-pointer select-none bg-opacity-80 ${page === "gamemodes" ? "bg-blue-700" : ""}`}>
                        <i class="fa-solid fa-chess-board mr-5"></i>
                        Gamemodes
                    </li>
                </ul>
                <div onClick={() => history("/menu")} className="U_back_btn text-xl mt-auto mb-10 mx-auto bg-[#007BFF] text-white px-10 py-2 rounded-sm hover:brightness-90 cursor-pointer select-none">back to menu</div>
            </div>
            <div className="U_content z-0 lg:w-3/4 h-full lg:p-10 px-4 overflow-scroll w-full">
                {page === "dashboard" && data && <User_dashboard data={data.raw_data} is_owner={is_owner} set_is_require_owner={set_is_require_owner}/>}
                {page === "bot" && <User_bot bots={data.chunked_data.bots} raw_bots={data.raw_data.bots} is_owner={is_owner} set_is_require_owner={set_is_require_owner}/>}
                {page === "post" && <User_post username={username} posts={data.chunked_data.posts} is_owner={is_owner} set_is_require_owner={set_is_require_owner}/>}
                {page === "training" && <User_training tasks={data.chunked_data.tasks} raw_tasks={data.raw_data.tasks} your_tasks={data.chunked_data.your_tasks} is_owner={is_owner} set_is_require_owner={set_is_require_owner}/>}
                {page === "gamemodes" && <User_gamemode u_id={id} is_owner={is_owner}/>}
            </div>
            {is_require_owner && 
            <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-20 z-[100000000]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0757ad] lg:w-1/3 w-[80%] h-3/4 rounded-2xl grid place-content-center px-20">
                    <div className="flex flex-col items-center text-2xl"> 
                        <p className="text-3xl text-center">
                            Bạn phải là chủ của tài khoản này thì mới được sử dụng chức năng này
                        </p>
                        <div className="text-2xl py-1 px-4 rounded-lg mt-10 bg-[#278ae8] hover:brightness-90 cursor-pointer select-none" onClick={() => set_is_require_owner(false)}>OK</div>
                    </div>
                </div>
            </div>
            }
        </div>
    )
}
