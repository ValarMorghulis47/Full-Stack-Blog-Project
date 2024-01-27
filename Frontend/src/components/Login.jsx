import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toggleloggedin } from '../store/authSlice'
import { Logo } from "./index"
import { useDispatch } from "react-redux"
import { useForm } from "react-hook-form"
import "../App.css"
function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { register, handleSubmit } = useForm()
    const [error, setError] = useState("")

    const login = async (data) => {
        setError("")
        try {
            const userData = await fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                credentials: 'include'
            });

            if (!userData.ok) {
                const error = await userData.json();
                setError(error.error.message);
                return;
            }
            dispatch(toggleloggedin()); // Dispatch the action with the parsed JSON data
            navigate("/");

        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div className="py-16 height">
            <form  onSubmit={handleSubmit(login)}>
                {error && <p className="text-red-600 h-6 text-center">{error}</p>}
            <div className="flex overflow-hidden mx-auto max-w-sm lg:max-w-4xl items-center">
                <div className="hidden lg:block lg:w-1/2 bg-cover">
                    <Logo width='100%' />
                </div>
                <div className="w-full p-8 lg:w-1/2">
                    <h2 className="text-2xl font-semibold text-gray-700 text-center">ValarMorghulis</h2>
                    <div className="mt-4 flex items-center justify-between">
                        <span className="border-b w-1/5 lg:w-1/4"></span>
                        <p className="text-xs text-center text-gray-500 uppercase">Login with email</p>
                        <span className="border-b w-1/5 lg:w-1/4"></span>
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                        <input className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none" type="email" {...register("email", {
                            required: true,
                            validate: {
                                matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                    "Email address must be a valid address",
                            }
                        })} />
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                            <a href="#" className="text-xs text-gray-500">Forget Password?</a>
                        </div>
                        <input className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none" type="password" {...register("password", {
                            required: true,
                        })} />
                    </div>
                    <div className="mt-8">
                        <button className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600">Login</button>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <span className="border-b w-1/5 md:w-1/4"></span>
                        <Link className="text-xs text-gray-500 uppercase" to='/signup'>or sign up</Link>
                        <span className="border-b w-1/5 md:w-1/4"></span>
                    </div>
                </div>
            </div>
                </form>
        </div>
    )
}

export default Login


