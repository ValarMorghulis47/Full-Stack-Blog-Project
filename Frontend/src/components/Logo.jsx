import React from 'react'
import logo from "./wallpap.jpg"
function Logo({width = '100px'}) {
  return (
    <img src={logo} width={width} className='rounded-2xl'/>
  )
}

export default Logo