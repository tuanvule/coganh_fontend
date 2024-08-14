import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../../context/appContext'
import Login_require from './requirements/login_require'

export default function Comment_modal({ post_id = null, task_id = null, bg = "bg-[#0e335b]", px = "px-4", set_comment_count, }) {
  const { user } = useContext(AppContext)
  const [value, set_value] = useState("")
  const [is_reset, set_is_reset] = useState(0)
  const [is_require_user, set_is_require_user] = useState(false)
  const [comments, set_comments] = useState([])
  const [chunk_index, set_chunk_index] = useState(0)
  const input_ref = useRef(null)
  const send_btn_ref = useRef(null)
  const max_value_text_ref = useRef(null)

  function parseDateString(dateString) {
    let [datePart, timePart, period] = dateString.split(/[\s,]+/);
    // Tách phần ngày thành tháng, ngày và năm
    let [month, day, year] = datePart.split('/');
    // Tách phần thời gian thành giờ, phút và giây
    let [hour, minute, second] = timePart.split(':');

    hour = parseInt(hour, 10);
    if (period === 'PM' && hour !== 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }

    // Định dạng giờ, phút và giây với 2 chữ số
    hour = String(hour).padStart(2, '0');
    minute = String(minute).padStart(2, '0');
    second = String(second).padStart(2, '0');

    // Tạo đối tượng Date với múi giờ Asia/Ho_Chi_Minh
    return new Date(year, month, day, hour, minute, second);
  }


  // Sắp xếp danh sách chuỗi thời gian

  function sort_date(tasks, date) {
    return tasks.sort((a, b) => {
      let dateA = parseDateString(a[date]);
      let dateB = parseDateString(b[date]);
      return (dateA - dateB);
    });
  }

  function handle_data(data, date) {
    data = data.reverse()
    set_comment_count(data.length)
    let sorted_data = sort_date(data, date).reverse()
    let d = []
    for (let i = 0; i < data.length; i += 20) {
      const chunk = sorted_data.slice(i, i + 20);
      d.push(chunk)
    }
    return d
  }
  console.log("hell3")

  useEffect(() => {
    console.log(post_id, task_id)
    if (post_id) {
      fetch(`https://coganh-cloud-tixakavkna-as.a.run.app/get_post_comments/${post_id}`)
        .then(res => res.json())
        .then(data => {
          let comment = handle_data(data, "comment_time")
          console.log(comment)
          set_comments(comment)
        })
        .catch(err => console.log(err))
    } else if (task_id) {
      fetch(`https://coganh-cloud-tixakavkna-as.a.run.app/get_task_comments/${task_id}`)
      .then(res => res.json())
      .then(data => {
        let comment = handle_data(data, "comment_time")
        set_comments(comment)
      })
      .catch(err => console.log(err))
    }
  }, [is_reset])

  let options = {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }

  function handle_send_comment() {
    if (user.username) {
      if (input_ref.current.value.length === 0) {
        max_value_text_ref.current.style.display = "block"
        return
      } else {
        let formatter = new Intl.DateTimeFormat([], options);
        fetch('https://coganh-cloud-tixakavkna-as.a.run.app/handle_comment', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: user.username,
            u_id: user.id,
            comment: value,
            comment_time: formatter.format(new Date()),
            post_id: post_id,
            task_id: task_id
          })
        })
        .then(res => res.json())
        .then(msg => {
          console.log(msg)
          set_is_reset(Math.random())
        })
        // db.collection("comments").add({
        //   username: user.username,
        //   u_id: user.id,
        //   comment: value,
        //   comment_time: formatter.format(new Date()),
        //   post_id: post_id,
        //   task_id: task_id
        // })
      }
    } else {
      set_is_require_user(true)
    }
  }

  function handle_input(value) {
    set_value(value)
    max_value_text_ref.current.style.display = "none"
  }
  console.log(bg)

  return (
    <div id='comment_modal' className={` ${bg} w-full ${px} py-4 rounded mt-4 overflow-x-hidden`}>
      {is_require_user && <Login_require set_is_require_login={set_is_require_user} />}
      <div className="text-2xl dark:text-[#a0d8fa] text-[#007bff] font-semibold flex items-center"><i class="fa-solid fa-comment mr-4"></i> Comment</div>
      <div className="my-4 ">
        <textarea ref={input_ref} value={value} onChange={(e) => handle_input(e.target.value)} className={`w-full h-20 p-2 outline-none ${bg} dark:placeholder:text-slate-300 placeholder:text-slate-700 border dark:border-white border-[#004ab3] focus:border-[#007bff] resize-none rounded`} placeholder="Nhập bình luận tại đây"></textarea>
        <p ref={max_value_text_ref} className="text-red-400 hidden">Tối đa 350 chữ</p>
        <div ref={send_btn_ref} onClick={() => handle_send_comment()} className={`text-xl mt-2 px-4 py-1 border dark:border-[#a0d8fa] border-[#007bff] w-fit rounded hover:brightness-90 cursor-pointer select-none transition-all ${value.length === 0 ? "" : "dark:bg-[#a0d8fa] dark:text-black bg-[#007bff] text-white"}`}><i class="fa-solid fa-paper-plane"></i></div>
      </div>
      <ul className="p-0">
        {comments[chunk_index] && comments[chunk_index].map((cm, i) =>
          <li className="mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 grid place-content-center text-3xl rounded-full bg-white text-[#007BFF] font-bold mr-4">{cm && cm.username[0].toUpperCase()}</div>
              <div className="text-lg">
                <div className="text-lg font-semibold">{cm.username}</div>
                <div className={`text-base ${bg === "bg-[#0e335b]" || bg === "bg-[#262626]" ? "text-slate-300" : "text-slate-700"} `}>{cm.comment_time}</div>
              </div>
            </div>
            <div className="pl-14 mt-1">
              {cm.comment}
            </div>
          </li>
        )}
      </ul>
    </div>
  )
}
