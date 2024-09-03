import React from 'react'

export default function Notification({content, set_is_open}) {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-20 z-[100000000000000]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0757ad] w-1/3 h-3/4 rounded-2xl grid place-content-center px-20">
          <div className="flex flex-col items-center text-2xl"> 
              <p className="text-3xl text-center">
                {content}
              </p>
              <div onClick={() => set_is_open({open: false, content: ""})} className="text-2xl py-1 px-4 rounded-lg mt-10 bg-[#278ae8] hover:brightness-90 cursor-pointer select-none">OK</div>
          </div>
      </div>
    </div>
  )
}
