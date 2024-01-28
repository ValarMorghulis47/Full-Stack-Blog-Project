import React, { useEffect } from 'react'
import '../App.css'
import { Container, PostCard } from '../components'
import { useSelector, useDispatch } from 'react-redux';
import Loading from '../components/Loading';
import { useState } from 'react';
import { AllPost } from '../store/postSlice';
function Home() {
    console.log("Home component rendering");
    const [loading, setLoading] = useState(false);
    const AllPosts = useSelector((state) => state.post.AllPost)
    const IsLoggedIn = useSelector((state) => state.auth.IsLoggedIn)
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchPosts = async () => {
            if (!AllPosts?.length) {
                try {
                    console.log("use effect of home triggered");
                    const response = await fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/posts/`, {
                        method: 'GET',
                        credentials: 'include'
                    });
                    if (response.ok) {
                        console.log("i am in if");
                        const postsData = await response.json();
                        dispatch(AllPost(postsData.data))
                        setLoading(false);
                    }
                    else {
                        setLoading(false);
                    }
                } catch (error) {
                    // Handle errors here
                    setLoading(false);
                    // console.error("Error fetching posts:", error);
                }
            }
            setLoading(false);
        };
        setLoading(true);
        fetchPosts();
    }, [IsLoggedIn])
    if (IsLoggedIn === false) {
        return (
            <div className="w-full py-8 text-center height" >
                <Container>
                    {loading && <Loading />}
                    <div className="flex flex-wrap main-container">
                        <div className="p-7 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                Login To Read Posts
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    else if (AllPosts?.length == 0) {
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
                        {AllPosts?.map((post) => (
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

export default Home