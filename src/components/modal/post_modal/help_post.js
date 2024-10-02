import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../../context/appContext'

import logo from "../../../static/img/logo.png"

export default function Help_post() {
    const { history } = useContext(AppContext)
    const [posts, set_posts] = useState([])
    const [post_chunk_index, set_post_chunk_index] = useState(0)


    useEffect(() => {
        fetch(`http://127.0.0.1:8080/get_posts?type=help_post&page=${post_chunk_index}&size=10`)
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
            <img
                style={{ width: 80, height: 80 }}
                src="https://jungle-laborer-6ce.notion.site/icons/mathematics_green.svg?mode=dark"
                alt=""
            />
            <div className="code_guide_title">Định hướng xây dựng thuật toán</div>
            <div className="cod_guide_description">
                Để có thể xây dựng thuật toán đánh cờ của chính mình, ta có thể tham khảo
                các thuật toán phổ biến như{" "}
                <span style={{ fontWeight: "bold" }}>MCTS</span>,{" "}
                <span style={{ fontWeight: "bold" }}>UCT</span>,{" "}
                <span style={{ fontWeight: "bold" }}>Minimax</span> … Các thuật toán này
                đều mang một ý tưởng chung là tính toán ra các biến thiên từ trạng thái
                bàn cờ hiện tại, so sánh đánh giá tình trạng của chúng với nhau để tìm ra
                nước đi tốt nhất.
                <hr style={{ margin: "10px 0", width: 1, height: 1 }} />
                Thế nhưng để đánh giá tình trạng bàn cờ, ta phải bắt đầu từ việc mô phỏng
                bàn cờ sau những nước đi, giúp bot hiểu được làm thế nào để ăn quân từ đó
                lựa chọn nước đi tối ưu lợi ích.
                <hr style={{ margin: "10px 0", width: 1, height: 1 }} />
                **Bot của người chơi có mặc định màu{" "}
                <span style={{ fontWeight: "bold", color: "#007BFF" }}>
                    xanh dương
                </span>{" "}
                và đối thủ là màu{" "}
                <span style={{ fontWeight: "bold", color: "red" }}>đỏ</span>.**
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
                        <img className="h-auto" src={post.image_url[0] || logo} alt="" />
                        <div className="back_drop" />
                    </div>
                </div>
            )}
            </div>
        </div>
    )
}
