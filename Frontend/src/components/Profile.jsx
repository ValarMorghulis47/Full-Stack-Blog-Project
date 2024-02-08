import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import "../App.css"
import { useEffect } from 'react'
import { toggleModal, toggleSuccess } from '../store/modalSlice'
import Loading from "./Loading"
import { toggleloggedin } from '../store/authSlice'
function Profile() {
    const [loading, setLoading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState("");
    const [coverImageUrl, setCoverImageUrl] = useState("");
    const [initialUsername, setInitialUsername] = useState(null);
    const [initialEmail, setInitialEmail] = useState(null);
    const [initialFullname, setInitialFullname] = useState(null);
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [editable, setEditable] = useState(false);
    const navigate = useNavigate()
    const { register, handleSubmit, setValue } = useForm();
    const dispatch = useDispatch();
    const modal = useSelector((state) => state.modal.modal)
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
                setAvatarUrl(`${profileData.data.avatar}?${new Date().getTime()}`);
                setCoverImageUrl(`${profileData.data.coverimage}?${new Date().getTime()}`);
                setValue("fullname", profileData.data.fullname);
                setValue("email", profileData.data.email);
                setValue("username", profileData.data.username);
                setInitialUsername(profileData.data.username);
                setInitialEmail(profileData.data.email);
                setInitialFullname(profileData.data.fullname);
            }
        } catch (error) {
            // Handle errors here
        }
    };
    useEffect(() => {
        fetchProfile();
    }, [!editable])
    const [showMessage, setShowMessage] = useState(true);
    useEffect(() => {
        if (error || success) {
            setShowMessage(true);
            const timer = setTimeout(() => {
                setShowMessage(false);
            }, 5000); // Change this value to adjust the time

            return () => clearTimeout(timer); // This will clear the timer if the component unmounts before the timer finishes
        }
    }, [error, success]);
    const update = async (data) => {
        setError("");
        setSuccess("");
        try {
            setLoading(true);
            const formData = new FormData();
            // Append JSON data
            if (initialFullname !== data?.fullname) {
                formData.append('fullname', data.fullname);
            }

            if (initialEmail !== data?.email) {
                formData.append('email', data.email);
            }

            if (initialUsername !== data?.username) {
                formData.append('username', data.username);
            }
            if (data?.coverimage[0]) {
                formData.append('coverimage', data.coverimage[0]);
            }

            if (data?.avatar[0]) {
                formData.append('avatar', data.avatar[0]);
            }


            const userData = await fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/users/update-account`, {
                method: "PATCH",
                body: formData,
                credentials: 'include'
            });

            if (!userData.ok) {
                const error = await userData.json();
                setError(error.error.message);
                setEditable(!editable);
                setLoading(false);
                return;
            }
            setLoading(false);
            setSuccess("Profile updated successfully");
            setEditable(!editable);
        } catch (error) {
            setError(error.message);
        }
    }
    const handlemodal = () => {
        dispatch(toggleModal());
    }
    const deleteAccount = async () => {
        try {
            dispatch(toggleModal());
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/users/delete-account`, {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                dispatch(toggleloggedin());
                dispatch(toggleSuccess());
                setLoading(false);
                navigate('/');
            }
        } catch (error) {
            setError(error.message);
        }
    }
    return (
        <section className={homeClassName}>
            <div className={`flex flex-col items-center ${loading ? 'loading' : ''}`}>
                <form encType='multipart/form-data'>
                    <div className="max-w-4xl w-full relative mx-auto p-6 rounded flex items-center justify-center">
                        <div className="spinner">
                            {loading && <Loading />}
                        </div>
                        <div className="w-full h-full">
                            <img className="w-full h-full" src={coverImageUrl} alt="avatar" />
                        </div>
                        <div className="w-24 h-24 bg-white rounded-full p-3 absolute sm:-bottom-14 -bottom-10 left-0" style={{ width: '11rem', height: '10rem' }}>
                            <img className="w-full h-full rounded-full" src={avatarUrl} alt="avatar" />
                        </div>
                        {editable && <div className=' bg-green-600 hover:bg-amber-600 p-3 rounded-full drop-shadow-md absolute sm:bottom-6 -bottom-10 right-6 cursor-pointer'>
                            <label htmlFor="coverimageInput" className="cursor-pointer flex items-center">
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
                        {!editable && <span onClick={handlemodal} className="flex space-x-2 items-center cursor-pointer px-3 py-2 bg-rose-500 hover:bg-rose-800 rounded-md drop-shadow-md mr-3 absolute bottom-[-2rem] right-0">
                            <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24">
                                <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 4.3652344 7 L 5.8925781 20.263672 C 6.0245781 21.253672 6.877 22 7.875 22 L 16.123047 22 C 17.121047 22 17.974422 21.254859 18.107422 20.255859 L 19.634766 7 L 4.3652344 7 z"></path>
                            </svg>
                            <span className="text-white">Delete Account</span>
                        </span>}
                        {modal && <div
                            data-te-modal-init
                            className="fixed left-0 top-0 z-[1055] h-full w-full overflow-y-auto overflow-x-hidden outline-none"
                            id="exampleModalCenter"
                            tabindex="-1"
                            aria-labelledby="exampleModalCenterTitle"
                            aria-modal="true"
                            role="dialog">
                            <div
                                data-te-modal-dialog-ref
                                className="pointer-events-none relative flex min-h-[calc(100%-1rem)] w-auto translate-y-[-50px] items-center transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:min-h-[calc(100%-3.5rem)] min-[576px]:max-w-[500px]">
                                <div
                                    className="pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-white shadow-lg outline-none dark:bg-gray-900">
                                    <div
                                        className="flex flex-shrink-0 items-center justify-end rounded-t-md border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
                                        <button
                                            type="button"
                                            onClick={handlemodal}
                                            className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                                            data-te-modal-dismiss
                                            aria-label="Close">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke-width="1.5"
                                                stroke="currentColor"
                                                className="h-6 w-6">
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="relative p-4">
                                        <p>Are You Sure You Want To Delete Your Accoutn. You Wont Be Able To Get It Back!</p>
                                    </div>
                                    <div
                                        className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
                                        <button
                                            type="button"
                                            onClick={deleteAccount}
                                            className="ml-1 inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                                            data-te-ripple-init
                                            data-te-ripple-color="light">
                                            Yes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        }
                    </div>
                    <div className="flex items-center w-full max-w-4xl p-8">
                        <div className="w-full pt-10">
                            <div style={{ height: '40px' }}>
                                {showMessage && error && <p className="text-red-600 text-center">{error}</p>}
                                {showMessage && success && <p className="text-green-600 text-center">{success}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                                <input className={inputClassName} type="text" readOnly={!editable} {...register("fullname")} />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Email</label>
                                <input className={inputClassName} type="email" readOnly={!editable} {...register("email")} />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Username</label>
                                <input className={inputClassName} type="text" readOnly={!editable} {...register("username")} />
                            </div>
                            {editable && <button
                                className="flex items-center justify-between px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 mt-4" onClick={handleSubmit(update)}>
                                <span>Save Changes</span>

                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 rtl:-scale-x-100" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clipRule="evenodd" />
                                </svg>
                            </button>}
                            {!editable && <button
                                className="flex items-center justify-between px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 mt-4" onClick={handleclick}>
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