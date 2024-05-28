import { convertFullWidthToHalfWidth } from '@/utils/common'
import { Input, InputProps } from 'antd'

type InputNumberProps = InputProps & {
  value?: string
  onChange?: (value: string) => void
}

const InputNumber = ({ value, onChange, ...props }: InputNumberProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const newValue = convertFullWidthToHalfWidth(value.replace(/-/g, ''))
    onChange?.(newValue)
  }

  // const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  //   const { value } = e.target
  //   const newValue = convertFullWidthToHalfWidth(value.replace(/-/g, ''))
  //   onChange?.(newValue)
  // }

  return (
    <Input
      value={value}
      onChange={handleChange}
      //  onBlur={handleBlur}
      {...props}
    />
  )
}

export default InputNumber
