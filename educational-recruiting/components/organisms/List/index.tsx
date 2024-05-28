import { useState } from 'react'
import { GoTriangleDown } from 'react-icons/go'
import './style.module.css'
import CheckBox, { CheckBoxColor } from '@/components/atoms/Button/CheckBox'

export interface ListItem {
  title: string
  children?: ListItem[]
}

export interface ListItemProps {
  item: ListItem
}

const ListItem = ({ item }: ListItemProps) => {
  const [expanded, setExpanded] = useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const checkBox = () => {}

  return (
    <li className="expandable-list-item cursor-pointer">
      <div className="px-[20px] py-[18.5px] border-b-2 border-gray-gray_dark bg-gray-gray_lighter" onClick={handleExpandClick}>
        <div className="flex justify-between">
          <p className="text-[16px] font-bold">{item.title}</p>
          <GoTriangleDown className={`w-[15px] h-[15px] ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </div>
      {expanded && item.children && (
        <ul className="expandable-list-children px-[20px]">
          {item.children.map((data, idx) => (
            <div key={idx}>
              <div key={idx} className="py-[8px] bg-light-blue_light text-center">
                <p className="text-[14px] font-bold">{data.title}</p>
              </div>
              {data.children &&
                data.children.map((child, jdx) => (
                  <div key={jdx} className=" border-b-2 border-gray-gray">
                    <CheckBox
                      name={child.title}
                      text={child.title}
                      backgroundColor={CheckBoxColor.GrayLight}
                      className="bg-transparent h-9"
                      labelClassName=" text-start"
                      onChange={() => console.log('Checkbox onChange')}
                      value={child.title}
                    />
                    {/* <p key={idx} className='my-[14px] text-[14px]'>{child}</p> */}
                  </div>
                ))}
            </div>
          ))}
        </ul>
      )}
    </li>
  )
}

interface ListProps {
  items: ListItem[]
}

const List = ({ items }: ListProps) => {
  return (
    <ul className="expandable-list">
      {items.map((item, idx) => (
        <ListItem key={idx} item={item} />
      ))}
    </ul>
  )
}

export default List
