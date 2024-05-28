import { convertHalfWidthToFullWidth } from '@/utils/common'
import { InputProps, Input } from 'antd'

type InputKanaProps = InputProps & {
  value?: string
  onChange?: (value: string) => void
}

const InputKana = ({ value, onChange, ...props }: InputKanaProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const newValue = convertHalfWidthToFullWidth(value)
    onChange?.(newValue)
  }

  return <Input value={value} onChange={handleChange} {...props} />
}

export default InputKana
