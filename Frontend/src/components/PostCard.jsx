import React from 'react'
import appwriteService from "../appwrite/databaseconfig"
import {Link} from 'react-router-dom'

function PostCard({_id, title, image}) {
    
  return (
    <Link to={`/post/${_id}`}>
        <div className='w-full bg-gray-100 rounded-xl p-4'>
            <div className='w-full justify-center mb-4'>
                <img src={image} alt={title}
                className='rounded-xl' />

            </div>
            <h2
            className='text-xl font-bold'
            >Blog Title: {title}</h2>
        </div>
    </Link>
  )
}


export default PostCard
