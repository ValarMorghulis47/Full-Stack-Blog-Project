// import React, { useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { Button, Container } from "../components";
// import parse from "html-react-parser";
// import { useDispatch, useSelector } from "react-redux";
// import { deletePost as deletePostAction } from "../store/postSlice";
// export default function Post() {
//     const [post, setPost] = useState(null);
//     const { slug } = useParams();
//     const navigate = useNavigate();
//     const dispatch = useDispatch()
//     console.log("Single Posts: ", post);
//     const userData = useSelector((state) => state.auth.userData)
//     const isAuthor = post && userData ? post.authorDetails._id === userData._id : false;

//     useEffect(() => {
//         const fetchPost = async () => {
//             if (slug) {
//                 const post = await fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/posts/${slug}`, {
//                     method: 'GET',
//                     credentials: 'include'
//                 })
//                 if (post.status === 200) {
//                     const postData = await post.json();
//                     setPost(postData.data);
//                 }
//                 else{
//                     navigate('/')
//                 }
//             }
//             else{
//                 navigate('/')
//             }
//         }
//         fetchPost();
//     }, [slug, navigate]);

//     const deletePost =  async() => {
//       const response = await fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/posts/${slug}`,{
//         method: 'DELETE',
//         credentials: 'include'
//       })
//       if (response.status === 200) {
//         dispatch(deletePostAction(slug))
//         navigate('/')
//       }

//     };

//     return post ? (
//         <div classNameName="py-8">
//             <Container>
//                 <div classNameName="w-full min-h-screen flex justify-center mb-4 relative border rounded-xl p-2">
//                     <img
//                         src={post.image}
//                         alt={post.title}
//                         classNameName="rounded-xl"
//                     />

//                     {isAuthor && (
//                         <div classNameName="absolute right-6 top-6">
//                             <Link to={`/edit-post/${post._id}`}>
//                                 <Button bgColor="bg-green-500" classNameName="mr-3">
//                                     Edit
//                                 </Button>
//                             </Link>
//                             <Button bgColor="bg-red-500" onClick={deletePost}>
//                                 Delete
//                             </Button>
//                         </div>
//                     )}
//                 </div>
//                 <div classNameName="w-full mb-6">
//                     <h1 classNameName="text-2xl font-bold">Author: {userData.name}</h1>
//                     <h1 classNameName="text-2xl font-bold">Title: {post.title}</h1>
//                 </div>
//                 <div classNameName="browser-css">
//                     {parse(post.content)}
//                 </div>
//             </Container>
//         </div>
//     ) : null;
// }

import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import parse from "html-react-parser";
import { useDispatch, useSelector } from "react-redux";
import { deletePost as deletePostAction } from "../store/postSlice";
import { toggleModal } from "../store/modalSlice";
import "../App.css"
export default function Post() {
    console.log("Post page mounted");
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const userData = useSelector((state) => state.auth.userData)
    const IsLoggedIn = useSelector((state) => state.auth.IsLoggedIn)
    const theme = useSelector((state) => state.theme.mode);
    const modal = useSelector((state) => state.modal.modal)
    console.log("The moda is: ", modal);
    const isAuthor = post && userData ? post.authorDetails._id === userData._id : false;
    let mainClassName = 'flex justify-center height';
    let authorClassName = 'font-bold text-sm hover:text-gray-600 mt-2 ml-4';
    let titleClassName = 'font-bold text-black text-xl m-2';
    let contentClassName = 'text-sm text-gray-500 mt-4 m-2';
    const handleclick = () => {
        console.log("i am clicked");
        dispatch(toggleModal());
    }

    if (theme === 'dark') {
        mainClassName += ' dark:bg-gray-950';
        authorClassName += ' dark:text-white' // Add the dark mode class if the theme is dark
        titleClassName = ' dark:text-white font-bold text-xl m-2' // Add the dark mode class if the theme is dark
        contentClassName = ' dark:text-white text-sm mt-4 m-2' // Add the dark mode class if the theme is dark
    }

    useEffect(() => {
        const fetchPost = async () => {
            if (slug) {
                const post = await fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/posts/${slug}`, {
                    method: 'GET',
                    credentials: 'include'
                })
                if (post.status === 200) {
                    const postData = await post.json();
                    setPost(postData.data);
                }
                else {
                    navigate('/')
                }
            }
            else {
                navigate('/')
            }
        }
        fetchPost();
    }, [slug, navigate, IsLoggedIn]);

    const deletePost = async () => {
        const response = await fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/posts/${slug}`, {
            method: 'DELETE',
            credentials: 'include'
        })
        if (response.status === 200) {
            console.log("The slug is: ", slug);
            dispatch(deletePostAction(slug))
            navigate('/')
        }

    };

    return post ? (
        <div className={mainClassName}>
            <div className="flex flex-col justify-center">
                <div className="flex flex-col md:flex-row w-screen justify-center items-center ">
                    <div className="overflow-hidden w-full m-4 shadow-sm flex flex-col md:flex-row justify-center">
                        <div className="flex flex-col md:flex-row">
                            <div className=" w-9/12 overflow-hidden rounded-2xl"> <img src={post.image} /> </div>
                            <div className="md:w-2/3 m-4 ">
                                <div className="flex justify-between cursor-pointer">
                                    <div className="flex m-2 w-20">
                                        <img src={post.authorDetails.avatar} alt=""
                                            className=" rounded-full" />
                                        <div className={authorClassName}>{post.authorDetails.username}</div>
                                    </div>
                                    {isAuthor && (<div className="flex justify-between mr-4">
                                        <Link>
                                            <button className="flex space-x-2 items-center px-3 py-2 bg-rose-500 hover:bg-rose-800 rounded-md drop-shadow-md mr-3" onClick={handleclick}>
                                                <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20"
                                                    viewBox="0 0 24 24">
                                                    <path
                                                        d="M 10 2 L 9 3 L 3 3 L 3 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 4.3652344 7 L 5.8925781 20.263672 C 6.0245781 21.253672 6.877 22 7.875 22 L 16.123047 22 C 17.121047 22 17.974422 21.254859 18.107422 20.255859 L 19.634766 7 L 4.3652344 7 z">
                                                    </path>
                                                </svg>
                                                <span className="text-white">Delete</span>
                                            </button>
                                        </Link>
                                        <Link to={`/edit-post/${post._id}`}>
                                            <button
                                                className="flex space-x-2 items-center px-4 py-2 bg-green-600 hover:bg-amber-600 rounded-full drop-shadow-md">
                                                <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20"
                                                    viewBox="0 0 50 50">
                                                    <path
                                                        d="M 46.574219 3.425781 C 45.625 2.476563 44.378906 2 43.132813 2 C 41.886719 2 40.640625 2.476563 39.691406 3.425781 C 39.691406 3.425781 39.621094 3.492188 39.53125 3.585938 C 39.523438 3.59375 39.511719 3.597656 39.503906 3.605469 L 4.300781 38.804688 C 4.179688 38.929688 4.089844 39.082031 4.042969 39.253906 L 2.035156 46.742188 C 1.941406 47.085938 2.039063 47.453125 2.292969 47.707031 C 2.484375 47.898438 2.738281 48 3 48 C 3.085938 48 3.171875 47.988281 3.257813 47.964844 L 10.746094 45.957031 C 10.917969 45.910156 11.070313 45.820313 11.195313 45.695313 L 46.394531 10.5 C 46.40625 10.488281 46.410156 10.472656 46.417969 10.460938 C 46.507813 10.371094 46.570313 10.308594 46.570313 10.308594 C 48.476563 8.40625 48.476563 5.324219 46.574219 3.425781 Z M 45.160156 4.839844 C 46.277344 5.957031 46.277344 7.777344 45.160156 8.894531 C 44.828125 9.222656 44.546875 9.507813 44.304688 9.75 L 40.25 5.695313 C 40.710938 5.234375 41.105469 4.839844 41.105469 4.839844 C 41.644531 4.296875 42.367188 4 43.132813 4 C 43.898438 4 44.617188 4.300781 45.160156 4.839844 Z M 5.605469 41.152344 L 8.847656 44.394531 L 4.414063 45.585938 Z">
                                                    </path>
                                                </svg>
                                                <span className="text-white text-md">Edit</span>
                                            </button>
                                        </Link>
                                    </div>)}
                                </div>
                                <div className={titleClassName}>{post.title}</div>
                                <div className={contentClassName}>{parse(post.content)}</div>
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
                                                    onClick={handleclick}
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
                                                <p>Are You Sure You Want To Delete The Post.</p>
                                            </div>
                                            <div
                                                className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
                                                <button
                                                    type="button"
                                                    onClick={deletePost}
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : null;
}
