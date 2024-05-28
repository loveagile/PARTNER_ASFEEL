import React, { useEffect, useState, useRef } from 'react'

export enum IconTypeSelectBox {
  OFF,
  FRONT,
  BACK,
}

export enum SelectBoxType {
  DEFAULT,
  DISABLED,
  ERROR,
}

export enum SelectBoxSize {
  PC,
  SP,
}

export interface OptionProps {
  value: string
  placeholder?: boolean
  text: string
  icon?: IconTypeSelectBox
  selected?: boolean
  size?: SelectBoxSize
  iconComponent?: (isPlaceholder: boolean, icon: IconTypeSelectBox, size: SelectBoxSize) => any
}

export interface SelectBoxProps {
  status: SelectBoxType
  size: SelectBoxSize
  options: OptionProps[]
  setValue: React.Dispatch<React.SetStateAction<string>>
  className?: string
  value?: string
  // iconComponent?: (isPlaceholder: boolean) => React.ReactNode;
}

const ArrowIcon = () => {
  return (
    <svg
      viewBox="0 0 10 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute top-1/2 -translate-y-1/2 transform sp:right-[15px] sp:h-[4px] sp:w-[8px] pc:right-[15.5px] pc:h-[6px] pc:w-[10px] "
    >
      <path d="M0 0.5L5 5.5L10 0.5H0Z" fill="#3D3D3D" />
    </svg>
  )
}

export const getIconStyleSelectBox = (icon: IconTypeSelectBox, size: SelectBoxSize) => {
  let iconStyle = ''
  if (size === SelectBoxSize.PC) {
    iconStyle = ' w-[18px] h-5 '
    switch (icon) {
      case IconTypeSelectBox.FRONT:
        iconStyle += ' mr-1 '
        break
      case IconTypeSelectBox.BACK:
        iconStyle += ' ml-1 '
        break
    }
  }
  if (size === SelectBoxSize.SP) {
    iconStyle = ' w-[15px] h-[16.7px] '
    switch (icon) {
      case IconTypeSelectBox.FRONT:
        iconStyle += ' mr-1 '
        break
      case IconTypeSelectBox.BACK:
        iconStyle += ' ml-1 '
        break
    }
  }
  return iconStyle
}

const getBackgroundColorStyle = (status: SelectBoxType) => {
  let backgroundColorStyle = ''
  switch (status) {
    case SelectBoxType.DEFAULT:
      backgroundColorStyle = 'bg-gray-white border-gray-gray_dark'
      break
    case SelectBoxType.DISABLED:
      backgroundColorStyle = 'bg-gray-white opacity-40 border-gray-gray_dark'
      break
    case SelectBoxType.ERROR:
      backgroundColorStyle = 'bg-light-red_light border-core-red'
      break
  }
  return backgroundColorStyle
}

const SelectBox = ({ value, status, options, size, setValue, className = ' w-[200px]' }: SelectBoxProps) => {
  const [selected, setSelected] = useState({} as OptionProps)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [selectedIcon, setSelectedIcon] = useState(IconTypeSelectBox.OFF)
  const [isPlaceholder, setIsPlaceholder] = useState(false)
  const [open, setOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (value) {
      const index = options.findIndex((element) => element.value == value)
      setSelected(options[index])
      setSelectedIcon(options[index]?.icon || IconTypeSelectBox.OFF)
      setIsPlaceholder(options[index]?.placeholder || false)
    } else {
      setSelected(options[0])
      setSelectedIcon(options[0].icon || IconTypeSelectBox.OFF)
      setIsPlaceholder(options[0].placeholder || false)
    }
  }, [value, options])

  const selectBoxStyle =
    'pc:py-[6.5px] pc:pl-[16px] pc:pr-[30px] pc:text-body_pc pc:h-[36px] sp:py-[7px] sp:pl-[12px] sp:pr-[26px] sp:text-body_sp sp:h-[34px] '

  const backgroundColorStyle = getBackgroundColorStyle(status)

  return (
    <div className={'relative '} ref={selectRef}>
      <div
        className={
          'm-auto flex appearance-none flex-row items-center rounded border hover:cursor-pointer ' +
          selectBoxStyle +
          backgroundColorStyle +
          `${isPlaceholder ? ' text-gray-gray_dark ' : ' '}` +
          className
        }
        onClick={() => {
          if (status !== SelectBoxType.DISABLED) setOpen(!open)
        }}
      >
        <ArrowIcon />
        {selectedIcon == IconTypeSelectBox.FRONT &&
          selected?.iconComponent &&
          selected?.iconComponent(isPlaceholder, selectedIcon, size)}
        {/* {selected?.text?.length > 25
          ? selected?.text.substring(0, 25) + "..."
          : selected?.text} */}
        <div className="line-clamp-1">{selected?.text}</div>
        {selectedIcon == IconTypeSelectBox.BACK &&
          selected?.iconComponent &&
          selected?.iconComponent(isPlaceholder, selectedIcon, size)}
      </div>
      <ul className={`absolute z-10 overflow-y-auto bg-white shadow-xl ${open ? 'max-h-60' : 'max-h-0'} ` + className}>
        <div className="sticky top-0 flex items-center bg-white px-2"></div>
        {options.map((option, index) => (
          <li
            key={option?.value}
            className={`flex flex-row p-2 pl-4 text-sm
            ${index === selectedIndex || option.placeholder ? ' ' : ' hover:cursor-pointer hover:bg-gray-gray_lighter '}

            ${option.placeholder ? ' text-gray-gray_dark ' : ''}
            
            ${index === selectedIndex && 'bg-gray-gray_lighter'}
            `}
            onClick={() => {
              if (option?.value?.toLowerCase() !== selected?.text.toLowerCase() && !option.placeholder) {
                setValue(option?.value)
                setSelected(option)
                setOpen(false)
                setSelectedIndex(index)
                setSelectedIcon(option?.icon || IconTypeSelectBox.OFF)
                setIsPlaceholder(option?.placeholder || false)
              }
            }}
          >
            {option.icon == IconTypeSelectBox.FRONT &&
              option.iconComponent &&
              option.iconComponent(option.placeholder || false, option.icon, size)}
            {option?.text}
            {option.icon == IconTypeSelectBox.BACK &&
              option.iconComponent &&
              option.iconComponent(option.placeholder || false, option.icon, size)}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SelectBox
