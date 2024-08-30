import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../../context/appContext'

import logo from "../../../static/img/logo.png"

export default function User_post() {
    const { history } = useContext(AppContext)
    const [posts, set_posts] = useState([])
    const [post_chunk_index, set_post_chunk_index] = useState(0)


    useEffect(() => {
        fetch(`http://192.168.1.249:8080/get_posts?type=user_post&page=${post_chunk_index}&size=10`)
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
    <div className="posts">
          <div className="posts_title">Bài đăng nổi bật</div>
          <div className="posts_list">
          {posts.map((post,i) => 
            <div key={i} className="posts_item">
              <div className="review_info">
                <div className="author">
                  <div className="author_avatar dark:bg-white">
                    {post.author[0].toUpperCase()}
                  </div>
                  <div className="author_name dark:text-gray-300">
                    {post.author}
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
                <img className="h-auto object-contain" src={post.image_url[0] || logo} alt="" />
                <div className="back_drop" />
              </div>
            </div>
            )}
          </div>
        </div>
  )
}
