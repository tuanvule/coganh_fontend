import React, { useContext, useEffect } from 'react'
import "../../../style/visualize_page.css"

import valid_move_visualize from "../../../static/img/valid_move_visualize.png"
import ganh_chet_visualize from "../../../static/img/ganh_chet_visualize.png"
import vay_visualize from "../../../static/img/vay_visualize.png"
import visualize from "../../../static/img/visualize.png"
import { AppContext } from '../../../context/appContext'
import Navbar from '../../primary/navbar'

export default function Visualize_page() {
    const { history } = useContext(AppContext)

    // useEffect(() => {

    // })

    return (
        <div className="VP_container pt-[80px] lg:px-[20%] md:px-[10%] px-10 lg:text-left text-center">
            <Navbar/>
            <div className="VP_title">Mô phỏng thuật toán</div>
            <div className="visualize_type">Thuật toán bàn cờ</div>
            <ul className="visualize_list p-0 grid lg:grid-cols-3 md:grid-cols-3 gap-10 justify-center mb-10">
                <li className="visualize_item lg:w-[250px] lg:h-[250px] md:w-[200px] md:h-[200px] w-[300px] h-[300px]">
                    <a onClick={() => history("/visualize/"+"OYRJNv4Jqez9dKZjLW27", { state: "OYRJNv4Jqez9dKZjLW27" })}>
                        <img
                            src={valid_move_visualize}
                            alt=""
                            className="visualize_image"
                        />
                        <div className="name">NƯỚC ĐI HỢP LỆ</div>
                    </a>
                    <div className="name lg:hidden">NƯỚC ĐI HỢP LỆ</div>
                </li>
                <li className="visualize_item lg:w-[250px] lg:h-[250px] md:w-[200px] md:h-[200px] w-[300px] h-[300px]">
                    <a onClick={() => history("/visualize/"+"aLzIcTxFR2EfRXVFov07", { state: "aLzIcTxFR2EfRXVFov07" })}>
                        <img
                            src={ganh_chet_visualize}
                            alt=""
                            className="visualize_image"
                        />
                        <div className="name">GÁNH CHẸT</div>
                    </a>
                    <div className="name lg:hidden">GÁNH CHẸT</div>
                </li>
                <li className="visualize_item lg:w-[250px] lg:h-[250px] md:w-[200px] md:h-[200px] w-[300px] h-[300px]">
                    <a onClick={() => history("/visualize/"+"1OyReHWrH3zgV5IfcZPk", { state: "1OyReHWrH3zgV5IfcZPk" })}>
                        <img
                            src={vay_visualize}
                            alt=""
                            className="visualize_image"
                        />
                        <div className="name">VÂY</div>
                    </a>
                    <div className="name lg:hidden">VÂY</div>
                </li>
            </ul>
            <div className="visualize_type">Thuật toán nâng cao</div>
            <ul className="visualize_list mb-0 p-0 pb-10 grid lg:grid-cols-3 md:grid-cols-3 gap-10 justify-center">
                <li className="visualize_item lg:w-[250px] lg:h-[250px] md:w-[200px] md:h-[200px] w-[300px] h-[300px]">
                    <a onClick={() => history("/visualize/"+"SctXzAxW6TtcMSPwPm1N", { state: "SctXzAxW6TtcMSPwPm1N" })}>
                        <img
                            src={visualize}
                            alt=""
                            className="visualize_image"
                        />
                        <div className="name">MINIMAX</div>
                    </a>
                </li>
            </ul>
        </div>

    )
}
