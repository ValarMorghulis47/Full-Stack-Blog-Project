import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

export default function Protected({children, authentication = true}) {

    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    const IsLoggedIn = useSelector(state => state.auth.IsLoggedIn)

    useEffect(() => {
        //TODO: make it more easy to understand

        // if (authStatus ===true){
        //     navigate("/")
        // } else if (authStatus === false) {
        //     navigate("/login")
        // }
        
        //let authValue = authStatus === true ? true : false

        if(authentication && IsLoggedIn !== authentication){
            navigate("/login")
        } else if(!authentication && IsLoggedIn !== authentication){
            navigate("/")
        }
        setLoader(false)
    }, [IsLoggedIn, navigate, authentication])

  return loader ? <h1>Loading...</h1> : <>{children}</>
}