import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../../../context/appContext'
import Navbar from '../../primary/navbar'
import Sidebar from '../../primary/sidebar'

import chessboard1 from "../../../static/img/chessboard1.png"
import bot_bot from "../../../static/img/bot_bot.png"
import visualize from "../../../static/img/visualize.png"
import post_page from "../../../static/img/post_page.png"
import form_img from "../../../static/img/form.png"
import freedoom from "../../../static/img/freedom.png"

import "../../../style/style.css"
import "../../../style/menu.css"
import Login_require from '../../modal/requirements/login_require'

export default function Menu() {
  const { history, user } = useContext(AppContext)

  const [is_require_login, set_is_require_login] = useState(false)

  useEffect(() => {
    const fightBotDir = document.querySelector(".bot_bot")
    const notification = document.querySelector(".notification")
    const backBtn = document.querySelector(".notification_directional--back")
    const sign = document.querySelector(".sign")
    const sign_btn = document.querySelector(".sign_btn")
    const create_bot_btn = document.querySelector(".create_bot")
    const fightBotBtn = document.querySelector(".bot_bot")
    const visualizeBtn = document.querySelector(".visualize")
    const training_btn = document.querySelector(".training")
    const freedom_mode = document.querySelector(".freedom_mode")

    const isMobile = (window.innerWidth <= 500)
    window.onresize = null

    window.onload = null

      fightBotBtn.onclick = () => {
        if (isMobile) {
          sign.style.display = "flex"
        } else {
          history("/bot_bot")
          // window.location.href = "/bot_bot"
        }
      }
      create_bot_btn.onclick = () => {
        if (isMobile) {
          sign.style.display = "flex"
        } else {
          history("/create_bot")
          // window.location.href = "/create_bot"
        }
      }
      visualizeBtn.onclick = () => {
        history("/visualize_page")
      }
      training_btn.onclick = () => {
        if (isMobile) {
          sign.style.display = "flex"
        } else {
          history("/task_list")
        }
      }
      freedom_mode.onclick = () => {
        if (isMobile) {
          sign.style.display = "flex"
        } else {
          history("/freedom")
        }
      }
      sign_btn.onclick = () => sign.style.display = "none"
      backBtn.onclick = () => notification.style.display = "none"
    }, [user])

  return (
    <div className=" overflow-scroll dark:bg-[#1e1926] dark:color-white pb-5">
      <Navbar back_link="/"/>
      {is_require_login && <Login_require set_is_require_login={set_is_require_login}/>}
      <link rel="stylesheet" href="../static/css/style.css" />
      <link rel="stylesheet" href="../static/css/animation.css" />
      <link rel="stylesheet" href="../static/css/menu.css" />
      <div className="notification" style={{ display: "none" }}>
        <div className="notification_header">
          <i className="fa-solid fa-face-frown" />
        </div>
        <div className="notification_content">
          oops, có lẽ bạn chưa có bot hoặc bot của bạn đang bị lỗi. hãy kiểm tra lại
          bot của bạn nhé
        </div>
        <div className="notification_directional">
          <div className="notification_directional--back">quay lại</div>
          <div className="notification_directional--create_bot">
            <a
              style={{ color: "#fff", textDecoration: "none" }}
              href="/create_bot"
            >
              tạo bot
            </a>
          </div>
        </div>
      </div>
      <br />
      <div className="menu_content">
        <div className="main">
          <div className="main_image">
            <img
              src={chessboard1}
              alt=""
              className="main_img dark:brightness-95 "
            />
            <a
              className="main_image_link text-blue-800 decoration-solid"
              href="https://www.youtube.com/watch?v=FU3auCFYGJc"
            >
              Hướng dẫn chơi cờ gánh
            </a>
          </div>
          <div className="main_nav_module">
            <div className="code_require dark:bg-[#0e335b] bg-[#52b1ff]">
              <h2 className="text-2xl font-bold">Programing</h2>
              <a className="btn dark:bg-[#111c2c] bg-[#007BFF] create_bot">Create bot</a>
              <a className="btn dark:bg-[#111c2c] bg-[#007BFF] training">Training</a>
            </div>
            <div className="non_code dark:bg-[#0e335b] bg-[#52b1ff]">
              <h2 className="text-2xl font-bold">Play chess</h2>
              <a className="btn dark:bg-[#111c2c] bg-[#007BFF]" onClick={() => history("/gamemode", {state: {mode: "human_bot"}})}>
                Human vs Bot
              </a>
            </div>
          </div>
        </div>
        <div className="detail_module mx-auto w-full">
          <div className="detail_module_title">Others</div>
          <div className="detail_list">
            <div className="detail_item dark:bg-[#0e335b] bg-[#52b1ff]">
              <div className="detail_nav">
                <div className="icon">
                  <i class="fa-solid fa-sliders"></i>
                </div>
                <a className="btn2 freedom_mode">Freedom mode</a>
              </div>
              <div className="detail_image dark:bg-black bg-slate-200">
                <img className="object-contain" src={freedoom} alt="" />
              </div>
            </div>
            <div className="detail_item dark:bg-[#0e335b] bg-[#52b1ff]">
              <div className="detail_image dark:bg-black bg-slate-200">
                <img className="object-cover" src={bot_bot} alt="" />
              </div>
              <div className="detail_nav">
                <div className="icon">
                  <i className="fa-solid fa-robot" />
                </div>
                <a className="btn2 bot_bot">Bot vs Bot</a>
              </div>
            </div>
            <div className="detail_item dark:bg-[#0e335b] bg-[#7ac8ff]">
              <div className="detail_nav">
                <div className="icon">
                  <i className="fa-solid fa-book-open" />
                </div>
                <a onClick={() => history("/post_page")} className="btn2 pp">
                  Blog
                </a>
              </div>
              <div className="detail_image dark:bg-black bg-slate-200">
                <img className="object-cover" src={post_page} alt="" />
              </div>
            </div>
            <div className="detail_item dark:bg-[#0e335b] bg-[#7ac8ff]">
              <div className="detail_image dark:bg-black bg-slate-200">
                <img className="object-cover" src={visualize} alt="" />
              </div>
              <div className="detail_nav">
                <div className="icon">
                  <i className="fa-brands fa-staylinked" />
                </div>
                <a className="btn2 visualize">Visualize</a>
              </div>
            </div>
          </div>
        </div>
        <div className="sign bg-[#0757ad]">
          <div className="sign_content">
            Chức năng này phù hợp với dạng thiết bị: máy tính, laptop,... Chúng tôi
            khuyên bạn nên sử dụng thiết bị như trên để có trải nghiệm tốt nhất
          </div>
          <div className="sign_btn">OK</div>
        </div>
        {/* <a className="btn" href="/training', id="") }}">Thử thách</a> */}
      </div>

      <div className="contact lg:w-3/5 w-[90%] mx-auto mt-10 flex flex-col lg:flex-row justify-center">
        <div className="lg:w-[49%] w-full text-center text-3xl mb-4">
          <p>Bạn thấy thế nào về Coganh</p>
          <div className="w-full my-4 rounded-lg overflow-hidden">
            <img className=" object-cover" src={form_img}/>
          </div>
          <p>Hãy đánh giá tại đây</p>
        </div>
        <div className="w-[2%]"></div>
        <div className="lg:w-[49%] w-full pl-6 py-4 flex flex-col dark:bg-slate-700 bg-slate-300 rounded-lg">
          <p className="text-2xl font-bold">Thành viên</p>
          <ul className="p-0 m-0">
            <li>Lê Tuấn Vũ</li>
            <li>Thông Minh Quân</li>
            <li>Nguyễn Quang Huy</li>
            <li>Nguyễn Thành Tài</li>
            <li>Phạm Vũ Minh Phương</li>
            <li>Đinh Huỳnh Vinh Quang</li>
          </ul>
          <p className="text-2xl font-bold mt-4">Cố vẫn</p>
          <p>Nguyễn Thị Bích Hảo</p>
          <p className="text-2xl font-bold mt-4">Đơn vị</p>
          <p>THPT Nguyễn Hữu Huân</p>
          <p>NHH IT club</p>
          
          <div className="mt-auto">
            -----------------------------
            <p>Contact: itclub.nhh@gmail.com</p>
            <p>Fanpage: facebook.com/itclub.nhh</p>
          </div>
        </div>
      </div>
    </div>
  )
}
