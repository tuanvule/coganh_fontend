import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/appContext';
import Login_require from './requirements/login_require';

export default function Vote_modal({post, is_mobile}) {
    const {user} = useContext(AppContext)
    const [is_upvote, set_is_upvote] = useState(false)
    const [is_downvote, set_is_downvote] = useState(false)
    const [vote, set_vote] = useState(0)
    const [is_require_login, set_is_require_login] = useState(false)

    useEffect(() => {
        console.log((post))
        if(post.upvote && post.upvote.find(({username, id}) => username === user.username && id === user.id)) {
            set_is_upvote(true)
        }
        if(post.downvote && post.downvote.find(({username, id}) => username === user.username && id === user.id)) {
            set_is_downvote(true)
        }
        if(post.upvote) {
            set_vote(post.upvote.length - post.downvote.length)
        }
    }, [post])

    function handle_upvote() {
        if(!user.username) {
            set_is_require_login(true)
            return
        }
        if(!is_upvote) {
            fetch(`http://192.168.1.249:8080/up_vote?post_id=${post.id}&username=${user.username}&u_id=${user.id}`)
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
            fetch(`http://192.168.1.249:8080/up_vote_reverse?post_id=${post.id}&username=${user.username}&u_id=${user.id}`)
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
            fetch(`http://192.168.1.249:8080/down_vote?post_id=${post.id}&username=${user.username}&u_id=${user.id}`)
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
            fetch(`http://192.168.1.249:8080/down_vote_reverse?post_id=${post.id}&username=${user.username}&u_id=${user.id}`)
            .then(res => res.json())
            .then(msg => {
                console.log(msg)
                set_is_downvote(!is_downvote)
                set_vote(vote+1)
            })
        }
    }
    
    console.log(is_upvote, is_downvote)
    return (
        <div className={`lg:mb-10 mb-0 cursor-pointer lg:text-4xl text-base lg:block flex items-center`}>
            {is_require_login && <Login_require set_is_require_login={set_is_require_login}/>}
            <div onClick={() => handle_upvote()} className={`lg:h-16 lg:w-16 h-6 w-6 rounded-full grid place-content-center ${is_upvote ? "bg-blue-500 bg-opacity-100 hover:bg-opacity-100" : "bg-slate-400 bg-opacity-20 hover:bg-opacity-40"}`}>
                <i class="fa-solid fa-chevron-up"></i>
            </div>
            <p className="lg:text-3xl text-xl text-center my-2 lg:mx-0 mx-3">{vote}</p>
            <div onClick={() => handle_downvote()} className={`lg:h-16 lg:w-16 h-6 w-6 mr-4 lg:mr-0 rounded-full grid place-content-center ${is_downvote ? "bg-blue-500 bg-opacity-100 hover:bg-opacity-100" : "bg-slate-400 bg-opacity-20 hover:bg-opacity-40"}`}>
                <i class="fa-solid fa-chevron-down"></i>
            </div>
            {/* {is_vote ? <i class="fa-solid fa-heart"></i> : <i class="fa-regular fa-heart"></i>} */}
            {/* <i class="fa-regular fa-heart"></i>
        <i class="fa-solid fa-heart"></i> */}
        </div>
    )
}
