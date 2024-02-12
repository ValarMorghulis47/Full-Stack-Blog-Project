import React, { useState } from 'react';
import Button from './Button';
import { useEffect } from 'react';
const ProfileDetails = ({ editable, register, handleSubmit, update, handleclick, showMessage, error, success, inputClassName, updatePassword }) => {
    const [isPasswordChange, setIsPasswordChange] = useState(false);
    useEffect(() => {
        setIsPasswordChange(false);
    }, [success]);
    if (isPasswordChange) {
        return (
            <div className="flex items-center w-full max-w-4xl p-8">
                <div className="w-full pt-10">
                    <div style={{ height: '40px' }}>
                        {showMessage && error && <p className="text-red-600 text-center">{error}</p>}
                        {showMessage && success && <p className="text-green-600 text-center">{success}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Old Password</label>
                        <input className={inputClassName} type="password" {...register("oldPassword")} />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">New Password</label>
                        <input className={inputClassName} type="password" {...register("newPassword")} />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">Confirm Password</label>
                        <input className={inputClassName} type="password" {...register("confirmpassword")} />
                    </div>
                    <Button
                        className="flex items-center justify-between px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 mt-4" onClick={handleSubmit(updatePassword)}>
                        <span>Save Changes To Password</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 rtl:-scale-x-100" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd" />
                        </svg>
                    </Button>
                </div>
            </div>
        );
    } else {
        return (
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
                {editable && <Button
                    className="flex items-center justify-between px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 mt-4" onClick={handleSubmit(update)}>
                    <span>Save Changes</span>

                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 rtl:-scale-x-100" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd" />
                    </svg>
                </Button>}
                <div className='flex'>
                    {!editable && <Button
                        className="flex items-center justify-between px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 mt-4" onClick={() => { handleclick() }}>
                        <span>Edit Profile</span>

                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 rtl:-scale-x-100" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd" />
                        </svg>
                    </Button>}
                    {!editable && <Button
                        className="flex items-center justify-between ml-4 px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 mt-4" onClick={() => { setIsPasswordChange(true) }}>
                        <span>Change Password</span>

                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 rtl:-scale-x-100" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd" />
                        </svg>
                    </Button>}
                </div>
            </div>
        );
    }
};

export default ProfileDetails;
