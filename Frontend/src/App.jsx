import './App.css'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { login, toggleloggedin } from './store/authSlice'
function App() {
  console.log("App component is mounted");
  const dispatch = useDispatch()
  const IsLoggedIn = useSelector((state) => state.auth.IsLoggedIn)
  const fetchCurrentUser = async () => {
    try {
      console.log("Use Effect of app triggered");
      const response = await fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/users/currentuser`, {
        method: 'GET',
        credentials: 'include'
      });
      if (response.ok) {
        console.log("i am in if");
        const userData = await response.json();
        dispatch(login(userData.data));
        // dispatch(toggleloggedin())
      } else {
        // console.log("I am in else in app");
        // console.error("Error fetching current user:", response.status);
      }
    } catch (error) {
      // Handle errors here
      // console.error("Error fetching current user:", error);
    }
  };
  useEffect(() => {
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
