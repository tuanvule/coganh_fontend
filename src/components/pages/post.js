import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'

import "../../style/post.css"
import { AppContext } from '../../context/appContext'
import Comment_modal from '../modal/comment_modal'
import Navbar from '../primary/navbar'
import Vote_modal from '../modal/vote_modal'

export default function Post() {
  const { theme, history } = useContext(AppContext)
  const { state } = useLocation()
  const { post_id } = useParams()
  const [post, set_post] = useState({})
  const [comment_count, set_comment_count] = useState(0)
  const [is_mobile, set_is_mobile] = useState((window.innerWidth < 1025))

  console.log(state)

  useEffect(() => {
    window.onresize = () => {
      set_is_mobile((window.innerWidth < 1025))
    }
  }, [])

  useEffect(() => {
    if (state) {
      set_post(state)
    } else {
      fetch("https://coganh-cloud-827199215700.asia-southeast1.run.app/get_post_by_id/" + post_id)
        .then(res => res.json())
        .then(data => {
          set_post(data)
        })
        .catch(err => console.log(err))
    }
  }, [state, post_id])

  useEffect(() => {
    document.querySelectorAll(".notion-enable-hover").forEach(item => {
      if(theme === "dark") {
        item.style.backgroundColor = "#444"
        item.style.color = "#fff"
      } else {
        item.style.backgroundColor = "#FBF3Db"
        item.style.color = "#000"
      }
    })
    document.querySelectorAll("a").forEach(item => {
      item.style.textDecoration = "underline"
      item.style.color = "#0866FF"
    })
    document.querySelectorAll("figcaption").forEach(item => {
      if(theme === "dark") {
        item.style.color = "#ccc"
        item.style.textDecoration = "none"
      }
    })
    document.querySelectorAll("pre").forEach(item => {
      item.style.color = "white"
    })
  })

  function scroll_to_comment() {
    const element = document.querySelector("#comment_modal");
    element.scrollIntoView({ block: 'end',  behavior: 'smooth' });
  }

  function copy_to_clipBoard() {
    navigator.clipboard.writeText(window.location);
    alert("copy to clipboard")
  }
  console.log(post)

  return (
    <div className="relative w-full h-full flex justify-center">
      <Navbar back_link="/post_page"/>
      {!is_mobile &&
        <div className="absolute top-28 left-28 text-6xl select-none">
          {post && <Vote_modal type="post" doc={post}/>}
          <i onClick={() => scroll_to_comment()} class="fa-solid fa-comment dark:text-[#a0d8fa] text-[#007bff] hover:brightness-90 cursor-pointer"></i>
          <p className="text-2xl text-center">{comment_count}</p>
        </div>
      }
      <div className="P_container lg:w-[60%] w-90%">
        <h1 className="P_title">{post && post.title}</h1>
        <div className="P_user">
          <div className="P_user_avatar dark:text-[#007BFF]">{post && post.author && post.author[0].toUpperCase()}</div>
          <div className="P_user_info">
            <div onClick={() => history("/user/"+post.author_id)} className="P_user_name">{post && post.author}</div>
            <div className="time">{post && post.upload_time}</div>
          </div>
          <div className="selection">
            <div onClick={copy_to_clipBoard} className="copy_link">
              <i className="fa-solid fa-link" />
            </div>
          </div>
        </div>
        {is_mobile && <div className="flex select-none items-center">
          {post && <Vote_modal type="post" doc={post} is_mobile={is_mobile}/>}
          <i onClick={() => scroll_to_comment()} class="fa-solid fa-comment text-[#a0d8fa] lg:text-6xl mr-3 lg:mr-0 text-xl hover:brightness-90 cursor-pointer"></i>
          <p className="text-2xl text-center">{comment_count}</p>
        </div>
        }
        <div dangerouslySetInnerHTML={{ __html: post && post.content }}></div>
        {post.type === "create_game_mode" && 
        <div className="flex">
          <div onClick={() => history(`/human_bot?title=${post.title}&upload_time=${post.upload_time}`, {state: {}})}
           className="bg-[#007bff] mr-4 w-fit text-2xl px-6 py-2 rounded mt-6 pointing_event_br-95">
            Chơi thử
          </div>  
          <div onClick={() => history(`/create_bot?title=${post.title}&upload_time=${post.upload_time}`)} className="bg-[#007bff] w-fit text-2xl px-6 py-2 rounded mt-6 pointing_event_br-95">
            Viết bot
          </div>  
        </div>}
        <Comment_modal bg={theme === "dark" ? "bg-[#0e335b]" : "bg-[#a3dcff]"} set_comment_count={set_comment_count} post_id={post_id}/>
      </div>
    </div>

  )
}
