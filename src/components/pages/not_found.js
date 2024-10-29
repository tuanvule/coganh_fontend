import React, { useContext } from 'react'
import { AppContext } from '../../context/appContext'
import logo from "../../static/img/logo.png"

export default function NotFoundPage() {
    const { history } = useContext(AppContext)

    return (
        <div className="fixed top-0 left-0 bottom-0 right-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center select-none">
                <img src={logo} className="w-40 h-40"/>
                <p className="text-5xl mt-4 mb-10">NO PAGE FOUND</p>
                <a className="menu_btn block no-underline dark:text-white text-xl border text-center cursor-pointer transition-all duration-[0.2s] ease-linear mb-5 px-[60px] py-2.5 rounded-[5px] border-solid border-[#007BFF] hover:bg-[#007BFF] hover:no-underline hover:text-white" onClick={() => history("/menu")}>
                    Menu
                </a>
            </div>
        </div>
    )
}
