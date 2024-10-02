import React from 'react'

export default function Spining({loading_w}) {
  return (
    // <div className="w-full h-full bg-black">
        <div className={`w-full h-full border-t-[${loading_w}] border-black border border-t-white rounded-full animate-spin select-none`}></div>
    // </div>
  )
}
