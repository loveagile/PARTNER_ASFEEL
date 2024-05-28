import { Typography } from 'antd'
import { TextProps } from 'antd/es/typography/Text'
import { DetailedHTMLProps, HTMLAttributes, RefAttributes } from 'react'

export const FormLabel = ({
  className,
  requiredProps,
  ...rest
}: TextProps &
  RefAttributes<HTMLSpanElement> & {
    requiredProps?: DetailedHTMLProps<
      HTMLAttributes<HTMLSpanElement>,
      HTMLSpanElement
    >
  }) => {
  return (
    <>
      <Typography.Text className={`font-bold ${className}`} {...rest} />
      <span
        className={`required_label ml-5 hidden rounded-[3px] bg-core-red px-[6px] py-[2px] text-[10px] text-white ${requiredProps?.className}`}
      >
        {requiredProps?.children || '必須'}
      </span>
    </>
  )
}

export default FormLabel
