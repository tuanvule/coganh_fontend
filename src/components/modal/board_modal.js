import React from 'react'

export default function Board_modal() {
  return (
    <>
        <div className="relative w-full h-full overflow-hidden">
            <div className="absolute w-full h-[4px] top-1/4 -translate-y-1/2 bg-black"></div>
            <div className="absolute w-full h-[4px] top-2/4 -translate-y-1/2 bg-black"></div>
            <div className="absolute w-full h-[4px] top-3/4 -translate-y-1/2 bg-black"></div>
            <div className="absolute w-[4px] h-full left-1/4 -translate-x-1/2 bg-black"></div>
            <div className="absolute w-[4px] h-full left-2/4 -translate-x-1/2 bg-black"></div>
            <div className="absolute w-[4px] h-full left-3/4 -translate-x-1/2 bg-black"></div>
            <div className="absolute w-[4px] h-[300%] -left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black -rotate-45"></div>
            <div className="absolute w-[4px] h-[300%] left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black -rotate-45"></div>
            <div className="absolute w-[4px] h-[300%] -translate-x-1/2 -translate-y-1/2 bg-black -rotate-45"></div>
            <div className="absolute w-[4px] h-[300%] top-[150%] -translate-x-1/2 -translate-y-1/2 bg-black rotate-45"></div>
            <div className="absolute w-[4px] h-[300%] top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black rotate-45"></div>
            <div className="absolute w-[4px] h-[300%] top-full -translate-x-1/2 -translate-y-1/2 bg-black rotate-45"></div>
        </div>
    </>
  )
}
