import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input, Logo } from './index.js'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'

function Signup() {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const dispatch = useDispatch()
    const { register, handleSubmit } = useForm()

    const create = async (data) => {
        setError("");
        try {
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
                console.error("Server Error:", userData.status, await userData.text());
                setError("An error occurred during registration. Please try again.");
                return;
            }
        
            console.log("Registration Successful:", await userData.json());
            navigate("/");
        } catch (error) {
            console.error("Error:", error.message);
            setError("An unexpected error occurred. Please try again.");
        }
        
    };
    

    return (
        <div className="flex items-center justify-center">
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

                <form onSubmit={handleSubmit(create)} encType='multipart/form-data'>
                    <div className='space-y-5'>
                        <Input
                            label="Full Name: "
                            placeholder="Enter your full name"
                            {...register("fullname", {
                                required: true,
                            })}
                        />
                        <Input
                            label="Email: "
                            placeholder="Enter your email"
                            type="email"
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Email address must be a valid address",
                                }
                            })}
                        />
                        <Input
                            label="Password: "
                            type="password"
                            placeholder="Enter your password"
                            {...register("password", {
                                required: true,
                            })}
                        />
                        <Input
                            label="Username: "
                            placeholder="Enter your username"
                            {...register("username", {
                                required: true,
                            })}
                        />
                        <Input
                            label="Avatar Image: "
                            type= "file"
                            {...register("avatar", {
                                required: true,
                            })}
                        />
                        <Input
                            label="Cover Image: "
                            type= "file"
                            {...register("coverimage", {
                                required: true,
                            })}
                        />
                        <Button type="submit" className="w-full">
                            Create Account
                        </Button>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default Signup