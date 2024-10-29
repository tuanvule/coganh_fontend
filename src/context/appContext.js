import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'

export const AppContext = React.createContext();

export default function AppProvider({ children, theme, setTheme }) {
  const [user, setUser] = useState({})
  const [profile, setProfile] = useState()
  const [page, setPage] = useState({route: 'home', info: null})
  const [searchInfo, setSearchInfo] = useState({})
  const history = useNavigate()


  async function refreshAccessToken() {
    const response = await fetch('http://127.0.0.1:8080/refresh_access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({uid: localStorage.getItem("id")})
    });

    if (response.ok) {
        const data = await response.json();
        setUser({
          username: localStorage.getItem("username"),
          id: localStorage.getItem("id"),
          access_token: data.access_token
        })
    } else {
        console.error('Failed to refresh token');
    }
  }
  
  useEffect(() =>  {
    if(!user.username && localStorage.getItem("username")) {
      refreshAccessToken()
      // setUser({
      //   username: localStorage.getItem("username"),
      //   id: localStorage.getItem("id"),
      //   access_token: localStorage.getItem("access_token")
      // })
    }
  }, [JSON.stringify(user)])

  return (
    <AppContext.Provider
      value={{
        history,
        user, setUser,
        profile, setProfile,
        page, setPage,
        theme, setTheme,
        searchInfo, setSearchInfo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}