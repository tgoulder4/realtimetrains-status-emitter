import React from 'react'

type BusinessIndicatorProps = {
  count: number
}

export function BusinessIndicator({ count }: BusinessIndicatorProps) {
  let eyesEmoji = "👀"
  const tooltipText = "Rush beaten count"

  return (
    <div className="flex items-center group relative">
      <div className="bg-white bg-opacity-10 text-white text-xs rounded px-1.5 py-0.5">
        <span className="mr-1 text-gray-400">{eyesEmoji}</span>
        {count}
      </div>
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none mb-2">
        {tooltipText}
      </div>
    </div>
  )
}