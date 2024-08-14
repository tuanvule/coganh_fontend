import React, { useEffect, useRef, useState } from 'react'
import Login from '../modal/login'
import Signin from '../modal/signin'
import coganh_logo  from "../../static/img/coganh_logo.png"

export default function SigninPage() {
  const [signinVisible, setSigninVisible] = useState(true)
  const [singupVisible, setSignupVisible] = useState(false)
  // https://kimlongcorp.com/wp-content/uploads/2020/03/Video-Wall-Background-1400x614.jpg
  return (
    <div style={{backgroundImage: `url(https://kimlongcorp.com/wp-content/uploads/2020/03/Video-Wall-Background-1400x614.jpg)`}} className={`flex fixed top-0 bottom-0 right-0 left-0 bg-cover ${signinVisible === true ? 'lg:bg-[center_left_10rem]' : 'lg:bg-[center_right_10rem]'} bg-center transition-all duration-[.6s]`}>
        {signinVisible ? <Login setSigninVisible={setSigninVisible} setSignupVisible={setSignupVisible} /> : null}
        {singupVisible ? <Signin setSigninVisible={setSigninVisible} setSignupVisible={setSignupVisible} /> : null}
    </div>
  )
}