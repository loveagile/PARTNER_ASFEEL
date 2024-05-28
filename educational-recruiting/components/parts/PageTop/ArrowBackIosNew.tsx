import React from 'react'

export enum ArrowIconType {
  NEXT,
  PREV,
}

export interface ArrowIconProps {
  type: ArrowIconType
  onClick: () => void
  disabled: boolean
}

export const ArrowIcon = ({ type, onClick, disabled }: ArrowIconProps) => {
  return type == ArrowIconType.NEXT ? (
    <svg
      width="10"
      height="16"
      viewBox="0 0 10 16"
      xmlns="http://www.w3.org/2000/svg"
      className={(disabled ? 'opacity-40' : ' cursor-pointer ') + '  fill-gray-black'}
      onClick={() => {
        !disabled && onClick()
      }}
    >
      <path d="M1.24862 14.7613C1.61612 15.1288 2.20862 15.1288 2.57612 14.7613L8.80862 8.52876C9.10112 8.23626 9.10112 7.76376 8.80862 7.47126L2.57612 1.23876C2.20862 0.87126 1.61612 0.87126 1.24862 1.23876C0.881116 1.60626 0.881116 2.19876 1.24862 2.56626L6.67862 8.00376L1.24112 13.4413C0.881116 13.8013 0.881116 14.4013 1.24862 14.7613Z" />
    </svg>
  ) : (
    <svg
      width="10"
      height="16"
      viewBox="0 0 10 16"
      xmlns="http://www.w3.org/2000/svg"
      className={(disabled ? 'opacity-40' : ' cursor-pointer ') + '  fill-gray-black'}
      onClick={() => {
        !disabled && onClick()
      }}
    >
      <path d="M8.78894 1.16381C8.42144 0.796309 7.82894 0.796309 7.46144 1.16381L1.15395 7.47131C0.861445 7.76381 0.861445 8.23631 1.15395 8.52881L7.46144 14.8363C7.82894 15.2038 8.42144 15.2038 8.78894 14.8363C9.15644 14.4688 9.15644 13.8763 8.78894 13.5088L3.28395 8.00381L8.79644 2.49131C9.15644 2.12381 9.15644 1.53131 8.78894 1.16381Z" />
    </svg>
  )
}
