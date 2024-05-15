import React from 'react'

const Subtitle = ({text, className}) => {
  return (
    <h2 className={`ml-2 text-center text-m font-bold leading-9 tracking-tight text-gray-900 ${className}`}>
      {text}
    </h2>
  )
}

export default Subtitle
