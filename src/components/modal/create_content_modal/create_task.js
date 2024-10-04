import React, { useContext, useEffect, useRef, useState } from 'react'
import "../../../style/create_content.css"
import CKEditorComponent from '../../modal/text_editor'
import { AppContext } from '../../../context/appContext.js'
import { useLocation, useSearchParams } from 'react-router-dom';
import Navbar from '../../primary/navbar.js'
import Login_require from '../../modal/requirements/login_require.js'

export default function Create_content() {
    const [editor, set_editor] = useState()
    const { user, history } = useContext(AppContext)
    const [is_require_login, set_is_require_login] = useState(false)
    const [searchParams] = useSearchParams();
    const { state } = useLocation()
    let is_update = searchParams.get("is_update")

    function handle_inp_oup(jsonString) {
        let data = eval(jsonString.replaceAll("T", "t").replaceAll("F", "f").replaceAll("(", "[").replaceAll(")", "]"))
        console.log(data)
        // return
        let res = []

        data.forEach(item => {
            let handle_data = {
                input: [],
                output: ""
            }
            item.input.forEach(inp => {
                if ((typeof inp === "string" || typeof inp === "object") && -1 in inp) {
                    handle_data.input.push(JSON.stringify(inp))
                } else {
                    let sub_input = JSON.stringify(inp)
                    if (sub_input.includes("{") && sub_input.includes("}")) {
                        handle_data.input.push(sub_input.replaceAll("[", "(").replaceAll("]", ")"))
                    } else {
                        handle_data.input.push(sub_input.replaceAll("[", "(").replaceAll("]", ")").replaceAll("))", ")]").replaceAll("((", "[("))
                    }
                }
            })
            handle_data.output = JSON.stringify(item.output).replaceAll("t", "T").replaceAll("f", "F")
            res.push(handle_data)
        })
        return res
    }

    useEffect(() => {
        console.log(searchParams.get("is_update"))
        if (searchParams.get("is_update") === "true" && state) {
            if (editor) {
                editor.setData(state.task.content)
            }
        }
    }, [editor, state])

    useEffect(() => {

        const $ = document.querySelector.bind(document)
        const $$ = document.querySelectorAll.bind(document)

        const username = user.username
        const post_btn = $(".CC_post_btn")
        const title_input = $(".CC_title_input")
        const test_case_list = $(".CC_test_case_list")
        const add_test_case_btn = $('.CC_add_test_case_btn')
        const remove_test_case_btn = $('.CC_remove_test_case_btn')
        const difficult_list = $(".CC_difficult_list")
        const type_list = $(".CC_type_list")
        const test_case_block = $(".CC_test_case_block")

        const tag_list = $(".CC_tag_list")
        const tag_item = $$(".CC_tag_item")

        // test case config

        const input_num_config = $(".CC_input_num_config")
        const title_input_config_list = $(".CC_title_input_config_list")
        const create_btn = $(".CC_create_btn")
        const test_case_config = $(".CC_test_case_config")

        // ---------------

        const overflow = $(".CC_overflow")
        const loadder = $(".CC_loadder")
        const noti_content = $(".CC_noti_content")
        const ok_btn = $(".CC_ok_btn")

        let input_title = []

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

        if(state) {
            test_case_block.style.display = "flex"
            test_case_config.style.display = "none"
            input_title = state.task.input_title
            title_input.value = state.task.task_name
            let skill_requires = state.task.tag.skill_require.map(item => item.name)
            $$(".CC_tag_item").forEach(item => {
                if(skill_requires.includes(item.innerHTML)) {
                    item.classList.add("CC_selected")
                }
            })
            difficult_list.options.namedItem(state.task.tag.difficult).selected = true
        }

        let text
        let dem = 0

        function check_valid_task(tags, test_case) {
            console.log(test_case)
            let is_valid = true
            if (title_input.value.length === 0) {
                title_input.style.borderColor = "red"
                title_input.style.borderWidth = "3px"
                is_valid = false
                console.log(1)
            }
            if (difficult_list.value === "") {
                difficult_list.style.borderColor = "red"
                difficult_list.style.borderWidth = "3px"
                is_valid = false
                console.log(2)
            }
            if (tags.length === 0) {
                tag_list.style.borderColor = "red"
                tag_list.style.borderWidth = "3px"
                is_valid = false
                console.log(3)
            }
            if (test_case.length === 0) {
                test_case_config.style.borderColor = "red"
                test_case_config.style.borderWidth = "3px"
                is_valid = false
                console.log(5)
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

        function getInOupValue() {
            let inp_list = $$(".CC_input_list")
            let oup = $$(".CC_oup")
            let inp_oup = []
            let input_list = []
            let input_value = []
            let output_value = []

            inp_list.forEach((item) => {
                input_value = []
                item.querySelectorAll(".CC_inp").forEach((i) => {
                    input_value.push(i.value)
                })
                input_list.push(input_value)
            })

            oup.forEach((item) => {
                output_value.push(item.value)
            })

            for (let i = 0; i < output_value.length; i++) {
                inp_oup.push({
                    input: input_list[i],
                    output: output_value[i],
                })
            }

            console.log(inp_oup)

            return inp_oup
        }

        function showErr(err) {
            loadder.style.display = "none"
            noti_content.style.display = "block"
            noti_content.innerHTML = err
            noti_content.classList.add("err")
        }

        function add_task(text) {
            const demo_code = $(".CC_demo_code").value
            let tags = Array.from($$(".CC_tag_item.CC_selected")).map(item => ({ name: item.innerHTML, link: item.dataset.link }))
            const inOupValue = getInOupValue()
            if (!check_valid_task(tags, inOupValue)) return
            let status = true
            if(is_update) {
                fetch("https://coganh-cloud-827199215700.asia-southeast1.run.app/update_task/" + state.task.id, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        author: username,
                        author_id: user.id,
                        task_name: title_input.value,
                        content: text,
                        inp_oup: inOupValue,
                        tag: {
                            difficult: difficult_list.value ? difficult_list.value : "easy",
                            skill_require: tags
                        },
                        demo_code: JSON.stringify(demo_code),
                        input_title: input_title,
                        upload_time: formatter.format(new Date()),
                        id: state.task.id
                    }),
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.code === 400) {
                            status = data.code
                            showErr(data.err)
                            return
                        }
                        console.log(data)
                    })
                    .catch(err => {
                        status = 400
                        showErr(err)
                        return
                    })
            } else {
                fetch("https://coganh-cloud-827199215700.asia-southeast1.run.app/upload_task", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        author: username,
                        author_id: user.id,
                        task_name: title_input.value,
                        accepted_count: 0,
                        challenger: [],
                        content: text,
                        submission_count: 0,
                        is_public: false,
                        inp_oup: inOupValue,
                        tag: {
                            difficult: difficult_list.value ? difficult_list.value : "easy",
                            skill_require: tags
                        },
                        demo_code: JSON.stringify(demo_code),
                        input_title: input_title,
                        upload_time: formatter.format(new Date()),
                    }),
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.code === 400) {
                            status = data.code
                            showErr(data.err)
                            return
                        }
                        console.log(data)
                    })
                    .catch(err => {
                        status = 400
                        showErr(err)
                        return
                    })
            }
            return status
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
                        status = add_task(text)
                    } else {
                        for(let i = 0; i < default_url.length; i++) {
                            let new_url = await uploadDataURLInChunks(default_url[i])
                            url.push(new_url)
                            text = text.replace(default_url[i], new_url)
                        }
                        add_task(text)
                    }
                } else {
                    status = add_task(text)
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
                console.log(err)
                showErr(err)
            }
        }

        create_btn.onclick = () => {
            input_title = []
            const title_input_config_items = $$(".CC_title_input_config_item")
            title_input_config_items.forEach(item => {
                input_title.push(item.value)
            })
            test_case_block.style.display = "flex"
            test_case_config.style.display = "none"
        }

        ok_btn.onclick = () => {
            overflow.style.display = "none"
        }

        function add_test_case(inp_value = [], oup_value = "") {
            let block = document.createElement('div')
            block.classList = "CC_test_case_item"

            let input_list = document.createElement('input_list')
            input_list.classList = "CC_input_list"

            input_title.forEach((item,i) => {
                let inp = document.createElement('textarea')
                inp.classList = "CC_input_item CC_inp"
                inp.placeholder = item
                inp.setAttribute("row", "1")
                inp.value = inp_value[i] || ""
                input_list.appendChild(inp)
            })

            let oup = document.createElement('textarea')
            oup.classList = "CC_oup"
            oup.value = oup_value
            oup.setAttribute("row", "1")

            let check_box = document.createElement('input')
            check_box.type = "checkbox"
            check_box.style = "width: 20px; height: 20px;"
            check_box.classList = "CC_check_box"
            check_box.dataset.index = dem

            block.appendChild(input_list)
            block.appendChild(oup)
            block.appendChild(check_box)
            test_case_list.appendChild(block)
            dem++
        }

        if (searchParams.get("is_update") === "true" && state) {
            test_case_list.innerHTML = `
            <div class="CC_inp_oup_title">
                <div class="CC_inp_title">input</div>
                <div class="CC_oup_title">output</div>
                <div style="width: 20px; height: 20px;"></div>
            </div>`
            handle_inp_oup(state.task.inp_oup).forEach(item => {
                add_test_case(item.input, item.output)
            })
        }

        add_test_case_btn.onclick = () => {
            add_test_case()
            console.log(input_title)
        }

        remove_test_case_btn.onclick = () => {

            const checked_box = $$(".CC_check_box:checked")
            const input_lists = $$(".CC_input_list")

            if (input_lists.length - checked_box.length < 2) return
            let test_case_item = $$(".CC_test_case_item")

            checked_box.forEach(item => {
                console.log(test_case_item[item.dataset.index])
                test_case_item[item.dataset.index].remove()
            })

            test_case_item = $$(".CC_test_case_item")

            test_case_item.forEach((item, i) => {
                item.querySelector(".CC_check_box").dataset.index = i
            })
            dem -= checked_box.length
        }

        input_num_config.oninput = (e) => {
            if (input_num_config.value > 5) {
                input_num_config.value = 5
            }
            let item = []
            console.log(e.target.value)
            for (let i = 0; i < e.target.value; i++) {
                item.push(`
            <input placeholder="Enter input name" type="text" class="CC_title_input_config_item">
        `.replaceAll(" , ", ""))
            }

            title_input_config_list.innerHTML = (item.map(a => a)).join("")
        }

        tag_item.forEach(item => {
            item.onclick = () => {
                if (item.classList.contains("CC_selected")) {
                    item.classList.remove("CC_selected")
                    return
                }
                item.classList.add("CC_selected")
            }
        })
    }, [editor, state])

    return (
        <div className='dark:text-black dark:bg-[#e6f6ff] text-center'>
            <Navbar mode="light" back_link="/task_list" />
            {is_require_login && <Login_require set_is_require_login={set_is_require_login} />}
            <div style={{ display: "none" }} className="CC_overflow">
                <div className="CC_notification">
                    <div className="CC_loadder">
                        <div className="CC_loading" />
                    </div>
                    <div style={{ display: "none" }} className="CC_noti_content CC_success">
                        Thành công
                    </div>
                    <div className="CC_ok_btn">OK</div>
                </div>
            </div>
            <div className="CC_header">Tạo task</div>
            <div className="CC_title">
                <input placeholder="nhập tiêu đề" type="text" className="CC_title_input" />
                <select

                    name=""
                    id=""
                    className="CC_difficult_list"
                >
                    <option id="none" value="" selected disabled>
                        Độ khó
                    </option>
                    <option id="easy" value="easy" className="CC_difficult_item">
                        Dễ
                    </option>
                    <option id="medium" value="medium" className="CC_difficult_item">
                        Vừa
                    </option>
                    <option id="hard" value="hard" className="CC_difficult_item">
                        Khó
                    </option>
                </select>
            </div>
            <div className="CC_tag_block flex mx-auto">
                <ul className="CC_tag_list">
                    <li
                        data-link="https://www.w3schools.com/python/python_datatypes.asp"
                        className="CC_tag_item"
                    >
                        data types
                    </li>
                    <li
                        data-link="https://www.w3schools.com/python/python_operators.asp"
                        className="CC_tag_item"
                    >
                        operators
                    </li>
                    <li
                        data-link="https://www.w3schools.com/python/python_lists.asp"
                        className="CC_tag_item"
                    >
                        list
                    </li>
                    <li
                        data-link="https://www.w3schools.com/python/python_tuples.asp"
                        className="CC_tag_item"
                    >
                        tuples
                    </li>
                    <li
                        data-link="https://www.w3schools.com/python/python_dictionaries.asp"
                        className="CC_tag_item"
                    >
                        dictionary
                    </li>
                    <li
                        data-link="https://www.w3schools.com/python/python_conditions.asp"
                        className="CC_tag_item"
                    >
                        if else
                    </li>
                    <li
                        data-link="https://www.w3schools.com/python/python_while_loops.asp"
                        className="CC_tag_item"
                    >
                        while loop
                    </li>
                    <li
                        data-link="https://www.w3schools.com/python/python_for_loops.asp"
                        className="CC_tag_item"
                    >
                        for loop
                    </li>
                    <li
                        data-link="https://www.w3schools.com/python/python_functions.asp"
                        className="CC_tag_item"
                    >
                        funcion
                    </li>
                    <li
                        data-link="https://www.w3schools.com/python/python_classes.asp"
                        className="CC_tag_item"
                    >
                        classes/object
                    </li>
                    <li
                        data-link="https://www.w3schools.com/python/python_math.asp"
                        className="CC_tag_item"
                    >
                        math
                    </li>
                </ul>
            </div>
            <div id="container">
                <CKEditorComponent set_editor={(data) => {
                    set_editor(data)
                }} />
            </div>
            <div className="CC_demo_code_block">
                <div className="CC_demo_code_title">demo code</div>
                <textarea
                    spellCheck="false"
                    className="CC_demo_code"
                    defaultValue={
                        state ? JSON.parse(state.task.demo_code) : '{`def main (params1, params2, ...):\n    """\n    params1: <type>\n    params2: <type>\n    """\n    return output`}\n        '
                    }
                />
            </div>
            <div className="CC_test_case_control flex flex-col mx-auto">
                <div className="CC_test_case_title">Test case</div>
                <div className="CC_test_case_config">
                    <div className="CC_config">
                        <div className="CC_input_config">
                            <input
                                min={1}
                                max={5}
                                type="number"
                                placeholder="Nhập số input muốn tạo (max 5)"
                                className="CC_input_num_config"
                            />
                        </div>
                        <div className="CC_title_input_config_list"></div>
                    </div>
                    <div className="CC_config_btn">
                        <div className="CC_create_btn">Tạo</div>
                    </div>
                </div>
                <div style={{ display: "none" }} className="CC_test_case_block">
                    <div className="CC_test_case_list">
                        <div className="CC_inp_oup_title">
                            <div className="CC_inp_title">input</div>
                            <div className="CC_oup_title">output</div>
                        </div>
                    </div>
                    <div className="CC_controller">
                        <div className="CC_add_test_case_btn">add more</div>
                        <div className="CC_remove_test_case_btn">remove</div>
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
