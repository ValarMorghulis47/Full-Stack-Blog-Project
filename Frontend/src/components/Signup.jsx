// import React, { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { Button, Input, Logo } from './index.js'
// import { useDispatch } from 'react-redux'
// import { useForm } from 'react-hook-form'

// function Signup() {
//     const navigate = useNavigate()
//     const [error, setError] = useState("")
//     const dispatch = useDispatch()
//     const { register, handleSubmit } = useForm()

//     const create = async (data) => {
//         setError("");
//         try {
//             const formData = new FormData();

//             // Append JSON data
//             formData.append('fullname', data.fullname);
//             formData.append('username', data.username);
//             formData.append('email', data.email);
//             formData.append('password', data.password);

//             // Append file data
//             formData.append('avatar', data.avatar[0]);
//             formData.append('coverimage', data.coverimage[0]);
//             const userData = await fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/users/register`, {
//                 method: "POST",
//                 body: formData,
//             });

//             if (!userData.ok) {
//                 const error = await userData.json();
//                 setError(error.error.message);
//                 return;
//             }
//             navigate("/");
//         } catch (error) {
//             setError(error.message);
//         }

//     };


//     return (
//         <div classNameName="flex items-center justify-center">
//             <div classNameName={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
//                 <div classNameName="mb-2 flex justify-center">
//                     <span classNameName="inline-block w-full max-w-[100px]">
//                         <Logo width="100%" />
//                     </span>
//                 </div>
//                 <h2 classNameName="text-center text-2xl font-bold leading-tight">Sign up to create account</h2>
//                 <p classNameName="mt-2 text-center text-base text-black/60">
//                     Already have an account?&nbsp;
//                     <Link
//                         to="/login"
//                         classNameName="font-medium text-primary transition-all duration-200 hover:underline"
//                     >
//                         Sign In
//                     </Link>
//                 </p>
//                 {error && <p classNameName="text-red-600 mt-8 text-center">{error}</p>}

//                 <form onSubmit={handleSubmit(create)} encType='multipart/form-data'>
//                     <div classNameName='space-y-5'>
//                         <Input
//                             label="Full Name: "
//                             placeholder="Enter your full name"
//                             {...register("fullname")}
//                         />
//                         <Input
//                             label="Email: "
//                             placeholder="Enter your email"
//                             type="email"
//                             {...register("email", {
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
//                             {...register("password")}
//                         />
//                         <Input
//                             label="Username: "
//                             placeholder="Enter your username"
//                             {...register("username")}
//                         />
//                         <Input
//                             label="Avatar Image: "
//                             type= "file"
//                             {...register("avatar")}
//                         />
//                         <Input
//                             label="Cover Image: "
//                             type= "file"
//                             {...register("coverimage")}
//                         />
//                         <Button type="submit" classNameName="w-full">
//                             Create Account
//                         </Button>
//                     </div>
//                 </form>
//             </div>

//         </div>
//     )
// }

// export default Signup

import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input, Logo } from './index.js'
import { useDispatch, useSelector } from 'react-redux'
import Loading from "./Loading"
import { useForm } from 'react-hook-form'
import "../App.css"
function Signup() {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(false);
    const [showMessage, setShowMessage] = useState(true);
    const { register, handleSubmit, reset } = useForm()
    const theme = useSelector((state) => state.theme.mode);
    let homeClassName = 'bg-white';
    let inputClassName = 'bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none';

    if (theme === 'dark') {
        homeClassName += ' dark:bg-gray-950';
        inputClassName += ' dark:bg-gray-900';
        // headingClassName += ' dark:text-white';
    }
    const create = async (data) => {
        setError("");
        try {
            setLoading(true);
            const formData = new FormData();

            // Append JSON data
            formData.append('fullname', data.fullname);
            formData.append('username', data.username);
            formData.append('email', data.email);
            formData.append('password', data.password);

            // Append file data
            formData.append('avatar', data.avatar[0]);
            formData.append('coverimage', data.coverimage[0]);
            const userData = await fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/users/register`, {
                method: "POST",
                body: formData,
            });

            if (!userData.ok) {
                const error = await userData.json();
                setError(error.error.message);
                setLoading(false);
                return;
            }
            setSuccess("Account created successfully");
            setLoading(false);
            reset();
            // navigate("/");
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }

    };
    useEffect(() => {
        if (error || success) {
            setShowMessage(true);
            const timer = setTimeout(() => {
                setShowMessage(false);
                setSuccess("");
            }, 3000); // Change this value to adjust the time

            return () => clearTimeout(timer); // This will clear the timer if the component unmounts before the timer finishes
        }
    }, [error, success]);

    return (
        <section className={homeClassName}>
            <div className={`flex justify-evenly height items-center ${loading ? 'loading' : ''}`}>
                <div className="hidden bg-cover lg:block lg:w-2/5">
                    <Logo width='100%' />
                </div>
                <div className="spinner">
                    {loading && <Loading />}
                </div>
                <div className="flex items-center w-full max-w-3xl p-8 lg:px-12 lg:w-3/5">
                    <div className="w-full">
                        <div style={{ height: '40px' }}>
                            {showMessage && error && <p className="text-red-600 text-center">{error}</p>}
                            {showMessage && success && <p className="text-green-600 text-center">{success}</p>}
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-700 text-center">ValarMorghulis</h2>
                        <form className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2" onSubmit={handleSubmit(create)} encType='multipart/form-data'>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                                <input className={inputClassName} type="text" {...register("fullname")} />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                                <input className={inputClassName} type="email" {...register("email")} />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                                <input className={inputClassName} type="text" {...register("username")} />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                                <input className={inputClassName} type="password" {...register("password")} />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Avatar</label>
                                <input id="example1" type="file" className="mt-2 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-teal-500 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-teal-700 focus:outline-none disabled:pointer-events-none disabled:opacity-60" {...register("avatar")} />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Cover Image</label>
                                <input id="example2" type="file" className="mt-2 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-teal-500 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-teal-700 focus:outline-none disabled:pointer-events-none disabled:opacity-60" {...register("coverimage")} />
                            </div>

                            <button
                                className="flex items-center justify-between w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                                <span>Sign Up </span>

                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 rtl:-scale-x-100" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clipRule="evenodd" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Signup