// import React, { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { toggleloggedin } from '../store/authSlice'
// import { Button, Input, Logo } from "./index"
// import { useDispatch } from "react-redux"
// import { useForm } from "react-hook-form"
// import "../App.css"
// function Login() {
//     const navigate = useNavigate()
//     const dispatch = useDispatch()
//     const { register, handleSubmit } = useForm()
//     const [error, setError] = useState("")

//     const login = async (data) => {
//         setError("")
//         try {
//             console.log(data);
//             const userData = await fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/users/login`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(data),
//                 credentials: 'include'
//             });

//             if (!userData.ok) {
//                 console.error("Server Error:", userData.status, await userData.text());
//                 setError("An error occurred during login. Please try again.");
//                 return;
//             }
//             dispatch(toggleloggedin()); // Dispatch the action with the parsed JSON data
//             navigate("/");

//         } catch (error) {
//             setError(error.message)
//         }
//     }

//     return (
//         <div
//             classNameName='flex items-center justify-center w-full height'
//         >
//             <div classNameName={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
//                 <div classNameName="mb-2 flex justify-center">
//                     <span classNameName="inline-block w-full max-w-[100px]">
//                         <Logo width="100%" />
//                     </span>
//                 </div>
//                 <h2 classNameName="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>
//                 <p classNameName="mt-2 text-center text-base text-black/60">
//                     Don&apos;t have any account?&nbsp;
//                     <Link
//                         to="/signup"
//                         classNameName="font-medium text-primary transition-all duration-200 hover:underline"
//                     >
//                         Sign Up
//                     </Link>
//                 </p>
//                 {error && <p classNameName="text-red-600 mt-8 text-center">{error}</p>}
//                 <form onSubmit={handleSubmit(login)} classNameName='mt-8'>
//                     <div classNameName='space-y-5'>
//                         <Input
//                             label="Email: "
//                             placeholder="Enter your email"
//                             type="email"
//                             {...register("email", {
//                                 required: true,
//                                 validate: {
//                                     matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
//                                         "Email address must be a valid address",
//                                 }
//                             })}
//                         />
//                         <Input
//                             label="Password: "
//                             type="password"
//                             placeholder="Enter your password"
//                             {...register("password", {
//                                 required: true,
//                             })}
//                         />
//                         <Button
//                             type="submit"
//                             classNameName="w-full"
//                         >Sign in</Button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     )
// }

// export default Login


import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toggleloggedin } from '../store/authSlice'
import { Button, Input, Logo } from "./index"
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
                console.error("Server Error:", userData.status, await userData.text());
                setError("An error occurred during login. Please try again.");
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
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
            <div className="flex overflow-hidden mx-auto max-w-sm lg:max-w-4xl items-center">
                <div className="hidden lg:block lg:w-1/2 bg-cover">
                    <Logo width='100%' />
                </div>
                <div className="w-full p-8 lg:w-1/2">
                    <h2 className="text-2xl font-semibold text-gray-700 text-center">ValarMorghulis</h2>
                    <div className="mt-4 flex items-center justify-between">
                        <span className="border-b w-1/5 lg:w-1/4"></span>
                        <a href="#" className="text-xs text-center text-gray-500 uppercase">Login with email</a>
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


