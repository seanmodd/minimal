import React from 'react'

function Icon({ color }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="29" height="20">
      <g
        fill="none"
        stroke={color || '#6600ff'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        transform="translate(1 1.43)"
      >
        <path d="M7 .57h20m-20 8h20m-20 8h20" />
        <circle cx="1" cy="1" r="1" transform="translate(0 -.43)" />
        <circle cx="1" cy="1" r="1" transform="translate(0 7.57)" />
        <circle cx="1" cy="1" r="1" transform="translate(0 15.57)" />
      </g>
    </svg>
  )
}

export default Icon
