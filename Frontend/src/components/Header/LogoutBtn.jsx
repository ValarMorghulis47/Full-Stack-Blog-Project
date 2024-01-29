import React from 'react'
import { useDispatch } from 'react-redux'
import { logout } from '../../store/authSlice'
import { dataclear } from '../../store/postSlice'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toggleloggedin } from '../../store/authSlice'
function LogoutBtn() {
  const theme = useSelector((state) => state.theme.mode)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  let logutClassName = 'inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full';
  if (theme === 'dark') {
    logutClassName += ' text-white'
  }
  const logoutHandler = async () => {
    const respone = await fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/users/logout`, {
      method: "GET",
      credentials: 'include'
    })
    if (!respone.ok) {
      console.error("Server Error:", respone.status, await respone.text());
      return;
    }
    dispatch(logout())
    dispatch(dataclear())
    dispatch(toggleloggedin())
    navigate('/')
  }
  return (
    <button
      className={logutClassName}
      onClick={logoutHandler}
    >Logout</button>
  )
}

export default LogoutBtn
