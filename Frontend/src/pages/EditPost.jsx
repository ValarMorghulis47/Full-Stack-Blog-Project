import React, { useEffect, useState } from 'react'
import { Container, PostForm } from '../components'
import appwriteService from "../appwrite/databaseconfig";
import { useNavigate, useParams } from 'react-router-dom';

function EditPost() {
    const [post, setPost] = useState(null)
    const { slug } = useParams()
    const navigate = useNavigate()

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
    }, [slug, navigate])
    return post ? (
        <div className='py-8'>
            <Container>
                <PostForm post={post} />
            </Container>
        </div>
    ) : null
}

export default EditPost