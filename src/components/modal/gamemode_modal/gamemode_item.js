import React, { useContext } from 'react'
import { AppContext } from '../../../context/appContext'
import Vote_modal from '../vote_modal'

export default function Gamemode_item({gamemode}) {
    console.log(gamemode)
    const { history } = useContext(AppContext)
    return (
        <div className="flex-1 flex flex-col justify-between">
            <div className="flex justify-between my-auto">
                <div className="flex flex-1 mr-2 rounded-lg overflow-hidden bg-slate-700">
                    <div className="min-w-52 max-w-52 h-52">
                        <img src={gamemode.demo_img} className=" object-cover" />
                    </div>
                    <div className="px-4 py-2 flex flex-col">
                        <p className="text-xl">{gamemode.title}</p>
                        <p className=" text-slate-300 text-lg">BY {gamemode.author}</p>
                        <p className=" text-slate-300 text-lg my-auto">{gamemode.description.slice(0, 100) + "..."}</p>
                        <p className=" text-slate-300 text-lg mt-auto"><i class="fa-solid fa-heart mr-1"></i> {gamemode.upvote.length - gamemode.downvote.length}</p>
                    </div>
                </div>
                <div className="text-3xl flex items-center">
                    <div className="-mb-7 mr-2 scale-75">
                        <Vote_modal type="gamemode" doc={gamemode}/>
                    </div>
                    <div onClick={() => history("/post/" + gamemode.post_id)} className="grid place-content-center bg-slate-400 w-24 h-24 rounded hover:brightness-105 cursor-pointer">
                        <i class="fa-solid fa-book-open"></i>
                    </div>
                </div>
            </div>
        </div>
    )
}
