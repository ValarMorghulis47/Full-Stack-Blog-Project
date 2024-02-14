import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toggleloggedin } from '../store/authSlice'
import { Logo } from "./index"
import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import Loading from "./Loading"
import "../App.css"
import { toggleEmailComp, toggleresetPassComp, toggleresetPassSuccess } from '../store/resetPassSlice'
function ResetPassword() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { register, handleSubmit, reset } = useForm()
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(false);
    const [showMessage, setShowMessage] = useState(true);
    const theme = useSelector((state) => state.theme.mode);
    const resetPassComp = useSelector((state) => state.resetPass.resetPassComp);
    let homeClassName = 'py-16 height';
    let inputClassName = 'bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none';
    // let headingClassName = 'text-2xl font-bold hover:text-gray-500';

    if (theme === 'dark') {
        homeClassName += ' dark:bg-gray-950';
        inputClassName = ' dark:bg-gray-900 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none';
        //   headingClassName += ' dark:text-white';
    }
    const resetPassword = async (data) => {
        setError("")
        try {
            const token = data.token;
            const {password , confirmpassword} = data;
            const payload = {password , confirmpassword}
            setLoading(true);
            const userData = await fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/users/reset-password/${token}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
                credentials: 'include'
            });

            if (!userData.ok) {
                const error = await userData.json();
                setError(error.error.message);
                setLoading(false);
                return;
            }
            setSuccess("Password reset successfully. You can now login.");
            setLoading(false);
            reset();
            dispatch(toggleresetPassSuccess());
            navigate("/login");
        } catch (error) {
            setError(error.message)
            setLoading(false);
        }
    }
    const verifyToken = async (data) => {
        setError("")
        try {
            const token = data.token;
            setLoading(true);
            const userData = await fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/users/verify-token/${token}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include'
            });

            if (!userData.ok) {
                const error = await userData.json();
                setError(error.error.message);
                setLoading(false);
                return;
            }
            setSuccess("Token verified successfully");
            setLoading(false);
            dispatch(toggleresetPassComp());
        } catch (error) {
            setError(error.message)
            setLoading(false);
        }
    }
    useEffect(() => {
        if (error || success) {
            setShowMessage(true);
            const timer = setTimeout(() => {
                setShowMessage(false);
                setSuccess("");
                setError("");
            }, 3000); // Change this value to adjust the time

            return () => clearTimeout(timer); // This will clear the timer if the component unmounts before the timer finishes
        }
    }, [error, success]);
    return (
        <div className={homeClassName}>
            {!resetPassComp && <form onSubmit={handleSubmit(resetPassword)} className={`${loading ? 'loading' : ''}`}>
                <div style={{ height: '40px' }}>
                    {showMessage && error && <p className="text-red-600 text-center">{error}</p>}
                    {showMessage && success && <p className="text-green-600 text-center">{success}</p>}
                </div>
                <div className="flex overflow-hidden mx-auto max-w-sm lg:max-w-4xl items-center justify-center">
                    <div className="spinner">
                        {loading && <Loading />}
                    </div>
                    <div className="hidden lg:block lg:w-1/2 bg-cover">
                        <Logo width='100%' />
                    </div>
                    <div className="w-full p-8 lg:w-1/2">
                        <h2 className="text-2xl font-semibold text-gray-700 text-center">ValarMorghulis</h2>
                        <div className="mt-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
                            <input className={inputClassName} type="password" {...register("password")} />
                        </div>
                        <div className="mt-4">
                            <div className="flex justify-between">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
                            </div>
                            <input className={inputClassName} type="password" {...register("confirmpassword")} />
                        </div>
                        <div className="mt-8">
                            <button className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600">Submit</button>
                        </div>
                    </div>
                </div>
            </form>}
            {resetPassComp && <form onSubmit={handleSubmit(verifyToken)} className={`${loading ? 'loading' : ''}`}>
                <div style={{ height: '40px' }}>
                    {showMessage && error && <p className="text-red-600 text-center">{error}</p>}
                    {showMessage && success && <p className="text-green-600 text-center">{success}</p>}
                </div>
                <div className="flex overflow-hidden mx-auto max-w-sm lg:max-w-4xl items-center justify-center">
                    <div className="spinner">
                        {loading && <Loading />}
                    </div>
                    <div className="hidden lg:block lg:w-1/2 bg-cover">
                        <Logo width='100%' />
                    </div>
                    <div className="w-full p-8 lg:w-1/2">
                        <div className="mt-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Enter The Token</label>
                            <input className={inputClassName} type="text" {...register("token")} />
                        </div>
                        <div className="mt-8">
                            <button className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600">Submit</button>
                        </div>
                    </div>
                </div>
            </form>}
        </div>
    )
}

export default ResetPassword


