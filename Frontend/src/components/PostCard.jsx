import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector} from 'react-redux';
function PostCard({ _id, title, image }) {
  const theme = useSelector((state) => state.theme.mode);
  let homeClassName = 'w-full bg-gray-100 rounded-xl p-4';
  let headingClassName = 'text-xl font-bold';

  if (theme === 'dark') {
    homeClassName += ' dark:bg-gray-900';
    headingClassName += ' dark:text-white' // Add the dark mode class if the theme is dark
  }
  return (
    <Link to={`/post/${_id}`}>
      <div className={homeClassName}>
        <div className='w-full justify-center mb-4'>
          <img src={image} alt={title}
            className='rounded-xl' />

        </div>
        <h2
          className={headingClassName}
        >Blog Title: {title}</h2>
      </div>
    </Link>
  )
}


export default PostCard
