import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../../context/appContext'

import logo from "../../../static/img/logo.png"

export default function Gamemode_post() {
    const { history } = useContext(AppContext)
    const [posts, set_posts] = useState([])
    const [post_chunk_index, set_post_chunk_index] = useState(0)


    useEffect(() => {
        fetch(`http://192.168.1.249:8080/get_posts?type=gamemode&page=${post_chunk_index}&size=10`)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                set_posts(data)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    return (
        <div className="code_guide">
        <p className="text-6xl text-green-500"><i class="fa-solid fa-gamepad"></i></p>
        <div className="code_guide_title">Các chế độ chơi khác</div>
        <div className="cod_guide_description">
            Các chế độ chơi do website và người dùng làm ra nhằm tăng tính đa dạng cho cờ gánh
        </div>
        <div className="posts_list">
        {posts.map((post,i) => 
            <div key={i} className="posts_item">
                <div className="review_info">
                    <div className="author">
                        <div className="author_avatar dark:bg-white">
                            <img src={logo} className=" object-cover"/>
                        </div>
                        <div onClick={() => history("/user/" + post.author_id)} className="author_name dark:text-gray-300 lg:text-xl sm:text-[1px] md:text-[1px]">
                            Coganh
                        </div>
                        <div className={`upload_time dark:text-gray-300 text-base`}>{post.upload_time}</div>
                    </div>
                    <a
                        onClick={() => history("/post/" + post.id, { state: post })}
                        className="review_title dark:text-gray-200"
                    >{post.title}</a>
                    <div className="review_decription">{post.description}</div>
                </div>
                <div
                    onClick={() => history("/post/" + post.id, { state: post })}
                    className="review_img bg-white place-content-center lg:grid md:grid hidden"
                >
                    <img className="h-auto" src={post.demo_img || logo} alt="" />
                    <div className="back_drop" />
                </div>
            </div>
        )}
        </div>
    </div>
    )
}
