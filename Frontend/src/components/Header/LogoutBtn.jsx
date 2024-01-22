import React from 'react'
import {useDispatch} from 'react-redux'
import authService from '../../appwrite/auth'
import {logout} from '../../store/authSlice'
import { useNavigate } from 'react-router-dom'
import {dataclear} from "../../store/postSlice"
function LogoutBtn() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const logoutHandler = async() => {
      console.log('Cookies:', document.cookie);
      const respone = await fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/users/logout`, {
        method: "GET",
      })
      if (!respone.ok) {
        console.error("Server Error:", respone.status, await respone.text());
        return;
      }
      console.log(respone);
      dispatch(logout())
      navigate('/')
    }
  return (
    <button
    className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
    onClick={logoutHandler}
    >Logout</button>
  )
}

export default LogoutBtn
