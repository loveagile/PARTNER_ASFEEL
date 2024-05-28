import { Select, SelectProps, SelectStatus } from '@/components/atoms'
import Router, { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { MdAdd, MdArrowRight } from 'react-icons/md'

export interface Option {
  text: string
  href: string
}

export interface SelectBoxProps {
  text: string
  options: Option[]
  // href: string;
}

const handleClickOption = (href: string) => {
  console.log('href ', href)
}

interface ButtonType {
  text: string
  onclick: () => void
}

interface items {
  item: SelectBoxProps | SelectProps | ButtonType
}

interface SidebarOptions {
  items: items[]
}

export interface SidebarProps {
  groups: SidebarOptions[]
  setActiveItem: React.Dispatch<React.SetStateAction<{ group: number; item: number; option: number }>>
  activeItem: { group: number; item: number; option: number }
  setCurrentPage?: (href: string) => void
}

const instanceOfSelectBoxProps = (item: SelectBoxProps | SelectProps | ButtonType): item is SelectBoxProps => {
  return (item as SelectBoxProps).options !== undefined
}

const instanceOfSelectProps = (item: SelectBoxProps | SelectProps | ButtonType): item is SelectProps => {
  return (item as SelectProps).icon !== undefined
}

const instanceOfButtonType = (item: SelectBoxProps | SelectProps | ButtonType): item is ButtonType => {
  return (item as ButtonType).text !== undefined
}

export const Sidebar = ({ groups, setActiveItem, activeItem, setCurrentPage }: SidebarProps) => {
  const [showOptions, setShowOptions] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)
  const optionsRef = useRef<HTMLDivElement>(null)
  const [selectedSelect, setSelectedSelect] = useState({
    group: -1,
    item: -1,
  })

  // const [selectedOption, setSelectedOption] = useState({
  //   group: -1,
  //   item: -1,
  //   option: -1,
  // });

  const currentHref = useRouter().asPath
  // console.log(currentHref);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current) {
        let { group, item } = JSON.parse(selectRef.current?.id)

        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node) &&
          optionsRef.current &&
          !optionsRef.current.contains(event.target as Node) &&
          showOptions &&
          (group == selectedSelect.group || item == selectedSelect.item)
        ) {
          setShowOptions((prevState) => !prevState)
        }
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node) &&
          optionsRef.current &&
          !optionsRef.current.contains(event.target as Node) &&
          showOptions
        ) {
          setShowOptions(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [selectRef, optionsRef, showOptions, selectedSelect.group, selectedSelect.item])

  const handleSelectBoxClick = (indexGroup: number, indexItem: number) => {
    if (selectedSelect.group !== indexGroup && selectedSelect.item !== indexItem) {
      setShowOptions(true)
      return
    }
    if (selectedSelect.group == indexGroup && selectedSelect.item == indexItem) {
      setShowOptions((prevState) => !prevState)

      return
    }
    setShowOptions((prevState) => !prevState)
  }

  useEffect(() => {
    // console.log("currentHref ", currentHref);
    groups.map((group, indexGroup) => {
      group.items.map((item, indexItem) => {
        if (instanceOfSelectBoxProps(item.item)) {
          item.item.options.map((option, indexOption) => {
            if (option.href == currentHref) {
              setActiveItem({
                group: indexGroup,
                item: indexItem,
                option: -1,
              })
            }
          })
        }
      })
    })
  }, [currentHref])

  return (
    <aside className="flex w-[180px] flex-col gap-1 bg-gray-white pb-2 drop-shadow-drop_wide">
      {groups.map((group, indexGroup) => {
        return (
          <React.Fragment key={indexGroup}>
            {group.items.map((item, indexItem) => {
              return (
                <div key={indexGroup + '-' + indexItem}>
                  {instanceOfSelectBoxProps(item.item) && (
                    <div key={indexGroup + '-' + indexItem + '-select-box'} className="relative flex w-max">
                      <div
                        onClick={() => {
                          setActiveItem({
                            group: indexGroup,
                            item: indexItem,
                            option: -1,
                          })
                        }}
                        className={
                          'flex w-[180px] flex-col gap-1  text-xs hover:cursor-pointer hover:bg-light-blue_light ' +
                          (activeItem.group == indexGroup && activeItem.item == indexItem
                            ? ' bg-light-blue_light text-core-blue_dark'
                            : '  text-gray-gray')
                        }
                      >
                        <div
                          className="relative flex flex-row gap-0.5 py-4 pl-4 pr-1"
                          id={JSON.stringify({
                            group: indexGroup,
                            item: indexItem,
                          })}
                          ref={selectRef}
                          onClick={() => (
                            setSelectedSelect({
                              group: indexGroup,
                              item: indexItem,
                            }),
                            handleSelectBoxClick(indexGroup, indexItem)
                          )}
                        >
                          <div>{item.item.text}</div>
                          <MdArrowRight
                            size={24}
                            className="absolute bottom-0 right-[13.5px] top-0 my-auto text-gray-gray_dark"
                          />
                        </div>
                      </div>
                      {showOptions && selectedSelect.group == indexGroup && selectedSelect.item == indexItem && (
                        <div ref={optionsRef} className="absolute left-[100.5%] top-[50%] w-[200px]">
                          {item.item.options.map((option, indexOption) => (
                            <div
                              className={
                                'py-1 pl-4 pr-1  text-mini text-gray-black hover:cursor-pointer hover:bg-gray-gray_lighter ' +
                                //   selectedOption.group == indexGroup &&
                                // selectedOption.item == indexItem &&
                                // selectedOption.option == indexOption
                                (option.href == currentHref ? 'bg-gray-gray_light' : ' bg-gray-white')
                              }
                              key={indexGroup + indexItem + indexOption}
                              onClick={() => {
                                setCurrentPage && setCurrentPage(option.href)
                                Router.push(option.href)
                                setShowOptions((prevState) => !prevState)
                                // setSelectedOption({
                                //   group: indexGroup,
                                //   item: indexItem,
                                //   option: indexOption,
                                // });
                              }}
                            >
                              {option.text}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {instanceOfSelectProps(item.item) && (
                    <div
                      key={indexGroup + '-' + indexItem + '-select'}
                      className="hover:bg-light-blue_light"
                      onClick={() => {
                        if ('href' in item.item) {
                          // item is a SelectProps or SelectBoxProps with a href property
                          setCurrentPage && setCurrentPage(item.item.href),
                            setActiveItem({
                              group: indexGroup,
                              item: indexItem,
                              option: -1,
                            })
                        } else {
                          // item is a ButtonType without a href property
                          console.log('no href')
                        }
                      }}
                    >
                      <Select
                        icon={item.item.icon}
                        notice={item.item.notice}
                        status={
                          // activeItem.group == indexGroup &&
                          // activeItem.item == indexItem
                          item.item.href == currentHref ? SelectStatus.ON : SelectStatus.OFF
                        }
                        size={item.item.size}
                        text={item.item.text}
                        noticeNumber={item.item.notice}
                        href={item.item.href}
                      />
                    </div>
                  )}

                  {!instanceOfSelectBoxProps(item.item) &&
                    !instanceOfSelectProps(item.item) &&
                    instanceOfButtonType(item.item) && (
                      <div className="py-[6px]" key={indexGroup + '-' + indexItem + '-button'}>
                        <button
                          className="mx-auto flex flex-row items-center  justify-center gap-1 rounded-[4px] border border-core-blue text-mini text-core-blue hover:bg-light-blue_light"
                          onClick={item.item.onclick}
                        >
                          <div className="pl-[10px]">
                            <MdAdd size={14} />
                          </div>
                          <div className="py-[6px] pr-[10px]">{item.item.text}</div>
                        </button>
                      </div>
                    )}
                </div>
              )
            })}
            {indexGroup !== groups.length - 1 && (
              <div className="px-4">
                <hr className="border border-gray-gray" />
              </div>
            )}
          </React.Fragment>
        )
      })}
    </aside>
  )
}
