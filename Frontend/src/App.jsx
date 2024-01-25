import './App.css'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { login, logout } from "./store/authSlice"
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux';
function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const IsLoggedIn = useSelector((state) => state.auth.IsLoggedIn)
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/users/currentuser`, {
          method: 'GET',
          credentials: 'include'
        });
  
        if (response.status === 200) {
          const userData = await response.json();
          dispatch(login(userData.data));
        }
      } catch (error) {
        // Handle errors here
        console.error("Error fetching current user:", error);
      }
    };
  
    fetchCurrentUser();
  }, [IsLoggedIn]);
  
  
  return (
    <div className='min-h-screen flex flex-wrap content-between'>
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
