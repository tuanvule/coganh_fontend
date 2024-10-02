import React, { useEffect, useRef, useState } from 'react'

import level1 from "../../../static/img/level1.png"
import level2 from "../../../static/img/level2.png"
import level3 from "../../../static/img/level3.png"
import level4 from "../../../static/img/level4.png"
import Master from "../../../static/img/Master.png"

const imgs = {
    level1: level1,
    level2: level2,
    level3: level3,
    level4: level4,
    Master: Master,
}

export default function Bot_list({bot, set_bot, move_bot}) {
    
    const bot_list_btn_ref = useRef(null)
    const [is_open_bot_list, set_is_open_bot_list] = useState(false)

    useEffect(() => {
    }, [])

    return (
        <div className="relative w-[180px] h-[60px] bg-black px-2 flex items-center justify-around rounded">
            <div ref={bot_list_btn_ref} onClick={() => set_is_open_bot_list(!is_open_bot_list)} className={`w-12 h-12 rounded-full overflow-hidden ${ bot !== "Master" ? "bg-slate-500" : "bg-red-500" } p-[6px] pointing_event_br-90`}>
                <img className="object-cover" src={imgs[bot]} />
            </div>
            <ul className={` m-0 rounded absolute top-full left-0 bg-slate-900 ${is_open_bot_list ? "h-[320px] p-2" : "h-0 p-0"} transition-all overflow-hidden`}>
                <li onClick={() => set_bot("level1")} data-level="level1" className="list-none flex items-center mb-4 bg-inherit pointing_event_br-90">
                    <div ref={bot_list_btn_ref} className="w-12 h-12 rounded-full overflow-hidden bg-slate-500 p-[6px]">
                        <img className="object-cover" src={level1} />
                    </div>
                    <p className="ml-4 text-xl font-semibold mr-2">level1</p>
                </li>
                <li onClick={() => set_bot("level2")} data-level="level2" className="list-none flex items-center mb-4 bg-inherit pointing_event_br-90">
                    <div ref={bot_list_btn_ref} className="w-12 h-12 rounded-full overflow-hidden bg-slate-500 p-[6px]">
                        <img className="object-cover" src={level2} />
                    </div>
                    <p className="ml-4 text-xl font-semibold mr-2">level2</p>
                </li>
                <li onClick={() => set_bot("level3")} data-level="level3" className="list-none flex items-center mb-4 bg-inherit pointing_event_br-90">
                    <div ref={bot_list_btn_ref} className="w-12 h-12 rounded-full overflow-hidden bg-slate-500 p-[6px]">
                        <img className="object-cover" src={level3} />
                    </div>
                    <p className="ml-4 text-xl font-semibold mr-2">level3</p>
                </li>
                <li onClick={() => set_bot("level4")} data-level="level4" className="list-none flex items-center mb-4 bg-inherit pointing_event_br-90">
                    <div ref={bot_list_btn_ref} className="w-12 h-12 rounded-full overflow-hidden bg-slate-500 p-[6px]">
                        <img className="object-cover" src={level4} />
                    </div>
                    <p className="ml-4 text-xl font-semibold mr-2">level4</p>
                </li>
                <li onClick={() => set_bot("Master")} data-level="Master" className="list-none flex items-center bg-inherit pointing_event_br-90">
                    <div ref={bot_list_btn_ref} className="w-12 h-12 rounded-full overflow-hidden bg-red-500 p-[6px]">
                        <img className="object-cover" src={Master} />
                    </div>
                    <p className="ml-4 text-xl font-semibold mr-2">Master</p>
                </li>
            </ul>
            <div onClick={move_bot} className="px-2 py-1 bg-blue-500 rounded pointing_event_br-90 transition-all">Move</div>
        </div>
    )
}
