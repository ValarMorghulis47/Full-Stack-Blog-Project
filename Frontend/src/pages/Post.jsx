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
import {useNavigate, useParams } from "react-router-dom";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useDispatch, useSelector } from "react-redux";
import { deletePost as deletePostAction } from "../store/postSlice";
import "../App.css"
export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const userData = useSelector((state) => state.auth.userData)
    const IsLoggedIn = useSelector((state)=> state.auth.IsLoggedIn)
    const isAuthor = post && userData ? post.authorDetails._id === userData._id : false;

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
            dispatch(deletePostAction(slug))
            navigate('/')
        }

    };

    return post ? (
        <div className="flex justify-center height">
            <div className="flex flex-col justify-center">
                <div className="flex flex-col md:flex-row max-w-7xl justify-center items-center ">
                    <div className="overflow-hidden w-full m-4 shadow-sm flex flex-col md:flex-row justify-center">
                        <div className="flex flex-col md:flex-row">
                            <div className=" w-full overflow-hidden rounded-2xl"> <img src={post.image}/> </div>
                            <div className="md:w-2/3 m-4 ">
                                <div className="flex cursor-pointer">
                                    <div className="m-2 w-20"> <img src={post.authorDetails.avatar} alt=""
                                        className=" rounded-full" /> </div>
                                    <div className="grid m-3">
                                        <div className="font-bold text-sm hover:text-gray-600 mt-2">{post.authorDetails.username}</div>
                                    </div>
                                </div>
                                <div className="font-bold text-black text-xl m-2">{post.title}</div>
                                <div className="text-sm text-gray-500 mt-4 m-2">{parse(post.content)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : null;
}
