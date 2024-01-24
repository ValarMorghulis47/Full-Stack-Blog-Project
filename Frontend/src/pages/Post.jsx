import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useDispatch, useSelector } from "react-redux";
import { deletePost as deletePostAction } from "../store/postSlice";
export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch()
    console.log("Single Posts: ", post);
    const userData = useSelector((state) => state.auth.userData)
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
                else{
                    navigate('/')
                }
            }
            else{
                navigate('/')
            }
        }
        fetchPost();
    }, [slug, navigate]);

    const deletePost =  async() => {
      const response = await fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/posts/${slug}`,{
        method: 'DELETE',
        credentials: 'include'
      })
      if (response.status === 200) {
        dispatch(deletePostAction(slug))
        navigate('/')
      }

    };

    return post ? (
        <div className="py-8">
            <Container>
                <div className="w-full min-h-screen flex justify-center mb-4 relative border rounded-xl p-2">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="rounded-xl"
                    />

                    {isAuthor && (
                        <div className="absolute right-6 top-6">
                            <Link to={`/edit-post/${post._id}`}>
                                <Button bgColor="bg-green-500" className="mr-3">
                                    Edit
                                </Button>
                            </Link>
                            <Button bgColor="bg-red-500" onClick={deletePost}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                <div className="w-full mb-6">
                    <h1 className="text-2xl font-bold">Author: {userData.name}</h1>
                    <h1 className="text-2xl font-bold">Title: {post.title}</h1>
                </div>
                <div className="browser-css">
                    {parse(post.content)}
                </div>
            </Container>
        </div>
    ) : null;
}
