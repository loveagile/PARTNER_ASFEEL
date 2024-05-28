import React from 'react'

export enum RequiredLabelType {
  REQUIRED,
  OPTIONAL,
}

export interface RequiredLabelProps {
  status: RequiredLabelType
  label: string
}

export const RequiredLabel = ({ status, label }: RequiredLabelProps) => {
  const backgroundColor = status === RequiredLabelType.REQUIRED ? ' bg-core-red ' : ' bg-gray-gray_dark '

  return (
    <div
      className={
        'h-full whitespace-nowrap rounded-[3px] px-[6px] py-[2px] text-mini text-gray-white ' + backgroundColor
      }
    >
      {label}
    </div>
  )
}
