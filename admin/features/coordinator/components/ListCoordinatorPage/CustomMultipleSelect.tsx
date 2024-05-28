import { Select, SelectProps, Tag } from 'antd'
import type { CustomTagProps } from 'rc-select/lib/BaseSelect'
import styles from './index.module.scss'

type CustomMultipleSelectProps = SelectProps

const CustomMultipleSelect = (props: CustomMultipleSelectProps) => {
  const handleTagRender = (props: CustomTagProps) => {
    const { label, value, closable, onClose } = props

    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault()
      event.stopPropagation()
    }

    return (
      <Tag
        color="#D9EFFE"
        closable={closable}
        onClose={onClose}
        onMouseDown={onPreventMouseDown}
        className="flex flex-row-reverse rounded-xl
        text-[0.652rem] font-normal leading-4  !text-black"
        closeIcon={
          <span
            className="mr-1.5 inline-flex w-3 items-center justify-center rounded-full
            bg-tools-blue_cerulean text-[10px] leading-3 text-white
            "
          >
            ×
          </span>
        }
      >
        {label}
      </Tag>
    )
  }

  return (
    <Select
      mode="multiple"
      tagRender={handleTagRender}
      showArrow={false}
      {...props}
      className={`${styles.custom_multi_select} md:!w-auto ${
        props.className || ''
      }`}
    />
  )
}

export default CustomMultipleSelect
