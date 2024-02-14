import React from 'react'
import "../../App.css"
function Container({children, className}) {
  return <div className={`w-full max-w-7xl mx-auto px-4 container-height ${className}`}>{children}</div>;
  
}

export default Container