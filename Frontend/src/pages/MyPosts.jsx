import React from 'react'
import { Container, PostCard } from '../components'
import { UserPost } from '../store/postSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import "../App.css"
function AllPosts() {
    console.log("my post page mounted");
    const UserPosts = useSelector((state) => state.post.UserPost)
    const userData = useSelector((state) => state.auth.userData)
    const theme = useSelector((state) => state.theme.mode);
    let homeClassName = 'w-full py-8 text-center height';
    let postClassName = 'w-full py-8 height';
    let headingClassName = 'text-2xl font-bold hover:text-gray-500';

    if (theme === 'dark') {
        homeClassName += ' dark:bg-gray-950';
        postClassName += ' dark:bg-gray-950';
        headingClassName += ' dark:text-white' // Add the dark mode class if the theme is dark
    }
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchPosts = async () => {
            if (!UserPosts?.length) {
                try {
                    console.log("use effect of my post triggered");
                    setLoading(true);
                    const response = await fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/posts/user/${userData._id}`, {
                        method: 'GET',
                        credentials: 'include',
                        cache: 'no-cache',
                    });
                    if (response.ok) {
                        const postsData = await response.json();
                        dispatch(UserPost(postsData.data))
                        setLoading(false);
                    }
                    else {
                        setLoading(false);
                    }
                } catch (error) {
                    // Handle errors here
                    setLoading(false);
                }
            }
            setLoading(false)
        };
        fetchPosts();
    }, [])
    if (UserPosts?.length == 0) {
        return (
            <div className={homeClassName} >
                <Container>
                    <div className="flex flex-wrap main-container">
                        <div className="p-7 w-full flex flex-col items-center">
                            <h1 className={headingClassName}>
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
            <div className={postClassName}>
            <Container>
                <div className='flex flex-wrap'>
                    {UserPosts?.map((post) => (
                        <div key={post._id} className='p-2 w-1/4'>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
                <div className="flex justify-center">
                    <div className="spinner">
                        {loading && <Loading />}
                    </div>
                </div>
            </Container>
        </div>
        )
    }
}

export default AllPosts