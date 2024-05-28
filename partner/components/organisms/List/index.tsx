import { useEffect, useState } from 'react'
import { GoTriangleDown } from 'react-icons/go'
import './style.module.css'
import CheckBox, { CheckBoxColor } from '@/components/atoms/Button/CheckBox'

interface ListProps {
  items: ListItem[]
  onChange: (value: string) => void
  selectedValue: string[]
}

const List = ({ items, onChange, selectedValue }: ListProps) => {
  return (
    <ul className="expandable-list relative top-[64px] mx-auto max-w-[800px]">
      {items.map((item, idx) => (
        <ListItem key={idx} item={item} onChange={onChange} selectedValue={selectedValue} />
      ))}
    </ul>
  )
}

export default List

export interface ListItem {
  title: string
  key: string
  children?: ListItem[]
}

export interface ListItemProps {
  item: ListItem
  onChange: (value: string) => void
  selectedValue: string[]
}

function ListItem({ item, onChange, selectedValue }: ListItemProps) {
  const [expanded, setExpanded] = useState(false)
  const [valueIsChanged, setValueIsChanged] = useState(false)
  const [checkValue, setCheckValue] = useState<string[]>(
    selectedValue && selectedValue.length > 0 ? [...selectedValue] : [],
  )

  useEffect(() => {
    valueIsChanged && setValueIsChanged(false)
  }, [valueIsChanged])

  const checkBox = (key: string) => {
    onChange(key)
    {
      checkValue.includes(key)
        ? (checkValue.splice(checkValue.indexOf(key), 1), setCheckValue(checkValue), setValueIsChanged(true))
        : (checkValue.push(key), setCheckValue(checkValue))

      setValueIsChanged(true)
    }
  }

  return (
    <li className="expandable-list-item cursor-pointer bg-gray-gray_lighter">
      <div
        className="mx-auto max-w-[800px] border-b-2 border-gray-gray_dark px-[20px] py-[18.5px]"
        onClick={() => {
          setExpanded(!expanded)
        }}
      >
        <div className="flex justify-between">
          <p className="text-[16px] font-bold">{item.title}</p>
          <GoTriangleDown className={`h-[15px] w-[15px] ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </div>
      {expanded && item.children && (
        <ul className="expandable-list-children">
          {item.children.map((data, idx) => (
            <div key={idx}>
              <div key={idx} className="bg-light-blue_light py-[8px] text-center">
                <p className="text-[14px] font-bold">{data.title}</p>
              </div>
              <div className="px-[20px]">
                {data.children &&
                  data.children.map((child, jdx) => (
                    <div
                      key={jdx}
                      className={`${
                        jdx != (data.children?.length || 0) - 1 && 'border-b-[1px]'
                      } h-[48px] border-gray-gray pt-[6px]`}
                    >
                      <CheckBox
                        name={child.key}
                        text={child.title}
                        backgroundColor={CheckBoxColor.GrayLight}
                        className="h-9 bg-transparent"
                        labelClassName=" text-start"
                        onChange={() => checkBox(child.key)}
                        value={checkValue.includes(child?.key) ? child?.key : ''}
                      />
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </ul>
      )}
    </li>
  )
}
