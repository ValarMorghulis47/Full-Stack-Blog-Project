import './App.css'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { login, logout } from "./store/authSlice"
import { Footer, Header } from './components'
import authService from "./appwrite/auth"
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux';
import databaseService from "./appwrite/databaseconfig"
import { AllPost, dataclear } from "./store/postSlice"
import { postdata } from "./store/postSlice"
function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const userStatus = useSelector((state) => state.auth.status)
  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData: userData}))
          getpostspecific(userData)
        } else {
          dispatch(logout())
        }
      })
    databaseService.getPosts().then((allposts) => {
      if (allposts) {
        dispatch(AllPost({ AllPost: allposts }))
      }
      else {
        dispatch(dataclear())
      }
    })
    .finally(() => setLoading(false))
  }, [userStatus,dispatch])
  
  const getpostspecific = (userData) => (databaseService.getPosts(userData.$id).then((post) => {
    if (post) {
      dispatch(postdata({ postData: post }))
    }
    else {
      dispatch(dataclear())
    }
  }))
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
