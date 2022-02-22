import React from 'react'

function Icon({ color }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 17">
      <g
        stroke={color || '#1f73e8'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        transform="translate(-47 -148)"
      >
        <rect
          width="20"
          height="15"
          fill="rgba(0,0,0,0)"
          rx="2"
          transform="translate(48 149)"
        />
        <path fill="none" d="M50.984 151.833l7.012 5.454 7.012-5.454" />
      </g>
    </svg>
  )
}

export default Icon
