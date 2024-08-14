import React, { useContext, useEffect, useRef, useState } from 'react'
import "../../../style/create_content.css"
import CKEditorComponent from '../../modal/text_editor'
import { AppContext } from '../../../context/appContext.js'
import { useLocation, useSearchParams } from 'react-router-dom';
import Navbar from '../../primary/navbar.js'
import Login_require from '../../modal/requirements/login_require.js'

export default function Create_post() {
  const [editor, set_editor] = useState()
  const { user, history } = useContext(AppContext)
  const [is_require_login, set_is_require_login] = useState(false)
  const [searchParams] = useSearchParams();
  const { state } = useLocation()
  let is_update = searchParams.get("is_update")

  useEffect(() => {
    if (is_update && state) {
        if (editor) {
            editor.setData(state.post.content)
        }
    }
  }, [editor, state])

  useEffect(() => {

    const $ = document.querySelector.bind(document)
    const $$ = document.querySelectorAll.bind(document)

    const username = user.username
    const post_btn = $(".CC_post_btn")
    const title_input = $(".CC_title_input")
    const description_input = $(".CC_description_input")

    const overflow = $(".CC_overflow")
    const loadder = $(".CC_loadder")
    const noti_content = $(".CC_noti_content")
    const ok_btn = $(".CC_ok_btn")

    let text

    let options = {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }

    let formatter = new Intl.DateTimeFormat([], options);

    if(is_update && state) {
      title_input.value = state.post.title
      description_input.value = state.post.description
    }

    function check_valid_post() {
      let is_valid = true

      if (title_input.value.length === 0) {
        title_input.style.borderColor = "red"
        title_input.style.borderWidth = "3px"
        is_valid = false
      }
      if (description_input.value.length === 0) {
        description_input.style.borderColor = "red"
        description_input.style.borderWidth = "3px"
        is_valid = false
      }
      if (!is_valid) {
        overflow.style.display = "none"
        loadder.style.display = "block"
      }
      return is_valid
    }

    function dataURLtoBlob(dataurl) {
      let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    }

    async function uploadDataURLInChunks(dataURL, chunkSize = 5 * 1024 * 1024) {
      const blob = dataURLtoBlob(dataURL);
      const totalChunks = Math.ceil(blob.size / chunkSize);

      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, blob.size);
        const chunk = blob.slice(start, end);
        const formData = new FormData();
        formData.append('chunk', chunk, `chunk_${i}`);
        formData.append('chunkNumber', i);
        formData.append('totalChunks', totalChunks);

        try {
          const response = await fetch('https://coganh-cloud-tixakavkna-as.a.run.app/upload_chunk', {
            method: 'POST',
            body: formData
          });

          if (!response.ok) {
            throw new Error('Network response was not ok.');
          }

          const result = await response.json();

          if (result.fileURL) {
            console.log('File URL:', result.fileURL);
            return result.fileURL
          } else {
            console.log(`Chunk ${i + 1} uploaded successfully.`);
          }
        } catch (error) {
          console.error(`Error uploading chunk ${i + 1}:`, error);
          return;
        }
      }

      console.log('All data URL chunks uploaded.');
    }

    function showErr(err) {
      loadder.style.display = "none"
      noti_content.style.display = "block"
      noti_content.innerHTML = err
      noti_content.classList.add("err")
    }

    function add_post(text, url) {
      if (!check_valid_post()) return
      if(is_update) {
        // console.log(text)
        // return
        fetch('https://coganh-cloud-tixakavkna-as.a.run.app/update_post', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            author: username,
            author_id: user.id,
            content: text,
            image_url: url,
            title: title_input.value,
            description: description_input.value,
            upload_time: formatter.format(new Date()),
            id: state.post.id
          })
        });
      } else {
        fetch('https://coganh-cloud-tixakavkna-as.a.run.app/upload_post', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            author: username,
            author_id: user.id,
            content: text,
            image_url: url,
            title: title_input.value,
            description: description_input.value,
            post_id: `${new Date().getTime()}`,
            is_public: false,
            upvote: [],
            downvote: [],
            upload_time: formatter.format(new Date()),
          })
        });
      }
    }

    post_btn.onclick = async () => {
      if (!username) {
        set_is_require_login(true)
        return
      }
      let url = []
      text = editor.getData()
      let default_url = []
      let editor_url = text.match(/src="([^"]+)"/g)
      let isTDU = false

      overflow.style.display = "grid"
      loadder.style.display = "block"
      noti_content.style.display = "none"

      let status = 200

      try {
        if (editor_url) {
          editor_url.forEach((url) => {
            if (url.indexOf("http") === -1) {
              default_url.push(url.replace("src=\"", "").replace("\"", "").replaceAll("amp;", ""))
              isTDU = true
            }
          })

          if (!isTDU) {
            url.push(editor_url[0].replace("src=\"", "").replace("\"", "").replaceAll("amp;", ""))
            add_post(text, url)
          } else {
            for(let i = 0; i < default_url.length; i++) {
              let new_url = await uploadDataURLInChunks(default_url[i])
              url.push(new_url)
              text = text.replace(default_url[i], new_url)
            }
            add_post(text, url)
          }
        } else {
          add_post(text, url)
        }

        if (status === 400) return
        if(is_update) {
          noti_content.innerHTML = "Bài của bạn đã được cập nhập thành công"
        } else {
          noti_content.innerHTML = "Bài của bạn đã được gửi đi. Chúng tôi sẽ xem xét và đăng lên nếu phù hợp"
        }
        loadder.style.display = "none"
        noti_content.style.display = "block"
        noti_content.classList.add("success")
      } catch (err) {
        showErr(err)
      }
    }

    ok_btn.onclick = () => {
      overflow.style.display = "none"
    }

  }, [editor])

  return (
    <div className='dark:text-black dark:bg-white text-center'>
      <Navbar mode="light" back_link="/post_page" />
      {is_require_login && <Login_require set_is_require_login={set_is_require_login} />}
      <div style={{ display: "none" }} className="CC_overflow">
        <div className="CC_notification">
          <div className="CC_loadder">
            <div className="CC_loading" />
          </div>
          <div style={{ display: "none" }} className="CC_noti_content CC_success">
            
          </div>
          <div className="CC_ok_btn">OK</div>
        </div>
      </div>
      <div className="CC_header">Tạo blog</div>
      <div className="CC_title">
        <input placeholder="nhập tiêu đề" type="text" className="CC_title_input" />
      </div>
      <textarea
        placeholder="nhập mô tả"
        className="CC_description_input"
        defaultValue={""}
      />
      <div id="container">
        <CKEditorComponent set_editor={(data) => {
          set_editor(data)
        }} />
      </div>
      <div className="CC_btns justify-center">
        <div className="CC_cancel_btn">Hủy</div>
        <div className="CC_post_btn text-white">{is_update ? "Lưu" : "Đăng"}</div>
      </div>
    </div>
  )
}
