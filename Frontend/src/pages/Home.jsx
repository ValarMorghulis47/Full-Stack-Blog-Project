import React from 'react'
import { Container, PostCard } from '../components'
import { useSelector } from 'react-redux';
import Loading from '../components/Loading';
import { useState } from 'react';
function Home() {
    const [loading, setLoading] = useState(false);
    const allpost = useSelector((state) => state.post.AllPost)
    console.log(allpost)
    const userStatus = useSelector((state) => state.auth.status)
    if (userStatus === false) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                {loading && <Loading />}
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                Login To Read Posts
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }
    else if (allpost?.length === 0) {
        return (
            <div className="w-full py-8 mt-4 text-center">
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
            <div className='w-full py-8'>
                <Container>
                {loading && <Loading />}
                    <div className='flex flex-wrap'>
                        {allpost?.map((post) => (
                            <div key={post.$id} className='p-2 w-1/4'>
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