import React from 'react'
import { Container, PostForm } from '../components'
import {useSelector } from "react-redux";
function AddPost() {
  const theme = useSelector((state) => state.theme.mode);
  let mainClassName = 'py-8';

  if (theme === 'dark') {
      mainClassName += ' dark:bg-gray-950';
  }
  return (
    <div className={mainClassName}>
        <Container>
            <PostForm />
        </Container>
    </div>
  )
}

export default AddPost