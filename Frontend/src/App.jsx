import './App.css'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { login, logout } from "./store/authSlice"
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { AllPost, dataclear } from "./store/postSlice"
import { postdata } from "./store/postSlice"
import axios from "axios"
function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)
  useEffect(()=>{
    const response = fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/users/currentuser`, {
      method: 'GET'
    })
    if (response.status===200) {
      dispatch(login(response));
    }
  }, [isLoggedIn])
  return (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
      <div className='w-full block'>
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default App
