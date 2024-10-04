import React, { useEffect, useRef, useState } from 'react'
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/worker-javascript";
import "ace-builds/webpack-resolver";
export default function Handle_user_gamemode({gamemode, set_gamemode_chunk_index, set_is_reset_gamemode, is_owner = false}) {

    const [python_code, set_python_code] = useState(JSON.parse(gamemode.break_rule).code)
    const [js_code, set_js_code] = useState(gamemode.break_rule_js ? JSON.parse(gamemode.break_rule_js).code : null)

    const python_save_btn = useRef(null)
    const js_save_btn = useRef(null)

    useEffect(() => {
        console.log(python_save_btn.current.classList)
        if(!python_save_btn.current) return
        if(python_save_btn.current.classList.contains("dark:bg-[white]")) {
            python_save_btn.current.classList.remove("dark:bg-[white]")
            python_save_btn.current.classList.remove("dark:text-black")
        }
        python_save_btn.current.onclick = () => {
            python_save_btn.current.classList.add("dark:bg-[white]")
            python_save_btn.current.classList.add("dark:text-black")
            fetch("https://coganh-cloud-827199215700.asia-southeast1.run.app/save_gamemode_code", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    gamemode_id: gamemode.id,
                    code: python_code.replaceAll('\r', ''),
                    type: "python",
                }),
            })
            .then(res => res.json())
            .then(data => {
                set_is_reset_gamemode(Math.random())
            })
            .catch(err => console.log(err))
        }
    }, [python_code])

    useEffect(() => {
        if(!js_save_btn.current) return
        if(js_save_btn.current.classList.contains("dark:bg-[white]")) {
            js_save_btn.current.classList.remove("dark:bg-[white]")
            js_save_btn.current.classList.remove("dark:text-black")
        }
        js_save_btn.current.onclick = () => {
            js_save_btn.current.classList.add("dark:bg-[white]")
            js_save_btn.current.classList.add("dark:text-black")
            fetch("https://coganh-cloud-827199215700.asia-southeast1.run.app/save_gamemode_code", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    gamemode_id: gamemode.id,
                    code: js_code.replaceAll('\r', ''),
                    type: "js",
                }),
            })
            .then(res => res.json())
            .then(data => {
                set_is_reset_gamemode(Math.random())
            })
            .catch(err => console.log(err))
        }
    }, [js_code])

    return (
        <div className="w-full h-fit mt-4">
            <div className="relative w-full h-96 py-4 bg-[#282A36] mb-4">
                <AceEditor
                    value={python_code}
                    onChange={(e) => set_python_code(e)}
                    mode="python"
                    theme="dracula"
                    name="UNIQUE_ID_OF_DIV1"
                    editorProps={{ $blockScrolling: true }}
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        autoScrollEditorIntoView: true,
                    }}
                    readOnly={!is_owner}
                    width='100%'
                    height='100%'
                    className=""
                    fontSize={15}
                />
                <div hidden={!is_owner} className="edit_selection absolute top-4 right-4">
                    <div ref={python_save_btn} className="VC_save_btn mx-1 px-3 py-1 dark:bg-[#282A36] bg-slate-300 rounded border border-white cursor-pointer select-none transition-all">Save</div>
                </div>
            </div>
            <div className="relative w-full h-96 py-4 bg-[#282A36]">
                <AceEditor
                    value={js_code}
                    onChange={(e) => set_js_code(e)}
                    mode="javascript"
                    theme="dracula"
                    name="UNIQUE_ID_OF_DIV2"
                    editorProps={{ $blockScrolling: true }}
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        autoScrollEditorIntoView: true,
                        useWorker: false,
                    }}
                    readOnly={!is_owner}
                    width='100%'
                    height='100%'
                    className=""
                    fontSize={15}
                />
                <div hidden={!is_owner} className="edit_selection absolute top-4 right-4">
                    <div ref={js_save_btn} className="VC_save_btn mx-1 px-3 py-1 dark:bg-[#282A36] bg-slate-300 rounded border border-white cursor-pointer select-none transition-all">Save</div>
                </div>
            </div>
        </div>
    )
}
