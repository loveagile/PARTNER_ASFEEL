import { SVGProps } from 'react'

const MessageBoxMark = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="11"
      height="9"
      viewBox="0 0 11 9"
      fill="#BDED9A"
      {...props}
    >
      <path
        d="M11 0C9.00003 2.00049 2.33333 3.33333 0 3C2.5 5.5 3 9 3 9C8.5 8 11 0 11 0Z"
        fill="#currentColor"
      />
    </svg>
  )
}

export default MessageBoxMark
