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

  return <div className={'rounded-[3px] py-[2px] px-[6px] h-full text-mini text-gray-white whitespace-nowrap ' + backgroundColor}>{label}</div>
}
