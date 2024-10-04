import React, { useContext, useEffect, useRef, useState } from 'react'
import "../../../style/create_content.css"
import CKEditorComponent from '../../modal/text_editor'
import { AppContext } from '../../../context/appContext.js'
import { useLocation, useSearchParams } from 'react-router-dom';
import Navbar from '../../primary/navbar.js'
import Login_require from '../../modal/requirements/login_require.js'

import level1 from "../../../static/img/level1.png"
import level2 from "../../../static/img/level2.png"
import level3 from "../../../static/img/level3.png"
import level4 from "../../../static/img/level4.png"
import Master from "../../../static/img/Master.png"

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/worker-javascript";
import "ace-builds/webpack-resolver";

export default function Create_gamemode() {
    const [editor, set_editor] = useState()
    const { user, history } = useContext(AppContext)
    const [is_require_login, set_is_require_login] = useState(false)
    const [is_use_own_bot, set_is_use_own_bot] = useState(false)
    const [post, set_post] = useState(null)
    const [code, set_code] = useState("")
    const [searchParams] = useSearchParams();
    const { state } = useLocation()
    let is_update = searchParams.get("is_update")

    const file_detector = useRef(null)
    const file_input = useRef(null)
    const animation_bar_ref = useRef(null)
    const add_bot_btn_ref = useRef(null)
    const your_own_bot_list_ref = useRef(null)
    const demo_gamemode_image_ref = useRef(null)
    const BR_save_btn = useRef(null)

    useEffect(() => {
        if(is_update && !post) {
            fetch("https://coganh-cloud-827199215700.asia-southeast1.run.app/get_post_by_id/" + state.post_id)
            .then(res => res.json())
            .then(data => set_post(data))
            .catch(err => console.log(err))
        }
    }, [])

    useEffect(() => {
        if (is_update && post) {
            if (editor) {
                editor.setData(post.content)
            }
        }
      }, [editor, state, post])

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

        if (is_update && state && post) {
            title_input.value = post.title
            description_input.value = post.description
            demo_gamemode_image_ref.current.value = state.demo_img
            set_code(JSON.parse(state.break_rule).code)
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
            console.log(is_valid)
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
                    const response = await fetch('https://coganh-cloud-827199215700.asia-southeast1.run.app/upload_chunk', {
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

        async function add_post(text, url) {
            let upload_time = formatter.format(new Date())

            if (!check_valid_post()) return
                // console.log(text)
                // return
            if (!is_update) {
                let fetchData  = await fetch('https://coganh-cloud-827199215700.asia-southeast1.run.app/upload_post', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        type: "create_game_mode",
                        author: username,
                        author_id: user.id,
                        content: text,
                        image_url: url,
                        title: title_input.value,
                        description: description_input.value,
                        id: `${new Date().getTime()}`,
                        is_public: false,
                        upvote: [],
                        downvote: [],
                        upload_time: upload_time,
                        demo_img: demo_gamemode_image_ref.current.value
                    })
                })
                let data = await fetchData.json()
                return {...data, upload_time}
            } else {
                console.log({
                    content: text,
                    image_url: url,
                    title: title_input.value,
                    description: description_input.value,
                    update_time: upload_time,
                    demo_img: demo_gamemode_image_ref.current.value,
                    id: state.post_id
                })
                let fetchData  = await fetch('https://coganh-cloud-827199215700.asia-southeast1.run.app/update_post/'+state.post_id, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${user.access_token}`,
                    },
                    body: JSON.stringify({
                        content: text,
                        image_url: url,
                        title: title_input.value,
                        description: description_input.value,
                        update_time: upload_time,
                        demo_img: demo_gamemode_image_ref.current.value,
                        id: state.post_id
                    })
                })
                let data = await fetchData.json()
                return {...data, upload_time, id: state.post_id}
            }
        }

        function readFileAsText(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject(reader.error);
                reader.readAsText(file);
            });
        }

        async function add_gamemode(upload_time, post_id) {
            let bots = []
            let file_inputs = document.querySelectorAll(".code_file")
            let bot_names = document.querySelectorAll(".CG_bot_name")
            let bot_avatars = document.querySelectorAll(".CG_bot_avatar")
            // let data = {}

            if(file_inputs[0].files[0]) {
                for(let i = 0; i < file_inputs.length; i++) {
                    const code = await readFileAsText(file_inputs[i].files[0])
                    bots.push({
                        code: code,
                        name: bot_names[i].value,
                        avatar: bot_avatars[i].value
                    })
                }
            }

            console.log(is_use_own_bot ? bots : [])
            // return

            if(!is_update) {
                let fetchData  = await fetch('https://coganh-cloud-827199215700.asia-southeast1.run.app/create_gamemode', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        author: username,
                        author_id: user.id,
                        title: title_input.value,
                        description: description_input.value,
                        upload_time: upload_time,
                        gamemode_id: `${new Date().getTime()}`,
                        post_id: post_id,
                        break_rule: JSON.stringify({code : await readFileAsText(file_input.current.files[0])}),
                        bots: is_use_own_bot && bots.length > 0 ? bots : [],
                        demo_img: demo_gamemode_image_ref.current.value,
                        upvote: [],
                        downvote: [],
                        is_public: false
                    })
                })
                let data = await fetchData.json()
                return data
            } else {
                let fetchData  = await fetch('https://coganh-cloud-827199215700.asia-southeast1.run.app/update_gamemode/'+state.id, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${user.access_token}`,
                    },
                    body: JSON.stringify({
                        title: title_input.value,
                        description: description_input.value,
                        break_rule: file_input.current.files[0] ? JSON.stringify({code : await readFileAsText(file_input.current.files[0])}) : "",
                        bots: is_use_own_bot ? bots : [],
                        demo_img: demo_gamemode_image_ref.current.value,
                        update_time: upload_time,
                        id: state.id
                    })
                })
                let data = await fetchData.json()
                return data
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

            // add_game_mode("123")

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
                        let res = await add_post(text, url)
                        let { upload_time, id, code } = res
                        if(code === 400) {
                            showErr(res.err)
                            return
                        }
                        let GM_res = await add_gamemode(upload_time, id)
                        if(GM_res.code === 400) {
                            showErr(GM_res.err)
                            return
                        }
                    } else {
                        for (let i = 0; i < default_url.length; i++) {
                            let new_url = await uploadDataURLInChunks(default_url[i])
                            url.push(new_url)
                            text = text.replace(default_url[i], new_url)
                        }
                        let res = await add_post(text, url)
                        let { upload_time, id, code } = res
                        if(code === 400) {
                            showErr(res.err)
                            return
                        }
                        let GM_res = await add_gamemode(upload_time, id)
                        if(GM_res.code === 400) {
                            showErr(GM_res.err)
                            return
                        }
                    }
                } else {
                    let res = await add_post(text, url)
                    let { upload_time, id, code } = res
                    if(code === 400) {
                        showErr(res.err)
                        return
                    }
                    let GM_res = await add_gamemode(upload_time, id)
                    if(GM_res.code === 400) {
                        showErr(GM_res.err)
                        return
                    }
                }

                if (status === 400) return
                
                noti_content.innerHTML = "Đã gửi đi thành công. Chúng tôi sẽ xem xét và đưa vào nếu nó phù hợp. Cảm ơn bạn đã đóng góp 😍😍"
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

    }, [editor, post])

    function create_your_own_bot_item(dem) {
        // Tạo phần tử <li> với class "mb-4"
        const li = document.createElement("li");
        li.className = "mb-4";

        // Tạo phần tử <p> cho số thứ tự "${dem+1}."
        const pNumber = document.createElement("p");
        pNumber.className = "text-xl font-bold w-fit";
        pNumber.textContent = `${dem + 1}.`;

        // Thêm <p> vào <li>
        li.appendChild(pNumber);

        // Tạo phần tử <label> với các thuộc tính và class
        const label = document.createElement("label");
        label.htmlFor = `code_file_${dem}`;
        label.className = "p-6 w-fit m-auto grid place-content-center text-xl rounded-lg border-2 border-dashed border-slate-300 bg-white transition-all pointing_event_br-95";

        // Tạo phần tử <p> chứa icon
        const pIcon = document.createElement("p");

        // Tạo phần tử <i> cho icon
        const i = document.createElement("i");
        i.className = "fa-solid fa-cloud-arrow-up text-3xl";

        // Thêm icon vào <p>
        pIcon.appendChild(i);

        const file_name_node = document.createElement("p");
        file_name_node.className = "file_name"
        file_name_node.textContent = "tải code lên"

        // Thêm <p> vào <label>
        label.appendChild(pIcon);

        // Thêm text "tải code lên" vào <label>
        label.appendChild(file_name_node);

        // Tạo phần tử <input> cho file upload
        const inputFile = document.createElement("input");
        inputFile.className = "code_file"
        inputFile.id = `code_file_${dem}`;
        inputFile.type = "file";
        inputFile.hidden = true;

        // Thêm <input> vào <label>
        label.appendChild(inputFile);

        // Thêm <label> vào <li>
        li.appendChild(label);

        // Tạo phần tử <input> cho tên bot
        const inputName = document.createElement("input");
        inputName.src = "";
        inputName.className = "CG_bot_name w-full h-10 outline-none border border-slate-300 px-4 mt-4";
        inputName.placeholder = "Nhập tên của bot";

        // Thêm <input> vào <li>
        li.appendChild(inputName);

        // Tạo phần tử <input> cho URL avatar
        const inputAvatar = document.createElement("input");
        inputAvatar.src = "";
        inputAvatar.className = "CG_bot_avatar w-full h-10 outline-none border border-slate-300 px-4 mt-4";
        inputAvatar.placeholder = "Nhập url avatar cho bot";

        // Thêm <input> vào <li>
        li.appendChild(inputAvatar);
        return li
    }

    function handle_file_change(e) {
        const parent_element = e.target.parentElement
        if(e.target.files[0]) {
            if (e.target.files[0].type === "text/x-python") {
                parent_element.querySelector(".file_name").innerHTML = e.target.files[0].name
                parent_element.classList.add("brightness-90")
            } else {
                alert("file này không phải file Python")
            }
        } else {
            parent_element.querySelector(".file_name").innerHTML = " tải code lên"
            parent_element.classList.remove("brightness-90")
        }
    }

    useEffect(() => {
        let dem = 1

        if(is_use_own_bot) {
            add_bot_btn_ref.current.onclick = () => {
                console.log("hello")
                your_own_bot_list_ref.current.appendChild(create_your_own_bot_item(dem))
                document.querySelector(`#code_file_${dem}`).onchange = handle_file_change
                dem++
            }
        }

        let dropArea = file_detector.current;
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false)
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ;['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => dropArea.classList.add('drop_area_lighlight'), false)
        });

        ;['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => dropArea.classList.remove('drop_area_lighlight'), false)
        });

        dropArea.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            let dt = e.dataTransfer;
            let files = dt.files;

            console.log(files[0].type)
            if (files[0].type === "text/x-python") {
                dropArea.classList.add('drop_area_lighlight_final')
            } else {
                alert("file này không phải file Python")
            }
            // handleFiles(files);
        }
    })

    function handle_toggle_UFB(type) {
        if(type) {
            animation_bar_ref.current.style.right = "0"
        } else {
            animation_bar_ref.current.style.right = "50%"
        }
        set_is_use_own_bot(type)
    }


    return (
        <div className='dark:text-black dark:bg-[#e6f6ff] text-center'>
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
            <div className="CC_header">Tạo chế độ mới</div>
            <div className="CC_title">
                <input placeholder="nhập tên chế độ mới" type="text" className="CC_title_input" />
            </div>
            <textarea
                placeholder="nhập mô tả"
                className="CC_description_input"
                defaultValue={""}
            />
            <div id="container">
                <CKEditorComponent placeholder="viết hướng dẫn chơi tại đây" set_editor={(data) => {
                    set_editor(data)
                }} />
            </div>

            <input ref={demo_gamemode_image_ref} className="demo_img w-[1000px] px-[20px] py-[10px] mt-4 outline-[#007BFF] text-xl border border-slate-300" placeholder="Nhập url hình minh họa"></input>

            <dic ref={file_detector} className={`file_detector flex mx-auto w-[500px] rounded-xl bg-white border border-slate-300 mt-5 h-64 pointing_event_br-95`}>
                <label htmlFor='code_file' className="w-2/3 h-4/5 m-auto grid place-content-center text-2xl rounded-lg border-2 border-dashed border-slate-300 transition-all">
                    <p><i class="fa-solid fa-cloud-arrow-up text-5xl"></i></p>
                    <p className="file_name">tải code lên</p>
                </label>
                <input onChange={handle_file_change} ref={file_input} id="code_file" hidden type="file" />
            </dic>

            <div className="w-[1000px] mx-auto mt-5 flex flex-col items-center">
                <div className="text-3xl font-bold">BOT</div>

                <div className="w-4/5 bg-white mt-2">
                    <div className="relative flex w-full border-b-2 border-slate-300">
                        <p onClick={() => handle_toggle_UFB(false)} className="w-1/2 text-xl p-2 font-semibold border-r border-slate-300 bg-white cursor-pointer select-none hover:brightness-95 ">Sử dụng bot của hệ thống</p>
                        <p onClick={() => handle_toggle_UFB(true)} className="w-1/2 text-xl p-2 font-semibold border-l border-slate-300 bg-white cursor-pointer select-none hover:brightness-95 ">Sử dụng bot của bạn</p>
                        <div ref={animation_bar_ref} className="absolute w-1/2 h-[3px] bg-[#007BFF] bottom-[-2px] transition-all select-none"></div>
                    </div>
                    <div className="py-4">
                        <div hidden={is_use_own_bot} className="px-44">
                            <div className="bot_list_block">
                                <div data-level="level1" className="bot_item h-auto level1">
                                    <img className="" src={level1} alt="" />
                                    <div className="bot_item_title level1">level 1</div>
                                </div>
                                <div data-level="level2" className="bot_item h-auto level2">
                                    <img className="" src={level2} alt="" />
                                    <div className="bot_item_title level2">level 2</div>
                                </div>
                                <div data-level="level3" className="bot_item h-auto level3">
                                    <img className="" src={level3} alt="" />
                                    <div className="bot_item_title level3">level 3</div>
                                </div>
                            </div>
                            <div className="bot_list_block">
                                <div data-level="level4" className="bot_item h-auto level4">
                                    <img className="" src={level4} alt="" />
                                    <div className="bot_item_title level4">level 4</div>
                                </div>
                                <div data-level="Master" className="bot_item h-auto Master">
                                    <img className="" src={Master} alt="" />
                                    <div className="bot_item_title Master">MASTER</div>
                                </div>
                            </div>

                        </div>
                        <div hidden={!is_use_own_bot} className="px-4">
                            <ul ref={your_own_bot_list_ref} className="your_own_bot_list p-0 m-0">
                                <li className="mb-4">
                                    <p className="text-xl font-bold w-fit">1.</p>
                                    <label htmlFor='code_file_0' className="p-6 w-fit m-auto grid place-content-center text-xl rounded-lg border-2 border-dashed border-slate-300 bg-white transition-all pointing_event_br-95">
                                        <p><i class="fa-solid fa-cloud-arrow-up text-3xl"></i></p>
                                        <p className="file_name">tải code lên</p>
                                        <input onChange={handle_file_change} id="code_file_0" className="code_file" hidden type="file" />
                                    </label>
                                    <input src="" className="CG_bot_name w-full h-10 outline-none border border-slate-300 px-4 mt-4" placeholder="Nhập tên của bot"/>
                                    <input src="" className="CG_bot_avatar w-full h-10 outline-none border border-slate-300 px-4 mt-4" placeholder="Nhập url avatar cho bot"/>
                                </li>
                            </ul>
                            <div ref={add_bot_btn_ref} className="w-fit px-4 py-2 bg-[#007BFF] text-white rounded pointing_event_br-95 mt-4">Thêm bot</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="CC_btns justify-center">
                <div className="CC_cancel_btn">Hủy</div>
                <div className="CC_post_btn text-white">{is_update ? "Lưu" : "Đăng"}</div>
            </div>
        </div>
    )
}
