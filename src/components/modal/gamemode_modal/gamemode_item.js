import React from 'react'

export default function Gamemode_item({gamemode}) {
    console.log(gamemode)
    return (
        <div className="flex-1 flex flex-col justify-between">
            <div className="flex justify-between my-auto">
                <div className="flex flex-1 mr-6 rounded-lg overflow-hidden bg-slate-700">
                    <div className="w-52 h-52 ">
                        <img src={gamemode.demo_img} className=" object-cover" />
                    </div>
                    <div className="px-4 py-2 flex flex-col">
                        <p className="text-xl">{gamemode.title}</p>
                        <p className=" text-slate-300 text-lg">BY {gamemode.author}</p>
                        <p className=" text-slate-300 text-lg my-auto">{gamemode.description}</p>
                        <p className=" text-slate-300 text-lg mt-auto"><i class="fa-solid fa-heart mr-1"></i> {gamemode.upvote.length - gamemode.downvote.length}</p>
                    </div>
                </div>
                <div className="text-3xl flex justify-around items-center pr-6">
                    <div className="grid place-content-center bg-slate-400 w-32 h-32 rounded hover:brightness-105 cursor-pointer">
                        <i class="fa-solid fa-book-open"></i>
                    </div>
                </div>
            </div>
        </div>
    )
}
