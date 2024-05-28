import React from 'react'

function UpdatedAt({ updateDateStr, className }: { updateDateStr: string; className?: string }) {
  return (
    <div className={`mx-auto flex flex-row items-end justify-end text-mini text-gray-gray_dark ${className}`}>
      <span>{`最終更新：${updateDateStr}`}</span>
    </div>
  )
}

export default UpdatedAt
