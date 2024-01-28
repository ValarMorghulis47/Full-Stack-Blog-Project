import './App.css'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { login } from './store/authSlice'
function App() {
  console.log("App component is mounted");
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const IsLoggedIn = useSelector((state) => state.auth.IsLoggedIn)
  const fetchCurrentUser = async () => {
    try {
      console.log("Use Effect of app triggered");
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/users/currentuser`, {
        method: 'GET',
        credentials: 'include'
      });
      console.log("Response is ", response);
      if (response.ok) {
        const userData = await response.json();
        dispatch(login(userData.data));
        setLoading(false);
      } else {
        console.log("I am in else in app");
        // console.error("Error fetching current user:", response.status);
        setLoading(false);
      }
    } catch (error) {
      // Handle errors here
      // console.error("Error fetching current user:", error);
      setLoading(false);
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
