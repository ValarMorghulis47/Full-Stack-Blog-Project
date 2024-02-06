import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Logo } from './index.js'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import "../App.css"
import { useEffect } from 'react'
function Profile() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("")
    const [editable, setEditable] = useState(false);
    const [data, setData] = useState('');
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const { id } = useParams();
    const theme = useSelector((state) => state.theme.mode);
    let homeClassName = 'bg-white';
    let inputClassName = 'bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none';

    if (theme === 'dark') {
        homeClassName += ' dark:bg-gray-950';
        inputClassName += ' dark:bg-gray-900';
        // headingClassName += ' dark:text-white';
    }
    const handleclick = () => {
        setEditable(!editable);
    }
    const fetchProfile = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/users/profile/${id}`, {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                const profileData = await response.json();
                console.log(profileData.data);
                setData(profileData.data);
                setValue("fullname", profileData.data.fullname);
                setValue("email", profileData.data.email);
                setValue("username", profileData.data.username);
            } else {
                console.log(response.json());
                console.error("Error fetching current user:", response.status);
            }
        } catch (error) {
            // Handle errors here
            console.error("Error fetching current user:", error);
        }
    };
    useEffect(() => {
        fetchProfile();
    }, [])
    const create = async (data) => {
        setError("");
        try {
            setLoading(true);
            const formData = new FormData();

            // Append JSON data
            formData.append('fullname', data?.fullname);
            formData.append('username', data?.username);
            formData.append('email', data?.email);

            // Append file data
            console.log(data.coverimage[0]);
            console.log(data.avatar[0]);
            formData.append('avatar', data?.avatar[0]);
            formData.append('coverimage', data?.coverimage[0]);
            const userData = await fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/users/update-account`, {
                method: "PATCH",
                body: formData,
                credentials: 'include'
            });

            if (!userData.ok) {
                const error = await userData.json();
                setError(error.error.message);
                setLoading(false);
                return;
            }
            setLoading(false);
            // navigate("/");
        } catch (error) {
            setError(error.message);
        }

    };


    return (
        <section className={homeClassName}>
            <div className={`flex flex-col items-center ${loading ? 'loading' : ''}`}>
                <form encType='multipart/form-data' onSubmit={handleSubmit(create)}>
                    <div className="max-w-4xl w-full relative mx-auto p-6 rounded">
                        <div className="w-full h-full">
                            <img className="w-full h-full" src={data?.coverimage} alt="avatar" />
                        </div>
                        <div className="w-24 h-24 bg-white rounded-full p-3 absolute sm:-bottom-14 -bottom-10 left-0 cursor-pointer" style={{ width: '11rem', height: '10rem' }}>
                            <img className="w-full h-full rounded-full" src={data?.avatar} alt="avatar" />
                        </div>
                        {editable && <div className=' bg-green-600 hover:bg-amber-600 p-3 rounded-full drop-shadow-md absolute sm:bottom-6 -bottom-10 right-6 cursor-pointer'>
                            <label htmlFor="avatarInput" className="cursor-pointer flex items-center">
                                <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50">
                                    <path d="M 46.574219 3.425781 C 45.625 2.476563 44.378906 2 43.132813 2 C 41.886719 2 40.640625 2.476563 39.691406 3.425781 C 39.691406 3.425781 39.621094 3.492188 39.53125 3.585938 C 39.523438 3.59375 39.511719 3.597656 39.503906 3.605469 L 4.300781 38.804688 C 4.179688 38.929688 4.089844 39.082031 4.042969 39.253906 L 2.035156 46.742188 C 1.941406 47.085938 2.039063 47.453125 2.292969 47.707031 C 2.484375 47.898438 2.738281 48 3 48 C 3.085938 48 3.171875 47.988281 3.257813 47.964844 L 10.746094 45.957031 C 10.917969 45.910156 11.070313 45.820313 11.195313 45.695313 L 46.394531 10.5 C 46.40625 10.488281 46.410156 10.472656 46.417969 10.460938 C 46.507813 10.371094 46.570313 10.308594 46.570313 10.308594 C 48.476563 8.40625 48.476563 5.324219 46.574219 3.425781 Z M 45.160156 4.839844 C 46.277344 5.957031 46.277344 7.777344 45.160156 8.894531 C 44.828125 9.222656 44.546875 9.507813 44.304688 9.75 L 40.25 5.695313 C 40.710938 5.234375 41.105469 4.839844 41.105469 4.839844 C 41.644531 4.296875 42.367188 4 43.132813 4 C 43.898438 4 44.617188 4.300781 45.160156 4.839844 Z M 5.605469 41.152344 L 8.847656 44.394531 L 4.414063 45.585938 Z">
                                    </path>
                                </svg>
                                <span className="text-white text-md">Edit CoverImage</span>
                            </label>
                            <input type="file" id="coverimageInput" className='hidden' accept='image/*' {...register("coverimage")} />
                        </div>}
                        {editable && <div className='bg-green-600 hover:bg-amber-600 p-3 rounded-full drop-shadow-md absolute cursor-pointer' style={{ left: '10rem', bottom: '-2rem' }}>
                            <label htmlFor="avatarInput" className="cursor-pointer flex items-center">
                                <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50">
                                    <path d="M 46.574219 3.425781 C 45.625 2.476563 44.378906 2 43.132813 2 C 41.886719 2 40.640625 2.476563 39.691406 3.425781 C 39.691406 3.425781 39.621094 3.492188 39.53125 3.585938 C 39.523438 3.59375 39.511719 3.597656 39.503906 3.605469 L 4.300781 38.804688 C 4.179688 38.929688 4.089844 39.082031 4.042969 39.253906 L 2.035156 46.742188 C 1.941406 47.085938 2.039063 47.453125 2.292969 47.707031 C 2.484375 47.898438 2.738281 48 3 48 C 3.085938 48 3.171875 47.988281 3.257813 47.964844 L 10.746094 45.957031 C 10.917969 45.910156 11.070313 45.820313 11.195313 45.695313 L 46.394531 10.5 C 46.40625 10.488281 46.410156 10.472656 46.417969 10.460938 C 46.507813 10.371094 46.570313 10.308594 46.570313 10.308594 C 48.476563 8.40625 48.476563 5.324219 46.574219 3.425781 Z M 45.160156 4.839844 C 46.277344 5.957031 46.277344 7.777344 45.160156 8.894531 C 44.828125 9.222656 44.546875 9.507813 44.304688 9.75 L 40.25 5.695313 C 40.710938 5.234375 41.105469 4.839844 41.105469 4.839844 C 41.644531 4.296875 42.367188 4 43.132813 4 C 43.898438 4 44.617188 4.300781 45.160156 4.839844 Z M 5.605469 41.152344 L 8.847656 44.394531 L 4.414063 45.585938 Z">
                                    </path>
                                </svg>
                                <span className="text-white text-md">Edit Avatar</span>
                            </label>
                            <input type="file" id="avatarInput" className='hidden' accept='image/*' {...register("avatar")} />
                        </div>}

                    </div>
                    <div className="flex items-center w-full max-w-3xl p-8 lg:px-12 lg:w-3/5">
                        <div className="w-full">
                            {error && <p classNameName="text-red-600 mt-8 text-center">{error}</p>}
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                                <input className={inputClassName} type="text" readOnly={!editable} {...register("fullname")} />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                                <input className={inputClassName} type="email" readOnly={!editable} {...register("email")} />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                                <input className={inputClassName} type="text" readOnly={!editable} {...register("username")} />
                            </div>
                            {editable && <button
                                className="flex items-center justify-between w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 mt-4">
                                <span>Save Changes</span>

                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 rtl:-scale-x-100" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clipRule="evenodd" />
                                </svg>
                            </button>}
                            {!editable && <button
                                className="flex items-center justify-between w-1/2 px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 mt-4" onClick={handleclick}>
                                <span>Edit Profile</span>

                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 rtl:-scale-x-100" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clipRule="evenodd" />
                                </svg>
                            </button>}
                        </div>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default Profile