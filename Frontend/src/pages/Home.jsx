import React, { useEffect } from 'react'
import '../App.css'
import { Container, PostCard } from '../components'
import { useSelector, useDispatch } from 'react-redux';
import Loading from '../components/Loading';
import { useState } from 'react';
import { AllPost } from '../store/postSlice';
import { togglePostDelete, toggleSuccess } from '../store/modalSlice';
function Home() {
    console.log("Home component rendering");
    const [loading, setLoading] = useState(false);
    const AllPosts = useSelector((state) => state.post.AllPost)
    const IsLoggedIn = useSelector((state) => state.auth.IsLoggedIn)
    const dispatch = useDispatch()
    const theme = useSelector((state) => state.theme.mode);
    const successmesj = useSelector((state) => state.modal.success);
    const postDeleteMesj = useSelector((state) => state.modal.postDelete);
    const [showMessage, setShowMessage] = useState(true);
    let homeClassName = 'w-full py-8 text-center height';
    let postClassName = 'w-full py-8 height';
    let headingClassName = 'text-2xl font-bold hover:text-gray-500';

    if (theme === 'dark') {
        homeClassName += ' dark:bg-gray-950';
        postClassName += ' dark:bg-gray-950';
        headingClassName += ' dark:text-white' // Add the dark mode class if the theme is dark
    }
    useEffect(() => {
        if (successmesj) {
            setShowMessage(true);
            const timer = setTimeout(() => {
                setShowMessage(false);
                dispatch(toggleSuccess());
            }, 5000); // Change this value to adjust the time

            return () => clearTimeout(timer); // This will clear the timer if the component unmounts before the timer finishes
        }
        if (postDeleteMesj) {
            setShowMessage(true);
            const timer = setTimeout(() => {
                setShowMessage(false);
                dispatch(togglePostDelete());
            }, 5000); // Change this value to adjust the time

            return () => clearTimeout(timer); // This will clear the timer if the component unmounts before the timer finishes
        }
    }, [successmesj, postDeleteMesj]);
    useEffect(() => {
        const fetchPosts = async () => {
            if (!AllPosts?.length) {
                try {
                    console.log("use effect of home triggered");
                    setLoading(true);
                    const response = await fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/posts/`, {
                        method: 'GET',
                        credentials: 'include',
                    });
                    if (response.ok) {
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
        fetchPosts();
    }, [IsLoggedIn])
    if (IsLoggedIn === false) {
        return (
            <div className={homeClassName} >
                <Container>
                    <div className="flex flex-wrap main-container">
                        <div className="p-7 w-full flex flex-col items-center">
                            <div style={{ height: '40px' }}>
                                {showMessage && successmesj && <p className="text-green-600 text-center">Your Account Has Been Deleted Successfully</p>}
                                {showMessage && postDeleteMesj && <p className="text-green-600 text-center">Your Post Has Been Deleted Successfully</p>}
                            </div>
                            <h1 className={headingClassName}>
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
            <div className={homeClassName}>
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full flex flex-col items-center">
                            <div style={{ height: '40px' }}>
                                {showMessage && successmesj && <p className="text-green-600 text-center">Your Account Has Been Deleted Successfully</p>}
                                {showMessage && postDeleteMesj && <p className="text-green-600 text-center">Your Post Has Been Deleted Successfully</p>}
                            </div>
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
                        <div style={{ height: '40px' }}>
                            {showMessage && successmesj && <p className="text-green-600 text-center">Your Account Has Been Deleted Successfully</p>}
                            {showMessage && postDeleteMesj && <p className="text-green-600 text-center">Your Post Has Been Deleted Successfully</p>}
                        </div>
                        {AllPosts?.map((post) => (
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

export default Home
