import './App.css'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { login} from "./store/authSlice"
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux';
function App() {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const IsLoggedIn = useSelector((state) => state.auth.IsLoggedIn)
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        console.log("Use Effect of app triggered");
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/users/currentuser`, {
          method: 'GET',
          credentials: 'include'
        });
  
        if (response.ok) {
          const userData = await response.json();
          dispatch(login(userData.data));
          setLoading(false);
        } else {
          console.error("Error fetching current user:", response.status);
          setLoading(false);
        }
      } catch (error) {
        // Handle errors here
        console.error("Error fetching current user:", error);
        setLoading(false);
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
