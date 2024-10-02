import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/appContext';
import Login_require from './requirements/login_require';

export default function Vote_modal({doc, is_mobile, type}) {
    const {user} = useContext(AppContext)
    const [is_upvote, set_is_upvote] = useState(false)
    const [is_downvote, set_is_downvote] = useState(false)
    const [vote, set_vote] = useState(0)
    const [is_require_login, set_is_require_login] = useState(false)

    useEffect(() => {
        if(doc.upvote && doc.upvote.find(({username, id}) => username === user.username && id === user.id)) {
            set_is_upvote(true)
        }
        if(doc.downvote && doc.downvote.find(({username, id}) => username === user.username && id === user.id)) {
            set_is_downvote(true)
        }
        if(doc.upvote) {
            set_vote(doc.upvote.length - doc.downvote.length)
        }
    }, [doc])

    function handle_upvote() {
        if(!user.username) {
            set_is_require_login(true)
            return
        }
        if(!is_upvote) {
            fetch(`http://127.0.0.1:8080/up_vote?type=${type}&doc_id=${doc.id}&username=${user.username}&u_id=${user.id}`)
            .then(res => res.json())
            .then(msg => {
                console.log(msg)
                set_is_upvote(!is_upvote)
                if(is_downvote) {
                    set_vote(vote+2)
                } else {
                    set_vote(vote+1)
                }
                set_is_downvote(false)
            })
            .catch(err => console.log(err))
        } else {
            fetch(`http://127.0.0.1:8080/up_vote_reverse?type=${type}&doc_id=${doc.id}&username=${user.username}&u_id=${user.id}`)
            .then(res => res.json())
            .then(msg => {
                console.log(msg)
                set_is_upvote(!is_upvote)
                set_vote(vote-1)
            })
            .catch(err => console.log(err))
        }
    }

    function handle_downvote() {
        if(!user.username) {
            set_is_require_login(true)
            return
        }
        if(!is_downvote) {
            fetch(`http://127.0.0.1:8080/down_vote?type=${type}&doc_id=${doc.id}&username=${user.username}&u_id=${user.id}`)
            .then(res => res.json())
            .then(msg => {
                console.log(msg)
                if(is_upvote) {
                    set_vote(vote-2)
                } else {
                    set_vote(vote-1)
                }
                set_is_downvote(!is_downvote)
                set_is_upvote(false)
            })
            .catch(err => console.log(err))
        } else {
            fetch(`http://127.0.0.1:8080/down_vote_reverse?type=${type}&doc_id=${doc.id}&username=${user.username}&u_id=${user.id}`)
            .then(res => res.json())
            .then(msg => {
                console.log(msg)
                set_is_downvote(!is_downvote)
                set_vote(vote+1)
            })
        }
    }
    
    return (
        <div className={`lg:mb-10 mb-0 cursor-pointer lg:text-4xl text-base lg:block flex items-center`}>
            {is_require_login && <Login_require set_is_require_login={set_is_require_login}/>}
            <div onClick={() => handle_upvote()} className={`lg:h-16 lg:w-16 h-6 w-6 select-none rounded-full grid place-content-center ${is_upvote ? "bg-blue-500 bg-opacity-100 hover:bg-opacity-100" : "bg-slate-400 bg-opacity-20 hover:bg-opacity-40"}`}>
                <i class="fa-solid fa-chevron-up"></i>
            </div>
            <p className="lg:text-3xl text-xl text-center my-2 lg:mx-0 mx-3 select-none">{vote}</p>
            <div onClick={() => handle_downvote()} className={`lg:h-16 lg:w-16 h-6 w-6 select-none mr-4 lg:mr-0 rounded-full grid place-content-center ${is_downvote ? "bg-blue-500 bg-opacity-100 hover:bg-opacity-100" : "bg-slate-400 bg-opacity-20 hover:bg-opacity-40"}`}>
                <i class="fa-solid fa-chevron-down"></i>
            </div>
        </div>
    )
}
