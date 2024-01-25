import React from 'react'
import { Container, PostCard } from '../components'
import { UserPost } from '../store/postSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import "../App.css"
function AllPosts() {
    const UserPosts = useSelector((state) => state.post.UserPost)
    const userData = useSelector((state)=> state.auth.userData)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/posts/user/${userData._id}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.ok) {
                    const postsData = await response.json();
                    // console.log(postsData.data);
                    dispatch(UserPost(postsData.data))
                    setLoading(false);
                }
                else {
                    console.error("Error fetching posts:", response.status);
                    setLoading(false);
                }
            } catch (error) {
                // Handle errors here
                setLoading(false);
                console.error("Error fetching posts:", error);
            }
        };
        fetchPosts();
    }, [])
        if (UserPosts?.length === 0) {
            return (
                <div className="w-full py-8 mt-4 text-center height">
                    <Container>
                    {loading && <Loading />}
                        <div className="flex flex-wrap">
                            <div className="p-2 w-full">
                                <h1 className="text-2xl font-bold hover:text-gray-500">
                                    Add a post to see one
                                </h1>
                            </div>
                        </div>
                    </Container>
                </div>
            )
        }
        else {
            return (
                <div className='w-full py-8 height'>
                    <Container>
                    {loading && <Loading />}
                        <div className='flex flex-wrap'>
                            {UserPosts?.map((post) => (
                                <div key={post._id} className='p-2 w-1/4'>
                                    <PostCard {...post} />
                                </div>
                            ))}
                        </div>
                    </Container>
                </div>
            )
        }
    
}

export default AllPosts